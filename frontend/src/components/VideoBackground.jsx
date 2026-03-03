import React, { useEffect } from "react";

const VideoBackground = () => {
  useEffect(() => {
    // YouTube IFrame API setup
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
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
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setInterval(() => {
                if (window.player.getCurrentTime() >= 84) {
                  window.player.seekTo(0);
                }
              }, 1000);
            }
          }
        }
      });
    };
  }, []);

  // IntersectionObserver for nav link animation
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

        <div className="video-overlay">
          <div className="bottom-buttons">
            <button>Explore <span>Alumni</span></button>
            <button>Student <span>Services</span></button>
            <button>Account <span>Login</span></button>
          </div>
          <div className="down-arrow">⮟⮟</div>
        </div>
      </div>

      {/* Horizontal link bar with animation classes */}
      <div className="link-bar animation-group animation-zoom-in">
        <a href="/about" className="nav-link animation-item">About</a>
        <a href="/news" className="nav-link animation-item">News</a>
        <a href="/events" className="nav-link animation-item">Events</a>
        <a href="/contact" className="nav-link animation-item">Contact</a>
      </div>

      <div className="community-section">
        <p>
          We support your academic success, personal growth, and overall well-being
          throughout your college journey. From guidance and campus resources to Alumni
          Connect opportunities, we’re here to help you thrive during and beyond your
          time on campus. Learn more about us at...{" "}
          <a href="/about" className="circle-arrow">⮞⮞</a>
        </p>
      </div>
    </>
  );
};

export default VideoBackground;