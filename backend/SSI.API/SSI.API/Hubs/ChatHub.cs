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

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            // Mark all messages in this room as read for this user
            var userName = Context.User?.FindFirstValue(ClaimTypes.Name);
            if (userName != null)
            {
                await _mentorshipService.MarkMessagesReadAsync(roomId, userName);
            }
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }

        public async Task SendMessage(string roomId, string message)
        {
            var userName = Context.User?.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return;

            var chatMessage = new ChatMessage
            {
                RoomId = roomId,
                SenderUserName = userName,
                Message = message,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            await _mentorshipService.SaveMessageAsync(chatMessage);

            await Clients.Group(roomId).SendAsync("ReceiveMessage", new
            {
                id = chatMessage.Id,
                roomId = chatMessage.RoomId,
                senderUserName = chatMessage.SenderUserName,
                message = chatMessage.Message,
                sentAt = chatMessage.SentAt,
                isRead = chatMessage.IsRead
            });
        }
    }
}