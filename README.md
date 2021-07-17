# Dictators
the best game since the dawn of time

Execute following commands

Before first start of django backend comment last lines of user_manager.py in dictators_game.services

```shell
pipenv sync
. bash_aliases
migrate-django
```

Uncomment previously commented lines

```shell
run-django-server
```


By default, it will run local web server on localhost:8000. Choose room id (integer) and your character (X, O), open second browser window, choose same room id and different character.
Enjoy this game.
