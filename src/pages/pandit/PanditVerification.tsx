
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./PanditVerification.css";
// import { saveMyPanditProfile } from "../../api/Api"; // ✅ adjust path if needed

// const PanditVerification: React.FC = () => {
//   const navigate = useNavigate();

//   // ✅ Form state
//   const [fullName, setFullName] = useState("");
//   const [city, setCity] = useState("");
//   const [experience, setExperience] = useState<number>(0);
//   const [bio, setBio] = useState("");
//   const [email, setEmail] = useState(""); // optional (your PanditProfile doesn’t store email)
//   const [phone, setPhone] = useState(""); // optional (your PanditProfile doesn’t store phone)
//   const [address, setAddress] = useState(""); // optional (your PanditProfile doesn’t store address)

//   // ✅ Specializations
//   const [specs, setSpecs] = useState<string[]>([]);
//   const toggleSpec = (name: string) => {
//     setSpecs((prev) =>
//       prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
//     );
//   };

//   const [agreed, setAgreed] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   /* 🔐 HARD GUARD */
//   useEffect(() => {
//     const role = (localStorage.getItem("userRole") || "").toLowerCase();
//     if (role !== "pandit") {
//       navigate("/home", { replace: true });
//     }
//   }, [navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!agreed) {
//       alert("Please accept terms & conditions");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // ✅ Send only what exists in your PanditProfile model
//       const payload = {
//         full_name: fullName,
//         city: city,
//         experience_years: experience,
//         bio: bio,
//         specializations: specs.join(","), // backend expects comma-separated string
//       };

//       const saved = await saveMyPanditProfile(payload);

//       // saved.is_approved comes from backend
//       if (saved?.is_approved) {
//         alert("✅ Approved! Welcome to your dashboard.");
//         navigate("/pandit/dashboard", { replace: true });
//       } else {
//         alert("✅ Submitted! Waiting for admin approval.");
//         navigate("/home", { replace: true });
//       }
//     } catch (err: any) {
//       alert(err?.message || "Failed to submit verification");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="pandit-verify-page">
//       <div className="pandit-verify-container">
//         <h1>Pandit Registration & Verification</h1>
//         <p className="subtitle">Submit your details for official verification</p>

//         <form onSubmit={handleSubmit}>
//           {/* PERSONAL INFO */}
//           <div className="verify-section">
//             <h3>Personal Information</h3>
//             <div className="verify-grid">
//               <input
//                 className="verify-input"
//                 placeholder="Full Name"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 required
//               />

//               {/* These 2 are not in PanditProfile model currently (optional UI only) */}
//               <input
//                 className="verify-input"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <input
//                 className="verify-input"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* ADDRESS */}
//           <div className="verify-section">
//             <h3>Address Details</h3>
//             <div className="verify-grid">
//               <input
//                 className="verify-input"
//                 placeholder="Full Address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//               <input
//                 className="verify-input"
//                 placeholder="City"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//               />
//               <input className="verify-input" placeholder="State" />
//             </div>
//           </div>

//           {/* PROFESSIONAL */}
//           <div className="verify-section">
//             <h3>Professional Details</h3>
//             <div className="verify-grid">
//               <input className="verify-input" placeholder="Temple Affiliation" />

//               <select
//                 className="verify-select"
//                 value={experience}
//                 onChange={(e) => setExperience(Number(e.target.value))}
//               >
//                 <option value={0}>Years of Experience</option>
//                 <option value={2}>1–3</option>
//                 <option value={4}>3–5</option>
//                 <option value={6}>5+</option>
//               </select>
//             </div>

//             <textarea
//               className="verify-textarea"
//               placeholder="Vedic Education & Training"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             />
//           </div>

//           {/* SPECIALIZATIONS */}
//           <div className="verify-section">
//             <h3>Specializations</h3>
//             <div className="specialization-grid">
//               <label className="specialization-item">
//                 <input
//                   type="checkbox"
//                   checked={specs.includes("Grih Pravesh")}
//                   onChange={() => toggleSpec("Grih Pravesh")}
//                 />
//                 Grih Pravesh
//               </label>

//               <label className="specialization-item">
//                 <input
//                   type="checkbox"
//                   checked={specs.includes("Vivah Sanskar")}
//                   onChange={() => toggleSpec("Vivah Sanskar")}
//                 />
//                 Vivah Sanskar
//               </label>

//               <label className="specialization-item">
//                 <input
//                   type="checkbox"
//                   checked={specs.includes("Satyanarayan Katha")}
//                   onChange={() => toggleSpec("Satyanarayan Katha")}
//                 />
//                 Satyanarayan Katha
//               </label>
//             </div>
//           </div>

//           {/* DOCUMENTS (we'll connect later if you want real upload) */}
//           <div className="verify-section">
//             <h3>Documents</h3>
//             <div className="upload-box">
//               <p>Upload ID Proof, Certificates, or Authorization Letters</p>
//               <input type="file" multiple disabled />
//               <small>Document upload not connected yet.</small>
//             </div>
//           </div>

//           {/* TERMS */}
//           <div className="verify-terms">
//             <input
//               type="checkbox"
//               checked={agreed}
//               onChange={() => setAgreed(!agreed)}
//             />
//             <span>I agree to the terms & conditions</span>
//           </div>

//           {/* SUBMIT */}
//           <button type="submit" className="verify-submit" disabled={submitting}>
//             {submitting ? "Submitting..." : "Submit for Verification"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PanditVerification;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PanditVerification.css";
import { saveMyPanditProfile } from "../../api/Api"; // ✅ correct path for src/pages/pandit/...

type ApiPanditProfile = {
  id?: number;
  full_name?: string;
  city?: string;
  experience_years?: number;
  bio?: string;
  specializations?: string;
  is_approved?: boolean;
};

const ALL_SPECS = ["Grih Pravesh", "Vivah Sanskar", "Satyanarayan Katha"];

const PanditVerification: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Form state (ONLY fields that exist in PanditProfile model)
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [bio, setBio] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const role = useMemo(
    () => (localStorage.getItem("userRole") || "").toLowerCase(),
    []
  );

  const toggleSpec = (name: string) => {
    setSpecs((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  // ✅ Guard + (optional) preload existing profile
  useEffect(() => {
    const access = localStorage.getItem("accessToken");

    // must be logged in
    if (!access) {
      navigate("/signin", { replace: true });
      return;
    }

    // only pandit can access
    if (role !== "pandit") {
      navigate("/home", { replace: true });
      return;
    }

    // ✅ If you want preload: call backend using saveMyPanditProfile with partial? (Not ideal)
    // Better: create a GET endpoint /api/pandits/me/ (recommended)
    // For now: just stop loading.
    setLoading(false);
  }, [navigate, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please accept terms & conditions");
      return;
    }

    if (!fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    if (experienceYears < 0) {
      alert("Experience years cannot be negative.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: ApiPanditProfile = {
        full_name: fullName.trim(),
        city: city.trim(),
        experience_years: Number(experienceYears) || 0,
        bio: bio.trim(),
        specializations: specs.join(","), // ✅ backend expects comma-separated string
      };

      const saved = (await saveMyPanditProfile(payload)) as ApiPanditProfile;

      // ✅ use backend approval flag
      if (saved?.is_approved) {
        alert("✅ Approved! Welcome to your dashboard.");
        navigate("/pandit/dashboard", { replace: true });
      } else {
        alert("✅ Submitted! Waiting for admin approval.");
        // you can keep them here or send them home
        navigate("/home", { replace: true });
      }
    } catch (err: any) {
      alert(err?.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div className="pandit-verify-page">
      <div className="pandit-verify-container">
        <h1>Pandit Registration & Verification</h1>
        <p className="subtitle">Submit your details for official verification</p>

        <form onSubmit={handleSubmit}>
          {/* PERSONAL INFO */}
          <div className="verify-section">
            <h3>Personal Information</h3>
            <div className="verify-grid">
              <input
                className="verify-input"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="verify-section">
            <h3>Location</h3>
            <div className="verify-grid">
              <input
                className="verify-input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* PROFESSIONAL */}
          <div className="verify-section">
            <h3>Professional Details and Experience</h3>
            <div className="verify-grid">
              <input
                className="verify-input"
                type="number"
                min={0}
                placeholder="Years of Experience"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>

            <textarea
              className="verify-textarea"
              placeholder="Bio / Vedic Education & Training"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* SPECIALIZATIONS */}
          <div className="verify-section">
            <h3>Specializations</h3>
            <div className="specialization-grid">
              {ALL_SPECS.map((s) => (
                <label key={s} className="specialization-item">
                  <input
                    type="checkbox"
                    checked={specs.includes(s)}
                    onChange={() => toggleSpec(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* DOCUMENTS (UI only for now) */}
          <div className="verify-section">
            <h3>Documents</h3>
            <div className="upload-box">
              <p>Upload ID Proof / Certificates (not connected yet)</p>
              <input type="file" multiple disabled />
              <small>Backend file upload not wired for PanditProfile yet.</small>
            </div>
          </div>

          {/* TERMS */}
          <div className="verify-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed((v) => !v)}
            />
            <span>I agree to the terms & conditions</span>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="verify-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PanditVerification;
