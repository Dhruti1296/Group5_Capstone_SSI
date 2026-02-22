import React, { useEffect } from "react";

const VideoBackground = () => {
  useEffect(() => {
    // Load YouTube IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create player once API is ready
    window.onYouTubeIframeAPIReady = () => {
      window.player = new window.YT.Player("yt-background", {
        videoId: "Hvizqg8gezU", // your video ID
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
                  window.player.seekTo(0); // loop back to start
                }
              }, 1000);
            }
          }
        }
      });
    };
  }, []);

  return (
    <div className="video-container">
      <div id="yt-background" className="background-video"></div>

      <div className="video-overlay">
        <div className="bottom-buttons">
   <button>Explore <span>Alumni</span></button>
<button>Student <span>Services</span></button>
<button>My <span>Account</span></button>
  </div>

         <div className="down-arrow">⮟⮟</div>

      </div>
    </div>
  );
};

export default VideoBackground;