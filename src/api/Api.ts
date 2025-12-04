// src/api/Api.ts
const BASE_URL = "http://localhost:8000/api";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface SigninData {
  username: string;
  password: string;
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
function setTokens(access: string, refresh: string) {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
  localStorage.setItem('isLoggedIn', 'true');
}
function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refresh})
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Refresh failed", e);
    clearTokens();
    return false;
  }
}

// wrapper that adds Authorization header and auto-refreshes on 401
export async function authFetch(path: string, opts: RequestInit = {}) {
  let access = getAccessToken();
  const headers: any = opts.headers ? {...(opts.headers as any)} : {};
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (access) headers['Authorization'] = `Bearer ${access}`;

  const res = await fetch(`${BASE_URL}${path}`, {...opts, headers});
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      access = getAccessToken();
      headers['Authorization'] = `Bearer ${access}`;
      return fetch(`${BASE_URL}${path}`, {...opts, headers});
    }
  }
  return res;
}

// Signup
export async function signupUser(payload: SignupData) {
  const res = await fetch(`${BASE_URL}/signup/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(()=>({}));
    if (!res.ok) {
    // 👇 Log full backend response including serializer.errors
    console.error("Signup failed:", data);

    // Try to extract a more specific message from errors
    let msg = data.message || 'Signup failed';
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField][0]) {
        msg = data.errors[firstField][0];
      }
    }
    throw new Error(msg);
  }
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
    localStorage.setItem('userRole', data.role || '');
    localStorage.setItem('username', data.username || '');
  }
  return data;
}

// Signin
export async function signinUser(credentials: SigninData) {
  const res = await fetch(`${BASE_URL}/signin/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Signin failed');
  }
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
    localStorage.setItem('userRole', data.role || '');
    localStorage.setItem('username', data.username || '');
  }
  return data;
}

// Get current user (calls protected endpoint)
export async function getCurrentUser() {
  const res = await authFetch('/current-user/', {method: 'GET'});
  if (!res.ok) {
    const b = await res.json().catch(()=>({}));
    throw new Error(b.message || 'Not authenticated');
  }
  return res.json();
}

// Logout - server-side blacklisting + client token removal
export async function logoutUser() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/logout/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken() || ''}`},
      body: JSON.stringify({refresh}),
    });
    // ignore response details; clear tokens anyway
  } catch (e) {
    console.warn("Logout request failed", e);
  } finally {
    clearTokens();
  }
}
