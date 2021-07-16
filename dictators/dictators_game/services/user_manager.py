from dictators.dictators_game import models


def create_user(username: str,
                password_hash: str,
                password_salt: str,
                email_address: str) -> bool:
    user = models.User.objects.filter(username=username)
    if user:
        return False
    new_user = models.User(username=username,
                           password_hash=password_hash,
                           password_salt=password_salt,
                           email_address=email_address)
    new_user.save()
    return True


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


create_user("sample_user", "sample_hash", "sample_salt", "sample@email.com")
