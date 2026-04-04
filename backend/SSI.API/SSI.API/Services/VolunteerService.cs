using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class VolunteerService
    {
        private readonly IMongoCollection<VolunteerApplication> _applications;

        public VolunteerService(MongoDbContext context)
        {
            _applications = context.VolunteerApplications;
        }

        public async Task<List<VolunteerApplication>> GetAllAsync()
        {
            return await _applications
                .Find(_ => true)
                .SortByDescending(v => v.AppliedAt)
                .ToListAsync();
        }

        public async Task<VolunteerApplication?> GetByUserAndOpportunityAsync(
            string userName, int opportunityId)
        {
            return await _applications
                .Find(v => v.UserName == userName && v.OpportunityId == opportunityId)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(VolunteerApplication application)
        {
            await _applications.InsertOneAsync(application);
        }

        public async Task UpdateStatusAsync(string id, string status)
        {
            var update = Builders<VolunteerApplication>.Update
                .Set(v => v.Status, status);
            await _applications.UpdateOneAsync(v => v.Id == id, update);
        }

            public async Task<List<VolunteerApplication>> GetByUserNameAsync(string userName)
{
    return await _applications
        .Find(v => v.UserName == userName)
        .ToListAsync();
}
    }


}