import graphene

from .models import Room
from .types import RoomType


class RoomInput(graphene.InputObjectType):
    name = graphene.String(required=True)


class RoomMembershipInput(graphene.InputObjectType):
    room_id = graphene.ID(required=True)
    user_id = graphene.Int(required=True)


class CreateRoomMutation(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        room_data = RoomInput(required=True)

    @staticmethod
    def mutate(root, info, room_data: RoomInput = None):
        print("CREATE ROOM:", root, info, room_data)

        room = Room(name=room_data.name,)
        room.save()

        return CreateRoomMutation(room=room)


class JoinRoomMutation(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        membership = RoomMembershipInput(required=True)

    @staticmethod
    def mutate(root, info, membership: RoomMembershipInput = None):
        print("JOIN ROOM:", root, info, info, membership)

        Room.objects(id=membership.room_id).update_one(
            add_to_set__members=[membership.user_id]
        )

        room = Room.objects.get(membership.room_id)

        return JoinRoomMutation(room=room)


class LeaveRoomMutation(graphene.Mutation):
    room = graphene.Field(RoomType)

    class Arguments:
        membership = RoomMembershipInput(required=True)

    @staticmethod
    def mutate(root, info, membership: RoomMembershipInput = None):
        print("LEAVE ROOM:", root, info, info, membership)

        Room.objects(id=membership.room_id).update_one(pull__members=membership.user_id)

        room = Room.objects.get(membership.room_id)

        return LeaveRoomMutation(room=room)
