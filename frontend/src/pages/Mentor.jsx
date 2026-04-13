import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import "./Mentor.css";

const API = "http://localhost:5277";

function Mentor() {
  const { user } = useContext(UserContext);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState({});
  const [hasActiveMentor, setHasActiveMentor] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, activeRes] = await Promise.all([
          authFetch(`${API}/api/mentor`),
          authFetch(`${API}/api/mentorship/my-mentor`),
        ]);
        if (mRes.ok) setMentors(await mRes.json());
        if (activeRes.ok) setHasActiveMentor(true);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRequest = async (mentor) => {
    if (hasActiveMentor) {
      showNotification("You already have an active mentor.", "error");
      return;
    }
    try {
      const res = await authFetch(`${API}/api/mentorship/request`, {
        method: "POST",
        body: JSON.stringify({
          mentorUserName: mentor.userName,
          mentorName: mentor.name,
          studentName: user?.name || user?.userName,
        }),
      });
      if (res.ok) {
        setRequested((prev) => ({ ...prev, [mentor.id]: true }));
        showNotification(
          `Mentorship request sent to ${mentor.name}!`,
          "success",
        );
      } else {
        const err = await res.text();
        showNotification(err || "Failed to send request.", "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    }
  };

  const renderLinkedIn = (url) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mentor-linkedin"
      >
        <i className="fi fi-brands-linkedin"></i> LinkedIn
      </a>
    );
  };

  return (
    <div className="mentor-page">
      <Navbar />

      {notification && (
        <div className={"notification " + notification.type}>
          {notification.message}
        </div>
      )}

      <div className="mentor-header">
        <h2>Find a Mentor</h2>
        <p>Connect with alumni who have been where you are</p>
        {hasActiveMentor && (
          <div className="active-mentor-banner">
            You already have an active mentor. Go to your dashboard to chat.
          </div>
        )}
      </div>

      <div className="mentor-grid">
        {loading ? (
          <p style={{ color: "#aaa", textAlign: "center", gridColumn: "1/-1" }}>
            Loading mentors...
          </p>
        ) : mentors.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", gridColumn: "1/-1" }}>
            No mentors available yet. Check back soon!
          </p>
        ) : (
          mentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-avatar">{mentor.name.charAt(0)}</div>
              <div className="mentor-info">
                <h3 className="mentor-name">{mentor.name}</h3>
                <p className="mentor-role">{mentor.role}</p>
                {mentor.passedOutYear && (
                  <p className="mentor-year">Class of {mentor.passedOutYear}</p>
                )}
                <p className="mentor-bio">{mentor.bio}</p>
                <div className="mentor-tags">
                  {mentor.expertise?.map((tag) => (
                    <span key={tag} className="mentor-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {renderLinkedIn(mentor.linkedin)}
                <button
                  className={
                    "mentor-btn " + (requested[mentor.id] ? "requested" : "")
                  }
                  onClick={() => handleRequest(mentor)}
                  disabled={requested[mentor.id] || hasActiveMentor}
                >
                  {requested[mentor.id]
                    ? "✓ Request Sent"
                    : "Request Mentorship"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Mentor;
