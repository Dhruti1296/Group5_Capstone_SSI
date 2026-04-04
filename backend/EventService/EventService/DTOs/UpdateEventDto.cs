namespace EventService.DTOs
{
    public class UpdateEventDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public DateTime? EventDate { get; set; }
        public string? Location { get; set; }
    }
}
