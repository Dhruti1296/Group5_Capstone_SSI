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

                    {/* ABOUT SECTION */}
                    <div className="about-section">
                        <h3>About SSI</h3>
                        <p>
                            SSI (Student Service Interface) connects students and alumni to
                            foster networking, mentorship, and career growth. We aim to build
                            a strong and supportive academic community.
                        </p>
                    </div>

                    {/* TEAM SECTION */}
                    <div className="team-section">
                        <h3>Meet Our Team Members</h3>

                        {/* Row 1 */}
                        <div className="team-row">

                            <div className="team-member">
                                <div className="member-content">
                                    <div className="member-text">
                                        <h4>Aakash Nair</h4>
                                        <p className="role">Product Owner & Frontend Developer</p>
                                        <p>
                                            Responsible for defining project requirements, managing features,
                                            and contributing to frontend development. Ensures smooth collaboration
                                            between team members and alignment with project goals.
                                        </p>
                                    </div>
                                    <img src="/images/profile_M.png" alt="Aakash" />
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-content">
                                    <div className="member-text">
                                        <h4>Christy Vijay</h4>
                                        <p className="role">Backend Developer</p>
                                        <p>
                                            Responsible for backend development and testing of the application.
                                            Designed and implemented APIs, handled database integration, and ensured
                                            secure and efficient data processing. Also performed backend testing to
                                            validate functionality, identify bugs, and ensure reliability of system features.
                                        </p>
                                    </div>
                                    <img src="/images/profile_M.png" alt="ChristVijay" />
                                </div>
                            </div>

                        </div>

                        {/* Row 2 */}
                        <div className="team-row">

                            <div className="team-member">
                                <div className="member-content">
                                    <div className="member-text">
                                        <h4>Dhruti Rathod</h4>
                                        <p className="role">UI/UX Designer, Frontend Developer & Tester</p>
                                        <p>
                                            Designed wireframes and developed responsive frontend pages.
                                            Integrated APIs and performed frontend testing to ensure smooth
                                            user interaction and consistent UI design.
                                        </p>
                                    </div>
                                    <img src="/images/profile.png" alt="Dhruti" />
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-content">
                                    <div className="member-text">
                                        <h4>Teena Maria</h4>
                                        <p className="role">Backend Developer & Scrum Master</p>
                                        <p>
                                            Managed backend development tasks and coordinated team activities.
                                            Ensured timely progress, organized meetings, and maintained project
                                            workflow using agile methodologies.
                                        </p>
                                    </div>
                                    <img src="/images/profile.png" alt="Teena" />
                                </div>
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
