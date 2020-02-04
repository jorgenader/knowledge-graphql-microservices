from base64 import decodebytes

from promise import Promise
from promise.dataloader import DataLoader

from products_service.models import ProductModel


def parse_mongo_id(pk: str):
    item_id = decodebytes(pk.encode())
    __, item_id = item_id.decode().split(":")
    return item_id


class ProductByIdLoader(DataLoader):
    def batch_load_fn(self, product_ids):
        results = {
            parse_mongo_id(product.id): product
            for product in ProductModel.objects(pk__in=product_ids)
        }
        return Promise.resolve([results.get(key) for key in product_ids])
