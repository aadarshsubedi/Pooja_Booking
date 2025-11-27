import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model

User = get_user_model()

def json_error(message, status=400):
    return JsonResponse({'message': message}, status=status)

@csrf_exempt  # DEV ONLY. For production, handle CSRF properly
def signup_view(request):
    if request.method != 'POST':
        return json_error('Invalid request method', 405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        role = data.get('role', 'user')

        if not username or not email or not password:
            return json_error('All fields are required.')

        if role not in ['user', 'pandit']:
            return json_error('Invalid role.')

        if User.objects.filter(username=username).exists():
            return json_error('Username already exists.')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
        )

        return JsonResponse({'message': 'Signup successful', 'role': user.role}, status=201)

    except Exception as e:
        return json_error(str(e))


from django.contrib.auth import authenticate, login

@csrf_exempt  # DEV ONLY. For production, handle CSRF properly
def signin_view(request):
    if request.method != 'POST':
        return json_error('Invalid request method', 405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return json_error('Username and password are required.')

        # 1. Authenticate the user against the database
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # 2. Log the user in to establish a session
            login(request, user)
            
            # Return success message and user details (e.g., role)
            return JsonResponse({
                'message': 'Signin successful', 
                'username': user.username,
                'role': user.role  # Assuming you added a 'role' field to your custom user model
            }, status=200)
        else:
            # 3. Handle incorrect credentials
            return json_error('Invalid username or password.', 401)

    except Exception as e:
        return json_error(str(e))
