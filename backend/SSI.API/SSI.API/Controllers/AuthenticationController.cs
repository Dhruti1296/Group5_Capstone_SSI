using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;
using System.Text.RegularExpressions;
using BCrypt.Net;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public AuthController(MongoDbContext context)
        {
            _context = context;
        }

        //  Registration endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            user.Email = user.Email.ToLower();

            // Check uniqueness
            var existingUser = await _context.Users
                .Find(u => u.UserName == user.UserName || u.Email == user.Email)
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                return BadRequest("Username or Email already exists.");
            }

            // Validate email format
            if (!Regex.IsMatch(user.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return BadRequest("Invalid email format.");
            }

            // Validate password strength
            if (user.Password.Length < 8)
            {
                return BadRequest("Password must be at least 8 characters long.");
            }

            // Hash password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _context.Users.InsertOneAsync(user);
            return Ok("Registration successful!");
        }

        //  Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _context.Users.Find(u => u.UserName == login.UserName).FirstOrDefaultAsync();

            if (user != null && BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return Ok(new
                {
                    message = "Login successful",
                    userName = user.UserName,
                    role = user.Role
                });
            }

            var admin = await _context.Admins.Find(a => a.UserName == login.UserName).FirstOrDefaultAsync();
            if (admin != null && BCrypt.Net.BCrypt.Verify(login.Password, admin.Password))
            {
                return Ok(new
                {
                    message = "Login successful",
                    userName = admin.UserName,
                    role = admin.Role
                });
            }

            return Unauthorized("Invalid username or password");
        }

[HttpDelete("clear-users")]
public async Task<IActionResult> ClearUsers()
{
    await _context.Users.DeleteManyAsync(_ => true); // deletes all users
    await _context.Admins.DeleteManyAsync(_ => true); // optional: clear admins too
    return Ok("All users deleted.");
}
    }
}