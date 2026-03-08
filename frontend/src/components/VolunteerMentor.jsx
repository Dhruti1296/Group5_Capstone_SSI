// src/components/VolunteerMentor.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./VolunteerMentor.css";

function VolunteerMentor() {
  return (
    <div className="volunteer-mentor">
      <h3>Get Involved</h3>
      <Link to="/volunteer" className="vm-link">Volunteer</Link>
      <Link to="/mentor" className="vm-link">Become a Mentor</Link>
    </div>
  );
}

export default VolunteerMentor;