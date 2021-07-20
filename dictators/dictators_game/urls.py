from django.urls import path
from dictators.dictators_game import views

urlpatterns = [
    path("api/user/create", views.CreateUser.as_view()),
    path("api/user/delete", views.DeleteUser.as_view()),
    path("api/user/authenticate", views.AuthenticateUser.as_view()),
    path("api/leaderboard", views.Leaderboard.as_view())
]
