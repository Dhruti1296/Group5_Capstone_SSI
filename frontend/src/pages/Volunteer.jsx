import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../utils/authFetch";
import "./Volunteer.css";

const API = "http://localhost:5277";

function Volunteer() {
  const [opportunities, setOpportunities] = useState([]);
  const [applied, setApplied] = useState({});
  const [statuses, setStatuses] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch opportunities
        const oppRes = await fetch(`${API}/api/volunteer/opportunities`);
        if (oppRes.ok) {
          const oppsData = await oppRes.json();
          setOpportunities(oppsData);
        }

        // Fetch user's existing applications
        const appRes = await authFetch(`${API}/api/volunteer/my-applications`);
        if (appRes.ok) {
          const appsData = await appRes.json();
          const appliedMap = {};
          const statusMap = {};
          appsData.forEach((app) => {
            appliedMap[app.opportunityId] = true;
            statusMap[app.opportunityId] = app.status;
          });
          setApplied(appliedMap);
          setStatuses(statusMap);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApply = async (opp) => {
    const oppId = opp.id;
    try {
      const res = await authFetch(`${API}/api/volunteer/apply`, {
        method: "POST",
        body: JSON.stringify({
          opportunityId: oppId,
          opportunityTitle: opp.title,
        }),
      });

      if (res.ok) {
        // Immediately update UI
        setApplied((prev) => ({ ...prev, [oppId]: true }));
        setStatuses((prev) => ({ ...prev, [oppId]: "Pending" }));
        showNotification(`Applied for "${opp.title}"!`, "success");
      } else {
        const err = await res.text();
        showNotification("Failed: " + err, "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    }
  };

  const getButtonLabel = (oppId) => {
    if (!applied[oppId]) return "Apply Now";
    const status = statuses[oppId];
    if (status === "Approved") return "✓ Approved";
    if (status === "Rejected") return "✗ Rejected";
    return "✓ Applied";
  };

  const getButtonClass = (oppId) => {
    if (!applied[oppId]) return "volunteer-btn";
    const status = statuses[oppId];
    if (status === "Approved") return "volunteer-btn approved";
    if (status === "Rejected") return "volunteer-btn rejected";
    return "volunteer-btn applied";
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
        {loading ? (
          <p style={{ color: "#aaa", textAlign: "center", gridColumn: "1/-1" }}>
            Loading...
          </p>
        ) : opportunities.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", gridColumn: "1/-1" }}>
            No volunteer opportunities available right now. Check back soon!
          </p>
        ) : (
          opportunities.map((opp) => {
            const oppId = opp.id;
            const status = statuses[oppId];
            return (
              <div key={oppId} className="volunteer-card">
                <div className="volunteer-card-header">
                  <h3>{opp.title}</h3>
                  <span className="volunteer-badge">Open</span>
                </div>
                <div className="volunteer-meta">
                  <span>📅 {opp.date}</span>
                  <span>📍 {opp.location}</span>
                </div>
                <p className="volunteer-desc">{opp.description}</p>

                {/* Status banner — shows after applying */}
                {applied[oppId] && (
                  <div className={`volunteer-status-banner ${status?.toLowerCase() || "pending"}`}>
                    {status === "Approved" && "🎉 Your application has been approved!"}
                    {status === "Rejected" && "Your application was not selected this time."}
                    {status === "Pending" && "⏳ Application submitted — awaiting review"}
                  </div>
                )}

                <button
                  className={getButtonClass(oppId)}
                  onClick={() => handleApply(opp)}
                  disabled={!!applied[oppId]}
                >
                  {getButtonLabel(oppId)}
                </button>
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Volunteer;