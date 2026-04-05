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

        public async Task UpdateUser(User user)
        {
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
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
   
        // ADMIN....
        public async Task<List<User>> GetAllAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<List<User>> SearchAsync(string keyword)
        {
            return await _users.Find(u =>
                u.UserName.Contains(keyword) ||
                u.Email.Contains(keyword) ||
                u.Role.Contains(keyword)
            ).ToListAsync();
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            var result = await _users.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
