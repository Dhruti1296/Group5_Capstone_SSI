using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly ContactServices _contactService;

        // injection of ContactServices into the controller...
        public ContactController(ContactServices contactService)
        {
            _contactService = contactService;
        }

        // OPTIONAL: Admin/Support can view all messages later
        // Later change to: [Authorize(Roles = "Admin")]
        [HttpGet]
        //[Authorize]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _contactService.GetAllAsync();
            return Ok(messages);
        }

        // OPTIONAL helper: get a single message by id (useful for CreatedAtAction)
        // Later you can lock it to Admin as well
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            var msg = await _contactService.GetByIdAsync(id);
            if (msg == null) return NotFound("Message not found");
            return Ok(msg);
        }

        // creating a contact us message (only logged-in users)
        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> CreateMessage([FromBody] ContactMessageRequest req)
        {
            // validation of the fields...
            if (string.IsNullOrWhiteSpace(req.FullName) ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Message))
            {
                return BadRequest("FullName, Email, and Message are required");
            }

            // take userId from JWT token
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contact = new ContactMessage
            {
                FullName = req.FullName.Trim(),
                Email = req.Email.Trim(),
                Topic = string.IsNullOrWhiteSpace(req.Topic) ? "General" : req.Topic.Trim(),
                Message = req.Message.Trim(),
                UserId = userId,
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            await _contactService.CreateAsync(contact);

            // 201 + location header to GET by id
            return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
        }
    }
}