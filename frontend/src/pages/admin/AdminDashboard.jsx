import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { authFetch } from "../../utils/authFetch";
import "./AdminDashboard.css";

const API = "http://localhost:5277";
const EVENT_SERVICE = "http://localhost:5237";

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
  const [opportunities, setOpportunities] = useState([]);
  const [ssiEvents, setSsiEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});

  const [oppForm, setOppForm] = useState({
    title: "", description: "", date: "", location: "", rawDate: ""
  });
  const [showOppForm, setShowOppForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);

  const [ssiEventForm, setSsiEventForm] = useState({
    title: "", description: "", type: "", location: "", rawDate: "", eventDate: ""
  });
  const [showSsiForm, setShowSsiForm] = useState(false);
  const [editingSsiEvent, setEditingSsiEvent] = useState(null);

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
        const [mRes, vRes, uRes, pRes, oppRes] = await Promise.all([
          authFetch(`${API}/api/admin/mentor-applications`),
          authFetch(`${API}/api/admin/volunteer-applications`),
          authFetch(`${API}/api/admin/users`),
          authFetch(`${API}/api/admin/posts`),
          authFetch(`${API}/api/admin/volunteer-opportunities`),
        ]);

        if (mRes.ok) setMentors(await mRes.json());
        if (vRes.ok) setVolunteers(await vRes.json());
        if (uRes.ok) setUsers(await uRes.json());
        if (pRes.ok) setPosts(await pRes.json());
        if (oppRes.ok) setOpportunities(await oppRes.json());

        // Fetch SSI events from microservice
        try {
          const ssiRes = await fetch(`${EVENT_SERVICE}/api/events`);
          if (ssiRes.ok) setSsiEvents(await ssiRes.json());
        } catch (err) {
          console.warn("Event microservice not running:", err.message);
        }
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Mentor handlers ───────────────────────────
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

  // ── Post handlers ─────────────────────────────
  const handleDeleteComment = async (postId, commentIndex) => {
    const res = await authFetch(
      `${API}/api/admin/posts/${postId}/comments/${commentIndex}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const updatedComments = p.comments.filter((_, i) => i !== commentIndex);
          return { ...p, comments: updatedComments };
        })
      );
      showNotification("Comment deleted.", "success");
    }
  };

  const handleDeletePost = async (id) => {
    const res = await authFetch(`${API}/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showNotification("Post deleted.", "success");
    }
  };

  // ── User handlers ─────────────────────────────
  const handleDeleteUser = async (userName) => {
    const res = await authFetch(`${API}/api/admin/users/${userName}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.userName !== userName));
      showNotification("User deleted.", "success");
    }
  };

  // ── Volunteer handlers ────────────────────────
  const handleVolunteerStatus = async (id, status) => {
    const res = await authFetch(
      `${API}/api/admin/volunteer-applications/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    );
    if (res.ok) {
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v))
      );
      showNotification("Status updated.", "success");
    }
  };

  // ── Opportunity handlers ──────────────────────
  const handleCreateOpportunity = async () => {
    if (!oppForm.title || !oppForm.description || !oppForm.date || !oppForm.location) {
      showNotification("All fields are required.", "error");
      return;
    }
    const res = await authFetch(`${API}/api/admin/volunteer-opportunities`, {
      method: "POST",
      body: JSON.stringify(oppForm),
    });
    if (res.ok) {
      const created = await res.json();
      setOpportunities((prev) => [...prev, created]);
      setOppForm({ title: "", description: "", date: "", location: "", rawDate: "" });
      setShowOppForm(false);
      showNotification("Opportunity created!", "success");
    }
  };

  const handleUpdateOpportunity = async () => {
    if (!oppForm.title || !oppForm.description || !oppForm.date || !oppForm.location) {
      showNotification("All fields are required.", "error");
      return;
    }
    const res = await authFetch(
      `${API}/api/admin/volunteer-opportunities/${editingOpp.id}`,
      { method: "PUT", body: JSON.stringify(oppForm) }
    );
    if (res.ok) {
      setOpportunities((prev) =>
        prev.map((o) => o.id === editingOpp.id ? { ...o, ...oppForm } : o)
      );
      setEditingOpp(null);
      setShowOppForm(false);
      setOppForm({ title: "", description: "", date: "", location: "", rawDate: "" });
      showNotification("Opportunity updated!", "success");
    }
  };

  const handleDeleteOpportunity = async (id) => {
    const res = await authFetch(
      `${API}/api/admin/volunteer-opportunities/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      showNotification("Opportunity deleted.", "success");
    }
  };

  const handleEditOpportunity = (opp) => {
    setEditingOpp(opp);
    setOppForm({
      title: opp.title,
      description: opp.description,
      date: opp.date,
      location: opp.location,
      rawDate: "",
    });
    setShowOppForm(true);
  };

  // ── SSI Event handlers ────────────────────────
  const handleCreateSsiEvent = async () => {
    if (!ssiEventForm.title || !ssiEventForm.description ||
        !ssiEventForm.eventDate || !ssiEventForm.location) {
      showNotification("All fields are required.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("title", ssiEventForm.title);
    formData.append("description", ssiEventForm.description);
    formData.append("type", ssiEventForm.type || "");
    formData.append("location", ssiEventForm.location);
    formData.append("eventDate", ssiEventForm.eventDate);

    try {
      const res = await fetch(`${EVENT_SERVICE}/api/events`, {
        method: "POST",
        headers: { "adminUserName": user?.userName },
        body: formData,
      });
      if (res.ok) {
        const updated = await fetch(`${EVENT_SERVICE}/api/events`);
        if (updated.ok) setSsiEvents(await updated.json());
        setSsiEventForm({ title: "", description: "", type: "", location: "", rawDate: "", eventDate: "" });
        setShowSsiForm(false);
        showNotification("SSI Event created!", "success");
      } else {
        const err = await res.text();
        showNotification("Failed: " + err, "error");
      }
    } catch (err) {
      showNotification("Event service not running.", "error");
    }
  };

  const handleDeleteSsiEvent = async (id) => {
    try {
      const res = await fetch(`${EVENT_SERVICE}/api/events/${id}`, {
        method: "DELETE",
        headers: { "adminUserName": user?.userName },
      });
      if (res.ok) {
        setSsiEvents((prev) => prev.filter((e) => e.id !== id));
        showNotification("Event deleted.", "success");
      }
    } catch (err) {
      showNotification("Event service not running.", "error");
    }
  };

  // ── Utils ─────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  const textareaStyle = {
    width: "100%",
    background: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontFamily: "inherit",
    fontSize: "0.88rem",
    resize: "vertical",
    outline: "none",
  };

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
          <button
            className={activeTab === "opportunities" ? "active" : ""}
            onClick={() => setActiveTab("opportunities")}
          >
            Volunteer Opportunities
            <span className="badge">{opportunities.length}</span>
          </button>
          <button
            className={activeTab === "ssiEvents" ? "active" : ""}
            onClick={() => setActiveTab("ssiEvents")}
          >
            SSI Events
            <span className="badge">{ssiEvents.length}</span>
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
            {/* ── Mentor Applications ── */}
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
                          : mentors.filter((m) => (m.status || "Pending") === f).length}
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
                          <a href={m.linkedin} target="_blank" rel="noreferrer">{m.linkedin}</a>
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

            {/* ── Volunteer Applications ── */}
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

            {/* ── Manage Users ── */}
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
                    {["All", "Student", "Alumni"].map((r) => (
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
                    const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter;
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

            {/* ── Post Moderation ── */}
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
                      {p.comments && p.comments.length > 0 && (
                        <div className="admin-comments-section">
                          <button
                            className="toggle-comments-btn"
                            onClick={() =>
                              setExpandedPosts((prev) => ({
                                ...prev,
                                [p.id]: !prev[p.id],
                              }))
                            }
                          >
                            {expandedPosts[p.id]
                              ? "Hide Comments"
                              : `Show ${p.comments.length} Comment${p.comments.length > 1 ? "s" : ""}`}
                          </button>
                          {expandedPosts[p.id] && (
                            <div className="admin-comments-list">
                              {p.comments.map((c, i) => (
                                <div key={i} className="admin-comment-row">
                                  <div className="admin-comment-content">
                                    <span className="admin-comment-author">@{c.userName}</span>
                                    <span className="admin-comment-text">{c.text}</span>
                                    <span className="admin-comment-time">{formatDate(c.createdAt)}</span>
                                  </div>
                                  <button
                                    className="delete-comment-btn"
                                    onClick={() => handleDeleteComment(p.id, i)}
                                    title="Delete comment"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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

            {/* ── Volunteer Opportunities ── */}
            {activeTab === "opportunities" && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>Volunteer Opportunities</h2>
                  <button
                    className="approve-btn"
                    onClick={() => {
                      setEditingOpp(null);
                      setOppForm({ title: "", description: "", date: "", location: "", rawDate: "" });
                      setShowOppForm((prev) => !prev);
                    }}
                  >
                    {showOppForm && !editingOpp ? "Cancel" : "+ New Opportunity"}
                  </button>
                </div>

                {showOppForm && (
                  <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "#d4af37", marginBottom: "1rem" }}>
                      {editingOpp ? "Edit Opportunity" : "Create New Opportunity"}
                    </h3>
                    <div className="opp-form-grid">
                      <div className="opp-form-field">
                        <label>Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Campus Open House Helper"
                          value={oppForm.title}
                          onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                          className="admin-search"
                        />
                      </div>
                      <div className="opp-form-field">
                        <label>Date</label>
                        <input
                          type="date"
                          value={oppForm.rawDate || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (!raw) return;
                            const [year, month, day] = raw.split("-");
                            const formatted = new Date(
                              parseInt(year), parseInt(month) - 1, parseInt(day)
                            ).toLocaleDateString("en-US", {
                              month: "long", day: "numeric", year: "numeric"
                            });
                            setOppForm({ ...oppForm, rawDate: raw, date: formatted });
                          }}
                          className="admin-search"
                          style={{ colorScheme: "dark" }}
                        />
                        {oppForm.date && (
                          <span style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>
                            {oppForm.date}
                          </span>
                        )}
                      </div>
                      <div className="opp-form-field">
                        <label>Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Kitchener – Doon"
                          value={oppForm.location}
                          onChange={(e) => setOppForm({ ...oppForm, location: e.target.value })}
                          className="admin-search"
                        />
                      </div>
                    </div>
                    <div className="opp-form-field" style={{ marginTop: "0.8rem" }}>
                      <label>Description</label>
                      <textarea
                        placeholder="Describe the volunteer opportunity..."
                        value={oppForm.description}
                        onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                        rows={3}
                        style={textareaStyle}
                      />
                    </div>
                    <div className="admin-actions" style={{ marginTop: "1rem" }}>
                      <button
                        className="approve-btn"
                        onClick={editingOpp ? handleUpdateOpportunity : handleCreateOpportunity}
                      >
                        {editingOpp ? "Save Changes" : "Create Opportunity"}
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => {
                          setShowOppForm(false);
                          setEditingOpp(null);
                          setOppForm({ title: "", description: "", date: "", location: "", rawDate: "" });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {opportunities.length === 0 ? (
                  <p className="admin-empty">No opportunities yet. Create one above.</p>
                ) : (
                  opportunities.map((opp) => (
                    <div key={opp.id} className="admin-card">
                      <div className="admin-card-header">
                        <div>
                          <h3>{opp.title}</h3>
                          <p className="admin-meta">📅 {opp.date} &nbsp;·&nbsp; 📍 {opp.location}</p>
                        </div>
                        <span className={"status-badge " + (opp.status?.toLowerCase() || "open")}>
                          {opp.status || "Open"}
                        </span>
                      </div>
                      <p className="admin-bio">{opp.description}</p>
                      <div className="admin-actions">
                        <button className="approve-btn" onClick={() => handleEditOpportunity(opp)}>
                          Edit
                        </button>
                        <button className="reject-btn" onClick={() => handleDeleteOpportunity(opp.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── SSI Events ── */}
            {activeTab === "ssiEvents" && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>SSI Events</h2>
                  <button
                    className="approve-btn"
                    onClick={() => {
                      setEditingSsiEvent(null);
                      setSsiEventForm({ title: "", description: "", type: "", location: "", rawDate: "", eventDate: "" });
                      setShowSsiForm((prev) => !prev);
                    }}
                  >
                    {showSsiForm && !editingSsiEvent ? "Cancel" : "+ New Event"}
                  </button>
                </div>

                {showSsiForm && (
                  <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "#d4af37", marginBottom: "1rem" }}>
                      Create New SSI Event
                    </h3>
                    <div className="opp-form-grid">
                      <div className="opp-form-field">
                        <label>Title</label>
                        <input
                          type="text"
                          placeholder="Event title"
                          value={ssiEventForm.title}
                          onChange={(e) => setSsiEventForm({ ...ssiEventForm, title: e.target.value })}
                          className="admin-search"
                        />
                      </div>
                      <div className="opp-form-field">
                        <label>Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Workshop, Seminar"
                          value={ssiEventForm.type}
                          onChange={(e) => setSsiEventForm({ ...ssiEventForm, type: e.target.value })}
                          className="admin-search"
                        />
                      </div>
                      <div className="opp-form-field">
                        <label>Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Kitchener – Doon"
                          value={ssiEventForm.location}
                          onChange={(e) => setSsiEventForm({ ...ssiEventForm, location: e.target.value })}
                          className="admin-search"
                        />
                      </div>
                    </div>
                    <div className="opp-form-field" style={{ marginTop: "0.8rem" }}>
                      <label>Date</label>
                      <input
                        type="date"
                        value={ssiEventForm.rawDate || ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (!raw) return;
                          setSsiEventForm({
                            ...ssiEventForm,
                            rawDate: raw,
                            eventDate: new Date(raw + "T12:00:00").toISOString(),
                          });
                        }}
                        className="admin-search"
                        style={{ colorScheme: "dark" }}
                      />
                      {ssiEventForm.rawDate && (
                        <span style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>
                          {new Date(ssiEventForm.rawDate + "T12:00:00").toLocaleDateString("en-US", {
                            month: "long", day: "numeric", year: "numeric"
                          })}
                        </span>
                      )}
                    </div>
                    <div className="opp-form-field" style={{ marginTop: "0.8rem" }}>
                      <label>Description</label>
                      <textarea
                        placeholder="Describe the event..."
                        value={ssiEventForm.description}
                        onChange={(e) => setSsiEventForm({ ...ssiEventForm, description: e.target.value })}
                        rows={3}
                        style={textareaStyle}
                      />
                    </div>
                    <div className="admin-actions" style={{ marginTop: "1rem" }}>
                      <button className="approve-btn" onClick={handleCreateSsiEvent}>
                        Create Event
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => {
                          setShowSsiForm(false);
                          setEditingSsiEvent(null);
                          setSsiEventForm({ title: "", description: "", type: "", location: "", rawDate: "", eventDate: "" });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {ssiEvents.length === 0 ? (
                  <p className="admin-empty">
                    No SSI events yet. Create one above.
                    <br />
                    <span style={{ fontSize: "0.78rem", color: "#555", marginTop: "6px", display: "block" }}>
                      Make sure the Event Microservice is running on port 5237.
                    </span>
                  </p>
                ) : (
                  ssiEvents.map((event) => (
                    <div key={event.id} className="admin-card">
                      <div className="admin-card-header">
                        <div>
                          <h3>{event.title}</h3>
                          <p className="admin-meta">
                            📅 {formatDate(event.eventDate)}
                            &nbsp;·&nbsp;
                            📍 {event.location}
                            {event.type && <>&nbsp;·&nbsp; 🏷️ {event.type}</>}
                          </p>
                        </div>
                      </div>
                      <p className="admin-bio">{event.description}</p>
                      <div className="admin-actions">
                        <button
                          className="reject-btn"
                          onClick={() => handleDeleteSsiEvent(event.id)}
                        >
                          Delete
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