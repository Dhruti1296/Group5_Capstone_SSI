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
            //created errors list
            var errors = new List<string>();

            //user email lower
            user.Email = user.Email.ToLower();

            //userName
            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                errors.Add("User Name is required");
            }

            //Role
            if (user.Role == null || (user.Role.ToLower() != "student" && user.Role.ToLower() != "alumni"))
            {
                errors.Add("Invalid Student Role");
            }

            //user and email already exist or not
            var existingUser = await _context.Users
                .Find(u => u.UserName == user.UserName || u.Email == user.Email)
                .FirstOrDefaultAsync();

            //existingUser
            if (existingUser != null)
                errors.Add("Username or Email already exists.");

            //regex for email
            if (!Regex.IsMatch(user.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                errors.Add("Invalid email format.");

            //password length
            if (user.Password.Length < 8)
                errors.Add("Password must be at least 8 characters long.");

            //Name
            if (string.IsNullOrWhiteSpace(user.Name))
            {
                errors.Add("Name is required");
            }

            //if any errors we have in the list
            if (errors.Any())
            {
                return BadRequest(new
                {
                    message = "Validation Error",
                    errors = errors
                });
            }

            //hash the password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            //save the user details
            await _context.Users.InsertOneAsync(user);
            return Ok("Registration successful!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            //created errors list
            var errors = new List<string>();

            //login validation
            if (login == null)
            {
                return BadRequest(new
                {
                    message = "VAlidation Error",
                    errors = new[]
                {
                    "Login input is required"
                }
                });
            }

            //userName
            if (string.IsNullOrWhiteSpace(login.UserName))
            {
                errors.Add("User Name is required");
            }

            //password
            if (string.IsNullOrWhiteSpace(login.Password))
            {
                errors.Add("Password is required");
            }

            //errors list
            if (errors.Any())
            {
                return BadRequest(new
                {
                    message = "Validation Errors",
                    errors = errors
                });
            }

            // Check admins first and there is no lockout for admins
            var admin = await _context.Admins
                .Find(a => a.UserName == login.UserName)
                .FirstOrDefaultAsync();

            //verify username and password admin
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

            // Checking for regular users
            var user = await _context.Users
                .Find(u => u.UserName == login.UserName)
                .FirstOrDefaultAsync();

            // users
            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Login failed",
                    errors = new[] { "Invalid username or password" }
                });
            }

            // Check if account is locked
            if (user.LockUntil.HasValue && DateTime.UtcNow < user.LockUntil.Value)
            {
                TimeZoneInfo easternTime = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
                var lockUntilLocal = TimeZoneInfo.ConvertTimeFromUtc(user.LockUntil.Value, easternTime);

                return Unauthorized(new
                {
                    message = "Account Locked",
                    errors = new[] { $"Account is locked until {lockUntilLocal:MMM dd, yyyy h:mm tt} EST." }
                });
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
                    return Unauthorized(new
                    {
                        message = "Account locked",
                        errors = new[] { "Too many failed attempts. Account locked for 5 hours." }
                    });
                }

                await _userServices.UpdateAsync(user);
                return Unauthorized(new
                {
                    message = "Account locked",
                    errors = new[] { $"Invalid password. {3 - user.FailedLoginAttempts} attempt(s) remaining." }
                });                
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
    }
}