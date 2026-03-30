using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserName")]
        public string UserName { get; set; } = null!; // recipient

        [BsonElement("Message")]
        public string Message { get; set; } = null!;

        [BsonElement("Type")]
        public string Type { get; set; } = "info"; // info, success, warning

        [BsonElement("IsRead")]
        public bool IsRead { get; set; } = false;

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}