import React from "react";
import ReactPlayer from "react-player";
import "./index.css";

const SkillContent = ({ skill }) => {
  return (
    <div>
      <ReactPlayer
        className="video_inner media-lightbox__video-player mb-3"
        url={skill?.video}
        controls={true}
        light={
          "https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg"
        }
        width="100%"
        height="300px"
        config={{
          file: { attributes: { controlsList: "nodownload" } },
        }}
        playing={true}
      />
      <p className="page-content-title mb-2"></p>
      <p className="page-content-text">{skill?.description}</p>
    </div>
  );
};

export default SkillContent;
