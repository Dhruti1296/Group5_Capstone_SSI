using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/mentor")]
    [Authorize]
    public class MentorController : ControllerBase
    {
        private readonly MentorService _mentorService;
        private readonly NotificationService _notificationService;
        private readonly MentorshipService _mentorshipService;

        public MentorController(
            MentorService mentorService,
            NotificationService notificationService,
            MentorshipService mentorshipService)
        {
            _mentorService = mentorService;
            _notificationService = notificationService;
            _mentorshipService = mentorshipService;
        }

        // GET /api/mentor — approved mentors only
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var mentors = await _mentorService.GetApprovedAsync();
            return Ok(mentors);
        }

        // GET /api/mentor/all — all applications (admin only)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApplications()
        {
            var mentors = await _mentorService.GetAllAsync();
            return Ok(mentors);
        }

        // GET /api/mentor/my-application
        [HttpGet("my-application")]
        public async Task<IActionResult> GetMyApplication()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var application = await _mentorService.GetByUserNameAsync(userName);
            return application != null ? Ok(application) : NotFound("No application found.");
        }

        // POST /api/mentor/apply
        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] MentorApplication application)
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var existing = await _mentorService.GetByUserNameAsync(userName);
            if (existing != null)
                return BadRequest("You have already submitted a mentor application.");

            if (string.IsNullOrWhiteSpace(application.Bio))
                return BadRequest("Bio is required.");
            if (application.Expertise == null || application.Expertise.Count == 0)
                return BadRequest("At least one area of expertise is required.");

            application.UserName = userName;
            application.AppliedAt = DateTime.UtcNow;
            application.Approved = false;
            application.Status = "Pending";

            await _mentorService.CreateAsync(application);
            return Ok(application);
        }

        // PATCH /api/mentor/{id}/approve — admin only
        [HttpPatch("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(string id)
        {
            var application = await _mentorService.GetByIdAsync(id);
            if (application == null) return NotFound("Application not found.");

            await _mentorService.SetApprovalAsync(id, true);

            await _notificationService.CreateAsync(
                application.UserName!,
                "Congratulations! Your mentor application has been approved. You are now listed in the mentor directory.",
                "success"
            );

            return Ok("Mentor approved.");
        }

        // PATCH /api/mentor/{id}/reject — admin only
        [HttpPatch("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(string id)
        {
            var application = await _mentorService.GetByIdAsync(id);
            if (application == null) return NotFound("Application not found.");

            await _mentorService.SetApprovalAsync(id, false);

            // Cancel all active mentorships for this mentor
            await _mentorshipService.CancelAllForMentorAsync(application.UserName!);

            await _notificationService.CreateAsync(
                application.UserName!,
                "Your mentor status has been revoked by the admin. Your active mentorships have been cancelled.",
                "info"
            );

            return Ok("Mentor rejected.");
        }
    }
}