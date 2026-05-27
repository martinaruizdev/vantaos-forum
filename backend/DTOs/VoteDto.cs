namespace VantaOS.API.DTOs;

public class VoteDto
{
    /// <summary>ID del post o comment</summary>
    public int TargetId { get; set; }

    /// <summary>"post" | "comment"</summary>
    public string TargetType { get; set; } = string.Empty;

    /// <summary>+1 upvote | -1 downvote</summary>
    public int Value { get; set; }
}

public class VoteResponseDto
{
    public int NewScore { get; set; }

    /// <summary>Voto actual del usuario: +1, -1 o null si se quitó</summary>
    public int? UserVote { get; set; }
}
