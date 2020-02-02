import graphene
from graphql_jwt.decorators import login_required

from ..accounts.types import User


class AuthQuery(graphene.ObjectType):
    viewer = graphene.Field(User, token=graphene.String())
    viewer_by_token = graphene.Field(User, token=graphene.String())

    @login_required
    def resolve_viewer(self, info, **kwargs):
        return info.context.user
