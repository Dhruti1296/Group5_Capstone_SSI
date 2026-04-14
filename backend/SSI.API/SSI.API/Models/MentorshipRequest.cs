using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class MentorshipRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("StudentUserName")]
        public string StudentUserName { get; set; } = null!;

        [BsonElement("MentorUserName")]
        public string MentorUserName { get; set; } = null!;

        [BsonElement("MentorName")]
        public string MentorName { get; set; } = null!;

        [BsonElement("StudentName")]
        public string? StudentName { get; set; }

        [BsonElement("Status")]
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Cancelled

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}