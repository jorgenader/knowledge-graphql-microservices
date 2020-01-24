import graphene
from graphene_federation import build_schema
from graphene_mongo import MongoengineConnectionField

from .models import Room
from .mutations import CreateRoomMutation, JoinRoomMutation, LeaveRoomMutation
from .types import RoomType


class Mutation(graphene.ObjectType):
    create_room = CreateRoomMutation.Field()
    join_room = JoinRoomMutation.Field()
    leave_room = LeaveRoomMutation.Field()


class Query(graphene.ObjectType):
    user_rooms = MongoengineConnectionField(
        RoomType, user_id=graphene.Int(required=True)
    )
    all_rooms = MongoengineConnectionField(RoomType)

    @staticmethod
    def resolve_all_rooms(root, info, **kwargs):
        return Room.objects.all()

    @staticmethod
    def resolve_user_rooms(root, info, **kwargs):
        print(root, info, kwargs)
        return Room.objects(members=1)


schema = build_schema(Query, types=[Room], mutation=Mutation)
