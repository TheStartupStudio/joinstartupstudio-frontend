import React from 'react'
import Video from '../../components/Video'
import { Link } from 'react-router-dom'
import './widget.css'

export default function SavedMedia(props) {
  return (
    <>
      <h4
        style={{
          textAlign: 'center',
          color: '#333D3D',
          fontSize: '25px',
          fontWeight: '600'
        }}
      >
        My Saved Videos
      </h4>
      <div className='row saved-videos-widget'>
        {props.savedVideos?.map(
          (video, index) =>
            index < 2 && (
              <div className='col-12 col-sm-6 col-xl-12'>
                <Video
                  id={video.id}
                  key={index}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  description={video.description}
                  page={'saved-videos'}
                  videoData={video}
                  connections={props.connections}
                  type={'widget'}
                  removeSavedVideo={() =>
                    props.removeSavedVideo(video.id, video.type)
                  }
                />
              </div>
            )
        )}
        {props.savedVideos.length > 1 && (
          <Link className='view-all' to={'/savedMedia'}>
            View All
          </Link>
        )}
        {!props.savedVideos.length > 0 && (
          <div className='h-100'>
            <h4 className='text-center mt-5 pt-5 gt-5'>No saved videos!</h4>
          </div>
        )}
      </div>
    </>
  )
}
