from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import RedirectView

from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie


admin.autodiscover()

urlpatterns = [
    url(r"^adminpanel/", admin.site.urls),
    url(r"^graphql$", csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=settings.DEBUG)))),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if not settings.DEBUG:
    handler500 = "gql_accounts_service.views.server_error"
    handler404 = "gql_accounts_service.views.page_not_found"

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [url(r"^__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass


urlpatterns += [
    url(
        r"^$",
        RedirectView.as_view(url=settings.SITE_URL, permanent=False),
        name="app-redirect",
    )
]
