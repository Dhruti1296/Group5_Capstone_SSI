using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class PostService
    {
        private readonly IMongoCollection<Post> _posts;

        public PostService(MongoDbContext context)
        {
            _posts = context.Posts;
        }

        // Get all posts, newest first
        public async Task<List<Post>> GetAllAsync()
        {
            return await _posts
                .Find(_ => true)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        // Get posts by a specific user
        public async Task<List<Post>> GetByUserAsync(string userName)
        {
            return await _posts
                .Find(p => p.UserName == userName)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        // Create a new post
        public async Task CreateAsync(Post post)
        {
            await _posts.InsertOneAsync(post);
        }

        // Delete a post (only if owned by the requesting user)
        public async Task<bool> DeleteAsync(string postId, string userName)
        {
            var result = await _posts.DeleteOneAsync(
                p => p.Id == postId && p.UserName == userName
            );
            return result.DeletedCount > 0;
        }

        // Toggle like (add if not liked, remove if already liked)
        public async Task<Post?> ToggleLikeAsync(string postId, string userName)
        {
            var post = await _posts.Find(p => p.Id == postId).FirstOrDefaultAsync();
            if (post == null) return null;

            UpdateDefinition<Post> update;

            if (post.Likes.Contains(userName))
            {
                update = Builders<Post>.Update.Pull(p => p.Likes, userName);
            }
            else
            {
                update = Builders<Post>.Update.Push(p => p.Likes, userName);
            }

            await _posts.UpdateOneAsync(p => p.Id == postId, update);
            return await _posts.Find(p => p.Id == postId).FirstOrDefaultAsync();
        }

        // Add a comment
        public async Task<Post?> AddCommentAsync(string postId, Comment comment)
        {
            var update = Builders<Post>.Update.Push(p => p.Comments, comment);
            await _posts.UpdateOneAsync(p => p.Id == postId, update);
            return await _posts.Find(p => p.Id == postId).FirstOrDefaultAsync();
        }

        public async Task AdminDeleteAsync(string postId)
{
    await _posts.DeleteOneAsync(p => p.Id == postId);
}

public async Task DeleteCommentAsync(string postId, int commentIndex)
{
    var post = await _posts.Find(p => p.Id == postId).FirstOrDefaultAsync();
    if (post == null) return;

    if (commentIndex < 0 || commentIndex >= post.Comments.Count) return;

    post.Comments.RemoveAt(commentIndex);

    var update = Builders<Post>.Update.Set(p => p.Comments, post.Comments);
    await _posts.UpdateOneAsync(p => p.Id == postId, update);
}
    }
}