from dictators.dictators_game import models


def create_user(username: str,
                password_hash: str,
                password_salt: str,
                email_address: str) -> bool:
    username_match = models.User.objects.filter(username=username)
    email_match = models.User.objects.filter(email_address=email_address)
    if username_match or email_match:
        return False

    new_user = models.User(username=username,
                           password_hash=password_hash,
                           password_salt=password_salt,
                           email_address=email_address)
    new_user.save()
    return True


def get_user(username: str) -> models.User:
    return models.User.objects.get(username=username)


def delete_user(username: str,
                password_hash: str,
                password_salt: str) -> bool:
    user = models.User.objects.filter(username=username)
    if (user and
            user[0].password_hash == password_hash and
            user[0].password_salt == password_salt):
        user[0].delete()
        return True
    return False


def authenticate_user(username: str,
                      password_hash: str,
                      password_salt: str) -> bool:
    user = models.User.objects.filter(username=username)
    return (user and
            user[0].password_hash == password_hash and
            user[0].password_salt == password_salt)
