import graphene

from lists_service.context import GraphQLContext
from lists_service.models import ShoppingListModel, Owner
from lists_service.types import ShoppingList


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
    def mutate(cls, root, info, pk, products):
        shopping_list = ShoppingListModel.objects.get(pk=pk)

        if not products:
            return cls(shopping_list=shopping_list)

        ShoppingListModel.objects(pk=pk).update(add_to_set__products=products)

        shopping_list.reload()

        return cls(shopping_list=shopping_list)


class RemoveFromShoppingListByIdMutation(graphene.Mutation):
    shopping_list = graphene.Field(ShoppingList)

    class Arguments:
        pk = graphene.ID(required=True)
        products = graphene.List(ProductItem, required=True)

    @classmethod
    def mutate(cls, root, info, pk, products):
        shopping_list = ShoppingListModel.objects.get(pk=pk)

        if not products:
            return cls(shopping_list=shopping_list)

        ShoppingListModel.objects(pk=pk).update(pull_all__products=products)

        shopping_list.reload()

        return cls(shopping_list=shopping_list)
