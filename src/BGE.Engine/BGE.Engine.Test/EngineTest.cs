using BGE.Engine.DTO;
using BGE.Engine.Game;
using FluentAssertions;
using Xunit;

namespace BGE.Engine.Test
{
	public class EngineTest
	{
		private readonly IGame _game;
		
		public EngineTest()
		{
			_game = new Game.Game();
		}

		private static (int, int) GetCount(char[,] field)
		{
			var ships = 0;
			var cells = 0;
			for (var i = 0; i < field.GetUpperBound(0) + 1; i++)
			{
				for (var j = 0; j < field.GetUpperBound(1) + 1; j++)
				{
					cells++;
					if (field[i, j] != Constants.FieldEmptySymbol)
						ships++;
				}
			}

			return (cells, ships);
		}
		
		[Theory]
		[InlineData(6, 6)]
		[InlineData(8, 8)]
		[InlineData(12, 9)]
		[InlineData(13, 7)]
		[InlineData(8, 7)]
		[InlineData(10, 10)]
		public void StartCustomSize(int rows, int cols)
		{
			var playerState = _game.StartGame(rows, cols);
			var field = playerState.Field;
			var (cells, ships) = GetCount(field);
			ships.Should().Be(9);
			cells.Should().Be(rows * cols);
		}
		
		[Theory]
		[InlineData(1, 1)]
		public void Shot(int x, int y)
		{
			var playerState = _game.StartGame(8, 8);
			var shootResponse = _game.Shoot(new ShootRequest
			{
				X = x,
				Y = y
			}, playerState.Field);
			shootResponse.Field[x - 1, y - 1].Should().Be(Constants.FieldHitSymbol);
		}

        [Theory]
        [InlineData(6, 6)]
        [InlineData(8, 8)]
        [InlineData(12, 9)]
        [InlineData(13, 7)]
        [InlineData(8, 7)]
        [InlineData(10, 10)]
        public void Cleanse(int rows, int cols)
        {
            var playerState = _game.StartGame(rows, cols);
            var cleansed = _game.Cleanse(playerState);
            var (cells, ships) = GetCount(cleansed.Field);
            cells.Should().Be(rows * cols);
            ships.Should().Be(0);
        }
    }
}