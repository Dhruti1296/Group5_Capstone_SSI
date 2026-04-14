using System.Text.Json.Serialization;

namespace SSI.API.Models
{
    public class UpdateProfileRequest
    {
        [JsonIgnore]
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? ProfilePic { get; set; }
        public string? CourseName { get; set; }
        public string? CourseEndMonth { get; set; }
        public string? CourseEndYear { get; set; }
        public string? Department { get; set; }
        public string? PassedOutYear { get; set; }
        public string? CurrentJob { get; set; }
        public string? Company { get; set; }
        public string? LinkedIn { get; set; }
    }
}