from promise import Promise
from promise.dataloader import DataLoader

from accounts.models import User


class UsersByIdLoader(DataLoader):
    def batch_load_fn(self, user_ids):
        results = {
            user.pk: user
            for user in User.objects.filter(pk__in=user_ids)
        }
        return Promise.resolve([results.get(user_id) for user_id in user_ids])


class UsersByEmailLoader(DataLoader):
    def batch_load_fn(self, user_emails):
        results = {
            user.email: user
            for user in User.objects.filter(email__in=user_emails)
        }
        return Promise.resolve([results.get(email) for email in user_emails])
