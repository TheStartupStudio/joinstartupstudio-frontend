import React from 'react'
import { Image } from 'react-bootstrap'
import defaultImage from '../../assets/images/profile-image.png'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'

export default function StudentBox(props) {
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`
  const navigate = useHistory()
  const name = props.data.name.split(' ')
  return (
    <div className={`col-auto my-connection-box mx-2 p-3`}>
      <div className='text-center mb-2'>
        <Image
          src={
            props.data.profile_image ? props.data.profile_image : defaultImage
          }
        />
      </div>
      <h4>{name[0]}</h4>
      {name[1] ? <h4>{name[1]}</h4> : <h4>‎</h4>}
      <p className='mt-0 mb-3'>{props.data.profession}</p>

      <>
        <button
          className='d-block mx-auto'
          onClick={() =>
            navigate.push(`/public-portfolio/${encodeURIComponent(props.data.username)}`)
          }
        >
          PORTFOLIO
        </button>
      </>
    </div>
  )
}
