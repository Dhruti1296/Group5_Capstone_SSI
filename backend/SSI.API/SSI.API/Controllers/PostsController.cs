using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostsController : ControllerBase
    {

        private readonly PostServices _postService;
        private readonly CommentServices _commentService;


        // injects the PostServices and CommentServices into the controller...
        public PostsController(PostServices postService, CommentServices commentService)
        {
            _postService = postService;
            _commentService = commentService;
        }

        // return all the posts from DB in descending order based on the createdAt...
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        // SWT : returns a post by postID...
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var post = await _postService.GetByIdAsync(id);
            if (post == null) return NotFound("Post not found");
            return Ok(post);
        }

        // creates a new post...
        [HttpPost]
        public async Task<IActionResult> Create(CreatePostRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Title) ||
                string.IsNullOrWhiteSpace(req.Content) ||
                string.IsNullOrWhiteSpace(req.Author))
            {
                return BadRequest("Title, Content and Author are required");
            }

            var post = new Post
            {
                Title = req.Title,
                Content = req.Content,
                Author = req.Author
                // reatedAt set automatically by DB...
            };

            await _postService.CreateAsync(post);
            return Ok(post);
        }


        // deletion of the post iff, its the logged in user...
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string author)
        {
            if (string.IsNullOrWhiteSpace(author))
                return BadRequest("Author is required");

            // only delete if author owns the post...
            var deleted = await _postService.DeleteByIdAndAuthorAsync(id, author);
            if (!deleted)
                return Unauthorized("You can delete only your own posts (or post not found)");

            //return Ok("Post deleted successfully");
            return Ok("Posts deleted successfully");
        }
    }
}
