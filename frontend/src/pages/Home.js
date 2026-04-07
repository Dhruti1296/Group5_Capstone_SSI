function Home() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <div>
      {/* HERO SECTION */}
      <div className="bg-primary text-white text-center py-5">
        <h1 className="display-5 fw-bold">
          Student Service Interface (SSI)
        </h1>
        <p className="lead">
          Your one-stop platform for student services and support
        </p>
      </div>
      {/* WELCOME CARD */}
      <div className="container mt-5">
        <div className="card shadow border-0">
          <div className="card-body text-center p-4">
            {username ? (
              <>
                <h3 className="text-success">
                  Welcome {username}
                </h3>
                <p className="text-muted">
                  Role: <strong>{role}</strong>
                </p>
                <p>
                  You are successfully logged into the SSI platform.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-secondary">
                  Welcome Guest
                </h3>
                <p>
                  Please login or register to access all features.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="container mt-5">
        <h3 className="text-center mb-4">
          Our Services
        </h3>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h5 className="card-title">
                  Student Services
                </h5>
                <p>
                  Access campus support, academic help,
                  and student resources.
                </p>
              </div>
            </div>

          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h5 className="card-title">
                  Stories & Blogs
                </h5>
                <p>
                  Read and share student and alumni experiences.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h5 className="card-title">
                  Notifications
                </h5>
                <p>
                  Stay updated with latest campus announcements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ABOUT SECTION */}

      <div className="container mt-5 mb-5">
        <div className="card shadow border-0">
          <div className="card-body text-center">
            <h4>
              About SSI
            </h4>
            <p className="text-muted">

              Student Service Interface (SSI) helps students and alumni
              connect with campus services, share experiences,
              and manage their accounts efficiently.

              This system is built using React, ASP.NET Core, and MongoDB.

            </p>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="bg-dark text-white text-center p-3">
        © 2026 Student Service Interface | Capstone Project
      </footer>
    </div>
  );
}

export default Home;



