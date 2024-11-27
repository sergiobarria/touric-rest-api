from django.urls import path

from .api import views

urlpatterns = [
    path(
        "difficulty-choices/",
        views.DifficultyChoicesView.as_view(),
        name="difficulty-choices",
    ),
    path("", views.ListCreateToursAPIView.as_view(), name="list-tours-api"),
]
