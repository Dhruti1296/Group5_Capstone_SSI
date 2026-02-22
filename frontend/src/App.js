import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import VideoBackground from "./components/VideoBackground";
import AlumniList from "./components/AlumniList";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <VideoBackground />
      
      {/* Side Menu */}
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}

      {/* Alumni Cards */}
      <AlumniList />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;