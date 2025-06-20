from rest_framework import serializers
from .models import LogEntry


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ["id", "timestamp", "level", "service", "message", "context"]
        read_only_fields = ["id", "timestamp"]
