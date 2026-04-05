using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using SSI.API.Models;
using System.Xml.Linq;

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

        //Posts...
        public IMongoCollection<Post> Posts =>
        _database.GetCollection<Post>("Posts");

        //Comments...
        public IMongoCollection<Comment> Comments =>
        _database.GetCollection<Comment>("Comments");

        //ContactMessage...
        public IMongoCollection<ContactMessage> ContactMessages =>
        _database.GetCollection<ContactMessage>("ContactMessages");

        public IMongoCollection<AlumniProfile> AlumniProfiles =>
            _database.GetCollection<AlumniProfile>("AlumniProfiles");

        public IMongoCollection<ConnectionRequest> ConnectionRequests =>
            _database.GetCollection<ConnectionRequest>("ConnectionRequests");
    }
}
