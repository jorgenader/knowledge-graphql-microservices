from base64 import decodebytes

import graphene
from flask_jwt_extended import jwt_required

from lists_service.context import GraphQLContext
from lists_service.models import ShoppingListModel, Owner
from lists_service.types import ShoppingList


def parse_mongo_id(pk: str):
    item_id = decodebytes(pk.encode())
    __, item_id = item_id.decode().split(":")
    return item_id


class ShoppingListCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    image = graphene.String()


class ShoppingListUpdateInput(graphene.InputObjectType):
    name = graphene.String()
    image = graphene.String()


class ProductItem(graphene.InputObjectType):
    id = graphene.String(required=True)


class CreateShoppingListMutation(graphene.Mutation):
    shopping_list = graphene.Field(ShoppingList)

    class Arguments:
        data = ShoppingListCreateInput(required=True)

    @classmethod
    @jwt_required
    def mutate(cls, root, info, data: ShoppingListCreateInput):
        context: GraphQLContext = info.context
        shopping_list = ShoppingListModel(
            name=data.name,
            image=data.image,
            owner=Owner(email=context.user),
        )
        shopping_list.save()

        return cls(shopping_list=shopping_list)


class UpdateShoppingListByIdMutation(graphene.Mutation):
    shopping_list = graphene.Field(ShoppingList)

    class Arguments:
        pk = graphene.ID(required=True)
        data = ShoppingListUpdateInput()

    @classmethod
    @jwt_required
    def mutate(cls, root, info, pk, data: ShoppingListUpdateInput = None):
        shopping_list = ShoppingListModel.objects.get(pk=pk)

        if not data:
            return cls(shopping_list=shopping_list)

        fields = ['name', 'image']

        for field in fields:
            value = getattr(data, field)
            if value:
                setattr(shopping_list, field, value)

        shopping_list.save()

        return cls(shopping_list=shopping_list)


class AddToShoppingListByIdMutation(graphene.Mutation):
    shopping_list = graphene.Field(ShoppingList)

    class Arguments:
        pk = graphene.ID(required=True)
        products = graphene.List(ProductItem, required=True)

    @classmethod
    @jwt_required
    def mutate(cls, root, info, pk, products):
        shopping_list = ShoppingListModel.objects.get(pk=parse_mongo_id(pk))

        if not products:
            return cls(shopping_list=shopping_list)

        print([
            {'id': parse_mongo_id(p['id'])}
            for p in products
        ])

        ShoppingListModel.objects(pk=parse_mongo_id(pk)).update(add_to_set__products=[
            {'id': parse_mongo_id(p['id'])}
            for p in products
        ])

        shopping_list.reload()

        return cls(shopping_list=shopping_list)


class RemoveFromShoppingListByIdMutation(graphene.Mutation):
    shopping_list = graphene.Field(ShoppingList)

    class Arguments:
        pk = graphene.ID(required=True)
        products = graphene.List(ProductItem, required=True)

    @classmethod
    @jwt_required
    def mutate(cls, root, info, pk, products):
        shopping_list = ShoppingListModel.objects.get(pk=pk)

        if not products:
            return cls(shopping_list=shopping_list)

        ShoppingListModel.objects(pk=pk).update(pull_all__products=products)

        shopping_list.reload()

        return cls(shopping_list=shopping_list)
