import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Col } from 'react-bootstrap'
import { formatDateString } from '../../utils/helpers'

const InstructorFeedback = ({ spotlights, setArchiveSpotlightModal }) => {
  return (
    <Col className='spotlight-box '>
      <div className='item-profile__details'>
        <div
          style={{
            height: '36px',
            width: '36px',
            borderRadius: '50%',
            background: '#C8CDD880',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px'
          }}
        >
          <FontAwesomeIcon icon={faComments} />
        </div>
        <p className='p-0 m-0'>Instructor Feedback</p>
      </div>

      <Col className='px-5 pt-0 pb-3'>
        {spotlights
          ?.filter((spotlight) => spotlight.status === 'rejected')
          ?.map((spotlight) => (
            <div className='d-flex align-items-center py-2 application-link'>
              <span className={`dot__${spotlight.status} me-2`}></span>
              <span
                className='cursor-pointer'
                onClick={() =>
                  setArchiveSpotlightModal({
                    state: true,
                    data: spotlight
                  })
                }
              >
                {spotlight.applicationDate
                  ? formatDateString(spotlight.applicationDate)
                  : 'N/A'}{' '}
                {spotlight.productName}
              </span>
            </div>
          ))}
      </Col>
    </Col>
  )
}

export default InstructorFeedback
