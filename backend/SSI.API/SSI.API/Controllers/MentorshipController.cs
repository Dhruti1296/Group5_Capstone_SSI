using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/mentorship")]
    [Authorize]
    public class MentorshipController : ControllerBase
    {
        private readonly MentorshipService _mentorshipService;
        private readonly NotificationService _notificationService;
        private readonly MentorService _mentorService;

        public MentorshipController(
            MentorshipService mentorshipService,
            NotificationService notificationService,
            MentorService mentorService)
        {
            _mentorshipService = mentorshipService;
            _notificationService = notificationService;
            _mentorService = mentorService;
        }

        // POST /api/mentorship/request — student requests a mentor
        [HttpPost("request")]
        public async Task<IActionResult> RequestMentor(
            [FromBody] MentorshipRequestBody body)
        {
            var studentUserName = User.FindFirstValue(ClaimTypes.Name);
            if (studentUserName == null) return Unauthorized();

            // Check if already requested this mentor
            var existing = await _mentorshipService
                .GetRequestAsync(studentUserName, body.MentorUserName);
            if (existing != null)
                return BadRequest("You have already requested this mentor.");

            // Check if student already has an accepted mentor
            var accepted = await _mentorshipService
                .GetAcceptedForStudentAsync(studentUserName);
            if (accepted != null)
                return BadRequest("You already have an active mentor.");

            var request = new MentorshipRequest
            {
                StudentUserName = studentUserName,
                StudentName = body.StudentName,
                MentorUserName = body.MentorUserName,
                MentorName = body.MentorName,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _mentorshipService.CreateRequestAsync(request);

            // Notify the mentor
            await _notificationService.CreateAsync(
                body.MentorUserName,
                $"{studentUserName} has requested mentorship from you.",
                "info"
            );

            return Ok(request);
        }

        // GET /api/mentorship/my-requests — get pending requests for mentor
        [HttpGet("my-requests")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var requests = await _mentorshipService
                .GetPendingForMentorAsync(userName);
            return Ok(requests);
        }

        // GET /api/mentorship/my-mentor — get accepted mentor for student
        [HttpGet("my-mentor")]
        public async Task<IActionResult> GetMyMentor()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var mentor = await _mentorshipService
                .GetAcceptedForStudentAsync(userName);
            return mentor != null ? Ok(mentor) : NotFound("No active mentor.");
        }

        // GET /api/mentorship/my-mentees — get accepted mentees for mentor
        [HttpGet("my-mentees")]
        public async Task<IActionResult> GetMyMentees()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var mentees = await _mentorshipService
                .GetAcceptedForMentorAsync(userName);
            return Ok(mentees);
        }

        // PATCH /api/mentorship/{id}/accept — mentor accepts a student
        [HttpPatch("{id}/accept")]
        public async Task<IActionResult> Accept(string id)
        {
            var mentorUserName = User.FindFirstValue(ClaimTypes.Name);
            if (mentorUserName == null) return Unauthorized();

            var request = await _mentorshipService.GetByIdAsync(id);
            if (request == null) return NotFound("Request not found.");
            if (request.MentorUserName != mentorUserName)
                return Forbid();

            await _mentorshipService.AcceptRequestAsync(id, request.StudentUserName);

            // Notify student
            await _notificationService.CreateAsync(
                request.StudentUserName,
                $"Great news! {request.MentorName} has accepted your mentorship request. You can now chat with your mentor from your dashboard.",
                "success"
            );

            // Notify other mentors whose pending requests got cancelled
            var cancelledMentors = await _mentorshipService
                .GetPendingForMentorAsync(request.StudentUserName);

            return Ok("Request accepted.");
        }

        // PATCH /api/mentorship/{id}/decline — mentor declines a student
        [HttpPatch("{id}/decline")]
        public async Task<IActionResult> Decline(string id)
        {
            var mentorUserName = User.FindFirstValue(ClaimTypes.Name);
            if (mentorUserName == null) return Unauthorized();

            var request = await _mentorshipService.GetByIdAsync(id);
            if (request == null) return NotFound("Request not found.");
            if (request.MentorUserName != mentorUserName)
                return Forbid();

            await _mentorshipService.CancelRequestAsync(id);

            // Notify student
            await _notificationService.CreateAsync(
                request.StudentUserName,
                $"{request.MentorName} was unable to accept your mentorship request at this time.",
                "info"
            );

            return Ok("Request declined.");
        }

        // GET /api/mentorship/chat/{roomId} — get chat history
        [HttpGet("chat/{roomId}")]
        public async Task<IActionResult> GetChatHistory(string roomId)
        {
            var messages = await _mentorshipService.GetMessagesAsync(roomId);
            return Ok(messages);
        }

        // GET /api/mentorship/unread-counts — get unread counts for all rooms
         [HttpGet("unread-counts")]
         public async Task<IActionResult> GetUnreadCounts()
         {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            // Get all rooms this user is part of
            var asStudent = await _mentorshipService.GetAcceptedForStudentAsync(userName);
            var asMentor = await _mentorshipService.GetAcceptedForMentorAsync(userName);

            var counts = new Dictionary<string, long>();

            if (asStudent != null)
             {
               var roomId = $"{asStudent.StudentUserName}_{asStudent.MentorUserName}";
               counts[roomId] = await _mentorshipService.GetUnreadCountAsync(roomId, userName);
             }

            foreach (var mentee in asMentor)
            {
              var roomId = $"{mentee.StudentUserName}_{mentee.MentorUserName}";
              counts[roomId] = await _mentorshipService.GetUnreadCountAsync(roomId, userName);
          }      

             return Ok(counts);
       }

       // PATCH /api/mentorship/chat/{roomId}/mark-read — mark messages as read
       [HttpPatch("chat/{roomId}/mark-read")]
       public async Task<IActionResult> MarkRead(string roomId)
       {
        var userName = User.FindFirstValue(ClaimTypes.Name);
        if (userName == null) return Unauthorized();

        await _mentorshipService.MarkMessagesReadAsync(roomId, userName);
        return Ok("Messages marked as read.");
       }
    }

    public class MentorshipRequestBody
    {
        public string MentorUserName { get; set; } = null!;
        public string MentorName { get; set; } = null!;
        public string? StudentName { get; set; }
    }
}