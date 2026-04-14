using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class AdminServices
    {
        // MongoDB collection for Admin...
        private readonly IMongoCollection<Admin> _admins;

        // constructor to initialize MongoDB collection using context..
        public AdminServices(MongoDbContext context)
        {
            _admins = context.Admins;
        }

        // retrieve username and role based on userName...
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
