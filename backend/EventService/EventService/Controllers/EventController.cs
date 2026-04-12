using Microsoft.AspNetCore.Mvc;
using EventService.Services;
using EventService.Models;
using EventService.DTOs;

namespace EventService.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventController : ControllerBase
    {
        private readonly EventServices _eventService;
        private readonly IWebHostEnvironment _env;

        public EventController(EventServices eventService, IWebHostEnvironment env)
        {
            _eventService = eventService;
            _env = env;
        }

        private async Task<bool> ValidateAdmin(string adminUserName)
        {
            if (string.IsNullOrEmpty(adminUserName)) return false;
            try
            {
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback =
                        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                };
                using var client = new HttpClient(handler);
                var response = await client.GetAsync(
                    $"http://localhost:5277/api/admins/{adminUserName}");
                if (!response.IsSuccessStatusCode) return false;
                var admin = await response.Content.ReadFromJsonAsync<AdminDto>();
                return admin != null && admin.Role.ToLower() == "admin";
            }
            catch { return false; }
        }

        // GET all events
        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetAll()
        {
            return Ok(await _eventService.GetAllAsync());
        }

        // GET event by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetById(string id)
        {
            var evnt = await _eventService.GetByIdAsync(id);
            if (evnt == null) return NotFound("Event not found.");
            return Ok(evnt);
        }

        // GET events by type
        [HttpGet("type/{type}")]
        public async Task<ActionResult<List<Event>>> GetByType(string type)
        {
            var events = await _eventService.GetByTypeAsync(type);
            if (events == null || events.Count == 0)
                return NotFound($"No events found for type: {type}");
            return Ok(events);
        }

        // POST create event
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto, IFormFile? image)
        {
            var adminUserName = Request.Headers["adminUserName"].ToString();
            if (!await ValidateAdmin(adminUserName))
                return Unauthorized("Admin validation failed.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.EventDate <= DateTime.Now)
                return BadRequest("Event date must be in the future.");

            var evnt = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                EventDate = dto.EventDate,
                Location = dto.Location
            };

            if (image != null && image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);
                evnt.ImageUrl = "/Images/" + fileName;
            }

            await _eventService.AddSync(evnt);
            return Ok("Event added successfully.");
        }

        // PUT update event
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(string id, [FromForm] UpdateEventDto dto, IFormFile? image)
        {
            var adminUserName = Request.Headers["adminUserName"].ToString();
            if (!await ValidateAdmin(adminUserName))
                return Unauthorized("Admin validation failed.");

            var existingEvent = await _eventService.GetByIdAsync(id);
            if (existingEvent == null) return NotFound("Event not found.");

            existingEvent.Title = dto.Title ?? existingEvent.Title;
            existingEvent.Description = dto.Description ?? existingEvent.Description;
            existingEvent.Type = dto.Type ?? existingEvent.Type;
            existingEvent.EventDate = dto.EventDate ?? existingEvent.EventDate;
            existingEvent.Location = dto.Location ?? existingEvent.Location;

            if (image != null && image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);
                existingEvent.ImageUrl = "/Images/" + fileName;
            }

            await _eventService.UpdateAsync(id, existingEvent);
            return Ok("Event updated successfully.");
        }

        // DELETE event
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var adminUserName = Request.Headers["adminUserName"].ToString();
            if (!await ValidateAdmin(adminUserName))
                return Unauthorized("Admin validation failed.");

            var existingEvent = await _eventService.GetByIdAsync(id);
            if (existingEvent == null) return NotFound("Event not found.");

            await _eventService.DeleteAsync(id);
            return Ok("Event deleted successfully.");
        }
    }
}