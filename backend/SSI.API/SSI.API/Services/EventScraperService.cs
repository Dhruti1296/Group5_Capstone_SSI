using HtmlAgilityPack;
using System.Net;

namespace SSI.API.Services
{
    // represents a simple event...
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

    //represents full event info....
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

    // represents basic news info...
    public class ScrapedNews
    {
        public string Title { get; set; } = null!;
        public string Date { get; set; } = null!;
        public string Snippet { get; set; } = null!;
        public string DetailUrl { get; set; } = null!;
    }

    // represents full new details...
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

        // creates a constructor and pretends to be a browser...
        public EventScraperService()
        {
            _httpClient = new HttpClient();
            
            //for pretending to be a browser...
            _httpClient.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (compatible; SSI-App/1.0)");
        }

        // to remove or format scraped text properly before using it...
        private static string Clean(string? text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "";

            var decoded = WebUtility.HtmlDecode(text).Trim();

            while (decoded.Contains("  "))
                decoded = decoded.Replace("  ", " ");

            return decoded;
        }

        // scrapes event list from the websote and returns an structured event data...
        public async Task<List<ScrapedEvent>> GetEventsAsync()
        {
            var events = new List<ScrapedEvent>();

            try
            {
                var html = await _httpClient.GetStringAsync(BaseUrl);
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                //finds event table...
                var tables = doc.DocumentNode.SelectNodes("//table");
                if (tables == null) return events;

                //goes through each tables...
                foreach (var table in tables)
                {
                    string currentDate = "";

                    var rows = table.SelectNodes(".//tr");
                    if (rows == null) continue;

                    foreach (var row in rows)
                    {
                        var cells = row.SelectNodes(".//td | .//th");
                        if (cells == null) continue;

                        if (cells.Count == 1 ||
                            (cells.Count >= 1 && row.SelectSingleNode(".//th") != null))
                        {
                            var dateText = Clean(cells[0].InnerText);

                            if (!string.IsNullOrEmpty(dateText) &&
                                !dateText.Contains("Date/Time"))
                            {
                                currentDate = dateText;
                            }
                            continue;
                        }

                        if (cells.Count >= 3)
                        {
                            var timeText = Clean(cells[0].InnerText);
                            var eventCell = cells[1];
                            var locationText = Clean(cells[2].InnerText);

                            var link = eventCell.SelectSingleNode(".//a");
                            if (link == null) continue;

                            var title = Clean(link.InnerText);
                            var href = link.GetAttributeValue("href", "");

                            if (string.IsNullOrEmpty(title)) continue;

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

        // fetches full event details...
        public async Task<ScrapedEventDetail?> GetEventDetailAsync(string url)
        {
            try
            {
                var html = await _httpClient.GetStringAsync(url);
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                string title = "";
                var titleNode = doc.DocumentNode
                    .SelectSingleNode("//div[contains(@class,'col-12')]/h2");

                if (titleNode != null)
                    title = Clean(titleNode.InnerText);

                string date = "", time = "", location = "";
                var metaNode = doc.DocumentNode
                    .SelectSingleNode("//div[@style='border-bottom:2px solid #ccc']");

                if (metaNode != null)
                {
                    var metaText = Clean(metaNode.InnerText);

                    var parts = metaText.Split('|')
                        .Select(p => p.Trim())
                        .Where(p => !string.IsNullOrEmpty(p))
                        .ToList();

                    if (parts.Count >= 1) date = parts[0];
                    if (parts.Count >= 2) time = parts[1];
                    if (parts.Count >= 3) location = parts[2];
                }

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

                        var nodeText = Clean(node.InnerText);
                        if (string.IsNullOrEmpty(nodeText)) continue;

                        var nodeLinks = node.SelectNodes(".//a[@href]");
                        if (nodeLinks != null)
                        {
                            foreach (var a in nodeLinks)
                            {
                                var href = a.GetAttributeValue("href", "");
                                var linkText = Clean(a.InnerText);

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
                                    var itemText = Clean(item.InnerText);
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

        // fetches the list of news articles headlines and short descriptions from the website...
        public async Task<List<ScrapedNews>> GetNewsAsync()
        {
            var newsList = new List<ScrapedNews>();

            try
            {
                var html = await _httpClient.GetStringAsync("https://blogs1.conestogac.on.ca/news/");
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                var allLinks = doc.DocumentNode.SelectNodes(
                    "//a[contains(@href,'blogs1.conestogac.on.ca/news/202')]"
                );

                if (allLinks == null) return newsList;

                foreach (var link in allLinks)
                {
                    var href = link.GetAttributeValue("href", "");
                    var title = Clean(link.InnerText);

                    if (!href.EndsWith(".php")) continue;
                    if (string.IsNullOrEmpty(title)) continue;

                    string date = "";
                    string snippet = "";

                    var parent = link.ParentNode;

                    var prevSibling = parent?.PreviousSibling;
                    while (prevSibling != null)
                    {
                        var t = Clean(prevSibling.InnerText);

                        if (!string.IsNullOrEmpty(t) &&
                            (t.Contains("2025") || t.Contains("2026")) &&
                            t.Length < 40)
                        {
                            date = t;
                            break;
                        }

                        prevSibling = prevSibling.PreviousSibling;
                    }

                    var nextSibling = link.NextSibling;
                    while (nextSibling != null)
                    {
                        var t = Clean(nextSibling.InnerText);

                        if (!string.IsNullOrEmpty(t))
                        {
                            snippet = t.TrimStart('-', ' ');
                            break;
                        }

                        nextSibling = nextSibling.NextSibling;
                    }

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

        // method extracts complete news article details including image and full content...
        public async Task<ScrapedNewsDetail?> GetNewsDetailAsync(string url)
        {
            try
            {
                var html = await _httpClient.GetStringAsync(url);
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                string date = "";
                var dateNode = doc.DocumentNode.SelectSingleNode("//p[@style='font-size:11px;']");
                if (dateNode != null)
                    date = Clean(dateNode.InnerText);

                string title = "";
                var titleNode = doc.DocumentNode.SelectSingleNode(
                    "//p[@style='font-size:11px;']/following-sibling::h2[1]");
                if (titleNode != null)
                    title = Clean(titleNode.InnerText);

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
                            imageUrl = src.StartsWith("http")
                                ? src
                                : "https://blogs1.conestogac.on.ca" + src;
                        }
                    }
                }

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

                        var nodeText = Clean(node.InnerText);
                        if (string.IsNullOrEmpty(nodeText)) continue;

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
                                    var itemText = Clean(item.InnerText);
                                    if (!string.IsNullOrEmpty(itemText))
                                        descParts.Add($"• {itemText}");
                                }
                            }
                        }
                        else if (node.Name == "p")
                        {
                            if (nodeText.Length > 15)
                                descParts.Add(nodeText);
                        }
                        else if (node.Name == "div" &&
                                 !node.GetAttributeValue("class", "").Contains("float"))
                        {
                            var innerParas = node.SelectNodes(".//p");
                            if (innerParas != null)
                            {
                                foreach (var p in innerParas)
                                {
                                    var t = Clean(p.InnerText);
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