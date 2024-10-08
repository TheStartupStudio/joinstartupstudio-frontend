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

export default function PreviewPersonalBio() {
  const userId = useSelector((state) => state.user.user.user.id)
  const [user, setUser] = useState()
  const [userBio, setUserBio] = useState()
  const [userConnections, setuserConnections] = useState()
  const [charset, setCharset] = useState(100)
  const [loading, setLoading] = useState(false)
  const [updateBio, setUpdateBio] = useState(false)
  const [showEditBioModal, setShowEditBioModal] = useState(false)
  // dev
  const [isCertificidet, setIsCertificed] = useState(false)
  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    await axiosInstance
      .get('/connect/count')
      .then((response) =>
        setuserConnections(parseInt(response.data.connectionCount))
      )
    await axiosInstance
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
    <div className='row rounded mt-5 py-3 ps-2 pe-0 gx-0'>
      {loading ? (
        <div
          className='row px-0'
          style={{
            minHeight: '310px'
          }}
        >
          {/* user image */}
          <div className='col-12 col-md-2 p-0 text-center'>
            <img
              src={avatar}
              className='rounded-circle col-12 my-auto user-image ms-3'
            />
          </div>
          {/* User name,s media, etj */}
          <div className='col-8 my-auto px-0'>
            <h3 className='text-center'>&nbsp;&nbsp;</h3>
            <h3 className='text-center'>&nbsp;&nbsp;</h3>
            <h3 className='text-center'>&nbsp;&nbsp;</h3>
            <h3 className='text-center'>&nbsp;&nbsp;</h3>
          </div>
          {/* end of first */}
        </div>
      ) : (
        <div className='row px-0 gx-0' style={{ minHeight: '310px' }}>
          <div className='col-12 col-md-4 col-lg-3 col-xl-2 text-center text-sm-start ps-md-4'>
            <img
              src={user?.profile_image ? user?.profile_image : avatar}
              alt='Profile'
              className='rounded-circle float-right user-image z-depth-2 col-12'
            />
          </div>
          <div
            className='
              col-12 col-md-7 col-lg-8 mt-2 mt-sm-0 ps-2 ps-md-auto'
          >
            {/* start div */}
            <div className='row pt-4'>
              <div className='col-12 col-lg-4 col-md-7 pe-0 my-auto ps-md-5'>
                <h3 className='float-sm-start w-100 mt-2 mb-0 user-name px-0 mt-md-2'>
                  {user?.name}
                </h3>
                {/* proffesion */}
                <p className='user-profession pt-sm-4 pt-2 mb-2 mt-1 px-0 '>
                  {user?.profession}
                </p>
                <div className='social_links mb-2 px-0'>
                  {user?.social_links?.twitter && (
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
                <p className='connections px-0'>
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

              <div className='col-12 col-md-4  col-lg-5  Certificate px-0'>
                {isCertificidet && (
                  <>
                    <img src={Certificate} className='rounded ps-2 ps-md-3' />
                    <p className='verified'>
                      <IntlMessages id='general.verifyWithNova' />
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* end of div */}
          <div className='col-12 col-md-1 pe-1 py-0 pe-md-0'>
            <span
              className='float-end d-none me-4 me-md-0 pe-2'
              style={{ fontSize: '24px', color: '#707070' }}
              onClick={() => setShowEditBioModal(true)}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
          </div>
          <div className='col-12 mt-4 px-md-4'>
            <span className='user-bio'>
              {userBio ? (
                userBio.slice(0, charset)
              ) : (
                <IntlMessages id='portfolio.user_bio' />
              )}
              {userBio?.length > charset && (
                <p className='user-bio-read-more pe-auto mt-4'>
                  <span onClick={() => setCharset(charset + 100)}>
                    <IntlMessages id='general.readMore' />
                  </span>
                </p>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
