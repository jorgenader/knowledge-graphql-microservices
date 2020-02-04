from flask_jwt_extended import jwt_required
from graphene import Field, ObjectType, String
from graphene_federation import build_schema
from graphene_mongo import MongoengineConnectionField

from products_service.context import GraphQLContext
from products_service.mutations import CreateProductMutation
from products_service.types import Product


class Mutation(ObjectType):
    create_product = CreateProductMutation.Field()


@jwt_required
def create_context_user_queryset(model, info, **args):
    context: GraphQLContext = info.context
    return model.objects(owner__email=context.user, **args)


class Query(ObjectType):
    product = Field(Product, pk=String(required=True))
    products = MongoengineConnectionField(Product, get_queryset=create_context_user_queryset)

    @staticmethod
    @jwt_required
    def resolve_product(root, info, pk):
        context: GraphQLContext = info.context
        return context.products_by_id.load(pk)


schema = build_schema(Query, mutation=Mutation)
# print(str(schema))
