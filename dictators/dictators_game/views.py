from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import Http404


class MainPage(View):

    def get(self, request):
        return render(request, 'index.html', {})

    def post(self, request):
        room_code = request.POST.get('room_code')
        char_choice = request.POST.get('character_choice')

        return redirect(
            f'/play/{room_code}?&choice={char_choice}'
        )


class Game(View):

    def get(self, request, room_code):
        choice = request.GET.get('choice')
        if choice not in ['X', 'O']:
            print('RAISING')
            raise Http404('Choice does not exists.')

        context = {
            'char_choice': choice,
            'room_code': room_code,
        }

        return render(request, 'game.html', context)
