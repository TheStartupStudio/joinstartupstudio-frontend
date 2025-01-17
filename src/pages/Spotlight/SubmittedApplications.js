import { faArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Col } from 'react-bootstrap'
import { formatDateString } from '../../utils/helpers'

const SubmittedApplications = ({ spotlights, setArchiveSpotlightModal }) => {
  return (
    <Col md='6' className='spotlight-box' style={{ marginRight: '20px' }}>
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
          <FontAwesomeIcon icon={faArchive} />
        </div>
        <p className='p-0 m-0'>Submitted Applications</p>
      </div>

      <Col className='px-5 pt-0 pb-3'>
        {spotlights?.map((spotlight) => (
          <div
            key={spotlight.id}
            className='d-flex align-items-center py-2 application-link'
          >
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

export default SubmittedApplications
