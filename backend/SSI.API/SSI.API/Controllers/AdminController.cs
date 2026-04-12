using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserServices _userServices;
        private readonly PostService _postService;
        private readonly MentorService _mentorService;
        private readonly VolunteerService _volunteerService;
        private readonly NotificationService _notificationService;
        private readonly VolunteerOpportunityService _opportunityService;

        public AdminController(
            UserServices userServices,
            PostService postService,
            MentorService mentorService,
            VolunteerService volunteerService,
            NotificationService notificationService,
            VolunteerOpportunityService opportunityService)
        {
            _userServices = userServices;
            _postService = postService;
            _mentorService = mentorService;
            _volunteerService = volunteerService;
            _notificationService = notificationService;
            _opportunityService = opportunityService;
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userServices.GetAllAsync();
            var mentorApps = await _mentorService.GetAllAsync();

            var result = users.Select(u => new
            {
                id = u.Id,
                userName = u.UserName,
                email = u.Email,
                role = u.Role,
                name = u.Name,
                surname = u.Surname,
                mentorStatus = mentorApps
                    .FirstOrDefault(m => m.UserName == u.UserName)?.Status
            });

            return Ok(result);
        }

        // DELETE /api/admin/users/{userName}
        [HttpDelete("users/{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var deleted = await _userServices.DeleteByUserNameAsync(userName);
            return deleted ? Ok("User deleted.") : NotFound("User not found.");
        }

        // GET /api/admin/posts
        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        // DELETE /api/admin/posts/{id}
        [HttpDelete("posts/{id}")]
        public async Task<IActionResult> DeletePost(string id)
        {
            await _postService.AdminDeleteAsync(id);
            return Ok("Post deleted.");
        }

        // GET /api/admin/mentor-applications
        [HttpGet("mentor-applications")]
        public async Task<IActionResult> GetMentorApplications()
        {
            var applications = await _mentorService.GetAllAsync();
            return Ok(applications);
        }

        // GET /api/admin/volunteer-applications
        [HttpGet("volunteer-applications")]
        public async Task<IActionResult> GetVolunteerApplications()
        {
            var applications = await _volunteerService.GetAllAsync();
            return Ok(applications);
        }

        // PATCH /api/admin/volunteer-applications/{id}/status
        [HttpPatch("volunteer-applications/{id}/status")]
        public async Task<IActionResult> UpdateVolunteerStatus(
            string id, [FromBody] StatusRequest request)
        {
            var applications = await _volunteerService.GetAllAsync();
            var application = applications.FirstOrDefault(v => v.Id == id);

            if (application == null)
                return NotFound("Application not found.");

            await _volunteerService.UpdateStatusAsync(id, request.Status);

            if (request.Status == "Approved")
            {
                await _notificationService.CreateAsync(
                    application.UserName!,
                    $"Your volunteer application for \"{application.OpportunityTitle}\" has been approved! We look forward to seeing you there.",
                    "success"
                );
            }
            else if (request.Status == "Rejected")
            {
                await _notificationService.CreateAsync(
                    application.UserName!,
                    $"Unfortunately your volunteer application for \"{application.OpportunityTitle}\" was not approved this time.",
                    "info"
                );
            }

            return Ok("Status updated.");
        }

        // DELETE /api/admin/posts/{postId}/comments/{commentIndex}
        [HttpDelete("posts/{postId}/comments/{commentIndex}")]
        public async Task<IActionResult> DeleteComment(string postId, int commentIndex)
        {
           await _postService.DeleteCommentAsync(postId, commentIndex);
           return Ok("Comment deleted.");
        }

        // GET all opportunities including closed
[HttpGet("volunteer-opportunities")]
public async Task<IActionResult> GetAllOpportunities()
{
    var opps = await _opportunityService.GetAllAsync();
    return Ok(opps);
}

// POST create opportunity
[HttpPost("volunteer-opportunities")]
public async Task<IActionResult> CreateOpportunity([FromBody] VolunteerOpportunity opp)
{
    opp.CreatedAt = DateTime.UtcNow;
    await _opportunityService.CreateAsync(opp);
    return Ok(opp);
}

// PUT update opportunity
[HttpPut("volunteer-opportunities/{id}")]
public async Task<IActionResult> UpdateOpportunity(string id, [FromBody] VolunteerOpportunity opp)
{
    await _opportunityService.UpdateAsync(id, opp);
    return Ok(opp);
}

// DELETE opportunity
[HttpDelete("volunteer-opportunities/{id}")]
public async Task<IActionResult> DeleteOpportunity(string id)
{
    await _opportunityService.DeleteAsync(id);
    return Ok("Deleted.");
}


    }

    public class StatusRequest
    {
        public string Status { get; set; } = null!;
    }
}