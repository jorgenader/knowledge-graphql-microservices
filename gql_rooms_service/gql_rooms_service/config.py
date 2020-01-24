from environs import Env

env = Env()
env.read_env()


class EnvConfig:
    TESTING = False
    DEBUG = env.bool("DEBUG")

    MONGO_DATABASE = env.str("MONGODB_NAME")

    MONGO_USER = env.str("MONGODB_USER")
    MONGO_PWD = env.str("MONGODB_PASSWORD")

    MONGO_HOST = env.str("MONGODB_HOST")
