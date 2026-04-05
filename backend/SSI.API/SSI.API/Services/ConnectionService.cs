using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class ConnectionService
    {

        private readonly IMongoCollection<ConnectionRequest> _requests;

        public ConnectionService(MongoDbContext context)
        {
            _requests = context.ConnectionRequests;
        }

        public async Task CreateRequestAsync(ConnectionRequest request)
        {
            await _requests.InsertOneAsync(request);
        }

        public async Task<List<ConnectionRequest>> GetRequestsForAlumniAsync(string alumniUserName)
        {
            return await _requests.Find(r => r.AlumniUserName == alumniUserName).ToListAsync();
        }

        public async Task<List<ConnectionRequest>> GetRequestsByStudentAsync(string studentUserName)
        {
            return await _requests.Find(r => r.StudentUserName == studentUserName).ToListAsync();
        }

        public async Task<bool> UpdateStatusAsync(string id, string status)
        {
            var update = Builders<ConnectionRequest>.Update.Set(r => r.Status, status);

            var result = await _requests.UpdateOneAsync(r => r.Id == id, update);
            return result.ModifiedCount > 0;
        }

        // ADMIN
        public async Task<List<ConnectionRequest>> GetAllAsync()
        {
            return await _requests.Find(_ => true)
                                  .SortByDescending(r => r.RequestedAt)
                                  .ToListAsync();
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            var result = await _requests.DeleteOneAsync(r => r.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
