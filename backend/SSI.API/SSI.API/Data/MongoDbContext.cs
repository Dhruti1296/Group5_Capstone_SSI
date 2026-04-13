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

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");

        public IMongoCollection<Admin> Admins =>
            _database.GetCollection<Admin>("Admins");

        public IMongoCollection<Post> Posts =>
            _database.GetCollection<Post>("Posts");

        public IMongoCollection<MentorApplication> MentorApplications =>
            _database.GetCollection<MentorApplication>("MentorApplications");

        public IMongoCollection<VolunteerApplication> VolunteerApplications =>
            _database.GetCollection<VolunteerApplication>("VolunteerApplications");

        public IMongoCollection<Notification> Notifications =>
            _database.GetCollection<Notification>("Notifications");

        public IMongoCollection<MentorshipRequest> MentorshipRequests =>
            _database.GetCollection<MentorshipRequest>("MentorshipRequests");

        public IMongoCollection<ChatMessage> ChatMessages =>
            _database.GetCollection<ChatMessage>("ChatMessages");

        public IMongoCollection<VolunteerOpportunity> VolunteerOpportunities =>
    _database.GetCollection<VolunteerOpportunity>("VolunteerOpportunities");
    }
}