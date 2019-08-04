from game import Game
import sys
import threading
from signalrcore.hub_connection_builder import HubConnectionBuilder


def main(game_token=''):
    game = None
    user_token = None
    if game_token == '':
        game = Game('user1', game_token)
        user_token, game_token = game.start()
        game.game_token = game_token
        print(game_token)
    else:
        game = Game('user2', game_token)
        user_token = game.accept()
    hub_connection = HubConnectionBuilder().with_url(
        "ws://localhost:5000/engine",
        options={
            "access_token_factory": lambda: user_token
        }).with_automatic_reconnect({
            "type": "raw",
            "keep_alive_interval": 10,
            "reconnect_interval": 5,
            "max_attempts": 5
        }).build().build()

    hub_connection.start()
    hub_connection.on("Shot", lambda _: game.shot())
    hub_connection.on("Accepted", lambda _: game.accepted())
    while True:
        command = input()
        if command.lower() == 'quit':
            print("Goodbye!")
            return

        if command.lower().startswith('shoot'):
            command = command.replace('shoot', '')
            (x, y) = list(map(int, command.split()))
            game.shoot(x, y)


if __name__ == '__main__':
    thread = None
    if len(sys.argv) > 1:
        thread = threading.Thread(target=main, args=(sys.argv[1], ))
    else:
        thread = threading.Thread(target=main)
    thread.start()
