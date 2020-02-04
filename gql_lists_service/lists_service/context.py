from functools import cached_property

from flask_jwt_extended import get_jwt_identity, get_raw_jwt

from lists_service.data_loaders import ShoppingListByIdLoader


class GraphQLContext:
    def __init__(self, request):
        self.request = request

    @cached_property
    def user(self) -> str:
        print(get_raw_jwt())
        return get_jwt_identity()

    @cached_property
    def shopping_list_by_id(self):
        return ShoppingListByIdLoader()
