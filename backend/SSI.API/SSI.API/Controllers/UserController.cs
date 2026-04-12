using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserServices _userServices;

        public UserController(UserServices userServices)
        {
            _userServices = userServices;
        }

        // GET /api/user/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var user = await _userServices.GetByUserNameAsync(userName);
            if (user == null) return NotFound("User not found.");

            return Ok(new
            {
                user.UserName,
                user.Email,
                user.Role,
                user.Name,
                user.Surname,
                user.ProfilePic,
                user.CourseName,
                user.CourseEndMonth,
                user.CourseEndYear,
                user.Department,
                user.PassedOutYear
            });
        }

        // PUT /api/user/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request)
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var updatedUser = await _userServices.UpdateProfileAsync(userName, request);
            if (updatedUser == null) return NotFound("User not found.");

            return Ok(new
            {
                updatedUser.UserName,
                updatedUser.Email,
                updatedUser.Role,
                updatedUser.Name,
                updatedUser.Surname,
                updatedUser.ProfilePic,
                updatedUser.CourseName,
                updatedUser.CourseEndMonth,
                updatedUser.CourseEndYear,
                updatedUser.Department,
                updatedUser.PassedOutYear
            });
        }

        // GET /api/user/list?role=Alumni
      // GET /api/user/list?role=Alumni
[AllowAnonymous]
[HttpGet("list")]
public async Task<IActionResult> GetByRole([FromQuery] string role)
{
    if (string.IsNullOrWhiteSpace(role))
        return BadRequest("Role is required.");

    var users = await _userServices.GetByRoleAsync(role);

    var result = users.Select(u => new
    {
        u.UserName,
        u.Name,
        u.Surname,
        u.ProfilePic,
        u.PassedOutYear,
        u.CourseName,
        u.Department
    });

    return Ok(result);
}

        [HttpGet("ping")]
[AllowAnonymous]
public IActionResult Ping()
{
    return Ok("UserController is reachable");
}
    }
}