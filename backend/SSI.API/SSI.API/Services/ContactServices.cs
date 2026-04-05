using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class ContactServices
    {
        private readonly IMongoCollection<ContactMessage> _contacts;

        // connecting the ContactServices with the MongoDB ContactMessages collection...
        public ContactServices(MongoDbContext context)
        {
            _contacts = context.ContactMessages;
        }

        // returns all the contact messages from the DB in descending order based on CreatedAt...
        public async Task<List<ContactMessage>> GetAllAsync()
        {
            return await _contacts.Find(_ => true)
                                  .SortByDescending(c => c.CreatedAt)
                                  .ToListAsync();
        }

        // returns a single contact message by its Id or null if not found...
        public async Task<ContactMessage?> GetByIdAsync(string id)
        {
            return await _contacts.Find(c => c.Id == id)
                                  .FirstOrDefaultAsync();
        }

        // creates a new contact message and returns it...
        public async Task<ContactMessage> CreateAsync(ContactMessage message)
        {
            await _contacts.InsertOneAsync(message);
            return message;
        }

        // optional: update message status (New → InProgress → Resolved)
        public async Task<bool> UpdateStatusAsync(string id, string status)
        {
            var update = Builders<ContactMessage>.Update
                                                  .Set(c => c.Status, status);

            var result = await _contacts.UpdateOneAsync(c => c.Id == id, update);

            return result.ModifiedCount > 0;
        }
    }
}
