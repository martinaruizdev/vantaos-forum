namespace VantaOS.API.Models;

public class Tag{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;

    public ICollection<Post> Posts { get; set; } = new List<Post>();
}