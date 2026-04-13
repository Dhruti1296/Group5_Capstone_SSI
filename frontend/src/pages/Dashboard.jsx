import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlumniList from "../components/AlumniList";
import PostCard from "../components/PostCard";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5277";

function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [myMentor, setMyMentor] = useState(null);
  const [myMentees, setMyMentees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authFetch(`${API}/api/posts`); //this api will fetch posts
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch mentor/mentee data based on role
  useEffect(() => {
    if (!user) return;

    const fetchMentorData = async () => {
      try {
        if (user.role === "Student") {
          const res = await authFetch(`${API}/api/mentorship/my-mentor`);
          if (res.ok) setMyMentor(await res.json());
        } else if (user.role === "Alumni") {
          const [menteesRes, requestsRes] = await Promise.all([
            authFetch(`${API}/api/mentorship/my-mentees`),
            authFetch(`${API}/api/mentorship/my-requests`),
          ]);
          if (menteesRes.ok) {
            const menteesData = await menteesRes.json();
            setMyMentees(
              menteesData.filter(
                (m) => m !== null && m.studentUserName && m.status === "Accepted"
              )
            );
          }
          if (requestsRes.ok) {
            const requestsData = await requestsRes.json();
            setPendingRequests(
              requestsData.filter(
                (r) => r !== null && r.studentUserName && r.status === "Pending"
              )
            );
          }
        }

        // Fetch unread message counts
        const unreadRes = await authFetch(`${API}/api/mentorship/unread-counts`);
        if (unreadRes.ok) {
          const counts = await unreadRes.json();
          setUnreadCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch mentor data:", err);
      }
    };

    fetchMentorData();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="welcome-banner">Loading your dashboard...</div>
        <Footer />
      </div>
    );
  }

  const handlePost = async () => {
    if (!postText.trim()) return;
    try { // this api will create the post
      const res = await authFetch(`${API}/api/posts`, {
        method: "POST",
        body: JSON.stringify({ content: postText }),
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        setPostText("");
        setShowModal(false);
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleAcceptRequest = async (requestId) => {
    const res = await authFetch(`${API}/api/mentorship/${requestId}/accept`, {
      method: "PATCH",
    });
    if (res.ok) {
      const accepted = pendingRequests.find((r) => r.id === requestId);
      setPendingRequests([]);
      if (accepted) {
        setMyMentees((prev) => [...prev, { ...accepted, status: "Accepted" }]);
      }
    }
  };

  const handleDeclineRequest = async (requestId) => {
    const res = await authFetch(`${API}/api/mentorship/${requestId}/decline`, {
      method: "PATCH",
    });
    if (res.ok) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* Post box trigger */}
      <div className="post-box" onClick={() => setShowModal(true)}>
        <div className="post-box-inner">
          <div className="profile-circle">
            {user.profilePic ? (
              <img src={user.profilePic} alt="profile" />
            ) : (
              user.userName.charAt(0).toUpperCase()
            )}
          </div>
          <span>What's on your mind, {user.userName}?</span>
        </div>
      </div>

      {/* Post modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Create Post</h3>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your thoughts..."
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setPostText("");
                }}
              >
                Cancel
              </button>
              <button className="post-btn" onClick={handlePost}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-layout">

        {/* Column 1 — Profile */}
        <div className="dashboard-column profile-column">
          {user.profilePic ? (
            <Link to="/edit-profile">
              <img
                src={user.profilePic}
                alt="Profile"
                className="profile-pic clickable"
              />
            </Link>
          ) : (
            <Link to="/edit-profile">
              <div className="profile-pic initials clickable">
                {user.userName.charAt(0).toUpperCase()}
              </div>
            </Link>
          )}

          <h3 className="user-name">{user.userName}</h3>

          <nav className="profile-links">
            <a href="/news">News</a>
            <a href="/events">Events</a>
           
            <a href="/volunteer">Volunteer</a>
            {user.role === "Alumni" ? (
              <a href="/become-mentor">Be a Mentor</a>
            ) : (
              <a href="/mentor">Request Mentor</a>
            )}
          </nav>
        </div>

        {/* Column 2 — Feed */}
        <div className="dashboard-column feed-column">
          {loadingPosts ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>
              Loading posts...
            </p>
          ) : posts.length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>
              No posts yet — be the first to share something!
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>

       {/* Column 3 — Right sidebar */}
<div className="dashboard-column lists-column">

  {/* Student — show active mentor with chat */}
  {user.role === "Student" && myMentor && (
    <div className="side-connection-card">
      <h3>Your Mentor</h3>
      <div className="side-connection-row">
        <div className="side-avatar">
          {myMentor.mentorName.charAt(0)}
        </div>
        <div className="side-info">
          <p className="side-name">{myMentor.mentorName}</p>
          <p className="side-sub">@{myMentor.mentorUserName}</p>
        </div>
        <button
          className="chat-btn"
          onClick={() =>
            navigate(
              `/chat/${myMentor.studentUserName}_${myMentor.mentorUserName}`
            )
          }
        >
          💬
          {unreadCounts[`${myMentor.studentUserName}_${myMentor.mentorUserName}`] > 0 && (
            <span className="chat-unread-badge">
              {unreadCounts[`${myMentor.studentUserName}_${myMentor.mentorUserName}`]}
            </span>
          )}
        </button>
      </div>
    </div>
  )}

  {/* Alumni — pending mentorship requests */}
  {user.role === "Alumni" && pendingRequests.length > 0 && (
    <div className="side-connection-card">
      <h3>Mentorship Requests</h3>
      {pendingRequests
        .filter((req) => req && req.studentUserName)
        .map((req) => (
          <div key={req.id} className="side-request-row">
            <div className="side-avatar">
              {(req.studentName || req.studentUserName).charAt(0)}
            </div>
            <div className="side-info">
              <p className="side-name">
                {req.studentName || req.studentUserName}
              </p>
              <p className="side-sub">@{req.studentUserName}</p>
            </div>
            <div className="side-request-actions">
              <button
                className="accept-btn"
                onClick={() => handleAcceptRequest(req.id)}
              >
                ✓
              </button>
              <button
                className="decline-btn"
                onClick={() => handleDeclineRequest(req.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
    </div>
  )}

  {/* Alumni — active mentees with chat */}
  {user.role === "Alumni" && myMentees.length > 0 && (
    <div className="side-connection-card">
      <h3>Your Mentees</h3>
      {myMentees
        .filter((mentee) => mentee && mentee.studentUserName)
        .map((mentee) => (
          <div key={mentee.id} className="side-connection-row">
            <div className="side-avatar">
              {(mentee.studentName || mentee.studentUserName).charAt(0)}
            </div>
            <div className="side-info">
              <p className="side-name">
                {mentee.studentName || mentee.studentUserName}
              </p>
              <p className="side-sub">@{mentee.studentUserName}</p>
            </div>
            <button
              className="chat-btn"
              onClick={() =>
                navigate(
                  `/chat/${mentee.studentUserName}_${mentee.mentorUserName}`
                )
              }
            >
              💬
              {unreadCounts[`${mentee.studentUserName}_${mentee.mentorUserName}`] > 0 && (
                <span className="chat-unread-badge">
                  {unreadCounts[`${mentee.studentUserName}_${mentee.mentorUserName}`]}
                </span>
              )}
            </button>
          </div>
        ))}
    </div>
  )}

  {/* Directory links */}
 <div className="lists-column-links">
  <h3>Directory</h3>
  <Link to="/alumni">View Alumni</Link>
  <Link to="/students">View Students</Link>
</div>


</div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;