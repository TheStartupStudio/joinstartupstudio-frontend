import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Image, InputGroup, Form, Button, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faClipboardList,
  faEnvelope,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail, validateNumber } from '../../utils/helpers'
import { userUpdate, userUpdateProfileImage } from '../../redux'
import EditProfileModal from '../../components/Modals/Profile/editProfileModal'
import EditPasswordModal from '../../components/Modals/Profile/editPasswordModal'
import AddNewUserTag from '../../components/Modals/Profile/addNewUserTag'
import ShareMyPortfolio from '../../components/Modals/Profile/shareMyPortfolio'
import defaultImage from '../../assets/images/profile-image.png'
import '../PortfolioNew/style/previewPortfolio.css'
import { editSocialMedia, userUpdateProfession } from '../../redux/user/Actions'
import StudentData from '../../components/MyStudents/studentData'
import { StudentCountProvider } from '../../components/MyStudents/studentCountContext'
import InstructorNotes from './InstructorNotes/InstructorNotes'
import PlatformBadges from './PlatformBadges'
import { useLocation } from 'react-router-dom'

function MyAccount() {
  const dispatch = useDispatch()
  const userRole = localStorage.getItem('role')
  const platformBadgesRef = useRef(null)
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
  const [instructorNotes, setInstructorNotes] = useState(false)
  const [platformBadges, setPlatformBadges] = useState(false)
  const location = useLocation()

  const instructorNotesHandler = () => {
    setPlatformBadges(false)
    setInstructorNotes((state) => !state)
  }
  const platformBadgeHandler = () => {
    setInstructorNotes(false)
    setPlatformBadges((state) => !state)
    if (platformBadgesRef.current) {
      platformBadgesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    getUserData()
    getUserPortfolio()
    getUserTags()
  }, [])

  useEffect(() => {
    getAllTags()
  }, [userTags])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('platformBadges') === 'true') {
      platformBadgeHandler()
    }
  }, [location.search])

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

  // const updateIsContactable = async () => {
  //   const oldContactableValue = isContactable
  //   setIsContactable(!isContactable)

  //   await axiosInstance
  //     .put(`/users`, {
  //       is_contact: !oldContactableValue
  //     })
  //     .then()
  //     .catch((e) => {
  //       setIsContactable(!oldContactableValue)
  //       toast.error(<IntlMessages id='alerts.something_went_wrong' />)
  //     })
  // }

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
        response.data.map((item) => ids.push(item.id))
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
    if (editPage === 'phone' && !validateNumber(changedUser.phone_number)) {
      toast.error(<IntlMessages id='profile.incorrect_number' />)
      setLoading(false)
      return
    }
    if (user.email !== changedUser.email) {
      if (!changedUser.email || changedUser.email === '') {
        toast.error(<IntlMessages id='alerts.email_required' />)
      } else if (editPage === 'email' && !validateEmail(changedUser.email)) {
        toast.error(<IntlMessages id='alerts.valid_email' />)
      } else {
        await axiosInstance
          .put(`/users/change-email`, { new_email: changedUser.email })
          .then((res) => {
            if (editPage === 'email') {
              toast.success('Your email has been changed successfully')
              setUser(res.data)

              const storageUser = JSON.parse(localStorage.getItem('user'))
              const userObject = {
                token: localStorage.getItem('access_token'),
                user: {
                  ...storageUser.user,
                  email: changedUser.email
                }
              }
              localStorage.setItem('user', JSON.stringify(userObject))

              closeModal('profileModal')
            }
          })
          .catch((err) => {
            setLoading(false)
            toast.error(err.response.data)
          })
      }
    }

    if (editPage === 'email') {
      setLoading(false)
      return
    }

    await axiosInstance
      .put(`/users`, params)
      .then((res) => {
        setUser(res.data)
        setSocialMedia(res.data.social_links)
        setLoading(false)
        const user = JSON.parse(localStorage.getItem('user'))
        const userProfession = user ? user.user?.profession : null

        if (userProfession !== res.data.profession) {
          const updatedUser = {
            ...user,
            profession: res.data.profession
          }

          localStorage.setItem('user', JSON.stringify(updatedUser))
          dispatch(userUpdateProfession(res.data.profession))
        } else if (localStorage.getItem('name') !== res.data.name) {
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
    if (modal === 'profileModal') {
      setShowEditProfileModal(false)
    } else if (modal === 'passwordModal') {
      setShowEditPasswordModal(false)
    } else if (modal === 'shareModal') {
      setShareMyPortfolioModal(false)
    } else if (modal === 'subscriptionModal') {
      setCancelSubscriptionModal(false)
    } else if (modal === 'tags') {
      setTagsModal(false)
    } else if (modal === 'addUserTagModal') {
      setAddUserTagsModal(false)
    }
  }

  // const cancelSubscription = async () => {
  //   await axiosInstance
  //     .post(`/users/cancel-subscription`, {
  //       lang: currentLanguage
  //     })
  //     .then(async (res) => {
  //       userLogout()
  //     })
  //     .catch((err) => err)
  // }

  // const userLogout = async () => {
  //   await Auth.signOut({ global: true })
  //     .then(() => {
  //       window.location = '/logout'
  //     })
  //     .catch((err) => err)
  // }

  // const saveUserTags = async (data, toDelete) => {
  //   setLoading(true)

  //   if (toDelete.length > 0) {
  //     await deleteUserTag(toDelete, data.length > 0 ? false : true)
  //   }
  //   if (data.length > 0) {
  //     await addTag(data)
  //     setLoading(false)
  //   }
  // }

  // const addTag = async (data) => {
  //   await axiosInstance
  //     .post(`/tags/user`, data)
  //     .then(async (res) => {
  //       if (res.data.message === 'more') {
  //         toast.error(<IntlMessages id='my_account.add_my_profile_tags_more' />)
  //         await getUserTags()
  //         setLoading(false)
  //         closeModal('tags')
  //       } else {
  //         toast.success(<IntlMessages id='alerts.success_change' />)
  //         await getUserTags()
  //         setLoading(false)
  //         closeModal('tags')
  //       }
  //     })
  //     .catch((err) => setLoading(false))
  // }

  // const deleteUserTag = async (data, showToast) => {
  //   await axiosInstance
  //     .delete('/tags/', { data })
  //     .then(async () => {
  //       if (showToast == true) {
  //         toast.success(<IntlMessages id='alerts.success_change' />)
  //       }
  //       await getUserTags()
  //       setLoading(false)
  //       closeModal('tags')
  //     })
  //     .catch((err) => setLoading(false))
  // }

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
              <div style={{ backgroundColor: '#f8f7f7' }} className='pb-3'>
                <div className='my-account mx-0 mt-4'>
                  <div className='row p-sm-3 p-3'>
                    <div className='col-12 text-center text-md-auto col-md-4 col-lg-3 gx-5'>
                      <div className='round-image-wrapper'>
                        <Image
                          src={
                            user.profile_image
                              ? user.profile_image
                              : defaultImage
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

                    <div className='mt-3'>
                      {user.bio ? (
                        <p>{user.bio}</p>
                      ) : (
                        <>
                          <p>You can write your biography here.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className='my-account mt-4 mb-2 mx-3 pr-2'
                  style={{ border: '2px solid #bbbdbf' }}
                >
                  <div className='row'>
                    <div className='row justify-content-between'>
                      <h4 className='m-3 col-12 col-lg-5'>
                        <IntlMessages id='my_account.email_address' />
                      </h4>
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
                {userRole === 'student' && (
                  <>
                    <div className='d-flex mx-3 my-3'>
                      {!instructorNotes && (
                        <Col md='6' className='pe-2'>
                          <div
                            className={`my-account  ${
                              instructorNotes
                                ? 'intructor-notes__btn-active'
                                : 'intructor-notes__btn'
                            }  `}
                            onClick={instructorNotesHandler}
                          >
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              size='xl'
                              style={
                                instructorNotes
                                  ? { color: 'white', fontSize: '40px' }
                                  : { color: '#707070', fontSize: '40px' }
                              }
                            />
                            <h4>INSTRUCTOR NOTES</h4>
                          </div>
                        </Col>
                      )}
                      {!platformBadges && (
                        <Col
                          md='6'
                          className={`${!platformBadges ? 'ps-0' : 'ps-2'} `}
                          ref={platformBadgesRef}
                        >
                          <div
                            className={`my-account  ${
                              platformBadges
                                ? 'intructor-notes__btn-active'
                                : 'intructor-notes__btn'
                            }  `}
                            onClick={platformBadgeHandler}
                          >
                            <FontAwesomeIcon
                              icon={faCircleNotch}
                              size='xl'
                              style={
                                platformBadges
                                  ? { color: 'white', fontSize: '40px' }
                                  : { color: '#707070', fontSize: '40px' }
                              }
                            />
                            <h4>PLATFORM BADGES</h4>
                          </div>
                        </Col>
                      )}
                    </div>
                    {instructorNotes && (
                      <InstructorNotes
                        instructorNotesHandler={instructorNotesHandler}
                        userRole={userRole}
                      />
                    )}
                    {platformBadges && (
                      <PlatformBadges
                        userRole={userRole}
                        platformBadgeHandler={platformBadgeHandler}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {userRole !== 'student' && (
          <div className='col-12 col-xl-3 border-md-0'>
            <div style={{ marginTop: '40px' }}>
              <StudentCountProvider>
                <StudentData fetchStudents={true} />
              </StudentCountProvider>
            </div>
          </div>
        )}
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
      {/*{tagsModal && (*/}
      {/*  <ProfileTags*/}
      {/*    show={tagsModal}*/}
      {/*    onHide={() => closeModal('tags')}*/}
      {/*    userTags={userTags}*/}
      {/*    allTags={allTags}*/}
      {/*    saveUserTags={saveUserTags}*/}
      {/*    loading={loading}*/}
      {/*  />*/}
      {/*)}*/}
      <ShareMyPortfolio
        show={shareMyPortfolioModal}
        onHide={() => closeModal('shareModal')}
        userLink={userPortfolio.url}
      />
      {/*<CancelSubscriptionModal*/}
      {/*  show={cancelSubscriptionModal}*/}
      {/*  onHide={() => closeModal('subscriptionModal')}*/}
      {/*  cancelSubscription={cancelSubscription}*/}
      {/*/>*/}
    </div>
  )
}
export default injectIntl(MyAccount, {
  withRef: false
})
