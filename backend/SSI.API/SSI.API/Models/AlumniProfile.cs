using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    public class AlumniProfile
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Program { get; set; }
        public string? GraduationYear { get; set; }
        public string? Company { get; set; }
        public string? JobTitle { get; set; }
        public string? Skills { get; set; }
        public string? Bio { get; set; }

    }
}
