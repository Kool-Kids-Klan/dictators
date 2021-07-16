from django.db import models
from django.contrib.auth import get_user_model


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]


class User(models.Model):
    username = models.CharField(max_length=20, unique=True)
    passwordHash = models.TextField()
    passwordSalt = models.TextField()
    email_address = models.EmailField()
    createdAt = models.DateTimeField()
    gamesPlayed = models.IntegerField()
    gamesWon = models.IntegerField()


class Game(models.Model):
    startedAt: models.DateTimeField()
    endedAt: models.DateTimeField()
    replayData: models.TextField()
    participants: models.ManyToManyField(User)
    winner: models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))
