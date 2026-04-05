import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./NewsDetail.css";

const API = "http://localhost:5277";

function NewsDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = new URLSearchParams(location.search).get("url");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!url) {
        setError("No news URL provided.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${API}/api/news/detail?url=${encodeURIComponent(url)}`
        );
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        } else {
          setError("Failed to load news article.");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [url]);

  const renderLine = (line, index) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h4 key={index} className="news-detail-subheading">
          {line.slice(2, -2)}
        </h4>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <div key={index} className="news-detail-bullet">
          <span className="news-bullet-dot">•</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    }
    return <p key={index} className="news-detail-para">{line}</p>;
  };

  return (
    <div className="news-detail-page">
      <Navbar />

      <div className="news-detail-container">
        <button
          className="news-back-btn"
          onClick={() => navigate("/news")}
        >
          ← Back to News
        </button>

        {loading ? (
          <p className="news-detail-loading">Loading article...</p>
        ) : error ? (
          <p className="news-detail-error">{error}</p>
        ) : news ? (
          <div className="news-detail-card">
            {news.date && (
              <p className="news-detail-date">📅 {news.date}</p>
            )}
            <h2 className="news-detail-title">{news.title}</h2>

            {news.imageUrl && (
              <div className="news-detail-image-wrapper">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="news-detail-image"
                />
              </div>
            )}

            {news.description && (
              <div className="news-detail-body">
                {news.description
                  .split("\n\n")
                  .filter(line => line.trim())
                  .map((line, i) => renderLine(line.trim(), i))}
              </div>
            )}

            <div className="news-detail-footer">
              <a
                href={news.detailUrl}
                target="_blank"
                rel="noreferrer"
                className="news-detail-source-btn"
              >
                View on Conestoga Website ↗
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}

export default NewsDetail;