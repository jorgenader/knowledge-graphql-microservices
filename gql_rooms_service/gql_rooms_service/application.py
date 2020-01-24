from flask import Flask
from flask_graphql import GraphQLView
from mongoengine import connect

from .schema import schema


def create_app(debug=False):
    app = Flask(__name__)

    app.debug = debug

    app.config.from_object("config.EnvConfig")

    connect(
        app.config["MONGO_DATABASE"],
        host=app.config["MONGO_HOST"],
        username=app.config["MONGO_USER"],
        password=app.config["MONGO_PWD"],
        authentication_source="admin",
    )

    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=app.debug),
    )

    return app
