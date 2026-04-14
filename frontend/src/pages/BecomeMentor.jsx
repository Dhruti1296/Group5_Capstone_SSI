import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import "./BecomeMentor.css";

const API = "http://localhost:5277";

const EXPERTISE_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Data Science & AI",
  "Business & Entrepreneurship",
  "Healthcare & Life Sciences",
  "Skilled Trades",
  "Hospitality & Culinary",
  "Design & Media",
  "Career Guidance",
  "Job Interviews",
  "Networking",
  "Leadership",
  "Research & Academia",
  "Finance & Accounting",
  "Community Service",
];

function BecomeMentor() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    passedOutYear: "",
    bio: "",
    expertise: [],
    email: "",
    linkedin: "",
  });

  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);
  const [application, setApplication] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name
          ? `${user.name} ${user.surname || ""}`.trim()
          : user.userName,
        passedOutYear: user.passedOutYear || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const res = await authFetch(`${API}/api/mentor/my-application`);
        if (res.ok) {
          const data = await res.json();
          setApplication(data);
        }
      } catch (err) {
      } finally {
        setChecking(false);
      }
    };
    checkApplication();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExpertise = (tag) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(tag)
        ? prev.expertise.filter((t) => t !== tag)
        : [...prev.expertise, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification("Name is required.", "error");
      return;
    }
    if (!formData.role.trim()) {
      showNotification("Your role/field is required.", "error");
      return;
    }
    if (!formData.bio.trim() || formData.bio.length < 30) {
      showNotification("Bio must be at least 30 characters.", "error");
      return;
    }
    if (formData.expertise.length === 0) {
      showNotification("Select at least one area of expertise.", "error");
      return;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification("Enter a valid email address.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch(`${API}/api/mentor/apply`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          passedOutYear: formData.passedOutYear,
          bio: formData.bio,
          expertise: formData.expertise,
          email: formData.email,
          linkedin: formData.linkedin,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        showNotification(
          "Application submitted! You will be notified once reviewed.",
          "success",
        );
      } else {
        const err = await res.text();
        showNotification("Failed: " + err, "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const renderStatusScreen = () => {
    const status = application?.status || "Pending";
    const config = {
      Approved: {
        icon: <i className="fi fi-sr-check-circle"></i>,
        colorClass: "status-approved",
        title: "Application Approved!",
        message:
          "Congratulations! You are now listed in the mentor directory. Students will be able to find and reach out to you.",
      },
      Rejected: {
        icon: <i className="fi fi-sr-cross-circle"></i>,
        colorClass: "status-rejected",
        title: "Application Not Approved",
        message:
          "Unfortunately your application was not approved at this time. Please contact the admin for more details.",
      },
      Pending: {
        icon: <i className="fi fi-rr-hourglass"></i>,
        colorClass: "status-pending",
        title: "Application Under Review",
        message:
          "Your application has been submitted and is currently being reviewed by the admin. You will be notified once a decision is made.",
      },
    };

    const c = config[status] || config.Pending;

    return (
      <div className={`already-applied ${c.colorClass}`}>
        <div className="status-icon">{c.icon}</div>
        <h3>{c.title}</h3>
        <p>{c.message}</p>

        {application && (
          <div className="submitted-details">
            <h4>Your Submitted Details</h4>
            <p>
              <strong>Name:</strong> {application.name}
            </p>
            <p>
              <strong>Role:</strong> {application.role}
            </p>
            {application.passedOutYear && (
              <p>
                <strong>Graduation Year:</strong> {application.passedOutYear}
              </p>
            )}
            <p>
              <strong>Bio:</strong> {application.bio}
            </p>
            <div className="submitted-tags">
              {application.expertise?.map((tag) => (
                <span key={tag} className="expertise-tag selected">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="update-btn" onClick={() => navigate("/dashboard")}>
          <i className="fi fi-rr-arrow-left"></i> Back to Dashboard
        </button>
      </div>
    );
  };

  if (checking) {
    return (
      <div className="become-mentor-body">
        <Navbar />
        <div className="become-mentor-loading">
          <i className="fi fi-rr-spinner"></i> Loading...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="become-mentor-body">
      <Navbar />

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="become-mentor-page">
        <h2>
          <i className="fi fi-rr-star"></i> Become a Mentor
        </h2>
        <p className="become-mentor-subtitle">
          Share your journey and help current students navigate college life and
          their careers.
        </p>

        {application ? (
          renderStatusScreen()
        ) : (
          <form className="become-mentor-form" onSubmit={handleSubmit}>
            <label>
              <span className="label-text">
                <i className="fi fi-rr-user"></i> Full Name
                <span className="required">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Mitchell"
              />
            </label>

            <label>
              <span className="label-text">
                <i className="fi fi-rr-briefcase"></i> Your Role / Field
                <span className="required">*</span>
              </span>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Alumni – Software Engineering"
              />
            </label>

            <label>
              <span className="label-text">
                <i className="fi fi-rr-graduation-cap"></i> Year of Graduation
              </span>
              <input
                type="text"
                name="passedOutYear"
                value={formData.passedOutYear}
                onChange={handleChange}
                placeholder="e.g. 2021"
              />
            </label>

            <label>
              <span className="label-text">
                <i className="fi fi-rr-envelope"></i> Contact Email
                <span className="required">*</span>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </label>

            <label>
              <span className="label-text">
                <i className="fi fi-brands-linkedin"></i> LinkedIn Profile URL
              </span>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </label>

            <label>
              <span className="label-text">
                <i className="fi fi-rr-document"></i> Bio
                <span className="required">*</span>
              </span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell students about your journey, your current work, and what kind of mentorship you can offer. (min. 30 characters)"
                rows={5}
              />
              <span className="char-count">
                {formData.bio.length} characters
              </span>
            </label>

            <div className="expertise-section">
              <span className="expertise-label">
                <i className="fi fi-rr-tags"></i> Areas of Expertise
                <span className="required">*</span>
              </span>
              <p className="expertise-hint">Select all that apply</p>
              <div className="expertise-tags">
                {EXPERTISE_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`expertise-tag ${formData.expertise.includes(tag) ? "selected" : ""}`}
                    onClick={() => toggleExpertise(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="update-btn" disabled={saving}>
              {saving ? (
                <>
                  <i className="fi fi-rr-spinner"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fi fi-rr-paper-plane"></i> Submit Application
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BecomeMentor;
