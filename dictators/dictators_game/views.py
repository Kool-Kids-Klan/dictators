from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response

from dictators.dictators_game.services import user_manager


# TODO
# pohrat sa kus s navratovymi hodnotami, return codes, error messages...


class CreateUser(APIView):

    def post(self, request):
        params = request.data
        if ("username" not in params or
                "password_hash" not in params or
                "password_salt" not in params or
                "email_address" not in params):
            return Response(status=400,
                            data={
                                "error": "Parameter(s) missing."
                            })
        result = user_manager.create_user(params["username"],
                                          params["password_hash"],
                                          params["password_salt"],
                                          params["email_address"])
        if not result:
            return Response(status=409, data={
                "error": "User with such username already exists."
            })
        return Response(status=204)


class DeleteUser(APIView):

    def delete(self, request):
        params = request.data
        if ("username" not in params or
                "password_hash" not in params or
                "password_salt" not in params):
            return Response(status=400,
                            data={
                                "error": "Parameter(s) missing."
                            })
        result = user_manager.delete_user(params["username"],
                                          params["password_hash"],
                                          params["password_salt"])
        if not result:
            return Response(status=401, data={
                "error": "Incorrect username or password."
            })
        return Response(status=204)


class AuthenticateUser(APIView):

    def get(self, request):
        params = request.data
        if ("username" not in params or
                "password_hash" not in params or
                "password_salt" not in params):
            return Response(status=400,
                            data={
                                "error": "Parameter(s) missing."
                            })
        result = user_manager.authenticate_user(params["username"],
                                                params["password_hash"],
                                                params["password_salt"])
        if not result:
            return Response(status=401, data={
                "error": "Incorrect username or password."
            })
        return Response(status=200, data={
            "result": "User authenticated."
        })
