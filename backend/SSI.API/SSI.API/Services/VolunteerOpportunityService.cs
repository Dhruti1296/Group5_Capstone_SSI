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

        public async Task UpdateAsync(string id, VolunteerOpportunity opportunity)
        {
            // Never let the incoming object override the _id
            var filter = Builders<VolunteerOpportunity>.Filter.Eq(o => o.Id, id);

            var update = Builders<VolunteerOpportunity>.Update
                .Set(o => o.Title, opportunity.Title)
                .Set(o => o.Description, opportunity.Description)
                .Set(o => o.Date, opportunity.Date)
                .Set(o => o.Location, opportunity.Location)
                .Set(o => o.Status, opportunity.Status);

            await _opportunities.UpdateOneAsync(filter, update);
        }

        public async Task DeleteAsync(string id) =>
            await _opportunities.DeleteOneAsync(o => o.Id == id);
    }
}