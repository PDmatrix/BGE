from abc import ABC, abstractmethod
from os import system, name


def clear():
    system("cls" if name == "nt" else "clear")


class BasePrinter(ABC):
    @abstractmethod
    def draw_field(self, first_player, second_player):
        pass


class DefaultPrinter(BasePrinter):
    def draw_field(self, first_player, second_player):
        zipped = list(zip(list(zip(*first_player)), list(zip(*second_player))))
        print()
        for tpl in zipped:
            print(tpl)
        print()
