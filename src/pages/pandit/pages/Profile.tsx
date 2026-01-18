import React, { useEffect, useState } from "react";
import "./PanditProfile.css";
import { saveMyPanditProfile } from "../../../api/Api"; // ✅ correct relative path

type PanditProfileForm = {
  full_name: string;
  city: string;
  experience_years: number;
  bio: string;
  specializations: string; // comma-separated string
  image_url: string;
  is_approved?: boolean;
};

const PanditProfile: React.FC = () => {
  const [form, setForm] = useState<PanditProfileForm>({
    full_name: "",
    city: "",
    experience_years: 0,
    bio: "",
    specializations: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Load existing profile (same endpoint works with partial)
  useEffect(() => {
    const init = async () => {
      try {
        // Trick: calling saveMyPanditProfile({}) will return current profile
        // If your backend doesn't accept empty POST, I’ll show a GET endpoint alternative.
        const data = await saveMyPanditProfile({});
        setForm({
          full_name: data.full_name || "",
          city: data.city || "",
          experience_years: data.experience_years || 0,
          bio: data.bio || "",
          specializations: data.specializations || "",
          image_url: data.image_url || "",
          is_approved: data.is_approved,
        });
      } catch (e) {
        // If backend rejects empty payload, just keep blank form
        console.log("Profile load failed, showing empty form", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        full_name: form.full_name,
        city: form.city,
        experience_years: Number(form.experience_years),
        bio: form.bio,
        specializations: form.specializations,
        image_url: form.image_url,
      };

      const updated = await saveMyPanditProfile(payload);
      setForm((prev) => ({
        ...prev,
        is_approved: updated.is_approved,
      }));

      alert(
        updated.is_approved
          ? "✅ Profile updated (Approved)."
          : "✅ Profile saved. Waiting for admin approval."
      );
    } catch (err: any) {
      alert(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="pandit-profile-loading">Loading...</p>;

  return (
    <div className="pandit-profile-page">
      <div className="pandit-profile-card">
        <div className="pandit-profile-header">
          <h2>Pandit Profile</h2>
          <span
            className={
              form.is_approved ? "status-pill approved" : "status-pill pending"
            }
          >
            {form.is_approved ? "Approved" : "Pending Approval"}
          </span>
        </div>

        {/* Preview */}
        <div className="pandit-preview">
          <img
            className="pandit-avatar"
            src={form.image_url || "/images/pandit-default.png"}
            alt="Pandit"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/pandit-default.png";
            }}
          />
          <div className="pandit-preview-text">
            <h3>{form.full_name || "Your Name"}</h3>
            <p>{form.city ? `📍 ${form.city}` : "📍 City not set"}</p>
            <p>🧘 Experience: {form.experience_years || 0} years</p>
          </div>
        </div>

        {/* Form */}
        <div className="pandit-form-grid">
          <div className="field">
            <label>Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="e.g., Ram Sharma"
            />
          </div>

          <div className="field">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g., Kathmandu"
            />
          </div>

          <div className="field">
            <label>Experience (years)</label>
            <input
              name="experience_years"
              type="number"
              value={form.experience_years}
              onChange={handleChange}
              min={0}
            />
          </div>

          <div className="field">
            <label>Image URL</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="Paste image link (optional)"
            />
          </div>

          <div className="field full">
            <label>Specializations (comma separated)</label>
            <input
              name="specializations"
              value={form.specializations}
              onChange={handleChange}
              placeholder="e.g., Bratabandha, Satyanarayan, Wedding"
            />
            <small className="hint">
              Use commas: Bratabandha, Chaurasi, Griha Pravesh
            </small>
          </div>

          <div className="field full">
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short bio..."
              rows={4}
            />
          </div>
        </div>

        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default PanditProfile;
