import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import EmojiPicker from "emoji-picker-react";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import "./Chat.css";

const API = "http://localhost:5277";

function Chat() {
  const { roomId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [otherUser, setOtherUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Derive the other person's name from roomId
  useEffect(() => {
    if (roomId && user) {
      const parts = roomId.split("_");
      const other = parts[0] === user.userName ? parts[1] : parts[0];
      setOtherUser(other);
    }
  }, [roomId, user]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (!roomId) return;
    authFetch(`${API}/api/mentorship/chat/${roomId}/mark-read`, {
      method: "PATCH",
    }).catch((err) => console.error("Failed to mark read:", err));
  }, [roomId]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await authFetch(`${API}/api/mentorship/chat/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    if (roomId) loadHistory();
  }, [roomId]);

  // Connect to SignalR hub
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !roomId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API}/hubs/chat?access_token=${token}`)
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      authFetch(`${API}/api/mentorship/chat/${roomId}/mark-read`, {
        method: "PATCH",
      }).catch(() => { });
    });

    newConnection.start()
      .then(() => {
        setConnected(true);
        newConnection.invoke("JoinRoom", roomId);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    setConnection(newConnection);

    return () => {
      newConnection.invoke("LeaveRoom", roomId).catch(() => { });
      newConnection.stop();
    };
  }, [roomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current?.selectionStart ?? input.length;
    const newInput =
      input.slice(0, cursorPos) + emoji + input.slice(cursorPos);
    setInput(newInput);
    // Keep focus on input after selecting emoji
    setTimeout(() => {
      inputRef.current?.focus();
      const newPos = cursorPos + emoji.length;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const handleSend = async () => {
    if (!input.trim() || !connection || !connected) return;
    try {
      await connection.invoke("SendMessage", roomId, input.trim());
      setInput("");
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric"
    });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.sentAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="chat-page">
      <Navbar />

      <div className="chat-container">
        {/* Chat header */}
        <div className="chat-header">
          <button className="chat-back" onClick={() => navigate("/dashboard")}>
            <i className="fi fi-rr-arrow-left"></i> Back
          </button>
          <div className="chat-header-info">
            <div className="chat-avatar">{otherUser.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{otherUser}</h3>
              <span className={connected ? "chat-status online" : "chat-status"}>
                {connected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="chat-date-divider">{date}</div>
              {msgs.map((msg, i) => {
                const isOwn = msg.senderUserName === user?.userName;
                return (
                  <div
                    key={msg.id || i}
                    className={"chat-message " + (isOwn ? "own" : "other")}
                  >
                    {!isOwn && (
                      <div className="chat-msg-avatar">
                        {msg.senderUserName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="chat-bubble">
                      <p>{msg.message}</p>
                      <div className="chat-bubble-footer">
                        <span className="chat-time">{formatTime(msg.sentAt)}</span>
                        {isOwn && (
                          <span className={`chat-read-receipt ${msg.isRead ? "read" : "sent"}`}>
                            {msg.isRead ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="chat-empty">
              No messages yet. Say hello to start the conversation!
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              skinTonesDisabled
              searchDisabled={false}
              height={380}
              width="100%"
            />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-row">
          <button
            className="emoji-toggle-btn"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            title="Add emoji"
          >
            <i className="fi fi-rr-smile icon-smile"></i>
          </button>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!connected || !input.trim()}
          >
            <i className="fi fi-rr-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;