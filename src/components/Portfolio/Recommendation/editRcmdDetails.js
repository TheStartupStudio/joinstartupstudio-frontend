import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import defaultImage from '../../../assets/images/profile-image.png'

export const EditRcmdDetails = (props) => {
  const [recommendation, setRecommendation] = useState()
  const [newRcmdDescription, setNewRcmdDescription] = useState(
    '' || props.recommendation.description
  )
  const [isEditing, setIsEditing] = useState(false)
  const rcmd_name = recommendation?.toUser?.name.split(' ')

  useEffect(() => {
    setRecommendation(props.recommendation)
  }, [props.recommendation])

  return (
    <>
      {recommendation &&
        (!isEditing ? (
          <div
            className='edit-rcmd-responsive my-3'
            style={{
              border: '1px solid #bbbdbf',
              borderRadius: '6px'
            }}
          >
            <div className='mx-md-2 my-3 recommendation-container d-flex justify-content-center justify-content-md-start'>
              <div className='rcmd-user text-center'>
                {/* {recommendation.status === 'pending' && (
                  <p className='text-start mb-0 pendingLabel'>
                    PENDING
                  </p>
                )} */}
                <img
                  src={
                    recommendation?.toUser?.profile_image
                      ? recommendation?.toUser?.profile_image
                      : defaultImage
                  }
                  className='rounded-circle p-0'
                  style={{ width: '100px', height: '100px' }}
                  alt=''
                />
                <h5 className='mt-2 mb-1'>{rcmd_name[0]}</h5>
                <h5 className='my-0'>{rcmd_name[1]}</h5>
                <p className='my-0'>{recommendation.toUser.profession}</p>
              </div>
              <div className='break-rcmd d-none'></div>
              <div className='rcmd-description my-auto px-md-5'>
                <p>{recommendation.description}</p>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faPencilAlt}
              style={{
                width: '22px',
                height: '20px',
                color: '#707070',
                cursor: 'pointer'
              }}
              className='me-3 mt-3 rcmd-edit-icon'
              onClick={() => setIsEditing(true)}
            />
          </div>
        ) : (
          <div className='editing-rcmd my-3'>
            <div className='mx-md-2 my-3 recommendation-container d-flex justify-content-center justify-content-md-start'>
              <div className='rcmd-user text-center'>
                <img
                  src={recommendation.toUser.profile_image}
                  className='rounded-circle p-0'
                  style={{ width: '100px', height: '100px' }}
                  alt=''
                />
                <h5 className='mt-2 mb-1'>{rcmd_name[0]}</h5>
                <h5 className='my-0'>{rcmd_name[1]}</h5>
                <p className='my-0'>{recommendation.toUser.profession}</p>
              </div>
              <div className='break-rcmd d-none'></div>
              <div className='rcmd-description px-3 ps-md-5 pe-md-2 w-100'>
                <textarea
                  value={newRcmdDescription}
                  onChange={(e) => setNewRcmdDescription(e.target.value)}
                />
                <div className='d-flex justify-content-between'>
                  <div className='contact-us'>
                    <button
                      onClick={() => props.handleDelete(recommendation.id)}
                      style={{ backgroundColor: '#BBBDBF' }}
                      className='mt-2 my-auto'
                    >
                      DELETE
                    </button>
                  </div>
                  <div className='contact-us'>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        props.handleUpdate({
                          id: recommendation.id,
                          description: newRcmdDescription,
                          index: props.index
                        })
                      }}
                      className='mt-2 my-auto'
                    >
                      UPDATE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  )
}
