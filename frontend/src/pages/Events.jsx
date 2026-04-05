/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./Events.css";

const API = "http://localhost:5277";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          setError("Failed to load events.");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Group events by date
  const grouped = events.reduce((acc, event) => {
    const date = event.date || "Unknown Date";
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const handleEventClick = (event) => {
    // Encode the detail URL and navigate to event detail page
    const encoded = encodeURIComponent(event.detailUrl);
    navigate(`/events/detail?url=${encoded}`);
  };

  return (
    <div className="events-page">
      <Navbar />
      <div className="events-header">
        <h2>Conestoga Events</h2>
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
      </div>

      {loading ? (
        <p className="events-loading">Loading events from Conestoga...</p>
      ) : error ? (
        <p className="events-error">{error}</p>
      ) : (
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
      )}

      <Footer />
    </div>
  );
}

export default Events;