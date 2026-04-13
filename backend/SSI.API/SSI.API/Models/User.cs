using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SSI.API.Models
{
    [BsonIgnoreExtraElements] // ignore any fields in MongoDB not in this model
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserName")]
        public string UserName { get; set; } = null!;

        [BsonElement("Email")]
        public string Email { get; set; } = null!;

        [BsonElement("Password")]
        public string Password { get; set; } = null!;

        [BsonElement("Role")]
        public string Role { get; set; } = null!;

        [BsonElement("Name")]
        public string? Name { get; set; }

        [BsonElement("Surname")]
        public string? Surname { get; set; }

        [BsonElement("ProfilePic")]
        public string? ProfilePic { get; set; }

        [BsonElement("CourseName")]
        public string? CourseName { get; set; }

        [BsonElement("CourseEndMonth")]
        public string? CourseEndMonth { get; set; }

        [BsonElement("CourseEndYear")]
        public string? CourseEndYear { get; set; }

        [BsonElement("Department")]
        public string? Department { get; set; }

        [BsonElement("PassedOutYear")]
        public string? PassedOutYear { get; set; }

        [BsonElement("FailedLoginAttempts")]
        public int FailedLoginAttempts { get; set; } = 0;

        [BsonElement("LockUntil")]
        public DateTime? LockUntil { get; set; } = null;
    }
}
