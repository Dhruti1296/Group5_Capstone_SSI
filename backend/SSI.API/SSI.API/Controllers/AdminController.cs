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

        public AdminController(
            UserServices userServices,
            PostService postService,
            MentorService mentorService,
            VolunteerService volunteerService)
        {
            _userServices = userServices;
            _postService = postService;
            _mentorService = mentorService;
            _volunteerService = volunteerService;
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userServices.GetAllAsync();
            var mentorApps = await _mentorService.GetAllAsync();

            var result = users.Select(u => new
            {
                u.Id,
                u.UserName,
                u.Email,
                u.Role,
                u.Name,
                u.Surname,
                MentorStatus = mentorApps
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
            await _volunteerService.UpdateStatusAsync(id, request.Status);
            return Ok("Status updated.");
        }
    }

    public class StatusRequest
    {
        public string Status { get; set; } = null!;
    }
}