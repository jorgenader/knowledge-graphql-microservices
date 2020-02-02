from flask import Flask
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager, create_access_token
from mongoengine import connect

from products_service.context import GraphQLContext
from products_service.schema import schema


app = Flask(__name__)
jwt = JWTManager(app)

# Prefer header, fallback to cookies
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']


app.config.from_object("products_service.config.EnvConfig")

connect(
    app.config["MONGO_DATABASE"],
    host=f'mongodb://{app.config["MONGO_HOST"]}',
    username=app.config["MONGO_USER"],
    password=app.config["MONGO_PWD"],
    authentication_source="admin",
)


@app.route('/dummy-token', methods=['GET'])
def protected():
    token = create_access_token(1, user_claims={
        'user_id': 1,
        'email': 'r@r.ee',
        'is_staff': True,
        'is_superuser': True,
    })
    return token, 200


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
