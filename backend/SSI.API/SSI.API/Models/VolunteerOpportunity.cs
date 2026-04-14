using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class VolunteerOpportunity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Title")]
        public string Title { get; set; } = null!;

        [BsonElement("Description")]
        public string Description { get; set; } = null!;

        [BsonElement("Date")]
        public string Date { get; set; } = null!;

        [BsonElement("Location")]
        public string Location { get; set; } = null!;

        [BsonElement("Status")]
        public string Status { get; set; } = "Open";

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}