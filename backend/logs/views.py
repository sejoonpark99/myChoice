from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import LogEntry
from .serializers import LogEntrySerializer


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer

    def destroy(self, request, *args, **kwargs):
        # If no specific ID, assume a bulk delete
        if not kwargs.get("pk"):
            count = LogEntry.objects.all().delete()
            return Response(
                {"detail": f"Deleted {count[0]} logs."},
                status=status.HTTP_204_NO_CONTENT,
            )
        return super().destroy(request, *args, **kwargs)
