const BASE_URL = "http://localhost:8000/api";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
  full_name?: string;
  phone?: string;
  address?: string;
  dob?: string;
  gender?: string;
}
export type BlockedDate = {
  id: number;
  date: string;       // "YYYY-MM-DD"
  reason?: string;
};

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
  user_id: number;
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
export type PanditDashboardSummary = {
  pandit_username: string;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  upcoming: number;
  earnings: number;
};

export type PanditBooking = {
  id: number;
  user: number;
  user_username: string;
  user_email: string;
  pooja: number | null;
  pooja_name?: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "paid" | "unpaid" | "failed";
  payment_method?: string | null;
  payment_reference?: string | null;
};

export type BookedMap = Record<string, string[]>;

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
function setBasicUserProfileFromAuthResponse(data: any) {
  if (!data || !data.username) return;

  const profile = {
    fullName: data.full_name || data.username, // adjust if you add full_name later
    username: data.username,
    email: data.email || "",
    phone: "",
    address: "",
    avatar: "",
  };
  localStorage.setItem("userProfile", JSON.stringify(profile));
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

export async function khaltiDemoConfirm(bookingId: number, status: "paid" | "failed") {
  const res = await authFetch(`/payments/khalti/demo/confirm/${bookingId}/`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to confirm demo payment");
  return data;
}

export async function downloadReceipt(bookingId: number) {
  const res = await authFetch(`/bookings/${bookingId}/receipt/`, { method: "GET" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Receipt download failed");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt_booking_${bookingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}



export async function blockMyPanditDate(payload: { date: string; reason?: string }) {
  const res = await authFetch("/pandit/blocked-dates/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to block date");
  return data;
}
export async function unblockMyPanditDate(payload: { date: string }) {
  const res = await authFetch("/pandit/blocked-dates/unblock/", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to unblock date");
  return data;
}
export async function fetchMyBlockedDates(start: string, end: string): Promise<BlockedDate[]> {
  const res = await authFetch(`/pandit/blocked-dates/?start=${start}&end=${end}`, {
    method: "GET",
  });

  const data = await res.json().catch(() => ([]));
  if (!res.ok) throw new Error(data.message || "Failed to load blocked dates");
  return data;
}
export async function fetchPanditBlockedDatesPublic(
  panditId: number,
  start: string,
  end: string
): Promise<string[]> {
  const res = await fetch(
    `${BASE_URL}/pandits/${panditId}/blocked-dates/?start=${start}&end=${end}`
  );

  const data = await res.json().catch(() => ([]));
  if (!res.ok) throw new Error(data.message || "Failed to load blocked dates");
  return data; // expected: ["2026-02-03", "2026-02-07", ...]
}

// wrapper that adds Authorization header and auto-refreshes on 401
export async function authFetch(path: string, opts: RequestInit = {}) {
  const access = localStorage.getItem("accessToken");

  const headers = new Headers(opts.headers || {});
  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  // ✅ Only set JSON content-type if body is NOT FormData
  const isFormData =
    typeof FormData !== "undefined" && opts.body instanceof FormData;

  if (!isFormData && opts.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });

  // ✅ auto refresh if 401
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const access2 = localStorage.getItem("accessToken");
      if (access2) headers.set("Authorization", `Bearer ${access2}`);
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
  if (!res.ok) throw new Error(data.message || "Signup failed");

  // tokens
  if (data.access && data.refresh) {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem("userRole", data.role || "");
    localStorage.setItem("username", data.username || "");
    localStorage.setItem("userEmail", data.email || "");
  }

  // ✅ persist profile returned by backend
  if (data.profile) {
    const p = data.profile;
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        fullName: p.full_name || data.username,
        username: data.username,
        email: data.email || "",
        phone: p.phone || "",
        address: p.address || "",
        dob: p.dob || "",
        gender: p.gender || "",
        avatar: p.avatar_url || "",
      })
    );
  }

  return data;
}

export async function signinUser(credentials: SigninData) {
  const res = await fetch(`${BASE_URL}/signin/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json().catch(() => ({}));
  console.log("Signin response:", data);

  if (!res.ok) {
    throw new Error(data.message || "Signin failed");
  }

  if (!data.access || !data.refresh) {
    throw new Error("Signin failed: token missing from backend response");
  }

  // ✅ store tokens + login state
  setTokens(data.access, data.refresh);

  // ✅ store user info
  localStorage.setItem("userRole", data.role || "");
  localStorage.setItem("username", data.username || "");
  localStorage.setItem("userEmail", data.email || "");

  // ✅ create basic profile cache (optional)
  setBasicUserProfileFromAuthResponse(data);

  // ✅ notify UI
  window.dispatchEvent(new Event("auth-change"));

  return data;
}

export async function getMyProfile() {
  const res = await authFetch("/profile/", { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load profile");
  return data;
}
export async function updateMyProfile(payload: {
  full_name?: string;
  phone?: string;
  address?: string;
  dob?: string;
  gender?: string;
}) {
  const res = await authFetch("/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data; // contains updated profile + avatar_url
}

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("avatar", file);

  // IMPORTANT: do NOT set Content-Type manually for FormData
  const res = await authFetch("/profile/avatar/", {
    method: "POST",
    body: form,
    headers: {}, // let browser set multipart boundary
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Avatar upload failed");
  return data; // includes avatar_url
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
  console.log("Create booking payload:", payload); // ✅ see what you're sending

  const res = await authFetch('/bookings/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Create booking failed (status):", res.status);
    console.error("Create booking failed (data):", data);
    console.error("Create booking failed (errors):", data.errors); // ✅ important

    // show first field error nicely
    let msg = data.message || 'Failed to create booking';
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      const firstError = data.errors[firstField]?.[0];
      if (firstError) msg = `${firstField}: ${firstError}`;
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
export async function getMyPanditProfile() {
  const res = await authFetch("/pandits/me/", { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load pandit profile");
  return data; // includes is_approved
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
// For the Calender 
export async function fetchPanditBookedSlots(
  panditId: number,
  start: string,
  end: string
): Promise<BookedMap> {
  const res = await fetch(
    `${BASE_URL}/pandits/${panditId}/booked-slots/?start=${start}&end=${end}`
  );
  if (!res.ok) throw new Error("Failed to load pandit availability");
  return res.json();
}

//Payment
export async function payBooking(
  bookingId: number,
  payload: {
    method: "khalti" | "esewa";
    amount: number;
    payer_id?: string;
  }
) {
  const res = await authFetch(`/bookings/${bookingId}/pay/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Payment failed");
  return data;
}



// Dashboard
export async function fetchPanditSummary(): Promise<PanditDashboardSummary> {
  const res = await authFetch("/pandit/dashboard/summary/", { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load summary");
  return data;
}

export async function fetchPanditBookings(status?: string): Promise<PanditBooking[]> {
  const url = status
    ? `/pandit/dashboard/bookings/?status=${encodeURIComponent(status)}`
    : "/pandit/dashboard/bookings/";
  const res = await authFetch(url, { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load bookings");
  return data;
}

export async function updatePanditBookingStatus(bookingId: number, status: string) {
  const res = await authFetch(`/pandit/dashboard/bookings/${bookingId}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update status");
  return data;
}

export async function fetchPanditEarnings() {
  const res = await authFetch("/pandit/dashboard/earnings/", { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load earnings");
  return data;
}