from promise import Promise
from promise.dataloader import DataLoader

from products_service.models import ProductModel


class ProductByIdLoader(DataLoader):
    def batch_load_fn(self, product_ids):
        results = {
            product.id: product
            for product in ProductModel.objects(pk__in=product_ids)
        }
        return Promise.resolve([results.get(key) for key in product_ids])
