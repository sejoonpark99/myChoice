import logging
from .models import LogEntry


class DatabaseLogHandler(logging.Handler):
    def emit(self, record: logging.LogRecord):
        try:
            from .models import LogEntry

            LogEntry.objects.create(
                level=record.levelname,
                service=record.name,
                message=self.format(record),
                context=getattr(record, "context", None),
            )
        except Exception as e:
            logging.getLogger(__name__).error("Logging to DB failed", exc_info=e)
