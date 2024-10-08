import React from "react";
import ReactPlayer from "react-player";

import { useParams } from "react-router-dom";

const ImrContent = (props) => {
  const { id } = useParams();
  return (
    <div>
      <p className="text-uppercase">{"title"} - INSTRUCTIONS & QUESTIONS </p>
      <ReactPlayer
        className="video_inner media-lightbox__video-player"
        url={
          "https://d5tx03iw7t69i.cloudfront.net/Journal/LearnToStartJournal/LTS_1_-_Welcome_to_your_Learn_to_Start_Journal.mov"
        }
        controls={true}
        showPreview={true}
        width="100%"
        height="100%"
        config={{
          file: { attributes: { controlsList: "nodownload" } },
        }}
        // ref={'videoRef'}
        playing={true}
        // onProgress={({ playedSeconds }) => {
        //   updateLatestInterval(playedSeconds)
        // }}
        // onDuration={(duration) => {
        //   setDuration(duration)
        // }}
        // onSeek={(seconds) => {
        //   setNewInterval(seconds)
        // }}
      />
      <p></p>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </div>
  );
};

export default ImrContent;
