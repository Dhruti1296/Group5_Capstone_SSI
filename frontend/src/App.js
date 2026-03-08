import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import VideoBackground from "./components/VideoBackground";
import Footer from "./components/Footer";
import MakeADifference from "./components/MakeADifference";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; 

import { UserProvider } from "./context/UserContext"; 
import ProtectedRoute from "./routes/ProtectedRoute";


import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar onMenuClick={() => setMenuOpen(true)} />

          <Routes>
            {/* Home page */}
            <Route
              path="/"
              element={
                <>
                  <VideoBackground />
                  {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
                  <MakeADifference />
                  <Footer />
                </>
              }
            />

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Register page */}
            <Route path="/register" element={<Register />} />

            {/* Dashboard page */}
           
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />


          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;