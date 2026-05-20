using Microsoft.EntityFrameworkCore;
using VantaOS.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//Base de datos
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//CORS (frontned)
builder.Services.AddCors(options => {
    options.AddPolicy("Frontend", policy =>{
        policy.WithOrigins("http://localhost3000")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();