import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Image } from 'react-bootstrap'
import axiosInstance from '../../../utils/AxiosInstance'
import avatar from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faInstagram,
  faTwitterSquare,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import IntlMessages from '../../../utils/IntlMessages'
import EditBio from './EditBio'
import Certificate from '../../../assets/images/lts-certifeid-logo.png'
import CertificationBadge1 from '../../../assets/images/market-ready-1-badge.png'
import CertificationBadge2 from '../../../assets/images/market-ready-2-badge.png'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'

export default function PersonalBio(props) {
  // const userId = useSelector((state) => state.user.user.user.id)
  const [user, setUser] = useState()
  const [userBio, setUserBio] = useState()
  const [userConnections, setuserConnections] = useState()
  const [charset, setCharset] = useState(450)
  const [loading, setLoading] = useState(false)
  const [updateBio, setUpdateBio] = useState(false)
  const [showEditBioModal, setShowEditBioModal] = useState(false)
  const [isCertified, setIsCertified] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isPreview, setIsPreview] = useState(null)
  useEffect(() => {
    getUser()
  }, [userId])
  useEffect(() => {
    setUserId(props.userId)
  }, [props.userId])
  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])
  // console.log(isPreview)

  // console.log('userId', userId)

  // useEffect(() => {
  //   setUserBio(props.userBiography)
  // }, [props.userBiography])
  // useEffect(() => {
  //   setUser(props.userData)
  // }, [props.userData])

  const getUser = async () => {
    setLoading(true)
    await axiosInstance
      .get('/connect/count')
      .then((response) =>
        setuserConnections(parseInt(response.data.connectionCount))
      )
    if (userId) {
      await axiosInstance
        .get(`/users/${userId}`)
        .then((response) => {
          setUser(response.data)
          setUserBio(response.data.bio)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          return err
        })
    }
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
        toast.success(<IntlMessages id="alerts.success_change" />)
        setUserBio(response.data.bio)

        onClose()
      })
      .catch((err) => err)
    setUpdateBio(false)
  }

  const onClose = () => {
    setShowEditBioModal(false)
    // setUserBio(user.bio)
  }
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
  // const isPreview = props.isPreview
  // const history = useHistory()
  // const isPreview = history.location.pathname.includes('preview')

  return (
    <PortfolioSection
      isPreview={isPreview}
      isEdit={true}
      onEdit={() => setShowEditBioModal(true)}
    >
      <>
        <div
          className="  d-flex personal-bio-container"
          // className=" my-account d-flex"
        >
          <div
            className="d-flex  personal-bio-image-container"
            style={{
              marginRight: 'auto',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                border: '2px solid #01C5D1',
                width: '168px ',
                height: '168px ',
                boxSizing: 'content-box',
                borderRadius: '50%',
                marginTop: isPreview ? 0 : -23,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src={user?.profile_image ? user?.profile_image : avatar}
                className=" user-image"
              />
            </div>
          </div>
          <div
            className=" personal-bio-info-container"
            style={{ marginLeft: 'auto' }}
          >
            <div className="d-flex flex-wrap pb-0 mb-3">
              <div className="portfolio-user-info">
                <div className="row">
                  <div
                  // className="col-10"
                  >
                    <div className="d-flex flex-wrap ps-0 flex-grow-1 justify-content-between">
                      <div className="user-info-grid mt-0 mt-md-4 mt-lg-0">
                        <div style={{ flexGrow: 1 }}>
                          <p
                            className={`w-100 d-flex mt-auto ps-0 mb-0 pb-0 ${
                              // isPreview ? 'pt-3' : 'pt-3'
                              'pt-3'
                            }`}
                            style={style.user_name}
                          >
                            {user?.name}
                          </p>
                          <p
                            className="mb-0 pt-1"
                            style={{
                              ...style.user_proffesion,
                              display: 'block'
                            }}
                          >
                            {user?.profession ? user?.profession : ''}
                          </p>
                          <div
                            style={{
                              flexBasis: '100%',
                              height: 0
                            }}
                          ></div>
                          {(user?.social_links?.linkedIn ||
                            user?.social_links?.twitter ||
                            user?.social_links?.instagram ||
                            user?.social_links?.facebook ||
                            user?.social_links?.website) && (
                            <div
                              className="mt-0 ps-1 d-flex flex-wrap pt-1 pt-md-auto"
                              style={style.social_links}
                            >
                              {user?.social_links?.linkedIn && (
                                <a
                                  href={
                                    user.social_links.linkedIn?.startsWith(
                                      'https'
                                    )
                                      ? user.social_links.linkedIn
                                      : `https://${user.social_links.linkedIn}`
                                  }
                                  rel="noreferrer"
                                  target="_blank"
                                  className="link me-1"
                                >
                                  <FontAwesomeIcon icon={faLinkedinIn} />
                                </a>
                              )}
                              {user?.social_links?.twitter && (
                                <a
                                  href={
                                    user.social_links.twitter?.startsWith(
                                      'https'
                                    )
                                      ? user.social_links.twitter
                                      : `https://${user.social_links.twitter}`
                                  }
                                  rel="noreferrer"
                                  target="_blank"
                                  className="link mx-1"
                                >
                                  <FontAwesomeIcon icon={faTwitter} />
                                </a>
                              )}
                              {user?.social_links?.instagram && (
                                <a
                                  href={
                                    user.social_links.instagram?.startsWith(
                                      'https'
                                    )
                                      ? user.social_links.instagram
                                      : `https://${user.social_links.instagram}`
                                  }
                                  rel="noreferrer"
                                  target="_blank"
                                  className="link mx-1"
                                >
                                  <FontAwesomeIcon icon={faInstagram} />
                                </a>
                              )}

                              {user?.social_links?.website && (
                                <a
                                  href={
                                    user.social_links.website?.startsWith(
                                      'https'
                                    )
                                      ? user.social_links.website
                                      : `https://${user.social_links.website}`
                                  }
                                  rel="noreferrer"
                                  target="_blank"
                                  className="link mx-1"
                                >
                                  <FontAwesomeIcon icon={faGlobe} />
                                </a>
                              )}
                              {user?.social_links?.facebook && (
                                <a
                                  href={
                                    user.social_links.facebook?.startsWith(
                                      'https'
                                    )
                                      ? user.social_links.facebook
                                      : `https://${user.social_links.facebook}`
                                  }
                                  rel="noreferrer"
                                  target="_blank"
                                  className="link mx-1"
                                >
                                  <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                              )}
                            </div>
                          )}

                          {user && (
                            <p className="connections px-0 pt-1 pt-sm-auto">
                              {userConnections > 500 ? (
                                <>
                                  500+ <IntlMessages id="connection.title" />
                                </>
                              ) : (
                                <>
                                  <span> {userConnections} </span>
                                  <IntlMessages id="connection.title" />
                                </>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="d-lg-flex flex-wrap w-100 w-md-100 pe-0 my-auto ps-xlg-5 text-center Certificate mx-lg-5 mx-sm-1">
                          {!isCertified && (
                            <div className="d-flex">
                              <img src={CertificationBadge1} />
                              <img src={CertificationBadge2} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-0">
              {user && (
                <>
                  <span className="user-bio">
                    {userBio && userBio.slice(0, charset)}
                    {userBio?.length >= charset && '...'}
                  </span>
                  {userBio?.length > charset && (
                    <p className="user-bio-read-more pe-auto p-0 mt-1 mb-0">
                      <span
                        onClick={() => setCharset(charset + userBio.length)}
                      >
                        <IntlMessages id="general.readMore" />
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <EditBio
            show={showEditBioModal}
            onHide={() => setShowEditBioModal(false)}
            user={user}
            userBio={userBio}
            userConnections={userConnections}
            handleChange={(event) => handleChange(event)}
            avatar={avatar}
            onSubmit={() => submit()}
            loading={loading}
            updateBio={updateBio}
          />
        </div>
      </>
    </PortfolioSection>
  )
}
