from functools import wraps

from flask import current_app


def query_jwt_required(fn):
    """
    A decorator to protect a query resolver.
    If you decorate an resolver with this, it will ensure that the requester
    has a valid access token before allowing the resolver to be called. This
    does not check the freshness of the access token.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = kwargs.pop(current_app.config["JWT_TOKEN_ARGUMENT_NAME"])
        try:
            verify_jwt_in_argument(token)
        except Exception as e:
            return AuthInfoField(message=str(e))

        return fn(*args, **kwargs)

    return wrapper
