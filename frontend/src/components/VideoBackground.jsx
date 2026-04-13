import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VideoBackground = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let checkInterval = null;

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        window.player = new window.YT.Player("yt-background", {
          videoId: "Hvizqg8gezU",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            start: 0
          },
          events: {
            onReady: (event) => {
              event.target.seekTo(0);
              event.target.playVideo();

              const overlay = document.querySelector(".video-fade-overlay");
              if (overlay) {
                overlay.classList.add("fade-in");
                setTimeout(() => overlay.classList.remove("fade-in"), 1200);
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (checkInterval) clearInterval(checkInterval);
                checkInterval = setInterval(() => {
                  if (
                    window.player &&
                    typeof window.player.getCurrentTime === "function"
                  ) {
                    const currentTime = window.player.getCurrentTime();
                    if (currentTime >= 84) {
                      window.player.seekTo(0);
                    }
                  }
                }, 1000);
              } else {
                if (checkInterval) {
                  clearInterval(checkInterval);
                  checkInterval = null;
                }
              }
            }
          }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (window.player && typeof window.player.destroy === "function") {
        window.player.destroy();
        window.player = null;
      }
    };
  }, []);

  //  Add IntersectionObserver for link bar
  useEffect(() => {
    const linkBar = document.querySelector(".link-bar");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            linkBar.classList.add("content-appeared");
          } else {
            linkBar.classList.remove("content-appeared");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (linkBar) observer.observe(linkBar);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="video-container">
        <div id="yt-background" className="background-video"></div>
        <div className="video-fade-overlay"></div>

        <div className="video-overlay">
          <div className="bottom-buttons">
            <button onClick={() => navigate("/alumni")}>
              Explore <span>Alumni</span>
            </button>
            <button onClick={() => window.open("https://www.conestogac.on.ca/", "_blank")}>
              Student <span>Services</span>
            </button>
            <button onClick={() => navigate("/login")}>
              Account <span>Login</span>
            </button>
          </div>
          <div className="down-arrow">⮟⮟</div>
        </div>
      </div>

      {/*  Link bar animates on scroll */}
      <div className="link-bar animation-group animation-zoom-in">
        <a href="/about" className="nav-link animation-item">About</a>
        <a href="/news" className="nav-link animation-item">News</a>
        <a href="/events" className="nav-link animation-item">Events</a>
        <a
          href="#contact-footer"
          className="nav-link animation-item"
          onClick={(e) => {
            e.preventDefault();
            const footer = document.getElementById("contact-footer");
            if (footer) footer.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Contact
        </a>
      </div>

      <div className="community-section">
        <p>
          We support your academic success, personal growth, and overall well-being
          throughout your college journey. From guidance and campus resources to Alumni
          Connect opportunities, we’re here to help you. Learn more about us at...{" "}
          <a href="/about" className="circle-arrow">⮞⮞</a>
        </p>
      </div>
    </>
  );
};

export default VideoBackground;