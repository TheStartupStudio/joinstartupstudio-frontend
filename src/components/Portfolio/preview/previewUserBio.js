import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/AxiosInstance'
import avatar from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './css/editPersonalBio.css'
import IntlMessages from '../../../utils/IntlMessages'

export default function PreviewUserBio(props) {
  const userId = useSelector((state) => state.user.user.user.id)
  const [user, setUser] = useState()
  const [userBio, setUserBio] = useState()
  const [userConnections, setuserConnections] = useState()
  const [charset, setCharset] = useState(450)
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setUser(props.user)
    setUserBio(props.user.bio)
    setuserConnections(props.user.connections_count)
  }, [props.user])

  useEffect(() => {
    setIsConnected(props.isConnected)
  }, [props.isConnected])

  return (
    <div className='row rounded mt-4 mt-md-0 pe-0'>
      {loading ? (
        <div className='d-flex flex-wrap px-0 gx-0'>
          <div className='d-flex text-center text-sm-start'>
            <img
              src={avatar}
              alt='Profile'
              className='rounded-circle my-auto float-right user-image z-depth-2 col-12'
            />
          </div>
          <div className='d-flex flex-wrap ps-0 ps-md-3 flex-grow-1 justify-content-between'></div>
        </div>
      ) : (
        <div>
          <div
            className='user-portfolio'
            style={{ gridTemplateColumns: '140px auto' }}
          >
            <div className='text-center text-md-start'>
              <img
                src={user?.profile_image ? user?.profile_image : avatar}
                style={{
                  width: '140px',
                  height: '140px',
                  objectFit: 'cover',
                  position: 'relative'
                }}
                alt='Profile'
                className='rounded-circle my-auto'
              />
            </div>
            <div className='d-flex flex-wrap ps-0 ps-md-3 flex-grow-1 justify-content-md-between justify-content-center'>
              {/* start div */}
              <div className='user-info-grid mt-4 mt-lg-0'>
                <div className='pe-0 my-auto ps-xlg-5'>
                  <h3 className='w-100 mt-2 mb-0 user-name px-0 mt-md-2'>
                    {user?.name}
                  </h3>
                  <div
                    style={{
                      width: '100%',
                      flexBasis: '100%',
                      height: 0
                    }}
                  ></div>
                  {/* proffesion */}
                  {user?.profession !== '' ? (
                    <p className='w-100 user-profession d-flex flex-wrap my-1 px-0 '>
                      {user?.profession}
                    </p>
                  ) : (
                    <p className='w-100 user-profession d-flex flex-wrap my-1 px-0 '>
                      {props.user
                        ? "This user hasn't added a role yet."
                        : "You haven't added a role yet."}
                    </p>
                  )}
                  <div
                    style={{
                      width: '100%',
                      flexBasis: '100%',
                      height: 0
                    }}
                  ></div>
                  {(user?.social_links?.linkedIn ||
                    user?.social_links?.twitter ||
                    user?.social_links?.instagram ||
                    user?.social_links?.facebook ||
                    user?.social_links?.website) && (
                    <div className='social_links w-100 text-center d-flex flex-wrap text-md-start px-0'>
                      {user?.social_links?.linkedIn && (
                        <a
                          href={
                            user.social_links.linkedIn?.startsWith('https')
                              ? user.social_links.linkedIn
                              : `https://${user.social_links.linkedIn}`
                          }
                          rel='noreferrer'
                          target='_blank'
                          className='link me-1'
                        >
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      )}
                      {user?.social_links?.twitter && (
                        <a
                          href={
                            user.social_links.twitter?.startsWith('https')
                              ? user.social_links.twitter
                              : `https://${user.social_links.twitter}`
                          }
                          rel='noreferrer'
                          target='_blank'
                          className='link mx-1'
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      )}
                      {user?.social_links?.instagram && (
                        <a
                          href={
                            user.social_links.instagram?.startsWith('https')
                              ? user.social_links.instagram
                              : `https://${user.social_links.instagram}`
                          }
                          rel='noreferrer'
                          target='_blank'
                          className='link mx-1'
                        >
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {user?.social_links?.website && (
                        <a
                          href={
                            user.social_links.website?.startsWith('https')
                              ? user.social_links.website
                              : `https://${user.social_links.website}`
                          }
                          rel='noreferrer'
                          target='_blank'
                          className='link mx-1'
                        >
                          <FontAwesomeIcon icon={faGlobe} />
                        </a>
                      )}
                      {user?.social_links?.facebook && (
                        <a
                          href={
                            user.social_links.facebook?.startsWith('https')
                              ? user.social_links.facebook
                              : `https://${user.social_links.facebook}`
                          }
                          rel='noreferrer'
                          target='_blank'
                          className='link mx-1'
                        >
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      flexBasis: '100%',
                      height: 0
                    }}
                  ></div>
                  {props.showConnections && (
                    <p className='connections px-0 d-block w-100'>
                      {userConnections > 500 ? (
                        <>
                          500+ <IntlMessages id='connection.title' />
                        </>
                      ) : (
                        <>
                          {userConnections}{' '}
                          <IntlMessages id='connection.title' />
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {props.showConnect && (
              <div className='d-flex portfolio-connect'>
                {props.user && props.user.id !== userId && (
                  <div className='new-message text-start text-md-end my-auto'>
                    {isConnected === 'accept' ? (
                      props.user?.is_contact &&
                      props.user?.UserPortfolio.is_published && (
                        <button
                          onClick={() => {
                            props.contactUser()
                          }}
                        >
                          Contact
                        </button>
                      )
                    ) : isConnected === 'request' ? (
                      <button>Requested</button>
                    ) : isConnected === 'block' ? (
                      <></>
                    ) : (
                      <button
                        onClick={() => {
                          props.newConnectionRequest()
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='d-flex w-100 mt-4 mt-lg-3 pe-md-4'>
            <span className='user-bio'>
              {userBio ? (
                <>
                  {userBio && userBio.slice(0, charset)}
                  {userBio?.length > charset && (
                    <p className='user-bio-read-more pe-auto mt-4'>
                      <span
                        onClick={() => setCharset(charset + userBio.length)}
                      >
                        <IntlMessages id='general.readMore' />
                      </span>
                    </p>
                  )}
                </>
              ) : null}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
