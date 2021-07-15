from django.conf.urls import url
from dictators.dictators_game.consumers import DictatorsConsumer

websocket_urlpatterns = [
    url(r'^ws/play/(?P<room_code>\w+)/$', DictatorsConsumer.as_asgi()),
]