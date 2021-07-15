from abc import ABC

from rest_framework import serializers
from dictators.dictators_game import models


class GameBoardSerializer(serializers.ModelSerializer):
    game_board = serializers.JSONField()

    class Meta:
        model = models.GameBoard
        fields = ('id', 'game_board')
        read_only_fields = ['id']
