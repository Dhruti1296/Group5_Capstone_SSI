using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {

        private readonly UserServices _userService;

        // injection of UserServices into the controller...
        public AdminUsersController(UserServices userService)
        {
            _userService = userService;
        }

        // get all the users...
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // filtering user based on the email, role, username...
        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> Search(string keyword)
        {
            var users = await _userService.SearchAsync(keyword);
            return Ok(users);
        }

        // deletion of the user data via the id...
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _userService.DeleteByIdAsync(id);

            if (!deleted)
                return NotFound("User not found");

            return Ok("User deleted successfully");
        }

    }
}
