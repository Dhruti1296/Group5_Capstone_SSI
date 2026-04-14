using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventsController : ControllerBase
    {
        private readonly EventScraperService _scraperService;

        public EventsController(EventScraperService scraperService)
        {
            _scraperService = scraperService;
        }

        // GET /api/events — fetch all current events live from Conestoga site
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _scraperService.GetEventsAsync();
            return Ok(events);
        }

        // GET /api/events/detail?url=... — fetch detail page for one event
        [HttpGet("detail")]
        public async Task<IActionResult> GetEventDetail([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url) ||
                !url.StartsWith("https://blogs1.conestogac.on.ca"))
                return BadRequest("Invalid URL.");

            var detail = await _scraperService.GetEventDetailAsync(url);
            return detail != null ? Ok(detail) : NotFound("Event not found.");
        }
    }
}