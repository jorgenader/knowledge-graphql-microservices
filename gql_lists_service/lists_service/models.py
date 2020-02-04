from datetime import datetime

from mongoengine import EmbeddedDocument, Document, fields


class Owner(EmbeddedDocument):
    email = fields.StringField(required=True)


class Product(EmbeddedDocument):
    id = fields.StringField(required=True)


class ShoppingListModel(Document):
    meta = {"collection": "shopping_lists"}

    name = fields.StringField(max_length=200, required=True)

    image = fields.StringField(max_length=256)

    owner = fields.EmbeddedDocumentField(Owner, required=True)

    products = fields.EmbeddedDocumentListField(Product)

    created_at = fields.DateTimeField(default=datetime.utcnow)
