from graphene import Int, ObjectType
from graphene_federation import extend, external, key
from graphene_mongo import MongoengineObjectType

from .models import Room


@extend("id")
class UserType(ObjectType):
    id = external(Int(required=True))


@key("id")
class RoomType(MongoengineObjectType):
    def __resolve_reference(self, info, **kwargs):
        return Room.objects.get(id=self.id)

    class Meta:
        model = Room
