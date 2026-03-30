import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../utils/authFetch";
import "./Alumni.css";

const API = "https://localhost:7276";

function Alumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await authFetch(`${API}/api/user/list?role=Alumni`);
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
    fetch();
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
            <div key={a.userName} className="alumni-card">
              <div className="alumni-avatar">
                {a.profilePic ? (
                  <img src={a.profilePic} alt={a.userName} />
                ) : (
                  <span>{a.userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="alumni-info">
                <h3 className="alumni-name">
                  {a.name && a.surname
                    ? `${a.name} ${a.surname}`
                    : a.userName}
                </h3>
                {a.passedOutYear && (
                  <p className="alumni-detail">Class of {a.passedOutYear}</p>
                )}
                <p className="alumni-username">@{a.userName}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Alumni;