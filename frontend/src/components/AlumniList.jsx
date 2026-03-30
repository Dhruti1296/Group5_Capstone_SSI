import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import "./AlumniList.css";

const API = "http://localhost:5277";

function AlumniList() {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await authFetch(`${API}/api/user/list?role=Alumni`);
        if (res.ok) {
          const data = await res.json();
          setAlumni(data.slice(0, 5)); // show top 5
        }
      } catch (err) {
        console.error("Failed to fetch alumni:", err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="alumni-list">
      <h3>Alumni Connections</h3>
      {alumni.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: "0.8rem" }}>No alumni yet.</p>
      ) : (
        <ul>
          {alumni.map((a) => (
            <li key={a.userName}>
              {a.name ? `${a.name} ${a.surname || ""}`.trim() : a.userName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlumniList;