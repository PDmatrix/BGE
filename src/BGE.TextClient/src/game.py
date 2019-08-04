from api import Api
from printer import BasePrinter, DefaultPrinter, clear


class Game:
    def __init__(self,
                 user_id: str,
                 game_token: str,
                 printer: BasePrinter = DefaultPrinter()):
        self.printer = printer
        self.user_id = user_id
        self.game_token = game_token

        self.api = Api('http://127.0.0.1:3000/api')

    def accept(self):
        clear()
        player = self.api.accept(self.user_id, self.game_token)
        state = self.api.state(self.user_id, self.game_token)
        self.printer.draw_field(state["user"]["field"],
                                state["opponent"]["field"])
        return player["userToken"]

    def accepted(self):
        clear()
        print("Opponent accepted challenge")
        state = self.api.state(self.user_id, self.game_token)
        self.printer.draw_field(state["user"]["field"],
                                state["opponent"]["field"])

    def start(self):
        player = self.api.start(self.user_id)
        return player["userToken"], player["gameToken"]

    def shot(self):
        clear()
        state = self.api.state(self.user_id, self.game_token)
        self.printer.draw_field(state["user"]["field"],
                                state["opponent"]["field"])
        if state["game"]["status"] == "Finished":
            print("Winner!" if state["game"]["winnerId"] == self.
                  user_id else "Loser!")
            return

        if state["game"]["userTurnId"] == self.user_id:
            print("Your turn")
        else:
            print("Enemy turn")

    def shoot(self, x, y):
        clear()
        result = self.api.shoot(x, y, self.user_id, self.game_token)
        if result is not None:
            print(result["message"])

        state = self.api.state(self.user_id, self.game_token)
        self.printer.draw_field(state["user"]["field"],
                                state["opponent"]["field"])

        if state["game"]["status"] == "Finished":
            print("Winner!" if state["game"]["winnerId"] == self.
                  user_id else "Loser!")
            exit(0)
            return

        if state["game"]["userTurnId"] == self.user_id:
            print("Your turn")
        else:
            print("Enemy turn")
