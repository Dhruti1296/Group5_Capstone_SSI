import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <Navbar />

            {/* Hero */}
            <div className="about-hero">
                <div className="about-hero-content">
                    <p className="about-hero-label">About Us</p>
                    <h1>Connecting the <span>Conestoga</span> Community</h1>
                    <p className="about-hero-sub">
                        The SSI Portal is a unified digital platform built to bridge the gap
                        between students, alumni, and staff at Conestoga College.
                    </p>
                    <div className="about-hero-btns">
                        <button className="about-btn-primary" onClick={() => navigate("/register")}>
                            Join the Community
                        </button>
                        <button className="about-btn-secondary" onClick={() => navigate("/login")}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {/* Mission */}
            <section className="about-section about-mission">
                <div className="about-container">
                    <div className="about-section-label">Our Mission</div>
                    <h2>Why SSI Portal Exists</h2>
                    <p>
                        Conestoga College students and alumni had no central hub to stay connected
                        after graduation. Volunteer opportunities were scattered, mentorship was
                        informal, and college news required visiting multiple pages. SSI Portal
                        solves all of this in one place — a premium, modern platform built by
                        students, for students.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="about-stats-section">
                <div className="about-container">
                    <div className="about-stats-grid">
                        {[
                            { number: "3", label: "User Roles", sub: "Student · Alumni · Admin" },
                            { number: "14+", label: "Pages Built", sub: "Full responsive UI" },
                            { number: "8", label: "MongoDB Collections", sub: "Live cloud database" },
                            { number: "1", label: "Real-time Hub", sub: "SignalR WebSocket chat" },
                        ].map((stat, i) => (
                            <div className="about-stat-card" key={i}>
                                <div className="about-stat-number">{stat.number}</div>
                                <div className="about-stat-label">{stat.label}</div>
                                <div className="about-stat-sub">{stat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="about-section about-features">
                <div className="about-container">
                    <div className="about-section-label">What We Offer</div>
                    <h2>Everything in One Place</h2>
                    <div className="about-features-grid">
                        {[
                            {
                                icon: <i className="fi fi-rr-graduation-cap"></i>,
                                title: "Mentorship",
                                desc: "Alumni mentor current students through a structured request and chat system with real-time messaging.",
                            },
                            {
                                icon: <i className="fi fi-rr-handshake"></i>,
                                title: "Volunteering",
                                desc: "Browse and apply for volunteer opportunities across Conestoga campuses. Track your application status.",
                            },
                            {
                                icon: <i className="fi fi-rr-newspaper"></i>,
                                title: "Live News",
                                desc: "Stay updated with news scraped directly from the official Conestoga College website — always current.",
                            },
                            {
                                icon: <i className="fi fi-rr-calendar"></i>,
                                title: "Live Events",
                                desc: "Discover upcoming college events with full details, registration links, and location information.",
                            },
                            {
                                icon: <i className="fi fi-rr-comments"></i>,
                                title: "Community Feed",
                                desc: "Post, like, comment, and connect with your peers in a shared community space.",
                            },
                            {
                                icon: <i className="fi fi-rr-bell"></i>,
                                title: "Notifications",
                                desc: "Get notified when your mentor application or volunteer request is approved or rejected.",
                            },
                        ].map((f, i) => (
                            <div className="about-feature-card" key={i}>
                                <div className="about-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="about-section about-tech">
                <div className="about-container">
                    <div className="about-section-label">Built With</div>
                    <h2>Our Tech Stack</h2>
                    <div className="about-tech-grid">
                        {[
                            { name: "React.js", role: "Frontend UI" },
                            { name: "ASP.NET Core", role: "Backend API" },
                            { name: "MongoDB Atlas", role: "Cloud Database" },
                            { name: "SignalR", role: "Real-time Chat" },
                            { name: "JWT + BCrypt", role: "Authentication" },
                            { name: "HtmlAgilityPack", role: "Live Web Scraping" },
                        ].map((t, i) => (
                            <div className="about-tech-chip" key={i}>
                                <span className="about-tech-name">{t.name}</span>
                                <span className="about-tech-role">{t.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="about-section about-team">
                <div className="about-container">
                    <div className="about-section-label">The Team</div>
                    <h2>Built by Group 5</h2>
                    <p className="about-team-sub">
                        A team of Conestoga College students who designed, built, and delivered
                        this platform as part of the SSI Capstone Project.
                    </p>
                    <div className="about-team-grid">
                        {[
                            { name: "Aakash Nair", role: "Chief Bug Whisperer " },
                            { name: "Christ Vijay", role: "Meme Distribution Officer" },
                            { name: "Teena Maria Thomas", role: "Agile Cult Leader" },
                            { name: "Dhruti Rathod", role: "UI Alignment Police" },
                        ].map((m, i) => (
                            <div className="about-team-card" key={i}>
                                <div className="about-team-avatar">
                                    {m.name.charAt(0)}
                                </div>
                                <div className="about-team-name">{m.name}</div>
                                <div className="about-team-role">{m.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="about-container">
                    <h2>Ready to Get Started?</h2>
                    <p>Join the SSI community today and connect with students and alumni across Conestoga College.</p>
                    <div className="about-hero-btns">
                        <button className="about-btn-primary" onClick={() => navigate("/register")}>
                            Create Account
                        </button>
                        <button className="about-btn-secondary" onClick={() => navigate("/news")}>
                            Explore News
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default About;