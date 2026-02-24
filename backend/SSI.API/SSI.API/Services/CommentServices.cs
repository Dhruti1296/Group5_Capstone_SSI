using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class CommentServices
    {

        private readonly IMongoCollection<Comment> _comments;

        // connecting the CommentServices with the MongoDB Comment collection...
        public CommentServices(MongoDbContext context)
        {
            _comments = context.Comments;
        }


        // returns all the comments for a post, sortby createdAt...
        public async Task<List<Comment>> GetByPostIdAsync(string postId)
        {
            return await _comments.Find(c => c.PostId == postId)
                                  .SortBy(c => c.CreatedAt)
                                  .ToListAsync();
        }

        // creates a new comment and returns it...
        public async Task<Comment> CreateAsync(Comment comment)
        {
            await _comments.InsertOneAsync(comment);
            return comment;
        }

        // update the comments iff the author matches with logged in user...
        public async Task<bool> UpdateTextByIdAndAuthorAsync(string commentId, string author, string newText)
        {
            var update = Builders<Comment>.Update.Set(c => c.Text, newText);

            var result = await _comments.UpdateOneAsync(
                c => c.Id == commentId && c.Author == author,
                update
            );

            return result.ModifiedCount > 0;
        }

        // delete the comments iff the author matches with logged in user...
        public async Task<bool> DeleteByIdAndAuthorAsync(string commentId, string author)
        {
            var result = await _comments.DeleteOneAsync(
                c => c.Id == commentId && c.Author == author
            );

            return result.DeletedCount > 0;
        }

    }
}
