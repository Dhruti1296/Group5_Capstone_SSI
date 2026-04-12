using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class VolunteerOpportunityService
    {
        private readonly IMongoCollection<VolunteerOpportunity> _opportunities;

        public VolunteerOpportunityService(MongoDbContext context)
        {
            _opportunities = context.VolunteerOpportunities;
        }

        public async Task<List<VolunteerOpportunity>> GetAllAsync() =>
            await _opportunities.Find(_ => true).ToListAsync();

        public async Task<VolunteerOpportunity?> GetByIdAsync(string id) =>
            await _opportunities.Find(o => o.Id == id).FirstOrDefaultAsync();

        public async Task<VolunteerOpportunity> CreateAsync(VolunteerOpportunity opportunity)
        {
            await _opportunities.InsertOneAsync(opportunity);
            return opportunity;
        }

        public async Task UpdateAsync(string id, VolunteerOpportunity opportunity) =>
            await _opportunities.ReplaceOneAsync(o => o.Id == id, opportunity);

        public async Task DeleteAsync(string id) =>
            await _opportunities.DeleteOneAsync(o => o.Id == id);
    }
}