from rest_framework.routers import DefaultRouter
from logs.views import LogEntryViewSet

router = DefaultRouter()
router.register("", LogEntryViewSet, basename="logentry")

urlpatterns = router.urls
