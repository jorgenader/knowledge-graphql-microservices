from functools import cached_property

from flask_jwt_extended import get_jwt_identity

from products_service.data_loaders import ProductByIdLoader


class GraphQLContext:
    def __init__(self, request):
        self.request = request

    @cached_property
    def user(self) -> str:
        return get_jwt_identity()

    @cached_property
    def products_by_id(self):
        return ProductByIdLoader()
