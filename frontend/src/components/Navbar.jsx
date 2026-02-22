import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar">
        <a href="/" className="logo">
          <img src="/images/conestoga-logo.png" alt="Conestoga Logo" />
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(true)}>
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-card drop-in">
            <button className="close-button" onClick={() => setMenuOpen(false)}>
              ✕
            </button>
            <ul className="menu-links">
              <li><a href="/">Link 1</a></li>
              <li><a href="/">Link 2</a></li>
              <li><a href="/">Link 3</a></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;