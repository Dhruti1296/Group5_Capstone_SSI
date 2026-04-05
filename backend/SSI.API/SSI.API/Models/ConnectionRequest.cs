using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    public class ConnectionRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? StudentUserName { get; set; }
        public string? AlumniUserName { get; set; }       
        public string? Status { get; set; } = "Pending"; // Status can be Pending / Accepted / Rejected...
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
