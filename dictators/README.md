# Dictators API

Dependencies for Django: \
python3.8, pip3, pipenv

To run Django server, execute following commands:
```shell
pipenv sync
pipenv run python manage.py migrate
pipenv run python manage.py runserver
```

### Available endpoints:
* /api/user/create
* /api/user/delete
* /api/user/authenticate

### Endpoints description:

#### [POST] /api/user/create
Try to create new user.

**Request body**
```
{
    "username": "",
    "password_hash": "",
    "password_salt": "",
    "email_address": ""
}
```

**Response codes**
- **204**: Success
- **400**: Params missing
- **409**: User with such username already exists.


#### [DELETE] /api/user/delete
Try to delete existing user.

**Request body**
```
{
    "username": "",
    "password_hash": "",
    "password_salt": ""
}
```

**Response codes**
- **204**: Success
- **400**: Params missing
- **401**: Incorrect username or password

#### [POST] /api/user/authenticate
Try to authenticate existing user.

**Request body**
```
{
    "username": "",
    "password_hash": "",
    "password_salt": ""
}
```

**Response codes**
- **200**: Authenticated
- **400**: Params missing
- **401**: Not authenticated