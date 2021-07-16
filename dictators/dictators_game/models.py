from django.db import models
from django.contrib.auth import get_user_model


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]


class User(models.Model):
    username = models.CharField(max_length=20, unique=True)
    password_hash = models.TextField()
    password_salt = models.TextField()
    email_address = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)


class Game(models.Model):
    started_at: models.DateTimeField()
    ended_at: models.DateTimeField()
    replay_data: models.TextField()
    participants: models.ManyToManyField(User)
    winner: models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))
