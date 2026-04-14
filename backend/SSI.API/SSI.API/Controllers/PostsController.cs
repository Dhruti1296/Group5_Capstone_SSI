using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSI.API.Models;
using SSI.API.Services;
using System.Security.Claims;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/posts")]
    [Authorize] // all endpoints require a valid JWT
    public class PostsController : ControllerBase
    {
        // Injecting postservices for the admin operations...
        private readonly PostService _postService;

        // constructor to initialize postservices...
        public PostsController(PostService postService)
        {
            _postService = postService;
        }

        // GET /api/posts — fetch all posts (feed)
        // retrieve all d post...
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        // GET /api/posts/user/{userName}
        // fetch posts by one user...
        [HttpGet("user/{userName}")]
        public async Task<IActionResult> GetByUser(string userName)
        {
            var posts = await _postService.GetByUserAsync(userName);
            return Ok(posts);
        }

        // POST /api/posts — create a new post by requesting user via a content...
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PostRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Post content cannot be empty.");

            // Read the userName from the JWT claims...
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var post = new Post
            {
                UserName = userName,
                Content = request.Content.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _postService.CreateAsync(post);
            return Ok(post);
        }

        // DELETE /api/posts/{id}
        // delete your own post only...
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var deleted = await _postService.DeleteAsync(id, userName);
            return deleted ? Ok("Post deleted.") : NotFound("Post not found or not yours.");
        }

        // POST /api/posts/{id}/like
        // toggle like...
        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(string id)
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var updatedPost = await _postService.ToggleLikeAsync(id, userName);
            return updatedPost != null ? Ok(updatedPost) : NotFound("Post not found.");
        }

        // POST /api/posts/{id}/comment
        // add a comment for a post...
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> AddComment(string id, [FromBody] CommentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Comment cannot be empty.");

            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized();

            var comment = new Comment
            {
                UserName = userName,
                Text = request.Text.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var updatedPost = await _postService.AddCommentAsync(id, comment);
            return updatedPost != null ? Ok(updatedPost) : NotFound("Post not found.");
        }
    }
}