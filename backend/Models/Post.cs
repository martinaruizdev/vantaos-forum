namespace VantaOS.API.Models;

public class Post{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Score { get; set; } = 0;
    public bool IsPinned { get; set; } = false;
    public bool IsClosed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Relaciones

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int SubforumId { get; set; }
    public Subforum Subforum { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();

}