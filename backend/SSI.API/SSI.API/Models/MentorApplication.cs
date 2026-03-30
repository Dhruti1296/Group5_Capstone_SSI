using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    public class MentorApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserName")]
        public string? UserName { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = null!;

        [BsonElement("Role")]
        public string Role { get; set; } = null!;

        [BsonElement("PassedOutYear")]
        public string? PassedOutYear { get; set; }

        [BsonElement("Bio")]
        public string Bio { get; set; } = null!;

        [BsonElement("Expertise")]
        public List<string> Expertise { get; set; } = new();

        [BsonElement("Email")]
        public string Email { get; set; } = null!;

        [BsonElement("LinkedIn")]
        public string? LinkedIn { get; set; }

        [BsonElement("AppliedAt")]
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("Approved")]
        public bool Approved { get; set; } = false;

        [BsonElement("Status")]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    }
}