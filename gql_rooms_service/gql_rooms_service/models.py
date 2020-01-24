from datetime import datetime

from mongoengine import Document, fields


class Room(Document):
    meta = {"collection": "room"}

    name = fields.StringField(max_length=200, required=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)

    members = fields.ListField(fields.IntField())
