import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./MakeADifference.css";

const MakeADifference = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".animate-when-content-appears, .animation-item")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleBecomeMentor = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/register");
    } else if (user.role === "Alumni") {
      navigate("/become-mentor");
    } else {
      // Student or any other role
      navigate("/mentor");
    }
  };

  const handleVolunteer = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/register");
    } else {
      navigate("/volunteer");
    }
  };

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
        </div>
      </section>

      {/* Cards section */}
      <section className="cards-section">
        <div className="cards-intro-text">
          <p>
            Our comprehensive range of programming meets the needs of a variety
            of learners, providing multiple entry points and established
            pathways to ensure that individuals across our community can access
            the education they need for their chosen careers.
          </p>
        </div>

        <div className="grid cols-3 animation-zoom-in animation-group">
          {/* Best College in Ontario */}
          <div className="card animation-item">
            <a
              className="card-link"
              href="https://blogs1.conestogac.on.ca/news/2026/01/conestoga_ranked_best_college.php"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/images/card1.jpg" alt="Card 1" />
              <div className="card-body">
                <h3 className="card-title">Best College in Ontario</h3>
                <p>
                  Conestoga has been ranked as the Best College in Ontario by
                  CourseCompare for the second consecutive year.
                </p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </a>
          </div>

          {/* Be a Mentor */}
          <div className="card animation-item">
            <button className="card-link" onClick={handleBecomeMentor}>
              <img src="/images/card2.jpg" alt="Card 2" />
              <div className="card-body">
                <h3 className="card-title">Be a Mentor</h3>
                <p>
                  {!user
                    ? "Sign up to mentor students and help them navigate campus life."
                    : user.role === "Alumni"
                      ? "Apply to become a mentor and guide current Conestoga students."
                      : "Connect with an alumni mentor who can help guide your journey."}
                </p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </button>
          </div>

          {/* Volunteer */}
          <div className="card animation-item">
            <button className="card-link" onClick={handleVolunteer}>
              <img src="/images/card3.jpg" alt="Card 3" />
              <div className="card-body">
                <h3 className="card-title">Volunteer</h3>
                <p>
                  {!user
                    ? "Sign up to browse and apply for volunteer opportunities."
                    : "Browse open volunteer opportunities and apply today."}
                </p>
                <span className="card-arrow">⮞⮞</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MakeADifference;
