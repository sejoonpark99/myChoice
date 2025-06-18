import logging
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from ..models import Item
from .serializers import ItemSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiExample
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

# Logger for collection operations
logger = logging.getLogger(__name__)


@extend_schema_view(
    list=extend_schema(
        summary="List all items",
        description="Retrieve a list of all items in the collection",
        responses={200: ItemSerializer(many=True)},
        examples=[
            OpenApiExample(
                "Success Response",
                value=[
                    {
                        "id": 1,
                        "name": "Sample Item",
                        "group": "Primary",
                        "created_at": "2025-06-17T10:00:00Z",
                        "updated_at": "2025-06-17T10:00:00Z",
                    }
                ],
            )
        ],
    ),
    create=extend_schema(
        summary="Create a new item",
        description="Create a new item in the collection",
        examples=[
            OpenApiExample(
                "Request Example", value={"name": "New Item", "group": "Primary"}
            )
        ],
    ),
    retrieve=extend_schema(
        summary="Get item details",
        description="Retrieve details of a specific item by ID",
    ),
    update=extend_schema(
        summary="Update an item", description="Update all fields of an existing item"
    ),
    partial_update=extend_schema(
        summary="Partially update an item",
        description="Update specific fields of an existing item",
    ),
    destroy=extend_schema(
        summary="Delete an item", description="Delete an item from the collection"
    ),
)
class ItemViewSet(viewsets.ModelViewSet):
    """
    Provides: list, retrieve, create, partial_update, update, destroy
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def list(self, request, *args, **kwargs):
        logger.debug(
            "List of items requested", extra={"context": {"user": str(request.user)}}
        )
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        logger.debug(
            f"Retrieving item {pk}", extra={"context": {"user": str(request.user)}}
        )
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save()
        logger.info(
            f"Created item {instance.id}", extra={"context": serializer.validated_data}
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        logger.info(
            f"Updated item {instance.id}", extra={"context": serializer.validated_data}
        )

    def perform_destroy(self, instance):
        item_id = instance.id
        instance.delete()
        logger.warning(f"Deleted item {item_id}")

    @extend_schema(
        summary="Bulk delete items",
        description="Delete multiple items at once by providing a list of IDs",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "ids": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "description": "List of item IDs to delete",
                    }
                },
                "required": ["ids"],
            }
        },
        examples=[OpenApiExample("Bulk Delete Request", value={"ids": [1, 2, 3]})],
        responses={
            200: {
                "description": "Items deleted successfully",
                "examples": {
                    "application/json": {
                        "deleted": 3,
                        "message": "Successfully deleted 3 items",
                    }
                },
            }
        },
    )
    @action(detail=False, methods=["delete"])
    def bulk_delete(self, request):
        """
        Bulk delete items by providing a list of IDs
        """
        ids = request.data.get("ids", [])

        if not ids:
            return Response(
                {"error": "No IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(ids, list):
            return Response(
                {"error": "IDs must be provided as a list"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Filter items that exist
            items_to_delete = Item.objects.filter(id__in=ids)

            if not items_to_delete.exists():
                return Response(
                    {"error": "No valid items found to delete"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Log the items being deleted
            deleted_items = list(items_to_delete.values("id", "name"))

            # Perform the bulk delete
            deleted_count, _ = items_to_delete.delete()

            # Log the bulk deletion
            logger.warning(
                f"Bulk deleted {deleted_count} items",
                extra={
                    "context": {
                        "deleted_items": deleted_items,
                        "user": str(request.user),
                    }
                },
            )

            return Response(
                {
                    "deleted": deleted_count,
                    "message": f"Successfully deleted {deleted_count} items",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(
                f"Error during bulk delete: {str(e)}",
                extra={"context": {"ids": ids, "user": str(request.user)}},
            )
            return Response(
                {"error": "An error occurred during bulk deletion"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
