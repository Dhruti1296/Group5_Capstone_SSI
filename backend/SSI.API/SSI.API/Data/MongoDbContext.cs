using MongoDB.Driver;
using SSI.API.Models;

namespace SSI.API.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDbSettings:ConnectionString"]);
            _database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
        }
        // users
        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");

        //Admin
        public IMongoCollection<Admin> Admins =>
    _database.GetCollection<Admin>("Admins");
    }
}
