using Backend.WebApi;
using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GTDContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policyBuilder =>
        {
            policyBuilder.AllowAnyOrigin();
            policyBuilder.AllowAnyHeader();
            policyBuilder.AllowAnyMethod();
        });
    });
}

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAccountManager, AccountManager>((services) =>
{
    var userRepo = services.GetRequiredService<IUserRepository>();
    var configuration = services.GetRequiredService<IConfiguration>();
    var salt = configuration.GetValue<string>("HashSalt") ?? Constants.DEFAULT_HASH_SALT;
    var am = new AccountManager(userRepo, salt);
    return am;
});
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<IItemManager, ItemManager>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectManager, ProjectManager>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ITagManager, TagManager>();

builder.Services.AddScoped<SecurityFilterAttribute>();

builder.Services.AddControllers();

var app = builder.Build();

//create DB
using(var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetService<GTDContext>();
    context.Database.Migrate();
    SeedData.Initialize(context, builder.Configuration.GetValue<string>("HashSalt")??Constants.DEFAULT_HASH_SALT);
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseHttpsRedirection();

app.MapControllers()
    .WithOpenApi();

app.Run();
