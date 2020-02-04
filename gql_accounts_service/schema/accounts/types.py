from graphene_django import DjangoObjectType
from graphene_federation import key

from accounts.models import User as UserModel


@key("id")
@key("email")
class User(DjangoObjectType):
    def __resolve_reference(self, info, **kwargs):
        if self.email is not None:
            return info.context.users_by_email.load(self.email)

        return info.context.users_by_id.load(self.id)

    class Meta:
        model = UserModel
