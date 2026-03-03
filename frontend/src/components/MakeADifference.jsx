import React, { useEffect } from "react";
import "./MakeADifference.css";

const MakeADifference = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("content-appeared");
          } else {
            entry.target.classList.remove("content-appeared");
          }
        });
      },
      { threshold: 0.1 } // easier trigger
    );

    document
      .querySelectorAll(".animate-when-content-appears, .animation-item")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Background section */}
      <section className="make-a-difference-section">
        <div className="section-bg-image-container">
          <img
            className="section-bg-image"
            src="/images/about.jpg"
            alt="Community background"
          />
          <div className="overlay"></div>
        </div>

        <div className="section-title-container">
          <h2 className="section-title animate-when-content-appears">
            <b className="slide-from-left">Make a Difference.</b>
            <b className="slide-from-right nice-big-serif">Give Back.</b>
          </h2>

          <p className="section-intro-text animate-when-content-appears">
            The community’s annual support of College priorities is a crucial
            component of what makes our education possible and exceptional.
            Experience the joy and rewards of giving back.
          </p>
        </div>
      </section>

      {/* Cards section below background */}
      <section className="cards-section">
        {/* Centered intro text above cards */}
        <div className="cards-intro-text">
          <p>
            Our comprehensive range of programming meets the needs of a variety of learners,
            providing multiple entry points and established pathways to ensure that individuals across our
            community can access the education they need for their chosen careers.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid cols-3 animation-zoom-in animation-group">
          <div className="card animation-item">
            <a href="https://example.com" className="card-link">
              <img src="/images/card1.jpg" alt="Card 1" />
              <div className="card-body">
                <h3 className="card-title">Best College in Ontario</h3>
                <p>Conestoga has been ranked as the Best College in Ontario by CourseCompare for the second consecutive year.</p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </a>
          </div>

          <div className="card animation-item">
            <a href="https://example.com" className="card-link">
              <img src="/images/card2.jpg" alt="Card 2" />
              <div className="card-body">
                <h3 className="card-title">Be a Mentor</h3>
                <p>An extraordinary opportunity to develop positive relationships with students and help them navigate the campus life.</p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </a>
          </div>

          <div className="card animation-item">
            <a href="https://example.com" className="card-link">
              <img src="/images/card3.jpg" alt="Card 3" />
              <div className="card-body">
                <h3 className="card-title">Volunteer</h3>
                <p>An incredible way to enrich your life and the lives of others in countless ways.</p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default MakeADifference;