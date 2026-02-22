import React from "react";

const SideMenu = ({ onClose }) => (
  <div className="side-menu">
    <button className="close-btn" onClick={onClose}>✖</button>
    <div className="menu-content">
      <h2>Menu</h2>
      <ul>
        <li><a href="/alumni">Alumni Directory</a></li>
        <li><a href="/events">Events</a></li>
        <li><a href="/donate">Donate</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </div>
  </div>
);

export default SideMenu;