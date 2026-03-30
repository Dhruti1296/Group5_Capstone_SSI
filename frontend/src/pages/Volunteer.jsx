import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../utils/authFetch";
import "./Volunteer.css";


const API = "https://localhost:7276";

const opportunities = [
  {
    id: 1,
    title: "Campus Open House Helper",
    date: "March 7, 2026",
    location: "Kitchener – Doon",
    description:
      "Help prospective students navigate the campus, answer questions, and represent your program during Spring Open House.",
  },
  {
    id: 2,
    title: "Food Bank Drive Organizer",
    date: "March 15, 2026",
    location: "Cambridge Campus",
    description:
      "Coordinate donation collection points across campus and help sort and deliver food to the local community food bank.",
  },
  {
    id: 3,
    title: "International Students Welcome Team",
    date: "April 1, 2026",
    location: "Waterloo Campus",
    description:
      "Welcome new international students, help with campus orientation, and assist with settling-in activities.",
  },
  {
    id: 4,
    title: "Pow Wow Event Volunteer",
    date: "March 21, 2026",
    location: "Kitchener – Doon",
    description:
      "Support the Sixteenth Annual Traditional Pow Wow — assist with logistics, setup, and creating a welcoming environment.",
  },
];

function Volunteer() {
  const [applied, setApplied] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

const handleApply = async (opp) => {
  try {
    const res = await authFetch(`${API}/api/volunteer/apply`, {
      method: "POST",
      body: JSON.stringify({
        opportunityId: opp.id,
        opportunityTitle: opp.title,
      }),
    });

    if (res.ok) {
      setApplied((prev) => ({ ...prev, [opp.id]: true }));
      showNotification(`Applied for "${opp.title}"!`, "success");
    } else {
      const err = await res.text();
      showNotification("Failed: " + err, "error");
    }
  } catch (err) {
    showNotification("Network error: " + err.message, "error");
  }
};

  return (
    <div className="volunteer-page">
      <Navbar />

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="volunteer-header">
        <h2>Volunteer Opportunities</h2>
        <p>Give back to your community and grow your experience</p>
      </div>

      <div className="volunteer-grid">
        {opportunities.map((opp) => (
          <div key={opp.id} className="volunteer-card">
            <div className="volunteer-card-header">
              <h3>{opp.title}</h3>
              <span className="volunteer-badge">Open</span>
            </div>
            <div className="volunteer-meta">
              <span>📅 {opp.date}</span>
              <span>📍 {opp.location}</span>
            </div>
            <p className="volunteer-desc">{opp.description}</p>
            <button
              className={`volunteer-btn ${applied[opp.id] ? "applied" : ""}`}
              onClick={() => handleApply(opp)}
              disabled={applied[opp.id]}
            >
              {applied[opp.id] ? "✓ Applied" : "Apply Now"}
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Volunteer;