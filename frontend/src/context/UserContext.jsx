import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

const API = "http://localhost:5277";

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) return JSON.parse(savedUser);
  } catch {
    return null;
  }
  return null;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);
  const [authReady, setAuthReady] = useState(() => {
    const token = localStorage.getItem("token");
    return !token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthReady(true);
      return;
    }

    const savedUser = getSavedUser();

    // Skip /api/user/me for Admin — admins are not in the Users collection
    if (savedUser?.role === "Admin") {
      setAuthReady(true);
      return;
    }

    const loadFresh = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser((prev) => ({ ...prev, ...data }));
        } else {
          // Token invalid or expired — clear session
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Failed to refresh profile on load:", err);
      } finally {
        setAuthReady(true);
      }
    };

    loadFresh();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const saveToken = (token) => localStorage.setItem("token", token);
  const getToken = () => localStorage.getItem("token");

  const logout = () => {
    setUser(null);
    setAuthReady(true);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <UserContext.Provider value={{
      user, setUser,
      authReady, setAuthReady,
      saveToken, getToken,
      logout, refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
};