import React from "react";

const AlumniCard = ({ alumni }) => (
  <div className="alumni-card">
    <img src={alumni.image} alt={alumni.name} />
    <h3>{alumni.name}</h3>
    <p>Class of {alumni.year}</p>
    <p>{alumni.location}</p>
  </div>
);

export default AlumniCard;