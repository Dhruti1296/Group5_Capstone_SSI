using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class MentorshipService
    {
        private readonly IMongoCollection<MentorshipRequest> _requests;
        private readonly IMongoCollection<ChatMessage> _messages;

        public MentorshipService(MongoDbContext context)
        {
            _requests = context.MentorshipRequests;
            _messages = context.ChatMessages;
        }

        public async Task<List<MentorshipRequest>> GetPendingForMentorAsync(string mentorUserName)
        {
            return await _requests
                .Find(r => r.MentorUserName == mentorUserName && r.Status == "Pending")
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<MentorshipRequest?> GetAcceptedForStudentAsync(string studentUserName)
        {
            return await _requests
                .Find(r => r.StudentUserName == studentUserName && r.Status == "Accepted")
                .FirstOrDefaultAsync();
        }

        public async Task<List<MentorshipRequest>> GetAcceptedForMentorAsync(string mentorUserName)
        {
            return await _requests
                .Find(r => r.MentorUserName == mentorUserName && r.Status == "Accepted")
                .ToListAsync();
        }

        public async Task<MentorshipRequest?> GetRequestAsync(
            string studentUserName, string mentorUserName)
        {
            return await _requests
                .Find(r => r.StudentUserName == studentUserName &&
                           r.MentorUserName == mentorUserName &&
                           r.Status == "Pending")
                .FirstOrDefaultAsync();
        }

        public async Task<MentorshipRequest> CreateRequestAsync(MentorshipRequest request)
        {
            await _requests.InsertOneAsync(request);
            return request;
        }

        public async Task AcceptRequestAsync(string requestId, string studentUserName)
        {
            var acceptUpdate = Builders<MentorshipRequest>.Update
                .Set(r => r.Status, "Accepted");
            await _requests.UpdateOneAsync(r => r.Id == requestId, acceptUpdate);

            var cancelUpdate = Builders<MentorshipRequest>.Update
                .Set(r => r.Status, "Cancelled");
            await _requests.UpdateManyAsync(
                r => r.StudentUserName == studentUserName &&
                     r.Id != requestId &&
                     r.Status == "Pending",
                cancelUpdate
            );
        }

        public async Task CancelRequestAsync(string requestId)
        {
            var update = Builders<MentorshipRequest>.Update
                .Set(r => r.Status, "Cancelled");
            await _requests.UpdateOneAsync(r => r.Id == requestId, update);
        }

        public async Task CancelAllForMentorAsync(string mentorUserName)
        {
            var update = Builders<MentorshipRequest>.Update
                .Set(r => r.Status, "Cancelled");
            await _requests.UpdateManyAsync(
                r => r.MentorUserName == mentorUserName &&
                     (r.Status == "Accepted" || r.Status == "Pending"),
                update
            );
        }

        public async Task<MentorshipRequest?> GetByIdAsync(string id)
        {
            return await _requests.Find(r => r.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<ChatMessage>> GetMessagesAsync(string roomId)
        {
            return await _messages
                .Find(m => m.RoomId == roomId)
                .SortBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task SaveMessageAsync(ChatMessage message)
        {
            await _messages.InsertOneAsync(message);
        }

        public static string GetRoomId(string studentUserName, string mentorUserName)
        {
            return $"{studentUserName}_{mentorUserName}";
        }
    }
}