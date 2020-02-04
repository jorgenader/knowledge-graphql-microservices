from graphene import Field, ID, ObjectType, String, List
from graphene.relay import Node
from graphene_federation import extend, external, key
from graphene_mongo import MongoengineObjectType

from lists_service.context import GraphQLContext
from lists_service.models import ShoppingListModel, Product as ProductModel


@extend("email")
class User(ObjectType):
    email = external(String(required=True))


@extend("id")
class Product(MongoengineObjectType):
    id = external(ID(required=True))

    class Meta:
        model = ProductModel
        interfaces = (Node,)


@key("id")
class ShoppingList(MongoengineObjectType):
    owner = Field(User)

    products = Field(List(Product))

    def __resolve_reference(self, info, **kwargs):
        context: GraphQLContext = info.context
        return context.shopping_list_by_id.load(self.id)

    class Meta:
        model = ShoppingListModel
        interfaces = (Node,)

        filter_fields = {
            'name': [
                'exact',
                'iexact',
                'contains',
                'icontains',
            ]
        }
