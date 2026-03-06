using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class AdminServices
    {
        private readonly IMongoCollection<Admin> _admins;

        public AdminServices(MongoDbContext context)
        {
            _admins = context.Admins;
        }

        public async Task<Admin?> GetByUserName(string userName)
        {
            return await _admins
                .Find(a => a.UserName == userName)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAdmin(Admin admin)
        {
            await _admins.InsertOneAsync(admin);
        }
    }
}
