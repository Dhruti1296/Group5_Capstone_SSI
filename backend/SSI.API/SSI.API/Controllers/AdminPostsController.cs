using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/admin/posts")]
    public class AdminPostsController : ControllerBase
    {
        private readonly PostServices _postService;
        private readonly CommentServices _commentService;


        // injection of both the CommentServices and PostServices into the controller...
        public AdminPostsController(PostServices postService, CommentServices commentService)
        {
            _postService = postService;
            _commentService = commentService;
        }

        // get all the posts...
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        // deletion of the posts and comments via the id.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _postService.DeleteAnyByIdAsync(id);

            if (!deleted)
                return NotFound("Post not found");

            await _commentService.DeleteAnyByIdAsync(id);

            return Ok("Post and related comments deleted successfully");
        }
    }
}