import React from "react";

const Footer = () => (
  <footer
    id="contact-footer"
    className="site-footer animate-when-content-appears"
  >
    <div className="footer-card">
      {/* Contact Info */}
      <div className="footer-contact">
        <h3>Contact</h3>
        <p>
          299 Doon Valley Drive
          <br />
          Kitchener, Ontario N2G 4M4, Canada
        </p>
        <p>Phone: 519-748-5220</p>
        <a
          href="https://www.conestogac.on.ca/about/campuses-and-locations"
          className="footer-link"
        >
          Campus Maps
        </a>
      </div>

      {/* Social Media */}
      <div className="footer-social">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a
            href="https://www.facebook.com/ConestogaCollege"
            className="social-icon facebook"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://x.com/ConestogaC"
            className="social-icon twitter"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/conestogacollege/"
            className="social-icon instagram"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://ca.linkedin.com/school/conestoga-college-institute-of-technology-and-advanced-learning/"
            className="social-icon linkedin"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://www.youtube.com/c/ConestogaCollegeOfficial"
            className="social-icon youtube"
            aria-label="YouTube"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
