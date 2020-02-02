from datetime import datetime

from mongoengine import EmbeddedDocument, Document, fields


class Owner(EmbeddedDocument):
    email = fields.StringField(required=True)


class ProductModel(Document):
    meta = {"collection": "products"}

    name = fields.StringField(max_length=200, required=True)

    url = fields.StringField(max_length=512)

    image = fields.StringField(max_length=256)

    owner = fields.EmbeddedDocumentField(Owner, required=True)

    created_at = fields.DateTimeField(default=datetime.utcnow)
