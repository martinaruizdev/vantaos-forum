namespace VantaOS.API.Models;

public class Vote
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    /// <summary>ID del post o comment votado</summary>
    public int TargetId { get; set; }

    /// <summary>"post" | "comment"</summary>
    public string TargetType { get; set; } = string.Empty;

    /// <summary>+1 upvote | -1 downvote</summary>
    public int Value { get; set; }
}
