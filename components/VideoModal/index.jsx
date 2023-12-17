import { useEffect, useState } from "react";
import Div from "../Div";

export default function VideoModal({ videoSrc, bgUrl, variant }) {
  const [iframeSrc, setIframeSrc] = useState("about:blank");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (videoSrc) {
      const videoId = videoSrc.split("?v=")[1].trim();
      setIframeSrc(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
    }
  }, [videoSrc]);

  useEffect(() => {
    if (videoSrc) {
      setToggle(true);
    }
  }, [videoSrc]);

  const handelClick = () => {
    const video = videoSrc.split("?v=")[1].trim();
    setIframeSrc(`https://www.youtube.com/embed/${video}`);
    setToggle(!toggle);
  };

  const handelClose = () => {
    setIframeSrc("about:blank");
    setToggle(false);
  };

  return (
    <>
      <Div
        className={`cs-video_block ${variant ? variant : "cs-style1"} cs-video_open cs-bg`}
        style={{ backgroundImage: `url(${bgUrl})` }}
        onClick={handelClick}>
        <span className="cs-player_btn cs-accent_color">
          <span />
        </span>
      </Div>
      <Div className={toggle ? "cs-video_popup active" : "cs-video_popup"}>
        <Div className="cs-video_popup_overlay" />
        <Div className="cs-video_popup_content">
          <Div className="cs-video_popup_layer" />
          <Div className="cs-video_popup_container">
            <Div className="cs-video_popup_align">
              <Div className="embed-responsive embed-responsive-16by9">
                <iframe className="embed-responsive-item" src={iframeSrc} title="video modal" />
              </Div>
            </Div>
            <Div className="cs-video_popup_close" onClick={handelClose} />
          </Div>
        </Div>
      </Div>
    </>
  );
}
