using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly MentorshipService _mentorshipService;

        public ChatHub(MentorshipService mentorshipService)
        {
            _mentorshipService = mentorshipService;
        }

        // Join a chat room
        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        // Leave a chat room
        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }

        // Send a message to a room
        public async Task SendMessage(string roomId, string message)
        {
            var userName = Context.User?.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return;

            var chatMessage = new ChatMessage
            {
                RoomId = roomId,
                SenderUserName = userName,
                Message = message,
                SentAt = DateTime.UtcNow
            };

            // Save to MongoDB
            await _mentorshipService.SaveMessageAsync(chatMessage);

            // Broadcast to everyone in the room
            await Clients.Group(roomId).SendAsync("ReceiveMessage", new
            {
                id = chatMessage.Id,
                roomId = chatMessage.RoomId,
                senderUserName = chatMessage.SenderUserName,
                message = chatMessage.Message,
                sentAt = chatMessage.SentAt
            });
        }
    }
}