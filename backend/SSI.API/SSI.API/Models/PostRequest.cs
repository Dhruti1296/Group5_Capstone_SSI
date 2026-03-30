namespace SSI.API.Models
{
    public class PostRequest
    {
        public string Content { get; set; } = null!;
    }

    public class CommentRequest
    {
        public string Text { get; set; } = null!;
    }
}