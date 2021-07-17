#!/bin/bash

##################################
#             DJANGO             #
##################################

pipenv sync
pipenv run python manage.py migrate
pipenv run python manage.py runserver

