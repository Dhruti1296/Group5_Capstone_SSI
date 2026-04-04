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
            <div key={s.userName} className="students-card">
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
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Students;