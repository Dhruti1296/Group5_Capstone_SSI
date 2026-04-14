using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET /api/notifications — get all notifications for current user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var notifications = await _notificationService.GetForUserAsync(userName);
            return Ok(notifications);
        }

        // GET /api/notifications/unread-count
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var count = await _notificationService.GetUnreadCountAsync(userName);
            return Ok(new { count });
        }

        // PATCH /api/notifications/mark-all-read
        [HttpPatch("mark-all-read")]
        public async Task<IActionResult> MarkAllRead()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            await _notificationService.MarkAllReadAsync(userName);
            return Ok("All notifications marked as read.");
        }

        // PATCH /api/notifications/{id}/read
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkOneRead(string id)
        {
            await _notificationService.MarkOneReadAsync(id);
            return Ok("Notification marked as read.");
        }
    }
}