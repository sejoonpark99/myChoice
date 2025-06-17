from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Item

print("🔧 Signals file loaded!")  # Debug print

channel_layer = get_channel_layer()


@receiver(post_save, sender=Item)
def item_saved(sender, instance, created, **kwargs):
    print(
        f"SIGNAL FIRED - Item saved: {instance.name}, created: {created}"
    )  # Debug print

    if channel_layer:
        event_type = "item_created" if created else "item_updated"

        try:
            async_to_sync(channel_layer.group_send)(
                "items",
                {
                    "type": event_type,
                    "item": {
                        "id": instance.id,
                        "name": instance.name,
                        "group": instance.group,
                        "created_at": instance.created_at.isoformat(),
                        "updated_at": instance.updated_at.isoformat(),
                    },
                },
            )
            print(f"Broadcasted {event_type}: {instance.name}")
        except Exception as e:
            print(f"Broadcast failed: {e}")
    else:
        print("No channel layer found!")


@receiver(post_delete, sender=Item)
def item_deleted(sender, instance, **kwargs):
    print(f"SIGNAL FIRED: Item deleted: {instance.name}")

    if channel_layer:
        try:
            async_to_sync(channel_layer.group_send)(
                "items",
                {
                    "type": "item_deleted",
                    "item_id": instance.id,
                    "item_name": instance.name,
                },
            )
            print(f"Broadcasted item_deleted: {instance.name}")
        except Exception as e:
            print(f"Broadcast failed: {e}")
    else:
        print("No channel layer found!")
