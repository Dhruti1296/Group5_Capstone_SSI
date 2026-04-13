/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./Events.css";

const API = "http://localhost:5277";
const EVENT_SERVICE = "http://localhost:5237";

function Events() {
  const [scrapedEvents, setScrapedEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [loadingScraped, setLoadingScraped] = useState(true);
  const [loadingCustom, setLoadingCustom] = useState(true);
  const [scrapedError, setScrapedError] = useState(null);
  const [activeTab, setActiveTab] = useState("conestoga");
  const navigate = useNavigate();

  // Fetch scraped Conestoga events
  useEffect(() => {
    const fetchScraped = async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setScrapedEvents(data);
        } else {
          setScrapedError("Failed to load Conestoga events.");
        }
      } catch (err) {
        setScrapedError("Network error: " + err.message);
      } finally {
        setLoadingScraped(false);
      }
    };
    fetchScraped();
  }, []);

  // Fetch custom SSI events — fails silently if microservice is down
  useEffect(() => {
    const fetchCustom = async () => {
      try {
        const res = await fetch(`${EVENT_SERVICE}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setCustomEvents(data);
        }
      } catch (err) {
        console.warn("Event microservice not available:", err.message);
      } finally {
        setLoadingCustom(false);
      }
    };
    fetchCustom();
  }, []);

  // Group scraped events by date
  const grouped = scrapedEvents.reduce((acc, event) => {
    const date = event.date || "Unknown Date";
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const handleEventClick = (event) => {
    const encoded = encodeURIComponent(event.detailUrl);
    navigate(`/events/detail?url=${encoded}`);
  };

  const formatEventDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="events-page">
      <Navbar />

      <div className="events-header">
        <h2>Conestoga Events</h2>
      </div>

      {/* Tab switcher — always visible */}
      <div className="events-tabs">
        <button
          className={
            "events-tab " + (activeTab === "conestoga" ? "active" : "")
          }
          onClick={() => setActiveTab("conestoga")}
        >
          <i className="fi fi-rr-globe"></i> Live from Conestoga
        </button>
        <button
          className={"events-tab " + (activeTab === "custom" ? "active" : "")}
          onClick={() => setActiveTab("custom")}
        >
          <i className="fi fi-sr-thumbtack"></i> SSI Events
          {customEvents.length > 0 && (
            <span className="events-tab-badge">{customEvents.length}</span>
          )}
        </button>
      </div>

      {/* Conestoga tab */}
      {activeTab === "conestoga" && (
        <>
          {loadingScraped ? (
            <p className="events-loading">Loading events from Conestoga...</p>
          ) : scrapedError ? (
            <p className="events-error">{scrapedError}</p>
          ) : (
            <>
              <p className="events-subtitle">
                Live events from{" "}
                <a
                  href="https://blogs1.conestogac.on.ca/events/"
                  target="_blank"
                  rel="noreferrer"
                  className="events-source-link"
                >
                  blogs1.conestogac.on.ca
                </a>
              </p>
              <div className="events-table-wrapper">
                <table className="events-table">
                  <thead>
                    <tr className="sr-only">
                      <th scope="col">Date/Time</th>
                      <th scope="col">Event</th>
                      <th scope="col">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(grouped).map(([date, dateEvents]) => (
                      <React.Fragment key={date}>
                        <tr className="date-row">
                          <th colSpan="3">{date}</th>
                        </tr>
                        {dateEvents.map((event, i) => (
                          <tr key={i} className="event-row">
                            <td className="event-time">{event.time}</td>
                            <td>
                              <button
                                className="event-link-btn"
                                onClick={() => handleEventClick(event)}
                              >
                                {event.title}
                              </button>
                            </td>
                            <td className="event-location">{event.location}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* SSI Events tab */}
      {activeTab === "custom" && (
        <>
          {loadingCustom ? (
            <p className="events-loading">Loading SSI events...</p>
          ) : customEvents.length === 0 ? (
            <div className="events-empty">
              <p>No SSI events posted yet. Check back soon!</p>
            </div>
          ) : (
            <div className="custom-events-grid">
              {customEvents.map((event) => (
                <div key={event.id} className="custom-event-card">
                  {event.imageUrl && (
                    <div className="custom-event-image">
                      <img
                        src={`${EVENT_SERVICE}${event.imageUrl}`}
                        alt={event.title}
                      />
                    </div>
                  )}
                  <div className="custom-event-body">
                    {event.type && (
                      <span className="custom-event-type">{event.type}</span>
                    )}
                    <h3 className="custom-event-title">{event.title}</h3>
                    <p className="custom-event-desc">{event.description}</p>
                    <div className="custom-event-meta">
                      <span>
                        <i className="fi fi-rr-calendar"></i>{" "}
                        {formatEventDate(event.eventDate)}
                      </span>
                      {event.location && (
                        <span>
                          <i className="fi fi-rr-marker"></i> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

export default Events;
