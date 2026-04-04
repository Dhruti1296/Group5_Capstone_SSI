using System.ComponentModel.DataAnnotations;

namespace EventService.DTOs
{
    public class CreateEventDto
    {
        [Required(ErrorMessage ="Title is required")]
        public string Title { get; set; }
        [Required(ErrorMessage ="Description is required")]
        public string Description { get; set; }
        [Required(ErrorMessage ="Type is required")]
        public string Type { get; set; }
        [Required(ErrorMessage ="Event date is required")]
        public DateTime EventDate { get; set; }
        [Required(ErrorMessage ="Location is required")]
        public string Location { get; set; }
    }
}
