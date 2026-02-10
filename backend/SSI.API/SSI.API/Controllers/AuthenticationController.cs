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
            if((user.Role != "Student") && (user.Role != "Alimini"))
            {
                return BadRequest("Enter valid Role");
            }
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
            var user = await _userService.GetByUserName(login.UserName);

            if ((user != null) && (user.Password == login.Password))
            {
                return Ok(new { message = "Login successful",
                    userName = user.UserName,
                    role = user.Role
                });
                
            }

            var admin = await _adminService.GetByUserName(login.UserName);
            if (admin != null && admin.Password == login.Password)
            {
                return Ok(new { message = "Login successful", userName = admin.UserName, role = admin.Role });
            }

            return Unauthorized("Invalid username or password");
        }
        //public IActionResult Index()
        //{
        //    return View();
        //}
    }
}
