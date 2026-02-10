using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class UserServices
    {
        private readonly IMongoCollection<User> _users;

        public UserServices(MongoDbContext context)
        {
            _users = context.Users;
        }
        public async Task<User?> GetByUserName(string userName)
        {
            return await _users
                .Find(u => u.UserName == userName)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _users
                .Find(u => u.Email == email)
                .FirstOrDefaultAsync();
        }

        public async Task Register(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<User> Login(string username, string password)
        {
            return await _users.Find(u =>
                u.UserName == username && u.Password == password
            ).FirstOrDefaultAsync();
        }
    }
}
