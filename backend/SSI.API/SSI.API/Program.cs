using SSI.API.Data;
using SSI.API.Services;

namespace SSI.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // mongodb : mongodbContext
            builder.Services.AddSingleton<MongoDbContext>();

            // all services...
            builder.Services.AddSingleton<UserServices>();
            builder.Services.AddSingleton<AdminServices>();
            builder.Services.AddSingleton<PostServices>();
            builder.Services.AddSingleton<CommentServices>();

            //Added cors allowing react app to load and check the React URL
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy => policy.WithOrigins("http://localhost:3000")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
