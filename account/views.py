# account/views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import SignupSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    POST: { username, email, password, role }
    Returns access + refresh tokens and user info.
    """
    print("RAW signup request.data:",request.data)
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        print("Signup serializer errors:", serializer.errors)
        return Response({'message': 'Invalid data', 'errors': serializer.errors}, status=400)

    user = serializer.save()
    # create tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'Signup successful',
        'username': user.username,
        'role': user.role,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def signin_view(request):
    """
    POST: { username, password }
    Returns access + refresh tokens and basic user info.
    """
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    if not username or not password:
        return Response({'message': 'Username and password required'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({'message': 'Invalid credentials'}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'Signin successful',
        'username': user.username,
        'role': user.role,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=200)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    GET: returns { username, role }
    Requires Authorization: Bearer <access>
    """
    user = request.user
    return Response({
        'username': user.username,
        'role': user.role
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    POST: Blacklist refresh token. Body: { refresh: "<token>" }
    Requires Authorization header with access token (for identifying user).
    """
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'message': 'Refresh token required.'}, status=400)
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful.'}, status=200)
    except Exception as e:
        return Response({'message': 'Invalid token or already blacklisted.'}, status=400)
