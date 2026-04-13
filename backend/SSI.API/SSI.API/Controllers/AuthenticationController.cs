using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;
using SSI.API.Services;
using System.Text.RegularExpressions;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MongoDbContext _context;
        private readonly TokenService _tokenService;
        private readonly UserServices _userServices;

        public AuthController(MongoDbContext context, TokenService tokenService, UserServices userServices)
        {
            _context = context;
            _tokenService = tokenService;
            _userServices = userServices;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            user.Email = user.Email.ToLower();

            var existingUser = await _context.Users
                .Find(u => u.UserName == user.UserName || u.Email == user.Email)
                .FirstOrDefaultAsync();

            if (existingUser != null)
                return BadRequest("Username or Email already exists.");

            if (!Regex.IsMatch(user.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return BadRequest("Invalid email format.");

            if (user.Password.Length < 8)
                return BadRequest("Password must be at least 8 characters long.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _context.Users.InsertOneAsync(user);
            return Ok("Registration successful!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            // Check admins first — no lockout for admins
            var admin = await _context.Admins
                .Find(a => a.UserName == login.UserName)
                .FirstOrDefaultAsync();

            if (admin != null && BCrypt.Net.BCrypt.Verify(login.Password, admin.Password))
            {
                var token = _tokenService.GenerateToken(admin.UserName, admin.Role);
                return Ok(new
                {
                    message = "Login successful",
                    token,
                    userName = admin.UserName,
                    email = (string?)null,
                    role = admin.Role
                });
            }

            // Check regular users
            var user = await _context.Users
                .Find(u => u.UserName == login.UserName)
                .FirstOrDefaultAsync();

            if (user == null)
                return Unauthorized("Invalid username or password.");

            // Check if account is locked
            if (user.LockUntil.HasValue && DateTime.UtcNow < user.LockUntil.Value)
            {
                TimeZoneInfo easternTime = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
                var lockUntilLocal = TimeZoneInfo.ConvertTimeFromUtc(user.LockUntil.Value, easternTime);
                return Unauthorized($"Account is locked until {lockUntilLocal:MMM dd, yyyy h:mm tt} EST.");
            }

            // Wrong password
            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                user.FailedLoginAttempts++;

                if (user.FailedLoginAttempts >= 3)
                {
                    user.LockUntil = DateTime.UtcNow.AddHours(5);
                    user.FailedLoginAttempts = 0;
                    await _userServices.UpdateAsync(user);
                    return Unauthorized("Too many failed attempts. Account locked for 5 hours.");
                }

                await _userServices.UpdateAsync(user);
                return Unauthorized($"Invalid password. {3 - user.FailedLoginAttempts} attempt(s) remaining.");
            }

            // Successful login — reset counters
            user.FailedLoginAttempts = 0;
            user.LockUntil = null;
            await _userServices.UpdateAsync(user);

            var userToken = _tokenService.GenerateToken(user.UserName, user.Role);
            return Ok(new
            {
                message = "Login successful",
                token = userToken,
                userName = user.UserName,
                email = user.Email,
                role = user.Role
            });
        }

        [HttpDelete("clear-users")]
        public async Task<IActionResult> ClearUsers()
        {
            await _context.Users.DeleteManyAsync(_ => true);
            await _context.Admins.DeleteManyAsync(_ => true);
            return Ok("All users deleted.");
        }
    }
}