using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/posts/{postId}/comments")]
    public class CommentsController : ControllerBase
    {
        private readonly CommentServices _commentService;
        private readonly PostServices _postService;

        // injection of both the CommentServices and PostServices into the controller...
        public CommentsController(CommentServices commentService, PostServices postService)
        {
            _commentService = commentService;
            _postService = postService;
        }

        // returns all the comments for a post...
        [HttpGet]
        public async Task<IActionResult> GetComments(string postId)
        {
            // validating if the post exists or not...
            var post = await _postService.GetByIdAsync(postId);
            if (post == null) return NotFound("Post not found");

            var comments = await _commentService.GetByPostIdAsync(postId);
            return Ok(comments);
        }

        // adding of a comment to a post...
        [HttpPost]
        public async Task<IActionResult> AddComment(string postId, CreateCommentRequest req)
        {

            // validating if the post exists or not...
            var post = await _postService.GetByIdAsync(postId);
            if (post == null) return NotFound("Post not found");

            // validation of the fields...
            if (string.IsNullOrWhiteSpace(req.Text) ||
                string.IsNullOrWhiteSpace(req.Author))
            {
                return BadRequest("Text and Author are required");
            }

            var comment = new Comment
            {
                PostId = postId,
                Text = req.Text,
                Author = req.Author
                // CreatedAt set automatically by DB...
            };

            await _commentService.CreateAsync(comment);
            return Ok(comment);
        }
    }
}
