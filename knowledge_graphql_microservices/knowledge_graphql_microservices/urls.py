from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import RedirectView


admin.autodiscover()

urlpatterns = [
    url(r"^api/", include("knowledge_graphql_microservices.rest.urls")),
    url(r"^adminpanel/", admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if not settings.DEBUG:
    handler500 = "knowledge_graphql_microservices.views.server_error"
    handler404 = "knowledge_graphql_microservices.views.page_not_found"

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
