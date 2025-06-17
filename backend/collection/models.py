from django.db import models


class Item(models.Model):
    class Group(models.TextChoices):
        PRIMARY = "Primary"
        SECONDARY = "Secondary"

    name = models.CharField(max_length=100)
    group = models.CharField(max_length=10, choices=Group.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("group", "name")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.group})"
