import React, { useEffect } from 'react'
import ReactPlayer from 'react-player'

import './index.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const SkillContent = ({ skill }) => {
  const history = useHistory()

  // useEffect(() => history.push(`/iamr/${skill.type}/${skill.id}/instructions`))

  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
      <ReactPlayer
        className="video_inner media-lightbox__video-player "
        style={{ padding: '20px 5px 20px 20px' }}
        url={skill?.video}
        controls={true}
        light={
          'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg'
        }
        width="100%"
        height="500px"
        config={{
          file: { attributes: { controlsList: 'nodownload' } }
        }}
        playing={true}
      />
      <p className="page-content-title mb-2"></p>
      <p className="page-content-text ps-3">
        Watch the video to learn how the Certification System work
      </p>
    </div>
  )
}

export default SkillContent
