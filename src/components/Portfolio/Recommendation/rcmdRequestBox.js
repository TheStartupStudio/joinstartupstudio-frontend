import React, { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import defaultImage from '../../../assets/images/profile-image.png'
import { useHistory } from 'react-router-dom'

export default function RcmdRequestBox(props) {
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`
  const navigate = useHistory()

  const name = props.data.toUser.name.split(' ')

  return (
    <div className='col-auto my-connection-box mt-3 mx-2 p-3'>
      <div className='text-center mb-2'>
        <Image
          src={
            props.data.toUser.profile_image
              ? props.data.toUser.profile_image
              : defaultImage
          }
        />
      </div>
      <h4>{name[0]}</h4>
      {name[1] ? <h4>{name[1]}</h4> : <h4>‎</h4>}
      <p className='mt-0 mb-3'>{props.data.toUser.profession}</p>
      <button
        style={{ width: '100%' }}
        className='d-block mx-auto'
        onClick={() =>
          props.data.status === 'pending'
            ? props.respond(props.data.id)
            : props.continueResponding(props.data.id)
        }
      >
        {props.data.status === 'pending' ? 'VIEW REQUEST' : 'CONTINUE'}
      </button>
    </div>
  )
}
