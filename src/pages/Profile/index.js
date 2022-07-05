import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Image, InputGroup, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import Auth from '@aws-amplify/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import {
  faGlobe,
  faEnvelope,
  faPencilAlt,
  faMobileAlt,
  faPlus,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail, validateNumber } from '../../utils/helpers'
import { userUpdate, userUpdateProfileImage } from '../../redux'
import EditProfileModal from '../../components/Modals/Profile/editProfileModal'
import EditPasswordModal from '../../components/Modals/Profile/editPasswordModal'
import ProfileTags from '../../components/Modals/Profile/profileTags'
import ProfileTag from '../../components/Tags'
import AddNewUserTag from '../../components/Modals/Profile/addNewUserTag'
import ShareMyPortfolio from '../../components/Modals/Profile/shareMyPortfolio'
import CancelSubscriptionModal from '../../components/Modals/cancelSubscriptionModal'
import defaultImage from '../../assets/images/profile-image.png'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import { ShowMessenger } from '../../utils/helpers'
import '../PortfolioNew/style/previewPortfolio.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { ShareMyPortfolioWidget } from '../../components/Portfolio/preview/shareMyPortfolioWidget'
import { editSocialMedia } from '../../redux/user/Actions'
import StudentData from '../../components/MyStudents/studentData'
import { StudentCountProvider } from '../../components/MyStudents/studentCountContext'

function Profile(props) {
  const [user, setUser] = useState({})
  const [socialMedia, setSocialMedia] = useState({})
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [userTags, setUserTags] = useState({})
  const [allTags, setAllTags] = useState({})
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const [shareMyPortfolioModal, setShareMyPortfolioModal] = useState(false)
  const [tagsModal, setTagsModal] = useState(false)
  const [addUserTagsModal, setAddUserTagsModal] = useState(false)
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false)
  const [userPortfolio, setUserPortfolio] = useState({})
  const [editPage, setEditPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userTagsId, setUserTagsId] = useState([])
  const [tagName, setTagName] = useState('')
  const [isContactable, setIsContactable] = useState(false)
  const userId = useSelector((state) => state.user.user.user.id)
  const profileImage = useSelector((state) => state.user.profile_image)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const dispatch = useDispatch()

  useEffect(() => {
    getUserData()
    getUserPortfolio()
    getUserTags()
  }, [])

  useEffect(() => {
    getAllTags()
  }, [userTags])

  const getUserData = async () => {
    await axiosInstance
      .get(`/users/${userId}`)
      .then((response) => {
        setIsContactable(response.data.is_contact)
        setUser(response.data)
        setSocialMedia(response.data.social_links)
      })
      .catch((err) => err)
  }

  const updateIsContactable = async () => {
    const oldContactableValue = isContactable
    setIsContactable(!isContactable)

    await axiosInstance
      .put(`/users`, {
        is_contact: !oldContactableValue
      })
      .then()
      .catch((e) => {
        setIsContactable(!oldContactableValue)
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

  const getUserPortfolio = async () => {
    await axiosInstance
      .get(`/portfolio/`)
      .then((response) => {
        setUserPortfolio(response.data)
      })
      .catch((err) => err)
  }

  const getUserTags = async () => {
    await axiosInstance
      .get(`/tags/users/${userId}`)
      .then((response) => {
        let ids = []
        response.data.map((item) => {
          ids.push(item.id)
        })
        setUserTagsId(ids)
        setUserTags(response.data)
      })
      .catch((err) => err)
  }

  const getAllTags = async () => {
    await axiosInstance
      .get('/tags/')
      .then((response) => {
        // response.data.map((tag) => {
        //   tag.formattedTitle = intl.formatMessage({
        //     id: tag.name,
        //     defaultMessage: tag.name
        //   })
        // })
        setAllTags(response.data.filter((tag) => !userTagsId.includes(tag.id)))
      })
      .catch((err) => err)
  }

  const addTagtoUser = async () => {
    setLoading(true)
    if (tagName) {
      await axiosInstance
        .post(`tags/user/personalTag`, { name: tagName })
        .then(async (res) => {
          if (res.data.message === 'more') {
            toast.error(
              <IntlMessages id='my_account.add_my_profile_tags_more' />
            )
            await getUserTags()
            setLoading(false)
            closeModal('addUserTagModal')
            closeModal('tags')
          } else {
            toast.success(<IntlMessages id='alerts.success_change' />)
            await getUserTags()
            setLoading(false)
            closeModal('addUserTagModal')
            closeModal('tags')
          }
        })
        .catch((err) => {
          setLoading(false)
          toast.error(<IntlMessages id='alerts.something_went_wrong' />)
          closeModal('addUserTagModal')
          setTagName('')
        })
    }
  }

  const editUser = async (changedUser, changedMedias) => {
    setLoading(true)
    const params = {
      name: changedUser.name,
      bio: changedUser.bio,
      image: changedUser.image,
      profession: changedUser.profession,
      social_links: changedMedias,
      profile_image: changedUser.profile_image,
      language: changedUser.language,
      phone_number: changedUser.phone_number
    }
    if (editPage == 'phone' && !validateNumber(changedUser.phone_number)) {
      toast.error(<IntlMessages id='profile.incorrect_number' />)
      setLoading(false)
      return
    }
    if (user.email !== changedUser.email) {
      if (!changedUser.email || changedUser.email === '') {
        toast.error(<IntlMessages id='alerts.email_required' />)
      } else if (editPage == 'email' && !validateEmail(changedUser.email)) {
        toast.error(<IntlMessages id='alerts.valid_email' />)
      } else {
        const currentUser = await Auth.currentAuthenticatedUser()
        await axiosInstance
          .put(`/users`, { email: changedUser.email })
          .then(async () => {
            await Auth.updateUserAttributes(currentUser, {
              email: changedUser.email
            })
          })
          .catch((err) => err)
      }
    }

    await axiosInstance
      .put(`/users`, params)
      .then((res) => {
        setUser(res.data)
        setSocialMedia(res.data.social_links)
        setLoading(false)
        if (localStorage.getItem('name') !== res.data.name) {
          localStorage.setItem('name', res.data.name)
          dispatch(userUpdate(res.data.name))
        } else if (profileImage !== res.data.profile_image) {
          localStorage.setItem('profileImage', res.data.profile_image)
          dispatch(userUpdateProfileImage(res.data.profile_image))
        }
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        closeModal('profileModal')
        dispatch(editSocialMedia(params.social_links))
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const openEditProfileModal = (page) => {
    setEditPage(page)
    setShowEditProfileModal(true)
  }

  const closeModal = (modal) => {
    if (modal == 'profileModal') {
      setShowEditProfileModal(false)
    } else if (modal == 'passwordModal') {
      setShowEditPasswordModal(false)
    } else if (modal == 'shareModal') {
      setShareMyPortfolioModal(false)
    } else if (modal == 'subscriptionModal') {
      setCancelSubscriptionModal(false)
    } else if (modal == 'tags') {
      setTagsModal(false)
    } else if (modal == 'addUserTagModal') {
      setAddUserTagsModal(false)
    }
  }

  const cancelSubscription = async () => {
    await axiosInstance
      .post(`/users/cancel-subscription`, {
        lang: currentLanguage
      })
      .then(async (res) => {
        userLogout()
      })
      .catch((err) => err)
  }

  const userLogout = async () => {
    await Auth.signOut({ global: true })
      .then(() => {
        window.location = '/logout'
      })
      .catch((err) => err)
  }

  const saveUserTags = async (data, toDelete) => {
    setLoading(true)

    if (toDelete.length > 0) {
      await deleteUserTag(toDelete, data.length > 0 ? false : true)
    }
    if (data.length > 0) {
      await addTag(data)
      setLoading(false)
    }
  }

  const addTag = async (data) => {
    await axiosInstance
      .post(`/tags/user`, data)
      .then(async (res) => {
        if (res.data.message === 'more') {
          toast.error(<IntlMessages id='my_account.add_my_profile_tags_more' />)
          await getUserTags()
          setLoading(false)
          closeModal('tags')
        } else {
          toast.success(<IntlMessages id='alerts.success_change' />)
          await getUserTags()
          setLoading(false)
          closeModal('tags')
        }
      })
      .catch((err) => setLoading(false))
  }

  const deleteUserTag = async (data, showToast) => {
    await axiosInstance
      .delete('/tags/', { data })
      .then(async () => {
        if (showToast == true) {
          toast.success(<IntlMessages id='alerts.success_change' />)
        }
        await getUserTags()
        setLoading(false)
        closeModal('tags')
      })
      .catch((err) => setLoading(false))
  }

  return (
    <div className='container-fluid mx-auto'>
      <div className='row mx-auto'>
        <div className='col-12 col-xl-9'>
          <div className='col-12 col-md-12 px-0'>
            <div className='account-page-padding page-border'>
              <div className='row pe-0'>
                <div className='col-md-8 pe-0'>
                  <h3 className='page-title mb-0'>
                    <IntlMessages id='my_account.page_title' />
                  </h3>
                  <p className='page-description'>
                    <IntlMessages id='my_account.page_description' />
                  </p>
                </div>
                <div
                  className='col-md-4 update-password'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowEditPasswordModal(true)
                  }}
                >
                  <h3 className='float-md-end'>
                    <IntlMessages id='my_account.update_password' />
                  </h3>
                </div>
              </div>
              <div className='my-account mx-0 mt-4'>
                <div className='row p-sm-3 p-3'>
                  <div className='col-12 text-center text-md-auto col-md-4 col-lg-3 gx-5'>
                    <div className='round-image-wrapper'>
                      <Image
                        src={
                          user.profile_image ? user.profile_image : defaultImage
                        }
                        className='editbio-user-image mx-auto my-account'
                      />
                    </div>
                  </div>
                  <div className='col-10 col-md-6 col-lg-6 offset-lg-0'>
                    <h2 className='mt-4 mb-0'>{user.name}</h2>
                    <h5 className='mb-0'>
                      {user.profession ? user.profession : ''}
                    </h5>
                    <div className='mt-1'>
                      {socialMedia?.linkedIn && (
                        <a
                          className='m-1'
                          href={
                            socialMedia.linkedIn.startsWith('https')
                              ? socialMedia.linkedIn
                              : `https://${socialMedia.linkedIn}`
                          }
                          target='_blank'
                        >
                          <FontAwesomeIcon
                            icon={faLinkedinIn}
                            className='social-media-icons'
                          />
                        </a>
                      )}
                      {socialMedia?.twitter && (
                        <a
                          className='m-1'
                          href={
                            socialMedia.twitter.startsWith('https')
                              ? socialMedia.twitter
                              : `https://${socialMedia.twitter}`
                          }
                          target='_blank'
                        >
                          <FontAwesomeIcon
                            icon={faTwitterSquare}
                            className='social-media-icons'
                          />
                        </a>
                      )}
                      {socialMedia?.instagram && (
                        <a
                          className='m-1'
                          href={
                            socialMedia.instagram.startsWith('https')
                              ? socialMedia.instagram
                              : `https://${socialMedia.instagram}`
                          }
                          target='_blank'
                        >
                          <FontAwesomeIcon
                            icon={faInstagram}
                            className='social-media-icons'
                          />
                        </a>
                      )}
                      {socialMedia?.facebook && (
                        <a
                          className='m-1'
                          href={
                            socialMedia.facebook.startsWith('https')
                              ? socialMedia.facebook
                              : `https://${socialMedia.facebook}`
                          }
                          target='_blank'
                        >
                          <FontAwesomeIcon
                            icon={faFacebookSquare}
                            className='social-media-icons'
                          />
                        </a>
                      )}
                      {socialMedia?.website && (
                        <a
                          className='m-1'
                          href={
                            socialMedia.website.startsWith('https')
                              ? socialMedia.website
                              : `https://${socialMedia.website}`
                          }
                          target='_blank'
                        >
                          <FontAwesomeIcon
                            icon={faGlobe}
                            className='social-media-icons'
                          />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className='col-2 col-md-2 col-lg-3 mt-md-0'>
                    <div
                      className='float-lg-end float-end mx-2 mx-md-0 mt-4 mt-sm-0 pt-md-4 px-md-4'
                      onClick={() => openEditProfileModal('profile')}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon
                        className='edit-pencil'
                        icon={faPencilAlt}
                      />
                    </div>
                  </div>
                </div>
                <div className='m-3'>
                  {user.bio ? (
                    <p>{user.bio}</p>
                  ) : (
                    <>
                      <p>You can write your biography here.</p>
                    </>
                  )}
                </div>
              </div>
              <div className='my-account mx-0 mt-4'>
                <div className='row'>
                  <div className='row justify-content-between'>
                    <h4 className='m-3 col-12 col-lg-5'>
                      <IntlMessages id='my_account.email_address' />
                    </h4>

                    <div className='col-12 col-lg-6 my-auto'>
                      <div className='d-flex show_in_portfolio justify-content-lg-end ms-3 ms-lg-0'>
                        <p className='my-auto p-0'>
                          Allow people to contact me
                        </p>

                        <OverlayTrigger
                          // delay={{ hide: 450, show: 300 }}
                          overlay={(props) => (
                            <Tooltip {...props}>
                              By allowing users to message you, you are allowing
                              your Connections to send you emails via our
                              platform Contact box.
                            </Tooltip>
                          )}
                          placement='top'
                        >
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                            className='mx-3 my-auto'
                            style={{ color: '#707070' }}
                          />
                        </OverlayTrigger>

                        <label className='m-0 p-0 float-end my-auto form-switch d-flex'>
                          <input
                            type='checkbox'
                            checked={isContactable}
                            onChange={() => updateIsContactable()}
                          />
                          <i className='my-auto'></i>
                        </label>
                      </div>
                    </div>
                  </div>

                  <InputGroup className='mt-3 mb-3'>
                    <InputGroup.Text
                      style={{
                        border: 0,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <FontAwesomeIcon
                        className='edit-pencil mx-1'
                        icon={faEnvelope}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      className='my-profile-input'
                      type='text'
                      value={user.email}
                    />
                    <Button
                      style={{ backgroundColor: 'transparent', border: 0 }}
                      onClick={() => openEditProfileModal('email')}
                    >
                      <FontAwesomeIcon
                        className='edit-pencil float-end mx-md-4'
                        icon={faPencilAlt}
                      />
                    </Button>
                  </InputGroup>
                </div>
              </div>
              {/* <div className='my-account mx-0 mt-4'>
                <div className='row'>
                  <h4 className='m-3'>
                    <IntlMessages id='my_account.mobile_phone' />
                  </h4>
                  <InputGroup className='mt-3 mb-3'>
                    <InputGroup.Text
                      style={{
                        border: 0,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <FontAwesomeIcon
                        className='edit-pencil mx-1'
                        icon={faMobileAlt}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      className='my-profile-input'
                      type='text'
                      value={user.phone_number}
                      name='phone_number'
                    />
                    <Button
                      style={{ backgroundColor: 'transparent', border: 0 }}
                      onClick={() => openEditProfileModal('phone')}
                    >
                      <FontAwesomeIcon
                        className='edit-pencil float-end mx-md-4'
                        icon={faPencilAlt}
                      />
                    </Button>
                  </InputGroup>
                  <p className='ms-1 ms-md-5 mb-3 px-4 mx-lg-0'>
                    <IntlMessages id='my_account.edit_contact_information_info' />
                  </p>
                </div>
              </div> */}
              <div className='my-account profile-tags-div mx-0 mt-4'>
                <h4 className='m-3'>
                  <IntlMessages id='my_account.profile_tags_title' />
                </h4>
                {userTags?.length > 0 && (
                  <Button
                    style={{ backgroundColor: 'transparent', border: 0 }}
                    className='float-end mt-2'
                  >
                    <FontAwesomeIcon
                      className='edit-pencil float-end mx-md-4'
                      icon={faPencilAlt}
                      onClick={() => setTagsModal(true)}
                    />
                    <FontAwesomeIcon
                      className='edit-pencil float-end mx-4 mx-4'
                      icon={faPlus}
                      onClick={() => setAddUserTagsModal(true)}
                    />
                  </Button>
                )}
                {userTags?.length ? (
                  <div className='w-100 ms-3'>
                    {userTags?.map((name) => (
                      <ProfileTag tags={name.name} key={name.id} />
                    ))}
                  </div>
                ) : (
                  <>
                    <FormattedMessage
                      id='my_account.profile_description'
                      default='my_account.profile_description'
                    >
                      {(message) => (
                        <p className='mx-auto mt-4 px-5'>{message}</p>
                      )}
                    </FormattedMessage>
                    <div
                      className='mx-3 my-account my-4 text-center'
                      onClick={() => setTagsModal(true)}
                    >
                      {' '}
                      <FontAwesomeIcon
                        icon={faPlus}
                        className='social-media-icons my-5'
                        style={{
                          width: '56px',
                          height: '56px',
                          color: '#BBBDBF'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 border-md-0'>
          {/* <div>
            <span className='link_to_my_portfolio'>
              <IntlMessages id='my_account.link_to_my_Portfolio_text' />
            </span>
            <span className='link_to_my_portfolio_second'>
              <IntlMessages id='my_account.link_to_my_Portfolio_span' />
            </span>
          </div>
          <div onClick={() => setShareMyPortfolioModal(true)} className='my-2'>
            <input
              disabled
              type='text'
              className='form-control mt-2 link_to_my_portfolio_input'
              value={userPortfolio.url}
              aria-describedby='basic-addon2'
            />
          </div> */}
          <div style={{ marginTop: '40px' }}>
            <StudentCountProvider>
              <StudentData fetchStudents={true} />
            </StudentCountProvider>
          </div>

          <ShowMessenger />
          <div className={'community-connect my-2'}>
            <Link to='/my-connections'>
              <FontAwesomeIcon
                icon={faUsers}
                style={{
                  color: '#01C5D1',
                  background: 'white',
                  borderRadius: '50%',
                  height: '25px',
                  width: '36px',
                  opacity: '1'
                }}
              />
            </Link>
            <Link to='/my-connections'>
              <p className='my-auto ms-2'>Connect with my community</p>
            </Link>
          </div>
          {/* {user.payment_type != 'school' && (
            <p
              className='cancel-my-subscription mt-3 text-center'
              onClick={() => setCancelSubscriptionModal(true)}
              style={{ cursor: 'pointer' }}
            >
              <IntlMessages id='profile.cancel_subscription' />
            </p>
          )} */}
        </div>
      </div>
      <AddNewUserTag
        show={addUserTagsModal}
        onHide={() => closeModal('addUserTagModal')}
        setTagName={setTagName}
        tagName={tagName}
        onSave={addTagtoUser}
        loading={loading}
      />
      <EditProfileModal
        show={showEditProfileModal}
        onHide={() => closeModal('profileModal')}
        userData={user}
        page={editPage}
        editUser={editUser}
        loading={loading}
        setLoading={setLoading}
      />
      <EditPasswordModal
        show={showEditPasswordModal}
        onHide={() => closeModal('passwordModal')}
        userData={user}
        loading={loading}
      />
      {tagsModal && (
        <ProfileTags
          show={tagsModal}
          onHide={() => closeModal('tags')}
          userTags={userTags}
          allTags={allTags}
          saveUserTags={saveUserTags}
          loading={loading}
        />
      )}
      <ShareMyPortfolio
        show={shareMyPortfolioModal}
        onHide={() => closeModal('shareModal')}
        userLink={userPortfolio.url}
      />
      <CancelSubscriptionModal
        show={cancelSubscriptionModal}
        onHide={() => closeModal('subscriptionModal')}
        cancelSubscription={cancelSubscription}
      />
    </div>
  )
}
export default injectIntl(Profile, {
  withRef: false
})
