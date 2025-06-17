import logging


class DatabaseLogHandler(logging.Handler):
    def emit(self, record: logging.LogRecord):
        try:
            from logs.models import LogEntry

            LogEntry.objects.create(
                level=record.levelname,
                service=record.name,
                message=self.format(record),
                context=getattr(record, "context", None),
            )
        except Exception as e:
            if "database is locked" in str(e):
                pass
            else:
                logging.getLogger(__name__).error(
                    "Failed to log to database", exc_info=e
                )
