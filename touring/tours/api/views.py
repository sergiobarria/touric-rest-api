from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions

from tours.api.serializers import TourSerializer
from tours.models import Tour


class DifficultyChoicesView(APIView):
    """Return a list of difficulty choices."""

    def get(self, request):
        """Retrieve the difficulty choices dynamically."""
        choices = [
            {"value": choice[0], "label": choice[1]}
            for choice in Tour.Difficulty.choices
        ]
        return Response(choices)


class ListCreateToursAPIView(generics.ListCreateAPIView):
    queryset = Tour.objects.prefetch_related("start_dates")
    serializer_class = TourSerializer
    permission_classes = [permissions.AllowAny]
