using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/admin/connections")]
    public class AdminConnectionsController : ControllerBase
    {
        private readonly ConnectionService _connectionService;

        // injection of ConnectionService into the controller...
        public AdminConnectionsController(ConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _connectionService.GetAllAsync();
            return Ok(requests);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] string status)
        {
            if (status != "Pending" && status != "Accepted" && status != "Rejected")
                return BadRequest("Invalid status");

            var updated = await _connectionService.UpdateStatusAsync(id, status);

            if (!updated)
                return NotFound("Request not found");

            return Ok("Request status updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _connectionService.DeleteByIdAsync(id);

            if (!deleted)
                return NotFound("Request not found");

            return Ok("Request deleted successfully");
        }
    }
}