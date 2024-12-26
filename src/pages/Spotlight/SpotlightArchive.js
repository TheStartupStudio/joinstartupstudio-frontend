import React from 'react'
import { Row } from 'react-bootstrap'

const SpotlightArchive = () => {
  return (
    <Row className='spot-archive-wrapper'>
      <Row>
        <div>
          <div className='d-flex justify-content-between guidance-videos-top  guidance-encouragement-page-titles '>
            <h3 className='spot-archive-title'>Spotlight Archive</h3>
            <span
              className={'spotlight-archive-view-btn d-flex align-items-end  '}
              style={{ color: '#766C6EFD' }}
            >
              View all
            </span>
          </div>
        </div>
      </Row>
      <div className='beyond-videos-desktop mt-5 d-flex align-items-center justify-content-center '>
        <p className='archive-placeholder-title'>
          Stay tuned for the 2025 Spotlight Pitches
        </p>
      </div>
    </Row>
  )
}

export default SpotlightArchive
