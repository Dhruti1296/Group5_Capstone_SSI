namespace SSI.API.Models
{
    public class ContactMessageRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Topic { get; set; } = "General";
        public string? Message { get; set; }
    }
}
