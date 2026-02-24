using MongoDB.Driver;
using SSI.API.Data;
using SSI.API.Models;

namespace SSI.API.Services
{
    public class PostServices
    {
        private readonly IMongoCollection<Post> _posts;

        // connecting the PostServices with the MongoDB Posts collection...
        public PostServices(MongoDbContext context)
        {
            _posts = context.Posts;
        }


        // returns all the posts from the DB in the descending order based on the createdAt...
        public async Task<List<Post>> GetAllAsync()
        {
            return await _posts.Find(_ => true)
                               .SortByDescending(p => p.CreatedAt)
                               .ToListAsync();
        }


        // SWT :returns a single posts by its postId or null, if not found...
        public async Task<Post> GetByIdAsync(string id)
        {
            return await _posts.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        // SWT: creates a new post and returns it...
        public async Task<Post> CreateAsync(Post post)
        {
            await _posts.InsertOneAsync(post);
            return post;
        }

        // deletes the post iff, its the logged in user post...
        public async Task<bool> DeleteByIdAndAuthorAsync(string id, string author)
        {
            var result = await _posts.DeleteOneAsync(p => p.Id == id && p.Author == author);
            return result.DeletedCount > 0;
        }
    }
}
