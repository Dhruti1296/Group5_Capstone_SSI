import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../utils/authFetch";
import "./Students.css";

const API = "http://localhost:5277";

function Students() {
  const [studentList, setStudentList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await authFetch(`${API}/api/user/list?role=Student`);
        if (res.ok) {
          const data = await res.json();
          setStudentList(data);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = studentList.filter((s) =>
    s.userName.toLowerCase().includes(search.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="students-page">
      <Navbar />

      <div className="students-header">
        <h2>Student Directory</h2>
        <p>Connect with current students at Conestoga College</p>
        <input
          type="text"
          className="students-search"
          placeholder="Search by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="students-grid">
        {loading ? (
          <p className="students-empty">Loading students...</p>
        ) : filtered.length === 0 ? (
          <p className="students-empty">No students found.</p>
        ) : (
          filtered.map((s) => (
            <div
              key={s.userName}
              className="students-card"
              onClick={() => setSelectedUser(s)}
            >
              <div className="students-avatar">
                {s.profilePic ? (
                  <img src={s.profilePic} alt={s.userName} />
                ) : (
                  <span>{s.userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="students-info">
                <h3 className="students-name">
                  {s.name && s.surname
                    ? `${s.name} ${s.surname}`.trim()
                    : s.userName}
                </h3>
                {s.courseName && (
                  <p className="students-detail">{s.courseName}</p>
                )}
                {s.courseEndYear && (
                  <p className="students-detail">Graduating {s.courseEndYear}</p>
                )}
                <p className="students-username">@{s.userName}</p>
              </div>
              <span className="students-view-btn">View Profile →</span>
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
            <span className="profile-modal-badge student-badge">Student</span>

            {/* Details */}
            <div className="profile-modal-details">
              {selectedUser.courseName && (
                <div className="profile-modal-row">
                  <span className="profile-modal-label">🎓 Program</span>
                  <span className="profile-modal-value">{selectedUser.courseName}</span>
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
                  <span className="profile-modal-label">📅 Expected Graduation</span>
                  <span className="profile-modal-value">
                    {selectedUser.courseEndMonth} {selectedUser.courseEndYear}
                  </span>
                </div>
              )}
              {!selectedUser.courseName && !selectedUser.department &&
                !selectedUser.courseEndYear && (
                  <p className="profile-modal-empty">
                    This student hasn't filled in their profile details yet.
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

export default Students;