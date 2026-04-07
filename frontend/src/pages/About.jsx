import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
return (
<> <Navbar />

  <div className="about-wrapper">

    <h2 className="about-title">ABOUT US</h2>

    <div className="about-card">

      <div className="about-section">
        <h3>About SSI</h3>
        <p>
          SSI (Student Service Interface) connects students and alumni to
          foster networking, mentorship, and career growth. We aim to build
          a strong and supportive academic community.
        </p>
      </div>

      <div className="team-section">
        <h3>Meet Our Team Members</h3>

        <div className="team-row">
          <div className="team-member">
            <h4>Aakash Nair</h4>
            <p>Backend Developer</p>
          </div>

          <div className="team-member">
            <h4>Christy Vijay</h4>
            <p>Backend Developer</p>
          </div>
        </div>

        <div className="team-row">
          <div className="team-member">
            <h4>Dhruti Rathod</h4>
            <p>UI/UX Designer, Frontend Developer and Tester</p>
            <p>
                Frontend Developer, UI/UX Designer, and Tester. Responsible for designing wireframes, developing responsive pages, integrating APIs, and performing frontend testing to ensure a smooth user experience.
            </p>
          </div>

          <div className="team-member">
            <h4>Teena Maria</h4>
            <p>UI/Testing</p>
          </div>
        </div>

      </div>

    </div>

  </div>

  <Footer />
</>

);
}

export default About;
