using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class AlumniService
    {

        private readonly IMongoCollection<AlumniProfile> _alumniProfiles;

        public AlumniService(MongoDbContext context)
        {
            _alumniProfiles = context.AlumniProfiles;
        }

        public async Task<List<AlumniProfile>> GetAllAsync()
        {
            return await _alumniProfiles.Find(_ => true).ToListAsync();
        }

        public async Task<AlumniProfile> GetByUserNameAsync(string userName)
        {
            return await _alumniProfiles.Find(a => a.UserName == userName).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(AlumniProfile profile)
        {
            await _alumniProfiles.InsertOneAsync(profile);
        }

        public async Task<bool> UpdateAsync(string userName, AlumniProfile updatedProfile)
        {
            var result = await _alumniProfiles.ReplaceOneAsync(
                a => a.UserName == userName,
                updatedProfile
            );

            return result.ModifiedCount > 0;
        }

        public async Task<List<AlumniProfile>> SearchAsync(string keyword)
        {
            return await _alumniProfiles.Find(a =>
                a.FullName.Contains(keyword) ||
                a.Program.Contains(keyword) ||
                a.Company.Contains(keyword) ||
                a.JobTitle.Contains(keyword) ||
                a.Skills.Contains(keyword)
            ).ToListAsync();
        }

    }
}
