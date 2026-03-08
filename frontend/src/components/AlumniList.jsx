// src/components/AlumniList.jsx
import React from "react";
import "./AlumniList.css";

function AlumniList() {
  const alumni = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
  ];

  return (
    <div className="alumni-list">
      <h3>Alumni Connections</h3>
      <ul>
        {alumni.map(a => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AlumniList;