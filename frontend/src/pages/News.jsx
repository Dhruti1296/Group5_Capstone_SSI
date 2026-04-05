import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./News.css";

const API = "http://localhost:5277";

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API}/api/news`);
        if (res.ok) {
          const data = await res.json();
          setNewsItems(data);
        } else {
          setError("Failed to load news.");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleNewsClick = (item) => {
    const encoded = encodeURIComponent(item.detailUrl);
    navigate(`/news/detail?url=${encoded}`);
  };

  return (
    <div className="news-page">
      <Navbar />
      <div className="news-header">
        <h2>Latest News</h2>
        <p className="news-source-text">
          Live from{" "}
          <a
            href="https://blogs1.conestogac.on.ca/news"
            target="_blank"
            rel="noreferrer"
            className="news-source-link"
          >
            blogs1.conestogac.on.ca
          </a>
        </p>
      </div>

      {loading ? (
        <p className="news-loading">Loading news from Conestoga...</p>
      ) : error ? (
        <p className="news-error">{error}</p>
      ) : (
        <div className="news-grid">
          {newsItems.map((item, i) => (
            <div
              key={i}
              className="news-card"
              onClick={() => handleNewsClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3 className="news-title">{item.title}</h3>
                {item.snippet && (
                  <p className="news-description">{item.snippet}...</p>
                )}
                <span className="news-read-more">Read more →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default News;