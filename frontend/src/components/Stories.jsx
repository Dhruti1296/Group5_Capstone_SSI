import React from "react";
import "./Stories.css";

const storiesData = [
  {
    id: 1,
    author: "Aarav Mehta",
    title: "Volunteering at the Alumni Meet",
    content: "Last weekend I helped organize the alumni meet — it was inspiring to see so many graduates return and share their journeys.",
    date: "March 5, 2026"
  },
  {
    id: 2,
    author: "Priya Sharma",
    title: "Launching My Startup",
    content: "Excited to announce the launch of my ed-tech startup! Grateful for the mentorship I received from our alumni network.",
    date: "March 3, 2026"
  },
  {
    id: 3,
    author: "Rahul Singh",
    title: "Community Service Drive",
    content: "We organized a blood donation camp with 120+ participants. Proud moment for our student community!",
    date: "March 1, 2026"
  },
  {
    id: 4,
    author: "Sneha Patel",
    title: "Research Paper Published",
    content: "My paper on AI-driven healthcare solutions was published in an international journal. Thank you to my professors for guidance.",
    date: "Feb 28, 2026"
  }
];

function Stories() {
  return (
    <div className="stories-container">
      {storiesData.map(story => (
        <div key={story.id} className="story-card">
          <h3 className="story-title">{story.title}</h3>
          <p className="story-content">{story.content}</p>
          <div className="story-footer">
            <span className="story-author">By {story.author}</span>
            <span className="story-date">{story.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stories;