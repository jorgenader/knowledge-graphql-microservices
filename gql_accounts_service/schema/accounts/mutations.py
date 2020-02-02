from graphene import ObjectType
from graphene_django.rest_framework.mutation import SerializerMutation
from django.contrib.auth import get_user_model
from tg_react.api.accounts.serializers import SignupSerializer
from tg_react.settings import get_signup_skipped_fields


class RegisterUserMutation(SerializerMutation):
    class Meta:
        serializer_class = SignupSerializer

    @classmethod
    def perform_mutate(cls, serializer, info):
        data = serializer.validated_data.copy()
        password = data.pop('password', None)

        for skipped_field in get_signup_skipped_fields():
            data.pop(skipped_field, None)

        user = get_user_model()(**data)
        user.set_password(password)
        user.save()


class AccountMutation(ObjectType):
    register = RegisterUserMutation.Field()
