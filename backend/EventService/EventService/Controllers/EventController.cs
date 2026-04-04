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
        private readonly HttpClient _httpClient;
        private readonly IWebHostEnvironment _env;
        public EventController(EventServices eventService, IHttpClientFactory httpClientFactory, IWebHostEnvironment env)
        {
            _eventService = eventService;
            //controller can able to call the external APIs AdminService
            _httpClient = httpClientFactory.CreateClient();
            _env = env;
        }

        //Get all events
        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetAll()
        {
            return Ok(await _eventService.GetAllAsync());
        }

        //get event by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetById(string id)
        {
            var evnt = await _eventService.GetByIdAsync(id);
            if(evnt == null)
            {
                return NotFound("Event not found");
            }
            return Ok(evnt);
        }

        //get events by types
        [HttpGet("type/{type}")]
        public async Task<ActionResult<List<Event>>> GetByType(string type)
        {
            var events = await _eventService.GetByTypeAsync(type);

            if (events == null || events.Count == 0)
            {
                return NotFound($"No events found for type: {type}");
            }
            return Ok(events);
        }

        //Post a new event
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto, IFormFile? image)
        {
            //get the header
            var adminUserName = Request.Headers["adminUserName"].ToString();
            //var adminUserName = "admin";
            //validation
            if(string.IsNullOrEmpty(adminUserName))
            {
                return Unauthorized("Admin User Name is Required");
            }

            //To call admin api
            var response = await _httpClient.GetAsync($"https://localhost:7276/api/admins/{adminUserName}");

            if(!response.IsSuccessStatusCode)
            {
                return Forbid("Admin not found");
            }

            //converting the response from json response to AdminDto object
            var admin = await response.Content.ReadFromJsonAsync<AdminDto>();

            //Checking the role
            if(admin == null || admin.Role.ToLower() != "admin")
            {
                return Forbid("Only admin can create events");
            }

            //checking the model state
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //event date validation
            if (dto.EventDate <= DateTime.Now)
            {
                return BadRequest("Event date must be in future date");
            }

            var evnt = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                EventDate = dto.EventDate,
                Location = dto.Location
            };

            //Image upload validation
            if(image != null && image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                evnt.ImageUrl = "/Images/" + fileName;
            }
            await _eventService.AddSync(evnt);
            return Ok("Event added successfully");
        }

        //Put to update the events
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(string id, [FromForm] UpdateEventDto dto, IFormFile? image)
        {
            //validating admin
            var adminUserName = Request.Headers["adminUserName"].ToString();
            //var adminUserName = "admin";
            if(string.IsNullOrEmpty(adminUserName))
            {
                return BadRequest("Admin username is required");
            }

            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };

            using var client = new HttpClient(handler);
            var response = await client.GetAsync($"https://localhost:7276/api/admins/{adminUserName}");

            if(!response.IsSuccessStatusCode)
            {
                return BadRequest("Admin not found");
            }

            var admin = await response.Content.ReadFromJsonAsync<AdminDto>();
            if(admin.Role.ToLower() != "admin")
            {
                return BadRequest("Only admin can update events");
            }

            //finding the existing events
            var existingEvent = await _eventService.GetByIdAsync(id);
            if(existingEvent == null)
            {
                return NotFound("Event not found");
            }

            //Update fields
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
            return Ok("Event updated successfully");
        }

        //Delete an event
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var adminUserName = Request.Headers["adminUserName"].ToString();
            //var adminUserName = "admin";
            if (string.IsNullOrEmpty(adminUserName)) return BadRequest("Admin username is required");

            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
            using var client = new HttpClient(handler);
            var response = await client.GetAsync($"https://localhost:7276/api/admins/{adminUserName}");
            if (!response.IsSuccessStatusCode) return BadRequest("Admin not found");

            var admin = await response.Content.ReadFromJsonAsync<AdminDto>();
            if (admin.Role.ToLower() != "admin") return BadRequest("Only admin can delete events");

            var existingEvent = await _eventService.GetByIdAsync(id);
            if (existingEvent == null) return NotFound("Event not found");

            await _eventService.DeleteAsync(id);
            return Ok("Event deleted successfully");
        }
    }
}
