using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace EventService.Models
{
    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; } //type of event
        public DateTime EventDate { get; set; }
        public string? Location { get; set; }
        [JsonIgnore]
        public string? ImageUrl { get; set; }
    }
}
