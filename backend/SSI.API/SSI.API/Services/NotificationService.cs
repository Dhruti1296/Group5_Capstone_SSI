using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class NotificationService
    {
        private readonly IMongoCollection<Notification> _notifications;

        public NotificationService(MongoDbContext context)
        {
            _notifications = context.Notifications;
        }

        public async Task<List<Notification>> GetForUserAsync(string userName)
        {
            return await _notifications
                .Find(n => n.UserName == userName)
                .SortByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<long> GetUnreadCountAsync(string userName)
        {
            return await _notifications
                .CountDocumentsAsync(n => n.UserName == userName && n.IsRead == false);
        }

        public async Task CreateAsync(string userName, string message, string type = "info")
        {
            var notification = new Notification
            {
                UserName = userName,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notifications.InsertOneAsync(notification);
        }

        public async Task MarkAllReadAsync(string userName)
        {
            var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
            await _notifications.UpdateManyAsync(
                n => n.UserName == userName && n.IsRead == false,
                update
            );
        }

        public async Task MarkOneReadAsync(string id)
        {
            var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
            await _notifications.UpdateOneAsync(n => n.Id == id, update);
        }
    }
}