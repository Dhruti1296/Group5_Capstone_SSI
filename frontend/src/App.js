import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import VideoBackground from "./components/VideoBackground";
import Footer from "./components/Footer";
import MakeADifference from "./components/MakeADifference"; // ✅ new import
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <VideoBackground />

      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}

      {/* Make a Difference section */}
      <MakeADifference />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;