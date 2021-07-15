import json

from django.db import models

# Create your models here.


class GameBoard(models.Model):
    game_board = models.JSONField()

    def tick(self, addition: int):
        print(f'tick is happening by {addition}')

    def as_json(self):
        return {
            'game_board': self.game_board
        }
