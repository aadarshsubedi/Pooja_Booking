// // src/components/Navbar.tsx
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "./Navbar.css";
// import { AuthContext } from "../contexts/AuthContext";

// const DEFAULT_AVATAR = "/images/profile.jpg";

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useContext(AuthContext);

//   const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);

//   // ✅ Sync avatar from localStorage (userProfile.avatar)
//   useEffect(() => {
//     const syncAvatar = () => {
//       try {
//         const stored = localStorage.getItem("userProfile");
//         if (!stored) {
//           setAvatar(DEFAULT_AVATAR);
//           return;
//         }
//         const p = JSON.parse(stored);
//         setAvatar(p?.avatar || DEFAULT_AVATAR);
//       } catch {
//         setAvatar(DEFAULT_AVATAR);
//       }
//     };

//     syncAvatar();

//     // ✅ update avatar immediately when signin/signup/logout/avatar upload happens
//     window.addEventListener("auth-change", syncAvatar);
//     return () => window.removeEventListener("auth-change", syncAvatar);
//   }, []);

//   // ✅ Route based on role (if you want pandit dashboard)
//   const handleProfileClick = () => {
//     const role = (localStorage.getItem("userRole") || "").toLowerCase();
//     if (role === "pandit") navigate("/pandit-dashboard");
//     else navigate("/userprofile");
//   };

//   return (
//     <nav className="navbar">
//       {/* LOGO */}
//       <div className="logo" onClick={() => navigate("/home")}>
//         <img src="/images/logo.png" alt="Pooja Booking" />
//       </div>

//       {/* NAV LINKS */}
//       <ul className="nav-links">
//         <li>
//           <Link to="/home">
//             <img src="/images/home.png" className="nav-icon" /> Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/poojas">
//             <img src="/images/poojas.png" className="nav-icon" /> Poojas
//           </Link>
//         </li>
//         <li>
//           <Link to="/pandits">
//             <img src="/images/pandits.png" className="nav-icon" /> Pandits
//           </Link>
//         </li>
//         <li>
//           <Link to="/aboutus">
//             <img src="/images/aboutus.png" className="nav-icon" /> About Us
//           </Link>
//         </li>
//       </ul>

//       {/* RIGHT SIDE */}
//       <div className="nav-buttons">
//         {!isAuthenticated ? (
//           <>
//             <button className="signup" onClick={() => navigate("/signup")}>
//               Sign Up
//             </button>
//             <button className="signin" onClick={() => navigate("/signin")}>
//               Sign In
//             </button>
//           </>
//         ) : (
//           <button
//             className="profile-avatar"
//             type="button"
//             title={user?.username || "Profile"}
//             onClick={handleProfileClick}
//           >
//             <img src={avatar} alt="Profile" />
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [avatar, setAvatar] = useState("/images/profile.jpg");

  useEffect(() => {
    const syncAvatar = () => {
      const stored = localStorage.getItem("userProfile");
      if (!stored) {
        setAvatar("/images/profile.jpg");
        return;
      }
      try {
        const p = JSON.parse(stored);
        setAvatar(p?.avatar || "/images/profile.jpg");
      } catch {
        setAvatar("/images/profile.jpg");
      }
    };

    syncAvatar();
    window.addEventListener("auth-change", syncAvatar);
    return () => window.removeEventListener("auth-change", syncAvatar);
  }, []);

  // const handleProfileClick = () => {
  //   navigate("/profile"); // ✅ ONLY THIS (role decision happens in ProfileRouter)
  // };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        <img src="/images/logo.png" alt="Pooja Booking" />
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/home">
            <img src="/images/home.png" className="nav-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/poojas">
            <img src="/images/poojas.png" className="nav-icon" /> Poojas
          </Link>
        </li>
        <li>
          <Link to="/pandits">
            <img src="/images/pandits.png" className="nav-icon" /> Pandits
          </Link>
        </li>
        <li>
          <Link to="/aboutus">
            <img src="/images/aboutus.png" className="nav-icon" /> About Us
          </Link>
        </li>
      </ul>

      <div className="nav-buttons">
        {!isAuthenticated ? (
          <>
            <button className="signup" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className="signin" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          </>
        ) : (
          <button
            className="profile-avatar"
            type="button"
            title={user?.username || "Profile"}
            onClick={() => navigate("/profile")}
          >
            <img src={avatar} alt="Profile" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

