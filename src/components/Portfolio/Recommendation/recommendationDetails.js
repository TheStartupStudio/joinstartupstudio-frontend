import React, { useEffect, useState } from 'react'
import './style.css'
import { Image } from 'react-bootstrap'
import avatar from '../../../assets/images/profile-image.png'

export const RecommendationDetails = (props) => {
  const [recommendation, setRecommendation] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [charset, setCharset] = useState(450)
  const [desktopCharset, setDesktopCharset] = useState(800)

  useEffect(() => {
    setRecommendation(props.recommendation)
  }, [props.recommendation])

  const user = props.recommendation?.fromUser
    ? props.recommendation.fromUser
    : props.recommendation.toUser
  const rcmd_name = user?.name.split(' ')

  const resize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [windowWidth])

  const style = {
    user_proffesion: {
      textAlign: 'left',
      font: 'normal normal 500 12px/16px Montserrat',
      letterSpacing: '0.48px',
      color: '#707070',
      paddingLeft: '1px',
      opacity: '1'
    },
    user_name: {
      textAlign: 'left',
      font: 'normal normal 500 21px/17px Montserrat',
      letterSpacing: '0.84px',
      color: '#333D3D',
      opacity: '1'
    },
    social_links: {
      paddingLeft: '3px'
    }
  }

  return (
    <>
      {recommendation && (
        <>
          {windowWidth > 768 ? (
            <div className='mx-md-2 my-3 recommendation-container d-flex justify-content-center justify-content-md-start'>
              <div className='rcmd-user text-center'>
                <img
                  src={user.profile_image ? user.profile_image : avatar}
                  className='rounded-circle p-0'
                  style={{ width: '100px', height: '100px' }}
                  alt=''
                />
                <h5 className='mt-2 mb-1'>{rcmd_name[0]}</h5>
                <h5 className='my-0'>{rcmd_name[1]}</h5>
                <p className='my-0'>{user.profession}</p>
              </div>
              <div className='break-rcmd d-none'></div>
              <div className='rcmd-description my-auto px-md-5'>
                <span className='user-bio'>
                  {recommendation.description &&
                    recommendation.description.slice(0, desktopCharset)}
                  {recommendation?.description?.length >= desktopCharset &&
                    '...'}
                  {recommendation.description?.length > desktopCharset && (
                    <p className='user-bio-read-more pe-auto m-0 mt-1'>
                      <span
                        onClick={() =>
                          setDesktopCharset(
                            desktopCharset + recommendation.description.length
                          )
                        }
                      >
                        Read More
                      </span>
                    </p>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className='mb-3 w-100'>
              <div className='d-flex'>
                <div className='d-flex my-auto'>
                  <Image
                    src={user?.profile_image ? user?.profile_image : avatar}
                    className='me-2 rounded-circle float-start'
                    style={{ width: '80px', height: '80px' }}
                  />
                </div>
                <div className='my-auto d-flex flex-column'>
                  <p className='m-0' style={style.user_name}>
                    {user?.name}
                  </p>
                  <p
                    className='m-0'
                    style={{ ...style.user_proffesion, display: 'block' }}
                  >
                    {user?.profession ? user?.profession : ''}
                  </p>
                </div>
              </div>
              <div className='rcmd-description mt-2'>
                <span className='user-bio'>
                  {recommendation.description &&
                    recommendation.description.slice(0, charset)}
                  {recommendation?.description?.length >= charset && '...'}
                  {recommendation.description?.length > charset && (
                    <p className='user-bio-read-more pe-auto m-0 mt-1'>
                      <span
                        onClick={() =>
                          setCharset(
                            charset + recommendation.description.length
                          )
                        }
                      >
                        Read More
                      </span>
                    </p>
                  )}
                </span>
              </div>
              {props.length - props.index > 1 &&
                props.modalName !== 'editRcmdModal' && (
                  <hr className='d-md-none mx-auto mb-0 mt-3'></hr>
                )}
            </div>
          )}
        </>
      )}
    </>
  )
}
