import { useEffect, useState } from "react";
import Div from "../Div";

export default function VideoModal({ videoSrc }) {
  const [iframeSrc, setIframeSrc] = useState("about:blank");
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (videoSrc) {
      if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be")) {
        // C'est une vidéo YouTube
        const videoId = videoSrc.split("?v=")[1].trim();
        setIframeSrc(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        setIsYouTubeVideo(true);
      } else {
        // C'est une vidéo interne
        setIframeSrc(videoSrc);
        setIsYouTubeVideo(false);
      }
      setToggle(true);
    }
  }, [videoSrc]);

  const handelClose = () => {
    setIframeSrc("about:blank");
    setToggle(false);
  };

  return (
    <>
      <Div className={toggle ? "cs-video_popup active" : "cs-video_popup"}>
        <Div className="cs-video_popup_overlay" />
        <Div className="cs-video_popup_content">
          <Div className="cs-video_popup_layer" />
          <Div className="cs-video_popup_container">
            <Div className="cs-video_popup_align">
              <Div className="embed-responsive embed-responsive-16by9">
                {isYouTubeVideo ? (
                  // Affichage pour une vidéo YouTube
                  <iframe className="embed-responsive-item" src={iframeSrc} title="video modal" />
                ) : (
                  // Affichage pour une vidéo interne
                  <video className="embed-responsive-item" src={iframeSrc} title="video modal" controls autoPlay />
                )}
              </Div>
            </Div>
            <Div className="cs-video_popup_close" onClick={handelClose} />
          </Div>
        </Div>
      </Div>
    </>
  );
}
