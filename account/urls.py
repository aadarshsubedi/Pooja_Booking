# account/urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('signin/', views.signin_view, name='signin'),
    path('current-user/', views.current_user_view, name='current_user'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("pandits/", views.pandit_list_view, name="pandit_list"),
    path("pandits/me/", views.my_pandit_profile_view, name="my_pandit_profile"),
    path("pandits/<int:pk>/", views.pandit_detail_view, name="pandit_detail"),
    path("profile/", views.my_profile_view, name="my_profile"),
    path("profile/avatar/", views.upload_avatar_view, name="upload_avatar"),
    
]
