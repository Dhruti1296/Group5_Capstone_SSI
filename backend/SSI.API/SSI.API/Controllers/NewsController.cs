using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly EventScraperService _scraperService;

        public NewsController(EventScraperService scraperService)
        {
            _scraperService = scraperService;
        }

        // GET /api/news
        [HttpGet]
        public async Task<IActionResult> GetNews()
        {
            var news = await _scraperService.GetNewsAsync();
            return Ok(news);
        }

        [HttpGet("detail")]
        public async Task<IActionResult> GetNewsDetail([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url) ||
             !url.StartsWith("https://blogs1.conestogac.on.ca"))
                return BadRequest("Invalid URL.");

            var detail = await _scraperService.GetNewsDetailAsync(url);
            return detail != null ? Ok(detail) : NotFound("News not found.");
        }
    }
}