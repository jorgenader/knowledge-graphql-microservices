from environs import Env

env = Env()
env.read_env()


class EnvConfig:
    TESTING = False

    MONGO_DATABASE = env.str("MONGODB_NAME", "knowledge_graphql_microservices")

    MONGO_USER = env.str("MONGODB_USER", "knowledge_graphql_microservices")
    MONGO_PWD = env.str("MONGODB_PASSWORD", "knowledge_graphql_microservices")

    MONGO_HOST = env.str("MONGODB_HOST", "mongodb")

    JWT_HEADER_TYPE = "JWT"

    JWT_SECRET_KEY = env.str('JWT_SECRET_KEY', 'knowledge_graphql_microservices')
