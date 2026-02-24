using Microsoft.AspNetCore.Mvc;
using SSI.API.Services;

namespace SSI.API.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentActionsController : ControllerBase
    {
        private readonly CommentServices _commentService;

        // injection of both the CommentServices into the controller...
        public CommentActionsController(CommentServices commentService)
        {
            _commentService = commentService;
        }

        // for updating the user posted comments only...
        [HttpPut("{commentId}")]
        public async Task<IActionResult> Update(string commentId, [FromQuery] string author, [FromBody] string newText)
        {
            // validation of the fields...
            if (string.IsNullOrWhiteSpace(author))
                return BadRequest("Author is required");

            if (string.IsNullOrWhiteSpace(newText))
                return BadRequest("NewText is required");

            var updated = await _commentService.UpdateTextByIdAndAuthorAsync(commentId, author, newText);

            if (!updated)
                return Unauthorized("You can edit only your own comment (or comment not found)");

            return Ok("Comment updated successfully");
        }

        // for deleting the user posted comments only...
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(string commentId, [FromQuery] string author)
        {
            // validation of the fields...
            if (string.IsNullOrWhiteSpace(author))
                return BadRequest("Author is required");

            var deleted = await _commentService.DeleteByIdAndAuthorAsync(commentId, author);

            if (!deleted)
                return Unauthorized("You can delete only your own comment (or comment not found)");

            return Ok("Comment deleted successfully");
        }
    }
}
