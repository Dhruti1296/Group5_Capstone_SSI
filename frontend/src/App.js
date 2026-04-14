import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import VideoBackground from "./components/VideoBackground";
import Footer from "./components/Footer";
import MakeADifference from "./components/MakeADifference";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import News from "./pages/News";
import Events from "./pages/Events";
import Alumni from "./pages/Alumni";
import Volunteer from "./pages/Volunteer";
import Mentor from "./pages/Mentor";
import BecomeMentor from "./pages/BecomeMentor";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import About from "./pages/About";

import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Chat from "./pages/Chat";
import Students from "./pages/Students";
import EventDetail from "./pages/EventDetail";
import NewsDetail from "./pages/NewsDetail";

import "./App.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <VideoBackground />
                  <MakeADifference />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/detail" element={<NewsDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/detail" element={<EventDetail />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer"
              element={
                <ProtectedRoute>
                  <Volunteer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor"
              element={
                <ProtectedRoute>
                  <Mentor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/become-mentor"
              element={
                <ProtectedRoute>
                  <BecomeMentor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:roomId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
