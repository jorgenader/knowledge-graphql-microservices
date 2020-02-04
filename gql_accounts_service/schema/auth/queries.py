import graphene

from ..accounts.types import User


class AuthQuery(graphene.ObjectType):
    viewer = graphene.Field(User, token=graphene.String())

    def resolve_viewer(self, info, **kwargs):
        if info.context.user.is_authenticated:
            return info.context.user

        return None
