using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : Controller
    {
        private readonly UserServices _userService;
        private readonly AdminServices _adminService;
        public AuthenticationController(UserServices userService, AdminServices adminService)
        {
            _userService = userService;
            _adminService = adminService;
        }

        //register
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            // null check and handling ....
            if (user == null)
                return BadRequest("Invalid data");

            if (string.IsNullOrWhiteSpace(user.Role))
                return BadRequest("Role is required");
           
            if (string.IsNullOrWhiteSpace(user.Email))
                return BadRequest("Email is required");

            // for role based validation...            
            var role = user.Role.Trim().ToLower();
            if ((role != "student") && (role != "alimini"))
            {
                return BadRequest("Enter valid Role");
            }
           
            // for email based validation based on the conestoga mail id... 
            var email = user.Email.Trim().ToLower();
            if (!email.EndsWith("@conestogac.on.ca"))
                return BadRequest("Only Conestoga college email is allowed (example@conestogac.on.ca)");

            //duplicate email check...
            var existingUser = await _userService.GetByEmail(user.Email); 
            if (existingUser != null)
            {
                return BadRequest("User Email is already registered");
            }

            var users = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role
            };

            await _userService.Register(users);
            return Ok("Registered Successfully");
        }

        //login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest login)
        {
            //getting the admin details
            var admin = await _adminService.GetByUserName(login.UserName);
            if (admin != null && admin.Password == login.Password)
            {
                return Ok(new { message = "Login successful", userName = admin.UserName, role = admin.Role });
            }

            //getting the user details
            var user = await _userService.GetByUserName(login.UserName);
            if (user == null)
            {
                return BadRequest($"Invalid UserName or password");
            }

            //checking the user account is locked
            if ((user.LockUntill.HasValue) && (DateTime.UtcNow < user.LockUntill.Value))
            {
                //converting the UTC time to Eastern Time
                TimeZoneInfo easternTime = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
                var lockUntill_LocalTime = TimeZoneInfo.ConvertTimeFromUtc(user.LockUntill.Value, easternTime);
                return BadRequest($"Account is locked until {lockUntill_LocalTime}");
            }

            //failed login attempt
            if (user.Password != login.Password)
            {
                //increment the failedloginAttempt value +1
                user.FailedLoginAttempts++;

                //Checking if the attempts more than 3
                if (user.FailedLoginAttempts >= 3)
                {
                    //added the hours for locking the account
                    user.LockUntill = DateTime.UtcNow.AddHours(5);
                    user.FailedLoginAttempts = 0;
                }
                await _userService.UpdateUser(user);
                return Unauthorized("Invalid username or password");
            }

            user.FailedLoginAttempts = 0;
            user.LockUntill = null;
            await _userService.UpdateUser(user);
           
                return Ok(new { message = "Login successful",
                    userName = user.UserName,
                    role = user.Role
                });            
        }
    }
}
