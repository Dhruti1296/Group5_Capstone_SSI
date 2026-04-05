using HtmlAgilityPack;

namespace SSI.API.Services
{
    public class ScrapedEvent
    {
        public string Title { get; set; } = null!;
        public string Date { get; set; } = null!;
        public string Time { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string DetailUrl { get; set; } = null!;
    }

   public class ScrapedEventLink
{
    public string Text { get; set; } = null!;
    public string Url { get; set; } = null!;
}

public class ScrapedEventDetail
{
    public string Title { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string Time { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<ScrapedEventLink> Links { get; set; } = new();
    public string DetailUrl { get; set; } = null!;
}
public class ScrapedNews
{
    public string Title { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string Snippet { get; set; } = null!;
    public string DetailUrl { get; set; } = null!;
}

public class ScrapedNewsDetail
{
    public string Title { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string DetailUrl { get; set; } = null!;
}

    public class EventScraperService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://blogs1.conestogac.on.ca/events/";

        public EventScraperService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (compatible; SSI-App/1.0)");
        }

        public async Task<List<ScrapedEvent>> GetEventsAsync()
        {
            var events = new List<ScrapedEvent>();

            try
            {
                var html = await _httpClient.GetStringAsync(BaseUrl);
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                // Events are in a table — find all rows
                var tables = doc.DocumentNode.SelectNodes("//table");
                if (tables == null) return events;

                foreach (var table in tables)
                {
                    string currentDate = "";

                    var rows = table.SelectNodes(".//tr");
                    if (rows == null) continue;

                    foreach (var row in rows)
                    {
                        var cells = row.SelectNodes(".//td | .//th");
                        if (cells == null) continue;

                        // Date row — has colspan and bold date text
                        if (cells.Count == 1 ||
                            (cells.Count >= 1 && row.SelectSingleNode(".//th") != null))
                        {
                            var dateText = cells[0].InnerText.Trim();
                            if (!string.IsNullOrEmpty(dateText) &&
                                !dateText.Contains("Date/Time"))
                            {
                                currentDate = dateText;
                            }
                            continue;
                        }

                        // Event row — has time, event link, location
                        if (cells.Count >= 3)
                        {
                            var timeText = cells[0].InnerText.Trim();
                            var eventCell = cells[1];
                            var locationText = cells[2].InnerText.Trim();

                            var link = eventCell.SelectSingleNode(".//a");
                            if (link == null) continue;

                            var title = link.InnerText.Trim();
                            var href = link.GetAttributeValue("href", "");

                            if (string.IsNullOrEmpty(title)) continue;

                            // Make absolute URL
                            if (!href.StartsWith("http"))
                                href = "https://blogs1.conestogac.on.ca" + href;

                            events.Add(new ScrapedEvent
                            {
                                Title = title,
                                Date = currentDate,
                                Time = timeText,
                                Location = locationText,
                                DetailUrl = href
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Scraping error: {ex.Message}");
            }

            return events;
        }
public async Task<ScrapedEventDetail?> GetEventDetailAsync(string url)
{
    try
    {
        var html = await _httpClient.GetStringAsync(url);
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        // --- TITLE ---
        // The title is in <h2> inside <div class="col-12">
        string title = "";
        var titleNode = doc.DocumentNode
            .SelectSingleNode("//div[contains(@class,'col-12')]/h2");
        if (titleNode != null)
            title = titleNode.InnerText.Trim();

        // --- META (date/time/location) ---
        // It's in <div class="col-12" style="border-bottom:2px solid #ccc">
        string date = "", time = "", location = "";
        var metaNode = doc.DocumentNode
            .SelectSingleNode("//div[@style='border-bottom:2px solid #ccc']");
        if (metaNode != null)
        {
            var metaText = metaNode.InnerText.Trim()
                .Replace("\n", " ")
                .Replace("\r", " ")
                .Replace("\t", " ");
            while (metaText.Contains("  "))
                metaText = metaText.Replace("  ", " ");

            var parts = metaText.Split('|')
                .Select(p => p.Trim())
                .Where(p => !string.IsNullOrEmpty(p))
                .ToList();

            if (parts.Count >= 1) date = parts[0];
            if (parts.Count >= 2) time = parts[1];
            if (parts.Count >= 3) location = parts[2];
        }

        // --- DESCRIPTION ---
        // Content is in div.entry-body AND div#more.entry-more
        var descParts = new List<string>();
        var links = new List<ScrapedEventLink>();

        var contentDivs = new[]
        {
            doc.DocumentNode.SelectSingleNode("//div[contains(@class,'entry-body')]"),
            doc.DocumentNode.SelectSingleNode("//div[@id='more']")
        };

        foreach (var contentDiv in contentDivs)
        {
            if (contentDiv == null) continue;

            foreach (var node in contentDiv.ChildNodes)
            {
                if (node.NodeType == HtmlNodeType.Text) continue;

                var nodeText = node.InnerText.Trim();
                if (string.IsNullOrEmpty(nodeText)) continue;

                // Extract useful links
                var nodeLinks = node.SelectNodes(".//a[@href]");
                if (nodeLinks != null)
                {
                    foreach (var a in nodeLinks)
                    {
                        var href = a.GetAttributeValue("href", "");
                        var linkText = a.InnerText.Trim();
                        if (string.IsNullOrEmpty(href) ||
                            string.IsNullOrEmpty(linkText)) continue;

                        bool isUseful =
                            href.Contains("teams.microsoft.com") ||
                            href.Contains("eventbrite") ||
                            href.Contains("zoom.us") ||
                            href.Contains("forms.office.com") ||
                            href.Contains("forms.microsoft.com") ||
                            href.StartsWith("mailto:");

                        if (isUseful && !links.Any(l => l.Url == href))
                        {
                            links.Add(new ScrapedEventLink
                            {
                                Text = linkText,
                                Url = href
                            });
                        }
                    }
                }

                // Format by node type
                if (node.Name == "h4" || node.Name == "h3")
                {
                    descParts.Add($"**{nodeText}**");
                }
                else if (node.Name == "ul" || node.Name == "ol")
                {
                    var items = node.SelectNodes(".//li");
                    if (items != null)
                    {
                        foreach (var item in items)
                        {
                            var itemText = item.InnerText.Trim();
                            if (!string.IsNullOrEmpty(itemText))
                                descParts.Add($"• {itemText}");
                        }
                    }
                }
                else if (node.Name == "p")
                {
                    descParts.Add(nodeText);
                }
            }
        }

        return new ScrapedEventDetail
        {
            Title = title,
            Date = date,
            Time = time,
            Location = location,
            Description = string.Join("\n\n", descParts),
            Links = links,
            DetailUrl = url
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Detail scraping error: {ex.Message}");
        return null;
    }
}
public async Task<List<ScrapedNews>> GetNewsAsync()
{
    var newsList = new List<ScrapedNews>();

    try
    {
        // Use trailing slash — important for this site
        var html = await _httpClient.GetStringAsync("https://blogs1.conestogac.on.ca/news/");
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        // Strategy: find all links pointing to news articles
        // They follow the pattern: /news/2025/ or /news/2026/
        var allLinks = doc.DocumentNode.SelectNodes(
            "//a[contains(@href,'blogs1.conestogac.on.ca/news/202')]"
        );

        if (allLinks == null) return newsList;

        foreach (var link in allLinks)
        {
            var href = link.GetAttributeValue("href", "");
            var title = link.InnerText.Trim();

            // Skip archive/category links (they end in / or don't have .php)
            if (!href.EndsWith(".php")) continue;
            if (string.IsNullOrEmpty(title)) continue;

            // Get the date — it's in the previous sibling text node
            // or the parent's previous sibling
            string date = "";
            string snippet = "";

            // Walk up to find the parent paragraph
            var parent = link.ParentNode;

            // Date is usually in a preceding text node or sibling
            var prevSibling = parent?.PreviousSibling;
            while (prevSibling != null)
            {
                var t = prevSibling.InnerText.Trim();
                if (!string.IsNullOrEmpty(t) &&
                    (t.Contains("2025") || t.Contains("2026")) &&
                    t.Length < 40)
                {
                    date = t;
                    break;
                }
                prevSibling = prevSibling.PreviousSibling;
            }

            // Snippet is the text after the link in the same parent
            var nextSibling = link.NextSibling;
            while (nextSibling != null)
            {
                var t = nextSibling.InnerText.Trim();
                if (!string.IsNullOrEmpty(t))
                {
                    snippet = t.TrimStart('-', ' ');
                    break;
                }
                nextSibling = nextSibling.NextSibling;
            }

            // Avoid duplicates
            if (!newsList.Any(n => n.DetailUrl == href))
            {
                newsList.Add(new ScrapedNews
                {
                    Title = title,
                    Date = date,
                    Snippet = snippet,
                    DetailUrl = href
                });
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"News scraping error: {ex.Message}");
    }

    return newsList;
}

public async Task<ScrapedNewsDetail?> GetNewsDetailAsync(string url)
{
    try
    {
        var html = await _httpClient.GetStringAsync(url);
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        // --- DATE ---
        // <p style="font-size:11px;">April 1, 2026 3:00 PM</p>
        string date = "";
        var dateNode = doc.DocumentNode.SelectSingleNode(
            "//p[@style='font-size:11px;']"
        );
        if (dateNode != null)
            date = dateNode.InnerText.Trim();

        // --- TITLE ---
        // <h2> immediately after the date paragraph
        string title = "";
        var titleNode = doc.DocumentNode.SelectSingleNode(
            "//p[@style='font-size:11px;']/following-sibling::h2[1]"
        );
        if (titleNode != null)
            title = titleNode.InnerText.Trim();

        // --- IMAGE ---
        // Inside div#more, skip caption images
        string imageUrl = "";
        var moreDiv = doc.DocumentNode.SelectSingleNode("//div[@id='more']");
        if (moreDiv != null)
        {
            var img = moreDiv.SelectSingleNode(".//img");
            if (img != null)
            {
                var src = img.GetAttributeValue("src", "");
                if (!string.IsNullOrEmpty(src))
                {
                    imageUrl = src.StartsWith("http") ? src
                        : "https://blogs1.conestogac.on.ca" + src;
                }
            }
        }

        // --- DESCRIPTION ---
        // Content is in div.entry-body AND div#more.entry-more
        // Same pattern as events
        var descParts = new List<string>();

        var contentDivs = new[]
        {
            doc.DocumentNode.SelectSingleNode("//div[contains(@class,'entry-body')]"),
            doc.DocumentNode.SelectSingleNode("//div[@id='more']")
        };

        foreach (var contentDiv in contentDivs)
        {
            if (contentDiv == null) continue;

            foreach (var node in contentDiv.ChildNodes)
            {
                if (node.NodeType == HtmlNodeType.Text) continue;

                var nodeText = node.InnerText.Trim();
                if (string.IsNullOrEmpty(nodeText)) continue;

                // Stop at footer
                if (nodeText.StartsWith("Posted")) break;

                if (node.Name == "h3" || node.Name == "h4")
                {
                    descParts.Add($"**{nodeText}**");
                }
                else if (node.Name == "ul" || node.Name == "ol")
                {
                    var items = node.SelectNodes(".//li");
                    if (items != null)
                    {
                        foreach (var item in items)
                        {
                            var itemText = item.InnerText.Trim();
                            if (!string.IsNullOrEmpty(itemText))
                                descParts.Add($"• {itemText}");
                        }
                    }
                }
                else if (node.Name == "p")
                {
                    // Skip very short text (image captions)
                    if (nodeText.Length > 15)
                        descParts.Add(nodeText);
                }
                // Skip div.float-right (image wrapper) — only extract text from it
                else if (node.Name == "div" &&
                         !node.GetAttributeValue("class", "").Contains("float"))
                {
                    // Recursively get paragraphs from nested divs
                    var innerParas = node.SelectNodes(".//p");
                    if (innerParas != null)
                    {
                        foreach (var p in innerParas)
                        {
                            var t = p.InnerText.Trim();
                            if (t.Length > 15 && !t.StartsWith("Posted"))
                                descParts.Add(t);
                        }
                    }
                }
            }
        }

        return new ScrapedNewsDetail
        {
            Title = title,
            Date = date,
            ImageUrl = imageUrl,
            Description = string.Join("\n\n", descParts),
            DetailUrl = url
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"News detail scraping error: {ex.Message}");
        return null;
    }
}
}
       

}