import React, { useEffect, useState } from 'react'
import './style.css'
import { Image } from 'react-bootstrap'
import avatar from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

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
      opacity: '1',
    },
    user_name: {
      textAlign: 'left',
      font: 'normal normal 500 21px/17px Montserrat',
      letterSpacing: '0.84px',
      color: '#333D3D',
      opacity: '1',
    },
    social_links: {
      paddingLeft: '3px',
    },
  }
  const RecommendationUser = () => {
    return (
      <div>
        {props.isEdit && (
          <div>
            <img src={user.profile_image} style={{ width: 75, height: 75 }} />{' '}
            {/*{user}*/}
          </div>
        )}
        <div
          style={{
            textAlign: props.isEdit ? 'center' : 'left',
            font: props.isEdit
              ? 'normal normal 500 20px Montserrat'
              : 'normal normal 400 22px Montserrat',
            letterSpacing: 0,
            color: '#707070',
            textTransform: props.isEdit ? 'capitalize' : 'uppercase',
          }}
          // className="mt-2 mb-1"
        >
          {rcmd_name[0]} {rcmd_name[1]}
        </div>
        <div
          style={{
            textAlign: props.isEdit ? 'center' : 'left',
            font: props.isEdit
              ? 'normal normal 400 11px Montserrat'
              : 'normal normal 600 17px Montserrat',
            letterSpacing: 0.68,
            color: '#231F20',
            textTransform: 'capitalize',
          }}
          // className="my-0"
        >
          {user.profession}
        </div>
      </div>
    )
  }

  return (
    <>
      {recommendation && (
        <>
          {windowWidth > 768 ? (
            <div
              style={{
                display: 'flex',
                padding: '20px 10px',
                width: '100%',
              }}
              // className="mx-md-2 my-3 recommendation-container d-flex justify-content-center justify-content-md-start"
            >
              <div
                className="rcmd-user text-center"
                style={{
                  width: props.isEdit ? '15%' : '30%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: props.isEdit ? '0px ' : '1px solid #e5e5e5',
                  paddingRight: props.isEdit ? 0 : 40,
                }}
              >
                {/*<img*/}
                {/*  src={user.profile_image ? user.profile_image : avatar}*/}
                {/*  className='rounded-circle p-0'*/}
                {/*  style={{ width: '100px', height: '100px' }}*/}
                {/*  alt=''*/}
                {/*/>*/}
                <RecommendationUser />
              </div>
              {/*<div className="break-rcmd d-none"></div>*/}
              <div
                className={'d-flex justify-content-between '}
                style={{ width: props.isEdit ? '85%' : '70%' }}
              >
                <div
                  className="rcmd-description "
                  style={{ paddingLeft: 20, width: '100%' }}
                >
                  <span
                    className="user-bio"
                    style={{
                      textAlign: 'left',
                      font: 'normal normal 300 15px/17px Montserrat',
                      letterSpacing: 0.6,
                      color: '#231F20',
                    }}
                  >
                    {recommendation?.description &&
                      recommendation?.description.slice(0, desktopCharset)}
                    {recommendation?.description?.length >= desktopCharset &&
                      '...'}
                    {recommendation?.description?.length > desktopCharset && (
                      <p className="user-bio-read-more pe-auto m-0 mt-1">
                        <span
                          onClick={() =>
                            setDesktopCharset(
                              desktopCharset +
                                recommendation?.description?.length
                            )
                          }
                        >
                          Read More
                        </span>
                      </p>
                    )}
                  </span>
                </div>
                {props.isEdit && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{
                      width: '22px',
                      height: '20px',
                      color: '#ff2094',
                      cursor: 'pointer',
                    }}
                    className=" rcmd-edit-icon"
                    onClick={() => props.handleDelete(recommendation?.id)}
                    // onClick={() => handleDelete(recommendation.id)}
                  />
                  // <FontAwesomeIcon
                  //   icon={faPencilAlt}
                  //   onClick={() => {
                  //     // props.setCurrentExperience(experience)
                  //   }}
                  //   color={'#707070'}
                  //   className="editICO"
                  //   style={{
                  //     height: '25px',
                  //     width: '25px',
                  //   }}
                  // />
                )}
              </div>
            </div>
          ) : (
            <div className="mb-3 w-100">
              <div className="d-flex">
                <div className="d-flex my-auto">
                  <Image
                    src={user?.profile_image ? user?.profile_image : avatar}
                    className="me-2 rounded-circle float-start"
                    style={{ width: '80px', height: '80px' }}
                  />
                </div>
                <div className="my-auto d-flex flex-column">
                  <p className="m-0" style={style.user_name}>
                    {user?.name}
                  </p>
                  <p
                    className="m-0"
                    style={{ ...style.user_proffesion, display: 'block' }}
                  >
                    {user?.profession ? user?.profession : ''}
                  </p>
                </div>
              </div>
              <div className={'d-flex justify-content-between w-100'}>
                <div
                  className="rcmd-description"
                  style={{ paddingLeft: 20, width: '100%' }}
                >
                  <span
                    className="user-bio"
                    style={{
                      textAlign: 'left',
                      font: 'normal normal 300 15px/17px Montserrat',
                      letterSpacing: 0.6,
                      color: '#231F20',
                    }}
                  >
                    {recommendation.description &&
                      recommendation.description.slice(0, charset)}
                    {recommendation?.description?.length >= charset && '...'}
                    {recommendation.description?.length > charset && (
                      <p className="user-bio-read-more pe-auto m-0 mt-1">
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
                {props.containDelete && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{
                      width: '22px',
                      height: '20px',
                      color: '#ff2094',
                      cursor: 'pointer',
                    }}
                    className="me-sm-3 mt-sm-3 rcmd-edit-icon"
                    onClick={() => props.handleDelete(recommendation?.id)}
                    // onClick={() => handleDelete(recommendation.id)}
                  />
                  // <FontAwesomeIcon
                  //   icon={faPencilAlt}
                  //   onClick={() => {
                  //     // props.setCurrentExperience(experience)
                  //   }}
                  //   color={'#707070'}
                  //   className="editICO"
                  //   style={{
                  //     height: '25px',
                  //     width: '25px',
                  //   }}
                  // />
                )}
              </div>
              {props.length - props.index > 1 &&
                props.modalName !== 'editRcmdModal' && (
                  <hr className="d-md-none mx-auto mb-0 mt-3"></hr>
                )}
            </div>
          )}
        </>
      )}
    </>
  )
}
