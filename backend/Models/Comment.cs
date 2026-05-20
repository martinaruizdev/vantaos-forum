namespace VantaOS.API.Models;

public class Comment{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Score { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    //relaciones
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int PostId { get; set; }
    public Post Post { get; set; } = null!;

    //comentarios anidados
    public int? ParentId { get; set; }
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

}