using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("RoomId")]
        public string RoomId { get; set; } = null!; // studentUserName_mentorUserName

        [BsonElement("SenderUserName")]
        public string SenderUserName { get; set; } = null!;

        [BsonElement("Message")]
        public string Message { get; set; } = null!;

        [BsonElement("SentAt")]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}