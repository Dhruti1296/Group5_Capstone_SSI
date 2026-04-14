using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserName")]
        public string UserName { get; set; } = null!;

        [BsonElement("Content")]
        public string Content { get; set; } = null!;

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("Likes")]
        public List<string> Likes { get; set; } = new();

        [BsonElement("Comments")]
        public List<Comment> Comments { get; set; } = new();
    }

    [BsonIgnoreExtraElements]
    public class Comment
    {
        [BsonElement("UserName")]
        public string UserName { get; set; } = null!;

        [BsonElement("Text")]
        public string Text { get; set; } = null!;

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}