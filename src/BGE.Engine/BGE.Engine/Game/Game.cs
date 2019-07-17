using System;
using System.Linq;
using BGE.Engine.DTO;

namespace BGE.Engine.Game
{
	public class Game : IGame
	{
		private readonly Random _random;
		public Game()
		{
			_random = new Random();
		}
		
		public PlayerState StartGame(int rows, int cols)
		{
			var playerState = new PlayerState
			{
				Field = GenerateRandomField(rows, cols)
			};

			return playerState;
		}

		private char[,] GenerateRandomField(int rows, int cols)
		{
			var field = new char[rows, cols];

			for (var i = 0; i < rows; i++)
			{
				for (var j = 0; j < cols; j++)
				{
					field[i, j] = Constants.FieldEmptySymbol;
				}
			}
			
			Generate(field, 2);
			Generate(field, 3);
			Generate(field, 4);
			
			return field;
		}

		private void Generate(char[,] field, int ship)
		{
			var rows = field.GetUpperBound(0) + 1;
			var cols = field.GetUpperBound(1) + 1;
			while (true)
			{
				var x = _random.Next(0, rows);
				var y = _random.Next(0, cols);
				var isVertical = _random.Next(0, 2) == 1;
				
				if(isVertical && y > cols - ship)
					continue;
				
				if(!isVertical && x > rows - ship)
					continue;

				if (isVertical)
				{
					var overlap = Enumerable.Range(y, ship)
						.Select(r => field[x, r] != Constants.FieldEmptySymbol).Any(r => r);
					
					if(overlap)
						continue;
				}
				else
				{
					var overlap = Enumerable.Range(x, ship)
						.Select(r => field[r, y] != Constants.FieldEmptySymbol).Any(r => r);
					
					if(overlap)
						continue;
				}
				
				for (var i = 0; i < ship; i++)
				{
					if (isVertical)
						field[x, y + i] = Constants.FieldShipSymbol;
					else
						field[x + i, y] = Constants.FieldShipSymbol;
				}
				break;
			}
		}

		public ShootResponse Shoot(ShootRequest shootRequest)
		{
			var x = shootRequest.X - 1;
			var y = shootRequest.Y - 1;
			var shootResponse = new ShootResponse
			{
				IsHit = shootRequest.Field[x, y] == Constants.FieldShipSymbol
			};
			shootRequest.Field[x, y] =  shootResponse.IsHit 
				? Constants.FieldShipSinkSymbol 
				: Constants.FieldHitSymbol;

			var ships = shootRequest.Field.Cast<char>().Count(symbol => symbol == Constants.FieldShipSymbol);
			shootResponse.Field = shootRequest.Field;
			shootResponse.IsWinner = ships == 0;
			return shootResponse;
		}

		public PlayerState Cleanse(PlayerState playerState)
		{
			var field = playerState.Field;
			for (var i = 0; i < field.GetUpperBound(0) + 1; i++)
			{
				for (var j = 0; j < field.GetUpperBound(1) + 1; j++)
				{
					if (field[i, j] == Constants.FieldShipSymbol)
						field[i, j] = Constants.FieldEmptySymbol;
				}
			}

			return playerState;
		}
	}
}