import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./EventDetail.css";

const API = "http://localhost:5277";

function EventDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = new URLSearchParams(location.search).get("url");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!url) {
        setError("No event URL provided.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${API}/api/events/detail?url=${encodeURIComponent(url)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        } else {
          setError("Failed to load event details.");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [url]);

  const renderDescriptionLine = (line, index) => {
    // Subheading
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h4 key={index} className="event-detail-subheading">
          {line.slice(2, -2)}
        </h4>
      );
    }
    // Bullet point
    if (line.startsWith("• ")) {
      return (
        <div key={index} className="event-detail-bullet">
          <span className="event-bullet-dot">•</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    }
    // Regular paragraph
    return (
      <p key={index} className="event-detail-para">
        {line}
      </p>
    );
  };

  return (
    <div className="event-detail-page">
      <Navbar />

      <div className="event-detail-container">
        <button
          className="event-back-btn"
          onClick={() => {
            console.log("back clicked");
            navigate("/events");
          }}
        >
          <i className="fi fi-rr-arrow-left"></i> Back to Events
        </button>

        {loading ? (
          <p className="event-detail-loading">Loading event details...</p>
        ) : error ? (
          <p className="event-detail-error">{error}</p>
        ) : event ? (
          <div className="event-detail-card">
            <h2 className="event-detail-title">{event.title}</h2>

            {/* Meta info */}
            <div className="event-detail-meta">
              {event.date && (
                <div className="event-meta-item">
                  <span className="event-meta-icon">
                    {" "}
                    <i className="fi fi-rr-calendar event-meta-icon"></i>
                  </span>
                  <span>{event.date}</span>
                </div>
              )}
              {event.time && (
                <div className="event-meta-item">
                  <span className="event-meta-icon">
                    <i className="fi fi-rr-clock event-meta-icon"></i>
                  </span>
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="event-meta-item">
                  <span className="event-meta-icon">
                    <i className="fi fi-rr-marker event-meta-icon"></i>
                  </span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="event-detail-description">
                {event.description
                  .split("\n\n")
                  .filter((line) => line.trim())
                  .map((line, i) => renderDescriptionLine(line.trim(), i))}
              </div>
            )}

            {/* Registration / external links */}
            {event.links && event.links.length > 0 && (
              <div className="event-detail-links">
                <h4 className="event-detail-subheading">Quick Links</h4>
                {event.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      link.url.includes("teams.microsoft") ||
                      link.url.includes("forms") ||
                      link.url.includes("zoom")
                        ? "event-register-btn"
                        : "event-external-link"
                    }
                  >
                    {link.text} ↗
                  </a>
                ))}
              </div>
            )}

            {/* Source link */}
            <div className="event-detail-footer">
              <a
                href={event.detailUrl}
                target="_blank"
                rel="noreferrer"
                className="event-detail-source-btn"
              >
                View on Conestoga Website ↗
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}

export default EventDetail;
