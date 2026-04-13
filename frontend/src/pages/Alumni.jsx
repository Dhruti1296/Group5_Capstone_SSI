import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Alumni.css";

const API = "http://localhost:5277";

function Alumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch(`${API}/api/user/list?role=Alumni`);
        if (res.ok) {
          const data = await res.json();
          setAlumniList(data);
        }
      } catch (err) {
        console.error("Failed to fetch alumni:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const filtered = alumniList.filter((a) =>
    a.userName.toLowerCase().includes(search.toLowerCase()) ||
    (a.name && a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="alumni-page">
      <Navbar />

      <div className="alumni-header">
        <h2>Alumni Directory</h2>
        <p>Connect with graduates from Conestoga College</p>
        <input
          type="text"
          className="alumni-search"
          placeholder="Search by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="alumni-grid">
        {loading ? (
          <p className="alumni-empty">Loading alumni...</p>
        ) : filtered.length === 0 ? (
          <p className="alumni-empty">No alumni found.</p>
        ) : (
          filtered.map((a) => (
            <div
              key={a.userName}
              className="alumni-card"
              onClick={() => setSelectedUser(a)}
            >
              <div className="alumni-avatar">
                {a.profilePic ? (
                  <img src={a.profilePic} alt={a.userName} />
                ) : (
                  <span>{a.userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="alumni-info">
                <h3 className="alumni-name">
                  {a.name && a.surname ? `${a.name} ${a.surname}` : a.userName}
                </h3>
                {a.passedOutYear && (
                  <p className="alumni-detail">Class of {a.passedOutYear}</p>
                )}
                {a.courseName && (
                  <p className="alumni-detail">{a.courseName}</p>
                )}
                <p className="alumni-username">@{a.userName}</p>
              </div>
              <span className="alumni-view-btn">View Profile →</span>
            </div>
          ))
        )}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="profile-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={() => setSelectedUser(null)}>✕</button>

            {/* Avatar */}
            <div className="profile-modal-avatar">
              {selectedUser.profilePic ? (
                <img src={selectedUser.profilePic} alt={selectedUser.userName} />
              ) : (
                <span>{selectedUser.userName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Name */}
            <h3 className="profile-modal-name">
              {selectedUser.name && selectedUser.surname
                ? `${selectedUser.name} ${selectedUser.surname}`
                : selectedUser.userName}
            </h3>
            <p className="profile-modal-username">@{selectedUser.userName}</p>

            {/* Role badge */}
            <span className="profile-modal-badge">Alumni</span>

            {/* Details */}
            <div className="profile-modal-details">
              {selectedUser.courseName && (
                <div className="profile-modal-row">
                  <span className="profile-modal-label">🎓 Program</span>
                  <span className="profile-modal-value">{selectedUser.courseName}</span>
                </div>
              )}
              {selectedUser.passedOutYear && (
                <div className="profile-modal-row">
                  <span className="profile-modal-label">📅 Graduated</span>
                  <span className="profile-modal-value">{selectedUser.passedOutYear}</span>
                </div>
              )}
              {selectedUser.department && (
                <div className="profile-modal-row">
                  <span className="profile-modal-label">🏫 Department</span>
                  <span className="profile-modal-value">{selectedUser.department}</span>
                </div>
              )}
              {selectedUser.courseEndYear && (
                <div className="profile-modal-row">
                  <span className="profile-modal-label">📆 Graduation Year</span>
                  <span className="profile-modal-value">
                    {selectedUser.courseEndMonth} {selectedUser.courseEndYear}
                  </span>
                </div>
              )}
              {!selectedUser.courseName && !selectedUser.passedOutYear &&
                !selectedUser.department && (
                  <p className="profile-modal-empty">
                    This alumni hasn't filled in their profile details yet.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Alumni;