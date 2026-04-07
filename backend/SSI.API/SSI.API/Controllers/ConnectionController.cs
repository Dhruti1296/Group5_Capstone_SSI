using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    public class ConnectionController : Controller
    {
        [ApiController]
        [Route("api/alumni")]
        public class AlumniController : ControllerBase
        {
            private readonly AlumniService _alumniService;

            public AlumniController(AlumniService alumniService)
            {
                _alumniService = alumniService;
            }

            // GET: api/alumni
            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var alumni = await _alumniService.GetAllAsync();
                return Ok(alumni);
            }

            // GET: api/alumni/{userName}
            [HttpGet("{userName}")]
            public async Task<IActionResult> GetByUserName(string userName)
            {
                var profile = await _alumniService.GetByUserNameAsync(userName);

                if (profile == null)
                    return NotFound("Alumni profile not found");

                return Ok(profile);
            }

            // POST: api/alumni
            [HttpPost]
            public async Task<IActionResult> Create(AlumniProfile profile)
            {
                var existing = await _alumniService.GetByUserNameAsync(profile.UserName);
                if (existing != null)
                    return BadRequest("Profile already exists");

                await _alumniService.CreateAsync(profile);
                return Ok("Alumni profile created successfully");
            }

            // PUT: api/alumni/{userName}
            [HttpPut("{userName}")]
            public async Task<IActionResult> Update(string userName, AlumniProfile profile)
            {
                profile.UserName = userName;

                var updated = await _alumniService.UpdateAsync(userName, profile);

                if (!updated)
                    return NotFound("Profile not found");

                return Ok("Profile updated successfully");
            }

            // GET: api/alumni/search/{keyword}
            [HttpGet("search/{keyword}")]
            public async Task<IActionResult> Search(string keyword)
            {
                var results = await _alumniService.SearchAsync(keyword);
                return Ok(results);
            }

        }
    }
}
