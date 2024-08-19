import React from 'react'
import { Col } from 'react-bootstrap'
import { InfoBox } from '../ContentItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const SelectInstructorView = () => {
  return (
    <Col>
      <InfoBox
        cn='my-3 d-flex align-items-center justify-content-center'
        style={{ minHeight: '330px' }}
      >
        <div className='d-flex align-items-center'>
          <div
            style={{
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              padding: '5px',
              background: '#C8CDD880',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px'
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </div>
          <span>Please select an instructor to view data</span>
        </div>
      </InfoBox>
    </Col>
  )
}

export default SelectInstructorView
