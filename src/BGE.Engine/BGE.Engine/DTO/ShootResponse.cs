namespace BGE.Engine.DTO
{
	public class ShootResponse
	{
		public bool IsHit { get; set; }
		public bool IsWinner { get; set; }
		public char[,] Field { get; set; }
	}
}