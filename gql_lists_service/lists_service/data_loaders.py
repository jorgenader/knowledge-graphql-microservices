from promise import Promise
from promise.dataloader import DataLoader

from lists_service.models import ShoppingListModel


class ShoppingListByIdLoader(DataLoader):
    def batch_load_fn(self, shopping_list_ids):
        results = {
            shopping_list.id: shopping_list
            for shopping_list in ShoppingListModel.objects(pk__in=shopping_list_ids)
        }
        return Promise.resolve([results.get(key) for key in shopping_list_ids])
