import React, { useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import InterviewSection from './InterviewSection'
import MediaLightbox from '../../components/MediaLightbox'
import { useHistory } from 'react-router-dom'

function InterviewedMentors(props) {
  const [video, setVideo] = useState(null)

  const { accordion, journal } = props
  const navigate = useHistory()
  const navigateToStoryInMotion = () => {
    navigate.push('/story-in-motion')
  }
  return (
    <div className={'row py-2 px-3'}>
      <div
        className={'col-lg-4 col-md-12'}
        style={{ borderRight: ' 2px solid #E5E5E5' }}
      >
        <div className={'my-2'}>
          <div className={'d-flex flex-column align-items-center'}>
            <label
              className={'upload-image-box position-relative p-0 my-2'}
              onClick={navigateToStoryInMotion}
            >
              <img
                src={
                  accordion?.interviewedMentor?.mentorLogoUrl?.length > 0
                    ? accordion?.interviewedMentor?.mentorLogoUrl
                    : 'https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'
                }
                style={{
                  width: '100%',
                  height: '100%'
                }}
                alt="Thumb"
              />
              <FaPlay
                className="position-absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                  opacity: 0.7,
                  color: 'white',
                  marginLeft: 3
                }}
              />
            </label>
            <div
              className={'my-2'}
              onClick={navigateToStoryInMotion}
              style={{
                font: 'normal normal 400 12px/14px Montserrat',
                color: '#FE43A1',
                cursor: 'pointer'
              }}
            >
              Click to view full episodes
            </div>
          </div>
          <div>
            <div className={'mentor-title'}>
              {accordion?.interviewedMentor?.mentorName}
            </div>
            {accordion?.interviewedMentor?.mentorDescription?.map((desc) => {
              return <div className={'mentor-description'}>{desc.title}</div>
            })}
          </div>
        </div>
      </div>
      <div className={'col-lg-8 col-md-12'}>
        <div>
          <InterviewSection
            part="part-1"
            interviews={accordion?.interviewedMentor?.interviews}
            setVideo={setVideo}
            journal={journal}
          />
          <div className={'pt-3'}>
            <InterviewSection
              part="part-2"
              interviews={accordion?.interviewedMentor?.interviews}
              setVideo={setVideo}
              journal={journal}
            />
          </div>
        </div>
      </div>
      {video && (
        <MediaLightbox
          video={video}
          // key={index}
          show={!!video}
          onClose={() => setVideo(false)}
          // watchData={videoWatchData}
          // onVideoData={saveWatchData}
          // onVideoWatched={saveVideoWatched}
        />
      )}
    </div>
  )
}

export default InterviewedMentors
