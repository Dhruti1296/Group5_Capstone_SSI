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

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _users.Find(u => u.UserName == userName).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<List<User>> GetByRoleAsync(string role)
        {
            return await _users
                .Find(u => u.Role == role)
                .ToListAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<bool> DeleteByUserNameAsync(string userName)
        {
            var result = await _users.DeleteOneAsync(u => u.UserName == userName);
            return result.DeletedCount > 0;
        }

        public async Task<User?> UpdateProfileAsync(string userName, UpdateProfileRequest req)
        {
            var updates = new List<UpdateDefinition<User>>();

            if (req.Name != null)
                updates.Add(Builders<User>.Update.Set(u => u.Name, req.Name));
            if (req.Surname != null)
                updates.Add(Builders<User>.Update.Set(u => u.Surname, req.Surname));
            if (req.ProfilePic != null)
                updates.Add(Builders<User>.Update.Set(u => u.ProfilePic, req.ProfilePic));
            if (req.CourseName != null)
                updates.Add(Builders<User>.Update.Set(u => u.CourseName, req.CourseName));
            if (req.CourseEndMonth != null)
                updates.Add(Builders<User>.Update.Set(u => u.CourseEndMonth, req.CourseEndMonth));
            if (req.CourseEndYear != null)
                updates.Add(Builders<User>.Update.Set(u => u.CourseEndYear, req.CourseEndYear));
            if (req.Department != null)
                updates.Add(Builders<User>.Update.Set(u => u.Department, req.Department));
            if (req.PassedOutYear != null)
                updates.Add(Builders<User>.Update.Set(u => u.PassedOutYear, req.PassedOutYear));

            if (updates.Count == 0)
                return await GetByUserNameAsync(userName);

            var combined = Builders<User>.Update.Combine(updates);
            await _users.UpdateOneAsync(u => u.UserName == userName, combined);

            return await GetByUserNameAsync(userName);
        }
    }
}