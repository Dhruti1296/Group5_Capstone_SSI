using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/volunteer")]
    [Authorize]
    public class VolunteerController : ControllerBase
    {
        private readonly VolunteerService _volunteerService;

        public VolunteerController(VolunteerService volunteerService)
        {
            _volunteerService = volunteerService;
        }

        // POST /api/volunteer/apply
        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] VolunteerApplication application)
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            // Check if already applied for this opportunity
            var existing = await _volunteerService
                .GetByUserAndOpportunityAsync(userName, application.OpportunityId);

            if (existing != null)
                return BadRequest("You have already applied for this opportunity.");

            application.UserName = userName;
            application.AppliedAt = DateTime.UtcNow;
            application.Status = "Pending";

            await _volunteerService.CreateAsync(application);
            return Ok(application);
        }

        // GET /api/volunteer/my-applications
       [HttpGet("my-applications")]
       public async Task<IActionResult> GetMyApplications()
       {
         var userName = User.FindFirstValue(ClaimTypes.Name);
         if (userName == null) return Unauthorized();

         var applications = await _volunteerService.GetByUserNameAsync(userName);
         return Ok(applications);
        }
    }
}