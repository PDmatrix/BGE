import requests
from requests.exceptions import HTTPError


class Api:
    def __init__(self, url: str):
        self.url = url

    def accept(self, user_id: str, game_token: str):
        data = {"userId": user_id, "gameToken": game_token}
        return _send_request(f'{self.url}/accept', data)

    def start(self, user_id: str):
        data = {"userId": user_id}
        return _send_request(f'{self.url}/start', data)

    def shoot(self, x: int, y: int, user_id: str, game_token: str):
        return _send_request(f'{self.url}/shoot', {
            "userId": user_id,
            "gameToken": game_token,
            "x": x,
            "y": y
        })

    def state(self, user_id: str, game_token: str):
        data = {"userId": user_id, "gameToken": game_token}
        return _send_request(f'{self.url}/state', data)


def _send_request(url: str, data: dict = None):
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
    else:
        if response.content != b'':
            return response.json()

    return None
