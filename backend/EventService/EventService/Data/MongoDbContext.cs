using EventService.Models;
using MongoDB.Driver;

namespace EventService.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        public MongoDbContext(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDbSettings:ConnectionString"]);
            _database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
        }
        public IMongoCollection<Event> EventsCollection => _database.GetCollection<Event>("Events");
    }
}
