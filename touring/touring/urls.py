from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(r"health/", include("health_check.urls")),
    path("api/v1/", include("api.urls")),
]
