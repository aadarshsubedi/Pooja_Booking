import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("accessToken");

    // not logged in → go signin
    if (!access) {
      navigate("/signin", { replace: true });
      return;
    }

    const role = (localStorage.getItem("userRole") || "").toLowerCase();

    // ✅ IMPORTANT: your pandit dashboard route is /pandit/dashboard
    if (role === "pandit") {
      navigate("/pandit/dashboard", { replace: true });
    } else {
      navigate("/userprofile", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default ProfileRouter;
