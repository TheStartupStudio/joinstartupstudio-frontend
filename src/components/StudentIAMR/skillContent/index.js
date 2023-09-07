import {useState,useEffect} from "react";
import ReactPlayer from "react-player";
import { useIamrContext } from '../iamrContext/context'
import "./index.css";

const SkillContent = ({ skill }) => {

  return (
    <div>
       <p className='skill-title pb-3'>
        <span className="text-info fw-bold">{skill.category} - </span> 
        <span className='fw-bold'>{skill?.title} - </span> Content
      </p>
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
