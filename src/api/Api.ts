// // src/api/Api.ts
// const BASE_URL = "http://localhost:8000/api";

// export interface SignupData {
//   username: string;
//   email: string;
//   password: string;
//   role: string;
// }

// export interface SigninData {
//   username: string;
//   password: string;
// }

// function getAccessToken() {
//   return localStorage.getItem('accessToken');
// }
// function getRefreshToken() {
//   return localStorage.getItem('refreshToken');
// }
// function setTokens(access: string, refresh: string) {
//   localStorage.setItem('accessToken', access);
//   localStorage.setItem('refreshToken', refresh);
//   localStorage.setItem('isLoggedIn', 'true');
// }
// function clearTokens() {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
//   localStorage.removeItem('isLoggedIn');
//   localStorage.removeItem('userRole');
//   localStorage.removeItem('username');
// }

// async function tryRefreshToken(): Promise<boolean> {
//   const refresh = getRefreshToken();
//   if (!refresh) return false;
//   try {
//     const res = await fetch(`${BASE_URL}/token/refresh/`, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({refresh})
//     });
//     if (!res.ok) {
//       clearTokens();
//       return false;
//     }
//     const data = await res.json();
//     if (data.access) {
//       localStorage.setItem('accessToken', data.access);
//       return true;
//     }
//     return false;
//   } catch (e) {
//     console.error("Refresh failed", e);
//     clearTokens();
//     return false;
//   }
// }

// // wrapper that adds Authorization header and auto-refreshes on 401
// export async function authFetch(path: string, opts: RequestInit = {}) {
//   let access = getAccessToken();
//   const headers: any = opts.headers ? {...(opts.headers as any)} : {};
//   headers['Content-Type'] = headers['Content-Type'] || 'application/json';
//   if (access) headers['Authorization'] = `Bearer ${access}`;

//   const res = await fetch(`${BASE_URL}${path}`, {...opts, headers});
//   if (res.status === 401) {
//     const refreshed = await tryRefreshToken();
//     if (refreshed) {
//       access = getAccessToken();
//       headers['Authorization'] = `Bearer ${access}`;
//       return fetch(`${BASE_URL}${path}`, {...opts, headers});
//     }
//   }
//   return res;
// }

// // Signup
// export async function signupUser(payload: SignupData) {
//   const res = await fetch(`${BASE_URL}/signup/`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(payload),
//   });
//   const data = await res.json().catch(()=>({}));
//     if (!res.ok) {
//     // 👇 Log full backend response including serializer.errors
//     console.error("Signup failed:", data);

//     // Try to extract a more specific message from errors
//     let msg = data.message || 'Signup failed';
//     if (data.errors) {
//       const firstField = Object.keys(data.errors)[0];
//       if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField][0]) {
//         msg = data.errors[firstField][0];
//       }
//     }
//     throw new Error(msg);
//   }
//   if (data.access && data.refresh) {
//     setTokens(data.access, data.refresh);
//     localStorage.setItem('userRole', data.role || '');
//     localStorage.setItem('username', data.username || '');
//   }
//   return data;
// }

// // Signin
// export async function signinUser(credentials: SigninData) {
//   const res = await fetch(`${BASE_URL}/signin/`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(credentials),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error(data.message || 'Signin failed');
//   }
//   if (data.access && data.refresh) {
//     setTokens(data.access, data.refresh);
//     localStorage.setItem('userRole', data.role || '');
//     localStorage.setItem('username', data.username || '');
//   }
//   return data;
// }

// // Get current user (calls protected endpoint)
// export async function getCurrentUser() {
//   const res = await authFetch('/current-user/', {method: 'GET'});
//   if (!res.ok) {
//     const b = await res.json().catch(()=>({}));
//     throw new Error(b.message || 'Not authenticated');
//   }
//   return res.json();
// }

// // Logout - server-side blacklisting + client token removal
// export async function logoutUser() {
//   const refresh = getRefreshToken();
//   if (!refresh) {
//     clearTokens();
//     return;
//   }
//   try {
//     const res = await fetch(`${BASE_URL}/logout/`, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken() || ''}`},
//       body: JSON.stringify({refresh}),
//     });
//     // ignore response details; clear tokens anyway
//   } catch (e) {
//     console.warn("Logout request failed", e);
//   } finally {
//     clearTokens();
//   }
// }


// export interface BookingPayload {
//   pandit: number;     // pandit user id
//   pooja: number | null;    // pooja id
//   date: string;       // "2025-12-31"
//   time: string;       // "10:30:00" or "10:30"
//   location: string;
//   notes?: string;
//   price?: number;
// }

// export async function createBooking(payload: BookingPayload) {
//   const res = await authFetch('/bookings/', {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     console.error("Create booking failed:", data);
//     let msg = data.message || 'Failed to create booking';
//     if (data.errors) {
//       const firstField = Object.keys(data.errors)[0];
//       const firstError = data.errors[firstField]?.[0];
//       if (firstError) msg = firstError;
//     }
//     throw new Error(msg);
//   }

//   return data;
// }
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
export interface BookingPayload {
  pandit: number;              // pandit user id
  pooja?: number | null;       // 👈 now OPTIONAL, can be omitted or null
  date: string;                // "2025-12-31"
  time: string;                // "10:30:00" or "10:30"
  location: string;
  notes?: string;
  price?: number;
}
export interface PanditProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  city: string;
  experience_years: number;
  bio: string;
  specializations: string;
  specializations_list: string[];
  rating: number;
  reviews_count: number;
  image_url: string;
  is_approved: boolean;
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("isLoggedIn", "true");
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
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
  const headers: any = opts.headers ? { ...(opts.headers as any) } : {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      access = getAccessToken();
      headers["Authorization"] = `Bearer ${access}`;
      return fetch(`${BASE_URL}${path}`, { ...opts, headers });
    }
  }
  return res;
}

// Signup
export async function signupUser(payload: SignupData) {
  const res = await fetch(`${BASE_URL}/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Signup failed:", data);
    let msg = data.message || "Signup failed";
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      if (
        firstField &&
        Array.isArray(data.errors[firstField]) &&
        data.errors[firstField][0]
      ) {
        msg = data.errors[firstField][0];
      }
    }
    throw new Error(msg);
  }

  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
    localStorage.setItem("userRole", data.role || "");
    localStorage.setItem("username", data.username || "");
  }
  return data;
}

// Signin
export async function signinUser(credentials: SigninData) {
  const res = await fetch(`${BASE_URL}/signin/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Signin failed");
  }
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
    localStorage.setItem("userRole", data.role || "");
    localStorage.setItem("username", data.username || "");
  }
  return data;
}

// Get current user (calls protected endpoint)
export async function getCurrentUser() {
  const res = await authFetch("/current-user/", { method: "GET" });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b.message || "Not authenticated");
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
    await fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken() || ""}`,
      },
      body: JSON.stringify({ refresh }),
    });
  } catch (e) {
    console.warn("Logout request failed", e);
  } finally {
    clearTokens();
  }
}

// ---------- BOOKING ----------



export async function createBooking(payload: BookingPayload) {
  const res = await authFetch("/bookings/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Create booking failed:", data);
    let msg = data.message || "Failed to create booking";
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      const firstError = (data.errors as any)[firstField]?.[0];
      if (firstError) msg = firstError;
    }
    throw new Error(msg);
  }

  return data;
}
// public list of pandits
export async function fetchPandits(): Promise<PanditProfile[]> {
  const res = await fetch(`${BASE_URL}/pandits/`);
  if (!res.ok) throw new Error("Failed to load pandits");
  return res.json();
}

// detail (if you want a detail page)
export async function fetchPanditDetail(id: number): Promise<PanditProfile> {
  const res = await fetch(`${BASE_URL}/pandits/${id}/`);
  if (!res.ok) throw new Error("Failed to load pandit");
  return res.json();
}

// create/update current pandit's profile (protected)
export async function saveMyPanditProfile(
  payload: Partial<PanditProfile>
): Promise<PanditProfile> {
  const res = await authFetch("/pandits/me/", {
    method: "POST", // or "PUT"
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Save pandit profile failed:", data);
    throw new Error(data.message || "Failed to save profile");
  }
  return data;
}
