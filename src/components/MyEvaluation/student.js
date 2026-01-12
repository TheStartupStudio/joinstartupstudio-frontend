import { memo, useState } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'
import { useHistory } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'

function Student({ student, subject, setSelectedUser, journalSelected }) {
  const history = useHistory()

  return (
    <>
      <div
        className={`single-ticket d-flex 
        
        //   !ticket.read_by_instructor ? 'unread' : ''
        // }`}
        onClick={() => {
          if (subject == 'PORTFOLIO') {
            history.push(`/public-portfolio/${student.username}`)
          } else if (subject == 'CERTIFICATE') {
            history.push(`/student-iamr/${student.id}`)
          } else {
            setSelectedUser(student)
          }
        }}
      >
        <img
          //   src={ticket.User.profile_image ? ticket.User.profile_image : imgTest}
          src={student.profile_image ? student.profile_image : imgTest}
          alt='profile'
          className='rounded-circle'
        />
        <div className='ticket-information d-flex flex-column mx-2 min-w-0'>
          <h5 className='from'>{student.name}</h5>
          {/* <p className='subject'>
            Subject: <span className='fw-bold'> {subject ? subject : ''} </span>
          </p> */}
        </div>
        {/* <div className='ticket-status d-flex align-items-center'>
          <p className='my-auto pe-2' style={{ color: '#ccc' }}></p>
          <p className='my-auto pl-2'></p>
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              fontSize: '13px',
              textAlign: 'right',
              marginLeft: '5px'
            }}
            className={`status received_feedback`}
          />
        </div> */}
      </div>
    </>
  )
}

export default memo(Student)
