from graphql_jwt.utils import jwt_payload


def create_jwt_payload(user, context=None):
    payload = jwt_payload(user, context)

    if user.USERNAME_FIELD in payload:
        identity = payload[user.USERNAME_FIELD]
        del payload[user.USERNAME_FIELD]
        payload['identity'] = identity

    return payload
