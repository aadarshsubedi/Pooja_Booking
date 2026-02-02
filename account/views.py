# account/views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes,parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import PanditProfile
from .serializers import PanditProfileSerializer
from .serializers import SignupSerializer, UserSerializer
from django.shortcuts import get_object_or_404
from .serializers import UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UserProfile

@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    """
    POST: { username, email, password, role, full_name, phone, address, dob, gender }
    Creates CustomUser + UserProfile (profile fields stored in UserProfile only)
    """
    serializer = SignupSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=400,
        )

    user = serializer.save()

    # ✅ Create/update profile with extra fields
    profile, _ = UserProfile.objects.get_or_create(user=user)

    profile_payload = {
        "full_name": request.data.get("full_name", ""),
        "phone": request.data.get("phone", ""),
        "address": request.data.get("address", ""),
        "dob": request.data.get("dob", None),
        "gender": request.data.get("gender", ""),
    }

    pser = UserProfileSerializer(
        profile,
        data=profile_payload,
        partial=True,
        context={"request": request},
    )

    if pser.is_valid():
        pser.save()
    else:
        # Not blocking signup; but you will see what failed
        return Response(
            {"message": "Profile data invalid", "errors": pser.errors},
            status=400,
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "message": "Signup successful",
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),

            # ✅ Return profile so frontend can store it immediately
            "profile": pser.data,
        },
        status=201,
    )
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_avatar_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    serializer = UserProfileSerializer(
        profile,
        data=request.data,
        partial=True,
        context={"request": request},
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response({"message": "Invalid data", "errors": serializer.errors}, status=400)

# @api_view(["GET"])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
# def my_profile_view(request):
#     profile, _ = UserProfile.objects.get_or_create(user=request.user)
#     serializer = UserProfileSerializer(profile, context={"request": request})
#     return Response(serializer.data, status=200)
@api_view(["GET", "PUT", "PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def my_profile_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    if request.method == "GET":
        serializer = UserProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    serializer = UserProfileSerializer(
        profile,
        data=request.data,
        partial=True,
        context={"request": request},
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response({"message": "Invalid data", "errors": serializer.errors}, status=400)
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
        'email': user.email,
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
    avatar_url = None
    if hasattr(user, "profile") and user.profile.avatar:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        avatar_url = request.build_absolute_uri(user.profile.avatar.url) if profile.avatar else None
    return Response({
        'username': user.username,
        'role': user.role,
        'email': user.email,
        "avatar_url": avatar_url,
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
    
    
@api_view(["GET"])
@permission_classes([AllowAny])
def pandit_list_view(request):
    """
    Public list of approved pandits.
    GET /api/pandits/
    """
    pandits = PanditProfile.objects.filter(is_approved=True).select_related("user")
    serializer = PanditProfileSerializer(pandits, many=True)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([AllowAny])
def pandit_detail_view(request, pk):
    """
    Public detail of a pandit by profile id.
    GET /api/pandits/<id>/
    """
    profile = get_object_or_404(PanditProfile, pk=pk, is_approved=True)
    serializer = PanditProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST", "PUT"])
@authentication_classes([JWTAuthentication])   # ✅ ADD THIS
@permission_classes([IsAuthenticated])
def my_pandit_profile_view(request):
    user = request.user

    if (user.role or "").lower() != "pandit":
        return Response({"message": "Only pandits can create profiles."}, status=403)

    profile,_= PanditProfile.objects.get_or_create(user=user)

    if request.method == "GET":
        serializer = PanditProfileSerializer(profile)
        return Response(serializer.data, status=200)
    serializer = PanditProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        # ✅ never allow frontend to set approval
        serializer.save()
        return Response(serializer.data, status=200)

    return Response({"message": "Invalid data", "errors": serializer.errors}, status=400)
