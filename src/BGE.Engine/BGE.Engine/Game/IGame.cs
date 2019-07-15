using BGE.Engine.DTO;

namespace BGE.Engine.Game
{
	public interface IGame
	{
		PlayerState StartGame(int rows, int cols);
		ShootResponse Shoot(ShootRequest shootRequest, char[,] field);
		PlayerState Cleanse(PlayerState playerState);
	}
}