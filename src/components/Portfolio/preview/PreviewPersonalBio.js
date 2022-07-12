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
import Certificate from '../../../assets/images/lts-certifeid-logo.png'
import { toast } from 'react-toastify'
import {
  IsUserLevelAuthorized,
  checkLevelAuthorized
} from '../../../utils/helpers'

export default function PreviewPersonalBio(props) {
  const userId = useSelector((state) => state?.user?.user?.user?.id)
  const loggedUser = useSelector((state) => {
    const user = state?.user?.user?.user
    return { role_id: user?.role_id, level: user?.level }
  })
  const [user, setUser] = useState()
  const [userBio, setUserBio] = useState()
  const [userConnections, setuserConnections] = useState()
  const [charset, setCharset] = useState(450)
  const [loading, setLoading] = useState(false)
  const [updateBio, setUpdateBio] = useState(false)
  const [showEditBioModal, setShowEditBioModal] = useState(false)
  // dev
  const [isCertified, setIsCertified] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [loadingConnecting, setLoadingConnecting] = useState(false)
  const [levelMatch, setLevelMatch] = useState(false)
  const loggedUserLevel = IsUserLevelAuthorized()
  const previewedUserLevel = checkLevelAuthorized(props?.user?.level)

  useEffect(() => {
    if (!props.user) getUser()
    else {
      setUser(props.user)
      setUserBio(props.user.bio)
      setuserConnections(props.user.connections_count)
      if (loggedUser.role_id === 1) {
        if (
          props.user.role_id === loggedUser.role_id &&
          props.user.level === loggedUser.level
        ) {
          setLevelMatch(true)
        }
      } else {
        if (props.user.role_id === loggedUser.role_id) {
          setLevelMatch(true)
        }
      }
    }
  }, [props.user])

  useEffect(() => {
    setIsConnected(props.isConnected)
    setLoadingConnecting(false)
  }, [props.isConnected])

  const getUser = async () => {
    setLoading(true)
    axiosInstance
      .get('/connect/count')
      .then((response) =>
        setuserConnections(parseInt(response.data.connectionCount))
      )
    axiosInstance
      .get(`/users/${userId}`)
      .then((response) => {
        setUser(response.data)
        setUserBio(response.data.bio)
        setLoading(false)
      })
      .catch((err) => setLoading(false))
  }

  const handleChange = async (event) => {
    const { value } = event.target
    setUserBio(value)
  }

  const submit = async () => {
    setUpdateBio(true)
    await axiosInstance
      .put(`/users`, {
        bio: userBio
      })
      .then((response) => {
        toast.success(<IntlMessages id='alerts.success_change' />)
        setUserBio(response.data.bio)
        setTimeout(() => {
          onClose()
        }, 5000)
      })
      .catch((err) => err)
    setUpdateBio(false)
  }

  const onClose = () => {
    setShowEditBioModal(false)
    // setUserBio(user.bio)
  }
  return (
    <div className='row rounded mt-4 mt-md-0 pe-0'>
      {loading ? (
        <div
          className='d-flex flex-wrap px-0 gx-0 my-3'
          // style={{ minHeight: '310px' }}
        >
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
          <div className='user-portfolio my-3 mt-5'>
            <div className='d-flex flex-wrap flex-grow-1 justify-content-between'>
              <img
                src={user?.profile_image ? user?.profile_image : avatar}
                alt='Profile'
                className='rounded-circle my-auto float-right user-image z-depth-2 col-12'
              />
            </div>
            <div className='d-flex flex-wrap ps-0 ps-md-3 flex-grow-1 justify-content-between'>
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
                  <p className='connections px-0 d-block w-100'>
                    {userConnections > 500 ? (
                      <>
                        500+ <IntlMessages id='connection.title' />
                      </>
                    ) : (
                      <>
                        {userConnections} <IntlMessages id='connection.title' />
                      </>
                    )}
                  </p>
                </div>

                <div className='d-lg-flex flex-wrap w-md-100 pe-0 my-auto ps-xlg-5 text-center Certificate'>
                  {isCertified && (
                    <>
                      <img src={Certificate} />
                      <p className='verified mb-0'>
                        <IntlMessages id='general.verifyWithNova' />
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className='d-flex portfolio-connect'>
              {props.user && props.user.id !== userId && (
                <div className='new-message text-start text-md-end my-auto'>
                  {userId && (
                    <>
                      {isConnected === 'accept' ? (
                        props.user?.is_contact &&
                        loggedUserLevel &&
                        previewedUserLevel &&
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
                        <button disabled={loadingConnecting}>Requested</button>
                      ) : isConnected === 'block' ? (
                        <></>
                      ) : levelMatch ? (
                        <button
                          disabled={loadingConnecting}
                          onClick={() => {
                            setLoadingConnecting(true)
                            props.newConnectionRequest()
                          }}
                        >
                          Connect
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* end of div */}
          {!props.user && (
            <div className='d-flex pe-1 py-0 pe-md-0'>
              <span
                className='float-end d-none me-4 me-md-0 pe-2'
                style={{ fontSize: '24px', color: '#707070' }}
                onClick={() => setShowEditBioModal(true)}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}

          <div className='d-flex w-100 mt-lg-0 pe-md-4'>
            <span className='user-bio'>
              {userBio ? (
                <div className='d-flex w-100 mt-lg-0 pe-md-4'>
                  <span className='user-bio'>
                    {userBio && userBio.slice(0, charset)}
                    {userBio?.length >= charset && '...'}
                    {userBio?.length > charset && (
                      <p className='user-bio-read-more pe-auto mt-4'>
                        <span
                          onClick={() => setCharset(charset + userBio.length)}
                        >
                          <IntlMessages id='general.readMore' />
                        </span>
                      </p>
                    )}
                  </span>
                </div>
              ) : props.user ? (
                <>
                  This user hasn't added a bio yet! Once they do, their bio will
                  appear here.
                </>
              ) : (
                <>
                  You haven't added a bio yet! Once you do, your bio will appear
                  here.
                </>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
