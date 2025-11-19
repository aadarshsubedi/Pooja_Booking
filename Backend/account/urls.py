from django.urls import path
from .views import signup_view
from .views import signin_view


urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('signin/', signin_view, name='api_signin'),
]
