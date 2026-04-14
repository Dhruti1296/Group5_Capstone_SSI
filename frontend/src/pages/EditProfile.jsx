import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./EditProfile.css";

const API = "https://localhost:7276";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profilePic: "",
    name: "",
    surname: "",
    courseName: "",
    courseEndMonth: "",
    courseEndYear: "",
    department: "",
    passedOutYear: "",
    currentJob: "",
    company: "",
    linkedIn: "",
  });

  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pre-fill form from context on mount
  useEffect(() => {
    if (user) {
      setFormData({
        profilePic: user.profilePic || "",
        name: user.name || "",
        surname: user.surname || "",
        courseName: user.courseName || "",
        courseEndMonth: user.courseEndMonth || "",
        courseEndYear: user.courseEndYear || "",
        department: user.department || "",
        passedOutYear: user.passedOutYear || "",
        currentJob: user.currentJob || "",
        company: user.company || "",
        linkedIn: user.linkedIn || "",
      });
    }
  }, [user]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Convert uploaded image file to base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files?.length > 0) {
      const base64 = await toBase64(files[0]);
      setFormData((prev) => ({ ...prev, profilePic: base64 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await authFetch(`${API}/api/user/me`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          profilePic: formData.profilePic || null,
          courseName: formData.courseName || null,
          courseEndMonth: formData.courseEndMonth || null,
          courseEndYear: formData.courseEndYear || null,
          department: formData.department || null,
          passedOutYear: formData.passedOutYear || null,
          currentJob: formData.currentJob || null,
          company: formData.company || null,
          linkedIn: formData.linkedIn || null,
        }),
      });

      if (res.ok) {
        const updated = await res.json();

        // Sync context so Navbar + Dashboard reflect changes instantly
        setUser((prev) => ({
          ...prev,
          name: updated.name,
          surname: updated.surname,
          profilePic: updated.profilePic,
          courseName: updated.courseName,
          courseEndMonth: updated.courseEndMonth,
          courseEndYear: updated.courseEndYear,
          department: updated.department,
          passedOutYear: updated.passedOutYear,
          currentJob: updated.currentJob,
          company: updated.company,
          linkedIn: updated.linkedIn,
        }));

        showNotification("Profile updated successfully!", "success");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const err = await res.text();
        showNotification("Update failed: " + err, "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-body">
      <Navbar />

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="edit-profile-page">
        <h2>Edit Profile</h2>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <label>
            Profile Picture:
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          {formData.profilePic && (
            <img
              src={formData.profilePic}
              alt="Preview"
              className="profile-preview"
            />
          )}

          {/* Name & Surname */}
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First name"
            />
          </label>
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Last name"
            />
          </label>

          {/* Role-specific fields — read from context since role can't be edited */}
          {user?.role === "Student" && (
            <>
              <label>
                Course Name:
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Course End Month:
                <input
                  type="text"
                  name="courseEndMonth"
                  value={formData.courseEndMonth}
                  onChange={handleChange}
                  placeholder="e.g. April"
                />
              </label>
              <label>
                Course End Year:
                <input
                  type="text"
                  name="courseEndYear"
                  value={formData.courseEndYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                />
              </label>
            </>
          )}

          {user?.role === "Alumni" && (
            <>
              <label>
                Passed Out Year:
                <input
                  type="text"
                  name="passedOutYear"
                  value={formData.passedOutYear}
                  onChange={handleChange}
                  placeholder="e.g. 2023"
                />
              </label>
              <label>
                Current Job Title:
                <input
                  type="text"
                  name="currentJob"
                  value={formData.currentJob}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                />
              </label>
              <label>
                Company:
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                />
              </label>
              <label>
                LinkedIn URL:
                <input
                  type="text"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourname"
                />
              </label>
            </>
          )}

          <button type="submit" className="update-btn" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;
