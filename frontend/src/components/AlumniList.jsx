import React from "react";
import AlumniCard from "./AlumniCard";
import { alumniData } from "../mockData";

const AlumniList = () => (
  <div className="alumni-list">
    {alumniData.map((alumni, idx) => (
      <AlumniCard key={idx} alumni={alumni} />
    ))}
  </div>
);

export default AlumniList;