from graphene import Field, ID, ObjectType, String
from graphene.relay import Node
from graphene_federation import extend, external, key
from graphene_mongo import MongoengineObjectType

from products_service.context import GraphQLContext
from products_service.models import ProductModel


@extend("email")
class User(ObjectType):
    email = external(String(required=True))


@extend("id")
class ShoppingList(ObjectType):
    id = external(ID(required=True))

    class Meta:
        interfaces = (Node,)


@key("id")
class Product(MongoengineObjectType):
    owner = Field(User)

    shopping_list = Field(ShoppingList)

    def __resolve_reference(self, info, **kwargs):
        context: GraphQLContext = info.context
        return context.products_by_id.load(self.id)

    class Meta:
        model = ProductModel
        interfaces = (Node,)

        filter_fields = {
            'name': [
                'exact',
                'iexact',
                'contains',
                'icontains',
            ]
        }
