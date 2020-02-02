import graphene

from products_service.context import GraphQLContext
from products_service.models import ProductModel, Owner
from products_service.types import Product


class ProductCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    url = graphene.String()
    image = graphene.String()


class ProductUpdateInput(graphene.InputObjectType):
    name = graphene.String()
    url = graphene.String()
    image = graphene.String()


class CreateProductMutation(graphene.Mutation):
    product = graphene.Field(Product)

    class Arguments:
        data = ProductCreateInput(required=True)

    @staticmethod
    def mutate(root, info, data: ProductCreateInput):
        context: GraphQLContext = info.context
        product = ProductModel(
            name=data.name,
            url=data.url,
            image=data.image,
            owner=Owner(email=context.user),
        )
        product.save()

        return CreateProductMutation(product=product)


class UpdateProductByIdMutation(graphene.Mutation):
    product = graphene.Field(Product)

    class Arguments:
        pk = graphene.ID(required=True)
        data = ProductUpdateInput()

    @staticmethod
    def mutate(root, info, pk, data: ProductUpdateInput = None):
        product = ProductModel.objects.get(pk=pk)

        if not data:
            return UpdateProductByIdMutation(product=product)

        fields = ['name', 'image', 'url']

        for field in fields:
            value = getattr(data, field)
            if value:
                setattr(product, field, value)

        product.save()

        return UpdateProductByIdMutation(product=product)
