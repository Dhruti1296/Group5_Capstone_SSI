import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { authFetch } from "../../utils/authFetch";
import "./AdminDashboard.css";

const API = "http://localhost:5277";

function AdminDashboard() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mentors");
  const [mentorFilter, setMentorFilter] = useState("All");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");

  const [mentors, setMentors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const filteredMentors = mentors.filter((m) => {
    if (mentorFilter === "All") return true;
    return (m.status || "Pending") === mentorFilter;
  });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, vRes, uRes, pRes] = await Promise.all([
          authFetch(`${API}/api/admin/mentor-applications`),
          authFetch(`${API}/api/admin/volunteer-applications`),
          authFetch(`${API}/api/admin/users`),
          authFetch(`${API}/api/admin/posts`),
        ]);

        if (mRes.ok) setMentors(await mRes.json());
        if (vRes.ok) setVolunteers(await vRes.json());
        if (uRes.ok) {
          const usersData = await uRes.json();
          console.log("Users response:", usersData);
          setUsers(usersData);
        } else {
          console.log("Users request failed:", uRes.status);
        }
        if (pRes.ok) setPosts(await pRes.json());
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleApproveMentor = async (id) => {
    const res = await authFetch(`${API}/api/mentor/${id}/approve`, { method: "PATCH" });
    if (res.ok) {
      setMentors((prev) =>
        prev.map((m) => m.id === id ? { ...m, approved: true, status: "Approved" } : m)
      );
      showNotification("Mentor approved!", "success");
    }
  };

  const handleRejectMentor = async (id) => {
    const res = await authFetch(`${API}/api/mentor/${id}/reject`, { method: "PATCH" });
    if (res.ok) {
      setMentors((prev) =>
        prev.map((m) => m.id === id ? { ...m, approved: false, status: "Rejected" } : m)
      );
      showNotification("Mentor rejected.", "success");
    }
  };

  const handleDeleteUser = async (userName) => {
    if (!window.confirm(`Delete user ${userName}?`)) return;
    const res = await authFetch(`${API}/api/admin/users/${userName}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.userName !== userName));
      showNotification("User deleted.", "success");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    const res = await authFetch(`${API}/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showNotification("Post deleted.", "success");
    }
  };

  const handleVolunteerStatus = async (id, status) => {
    const res = await authFetch(
      `${API}/api/admin/volunteer-applications/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    if (res.ok) {
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v))
      );
      showNotification("Status updated.", "success");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <p className="admin-user">Logged in as {user?.userName}</p>

        <nav className="admin-nav">
          <button
            className={activeTab === "mentors" ? "active" : ""}
            onClick={() => setActiveTab("mentors")}
          >
            Mentor Applications
            <span className="badge">
              {mentors.filter((m) => (m.status || "Pending") === "Pending").length}
            </span>
          </button>
          <button
            className={activeTab === "volunteers" ? "active" : ""}
            onClick={() => setActiveTab("volunteers")}
          >
            Volunteer Applications
            <span className="badge">{volunteers.length}</span>
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Manage Users
            <span className="badge">{users.length}</span>
          </button>
          <button
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => setActiveTab("posts")}
          >
            Post Moderation
            <span className="badge">{posts.length}</span>
          </button>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="admin-main">

        {notification && (
          <div className={"admin-toast " + notification.type}>
            {notification.message}
          </div>
        )}

        {loading ? (
          <p className="admin-loading">Loading data...</p>
        ) : (
          <>
            {/* Mentor Applications */}
            {activeTab === "mentors" && (
              <div className="admin-section">
                <h2>Mentor Applications</h2>

                <div className="filter-tabs">
                  {["All", "Pending", "Approved", "Rejected"].map((f) => (
                    <button
                      key={f}
                      className={"filter-tab " + (mentorFilter === f ? "active" : "")}
                      onClick={() => setMentorFilter(f)}
                    >
                      {f}
                      <span className="badge">
                        {f === "All"
                          ? mentors.length
                          : mentors.filter((m) =>
                              (m.status || "Pending") === f
                            ).length}
                      </span>
                    </button>
                  ))}
                </div>

                {filteredMentors.length === 0 ? (
                  <p className="admin-empty">No applications in this category.</p>
                ) : (
                  filteredMentors.map((m) => (
                    <div key={m.id} className="admin-card">
                      <div className="admin-card-header">
                        <div>
                          <h3>{m.name}</h3>
                          <p className="admin-meta">{m.role}</p>
                          {m.passedOutYear && (
                            <p className="admin-meta">Class of {m.passedOutYear}</p>
                          )}
                          <p className="admin-meta">@{m.userName}</p>
                        </div>
                        <span className={"status-badge " + (m.status || "pending").toLowerCase()}>
                          {m.status || "Pending"}
                        </span>
                      </div>
                      <p className="admin-bio">{m.bio}</p>
                      <div className="admin-tags">
                        {m.expertise?.map((tag) => (
                          <span key={tag} className="admin-tag">{tag}</span>
                        ))}
                      </div>
                      <p className="admin-meta">Email: {m.email}</p>
                      {m.linkedin && (
                        <p className="admin-meta">
                          LinkedIn:{" "}
                          <a href={m.linkedin} target="_blank" rel="noreferrer">
                            {m.linkedin}
                          </a>
                        </p>
                      )}
                      <p className="admin-meta">Applied: {formatDate(m.appliedAt)}</p>
                      <div className="admin-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApproveMentor(m.id)}
                          disabled={m.status === "Approved"}
                        >
                          {m.status === "Approved" ? "✓ Approved" : "Approve"}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleRejectMentor(m.id)}
                          disabled={m.status === "Rejected"}
                        >
                          {m.status === "Rejected" ? "✗ Rejected" : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Volunteer Applications */}
            {activeTab === "volunteers" && (
              <div className="admin-section">
                <h2>Volunteer Applications</h2>
                {volunteers.length === 0 ? (
                  <p className="admin-empty">No applications yet.</p>
                ) : (
                  volunteers.map((v) => (
                    <div key={v.id} className="admin-card">
                      <div className="admin-card-header">
                        <div>
                          <h3>{v.opportunityTitle}</h3>
                          <p className="admin-meta">Applied by: @{v.userName}</p>
                          <p className="admin-meta">Date: {formatDate(v.appliedAt)}</p>
                        </div>
                        <span className={"status-badge " + (v.status?.toLowerCase() || "pending")}>
                          {v.status || "Pending"}
                        </span>
                      </div>
                      <div className="admin-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleVolunteerStatus(v.id, "Approved")}
                          disabled={v.status === "Approved"}
                        >
                          {v.status === "Approved" ? "✓ Approved" : "Approve"}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleVolunteerStatus(v.id, "Rejected")}
                          disabled={v.status === "Rejected"}
                        >
                          {v.status === "Rejected" ? "✗ Rejected" : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Manage Users */}
            {activeTab === "users" && (
              <div className="admin-section">
                <h2>Manage Users</h2>

                <div className="user-controls">
                  <input
                    type="text"
                    className="admin-search"
                    placeholder="Search by username, name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  <div className="filter-tabs">
                    {["All", "Student", "Alumni", "Staff"].map((r) => (
                      <button
                        key={r}
                        className={"filter-tab " + (userRoleFilter === r ? "active" : "")}
                        onClick={() => setUserRoleFilter(r)}
                      >
                        {r}
                        <span className="badge">
                          {r === "All"
                            ? users.length
                            : users.filter((u) => u.role === r).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const filtered = users.filter((u) => {
                    const matchesRole =
                      userRoleFilter === "All" || u.role === userRoleFilter;
                    const search = userSearch.toLowerCase();
                    const matchesSearch =
                      !search ||
                      u.userName?.toLowerCase().includes(search) ||
                      u.email?.toLowerCase().includes(search) ||
                      u.name?.toLowerCase().includes(search) ||
                      u.surname?.toLowerCase().includes(search);
                    return matchesRole && matchesSearch;
                  });

                  return filtered.length === 0 ? (
                    <p className="admin-empty">No users found.</p>
                  ) : (
                    <>
                      <p className="results-count">
                        Showing {filtered.length} of {users.length} users
                      </p>
                      {filtered.map((u) => (
                        <div key={u.userName} className="admin-card">
                          <div className="admin-card-header">
                            <div>
                              <h3>@{u.userName}</h3>
                              {u.name && (
                                <p className="admin-meta">{u.name} {u.surname}</p>
                              )}
                              <p className="admin-meta">{u.email}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                              <span className={"status-badge " + u.role?.toLowerCase()}>
                                {u.role}
                              </span>
                              {u.mentorStatus && (
                                <span className={"status-badge " + u.mentorStatus.toLowerCase()}>
                                  Mentor: {u.mentorStatus}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="admin-actions">
                            <button
                              className="reject-btn"
                              onClick={() => handleDeleteUser(u.userName)}
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Post Moderation */}
            {activeTab === "posts" && (
              <div className="admin-section">
                <h2>Post Moderation</h2>
                {posts.length === 0 ? (
                  <p className="admin-empty">No posts found.</p>
                ) : (
                  posts.map((p) => (
                    <div key={p.id} className="admin-card">
                      <div className="admin-card-header">
                        <div>
                          <h3>@{p.userName}</h3>
                          <p className="admin-meta">{formatDate(p.createdAt)}</p>
                        </div>
                        <div className="admin-post-stats">
                          <span>♥ {p.likes?.length || 0}</span>
                          <span>💬 {p.comments?.length || 0}</span>
                        </div>
                      </div>
                      <p className="admin-post-content">{p.content}</p>
                      <div className="admin-actions">
                        <button
                          className="reject-btn"
                          onClick={() => handleDeletePost(p.id)}
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;