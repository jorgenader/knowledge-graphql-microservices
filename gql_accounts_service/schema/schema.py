import graphene
from graphene_federation import build_schema

from .accounts.mutations import AccountMutation
from .auth.mutations import AuthMutation
from .auth.queries import AuthQuery


class Mutation(AccountMutation, AuthMutation, graphene.ObjectType):
    pass


class Query(AuthQuery, graphene.ObjectType):
    pass


schema = build_schema(query=Query, mutation=Mutation)
