from graphene_django import DjangoObjectType
from graphene_federation import key

from accounts.models import User as UserModel


@key('id')
class User(DjangoObjectType):
    class Meta:
        model = UserModel
