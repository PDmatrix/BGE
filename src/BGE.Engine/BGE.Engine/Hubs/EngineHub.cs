using System.Threading.Tasks;
using BGE.Engine.DTO;
using BGE.Engine.Game;
using Microsoft.AspNetCore.SignalR;

namespace BGE.Engine.Hubs
{
	public class EngineHub : Hub
	{
		private readonly IGame _game;
		
		public EngineHub(IGame game)
		{
			_game = game;
		}
		
		[HubMethodName("WinnerMarker")]
		public Task WinnerMarker(string userId)
		{
			return Clients.User(userId).SendAsync("Won");
		}
		
		[HubMethodName("ShootMarker")]
		public Task ShootMarker(string userId)
        {
            return Clients.User(userId).SendAsync("Shot");
        }
		
		[HubMethodName("AcceptMarker")]
		public Task AcceptMarker(string userId)
        {
            return Clients.User(userId).SendAsync("Accepted");
        }
		
		[HubMethodName("Cleanse")]
		public Task<PlayerState> Cleanse(PlayerState playerState)
		{
			return Task.FromResult(_game.Cleanse(playerState));
		}

		[HubMethodName("StartGame")]
		public async Task<PlayerState> StartGame(StartRequest startRequest)
        {
            await startRequest.ValidateAndThrowAsync();
			return _game.StartGame(startRequest.Rows, startRequest.Cols);
		}
		
		[HubMethodName("Shoot")]
		public Task<ShootResponse> Shoot(ShootRequest shootRequest)
        {
	        return Task.FromResult(_game.Shoot(shootRequest));
		}
	}
}