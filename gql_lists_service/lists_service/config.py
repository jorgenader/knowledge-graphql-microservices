from datetime import timedelta

from environs import Env

env = Env()
env.read_env()


class EnvConfig:
    TESTING = False

    MONGO_DATABASE = env.str("MONGODB_NAME", "knowledge_graphql_microservices")

    MONGO_USER = env.str("MONGODB_USER", "knowledge_graphql_microservices")
    MONGO_PWD = env.str("MONGODB_PASSWORD", "knowledge_graphql_microservices")

    MONGO_HOST = env.str("MONGODB_HOST", "mongodb")

    JWT_SECRET_KEY = env.str('JWT_SECRET_KEY', 'knowledge_graphql_microservices')
    JWT_ALGORITHM = "HS256"
    JWT_ISSUER = "Jorgen Ader"
    JWT_HEADER_TYPE = "JWT"
    JWT_ACCESS_COOKIE_NAME = "JWT"
    JWT_REFRESH_COOKIE_NAME = "JWT-refresh-token"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    JWT_IDENTITY_CLAIM = "email"
