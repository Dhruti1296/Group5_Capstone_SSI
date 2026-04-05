using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/admin/comments")]
    public class AdminCommentsController : ControllerBase
    {
        private readonly CommentServices _commentService;

        // injection of CommentServices into the controller...
        public AdminCommentsController(CommentServices commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentService.GetAllAsync();
            return Ok(comments);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _commentService.DeleteAnyByIdAsync(id);

            if (!deleted)
                return NotFound("Comment not found");

            return Ok("Comment deleted successfully");
        }
    }
}
