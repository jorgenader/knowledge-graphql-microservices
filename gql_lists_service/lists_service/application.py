from flask import Flask
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager
from mongoengine import connect

from lists_service.context import GraphQLContext
from lists_service.schema import schema


app = Flask(__name__)
jwt = JWTManager(app)

# Prefer header, fallback to cookies
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']


app.config.from_object("lists_service.config.EnvConfig")

connect(
    app.config["MONGO_DATABASE"],
    host=f'mongodb://{app.config["MONGO_HOST"]}',
    username=app.config["MONGO_USER"],
    password=app.config["MONGO_PWD"],
    authentication_source="admin",
)


class CustomContextGraphQLView(GraphQLView):
    def get_context(self):
        request = super().get_context()
        return GraphQLContext(request)


app.add_url_rule(
    "/graphql",
    view_func=CustomContextGraphQLView.as_view(
        "graphql",
        schema=schema,
        batch=True,
        graphiql=True,
    ),
)
