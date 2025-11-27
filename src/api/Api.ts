const BASE_URL = "http://localhost:8000/api";  // Django API URL

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

// Define the interface for Signin data (username and password only)
export interface SigninData {
    username: string;
    password: string;
}

export async function signupUser(data: SignupData) {
  try {
    const response = await fetch(`${BASE_URL}/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Function to handle the sign-in request
export async function signinUser(credentials: SigninData) {
  try {
    const response = await fetch(`${BASE_URL}/signin/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // The backend returns an error JSON with a 'message' field on failure
      throw new Error(data.message || 'Failed to sign in');
    }

  

    return data; // Returns data like { message: 'Signin successful', username: '...', role: '...' }

  } catch (error) {
    throw error;
  }
}