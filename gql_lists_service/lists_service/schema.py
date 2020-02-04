from flask_jwt_extended import jwt_required
from graphene import Field, ObjectType, String
from graphene_federation import build_schema
from graphene_mongo import MongoengineConnectionField

from lists_service.context import GraphQLContext
from lists_service.mutations import CreateShoppingListMutation, UpdateShoppingListByIdMutation
from lists_service.types import ShoppingList


class Mutation(ObjectType):
    create_shopping_list = CreateShoppingListMutation.Field()
    update_shopping_list_by_id = UpdateShoppingListByIdMutation.Field()


@jwt_required
def create_context_user_queryset(model, info, **args):
    context: GraphQLContext = info.context
    return model.object(owner__email=context.user, **args)


class Query(ObjectType):
    shopping_list = Field(ShoppingList, pk=String(required=True))
    shopping_lists = MongoengineConnectionField(ShoppingList, get_queryset=create_context_user_queryset)

    @staticmethod
    @jwt_required
    def resolve_shopping_list(root, info, pk):
        context: GraphQLContext = info.context
        return context.shopping_list_by_id.load(pk)


schema = build_schema(Query, mutation=Mutation)
# print(str(schema))
