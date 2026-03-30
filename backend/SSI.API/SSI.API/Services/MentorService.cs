using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class MentorService
    {
        private readonly IMongoCollection<MentorApplication> _mentors;

        public MentorService(MongoDbContext context)
        {
            _mentors = context.MentorApplications;
        }

        public async Task<List<MentorApplication>> GetApprovedAsync()
        {
            return await _mentors.Find(m => m.Approved == true).ToListAsync();
        }

        public async Task<List<MentorApplication>> GetAllAsync()
        {
            return await _mentors.Find(_ => true).ToListAsync();
        }

        public async Task<MentorApplication?> GetByUserNameAsync(string userName)
        {
            return await _mentors
                .Find(m => m.UserName == userName)
                .FirstOrDefaultAsync();
        }

        public async Task<MentorApplication?> GetByIdAsync(string id)
        {
            return await _mentors
                .Find(m => m.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(MentorApplication application)
        {
            await _mentors.InsertOneAsync(application);
        }

        public async Task SetApprovalAsync(string id, bool approved)
        {
            var status = approved ? "Approved" : "Rejected";
            var update = Builders<MentorApplication>.Update
                .Set(m => m.Approved, approved)
                .Set(m => m.Status, status);
            await _mentors.UpdateOneAsync(m => m.Id == id, update);
        }
    }
}