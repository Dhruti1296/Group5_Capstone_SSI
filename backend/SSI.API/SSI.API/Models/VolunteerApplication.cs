using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements]
    public class VolunteerApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserName")]
        public string? UserName { get; set; }

        [BsonElement("OpportunityId")]
        public string OpportunityId { get; set; } = null!;  // changed from int to string

        [BsonElement("OpportunityTitle")]
        public string OpportunityTitle { get; set; } = null!;

        [BsonElement("AppliedAt")]
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("Status")]
        public string Status { get; set; } = "Pending";
    }
}