import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Image, InputGroup, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import Auth from '@aws-amplify/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
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
import { editSocialMedia } from '../../redux/user/Actions'
import StudentData from '../../components/MyStudents/studentData'
import { StudentCountProvider } from '../../components/MyStudents/studentCountContext'
import { getUserWithIdAction } from '../../redux/users/Actions'
import './style.css'
import InstructorNotes from '../../components/Profile/InstructorNotes/InstructorNotes'

function Profile(props) {
  const dispatch = useDispatch()
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
  const currentLanguage = useSelector((state) => state.lang.locale)
  const userProfile = useSelector((state) => state.users.selectedUser)

  const { id } = useParams()

  useEffect(() => {
    dispatch(getUserWithIdAction(id))
  }, [id])

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
      .get(`/users/${id}`)
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
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
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
      .get(`/tags/users/${id}`)
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
              <IntlMessages id="my_account.add_my_profile_tags_more" />
            )
            await getUserTags()
            setLoading(false)
            closeModal('addUserTagModal')
            closeModal('tags')
          } else {
            toast.success(<IntlMessages id="alerts.success_change" />)
            await getUserTags()
            setLoading(false)
            closeModal('addUserTagModal')
            closeModal('tags')
          }
        })
        .catch((err) => {
          setLoading(false)
          toast.error(<IntlMessages id="alerts.something_went_wrong" />)
          closeModal('addUserTagModal')
          setTagName('')
        })
    }
  }

  const editUser = async (changedUser, changedMedias) => {
    console.log('changedUser', changedUser)
    console.log('changedMedias', changedMedias)
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
      toast.error(<IntlMessages id="profile.incorrect_number" />)
      setLoading(false)
      return
    }
    if (user.email !== changedUser.email) {
      if (!changedUser.email || changedUser.email === '') {
        toast.error(<IntlMessages id="alerts.email_required" />)
      } else if (editPage == 'email' && !validateEmail(changedUser.email)) {
        toast.error(<IntlMessages id="alerts.valid_email" />)
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
        if (localStorage.getItem('name') !== res.data.name) {
          localStorage.setItem('name', res.data.name)
          dispatch(userUpdate(res.data.name))
        } else if (userProfile?.profileImage !== res.data.profile_image) {
          localStorage.setItem('profileImage', res.data.profile_image)
          dispatch(userUpdateProfileImage(res.data.profile_image))
        }
        toast.success(<IntlMessages id="alert.my_account.success_change" />)
        closeModal('profileModal')
        dispatch(editSocialMedia(params.social_links))
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
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
          toast.error(<IntlMessages id="my_account.add_my_profile_tags_more" />)
          await getUserTags()
          setLoading(false)
          closeModal('tags')
        } else {
          toast.success(<IntlMessages id="alerts.success_change" />)
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
          toast.success(<IntlMessages id="alerts.success_change" />)
        }
        await getUserTags()
        setLoading(false)
        closeModal('tags')
      })
      .catch((err) => setLoading(false))
  }

  return (
    <div className="container-fluid mx-auto">
      <div className="row mx-auto">
        <div className="col-12 col-xl-9">
          <div className="col-12 col-md-12 px-0">
            <div className="account-page-padding page-border">
              <div className="row pe-0">
                <div className="col-md-8 pe-0">
                  <h3 className="page-title mb-0">
                    <IntlMessages id="my_account.page_title" />
                  </h3>
                  <p className="page-description">
                    <IntlMessages id="my_account.page_description" />
                  </p>
                </div>
                <div
                  className="col-md-4 update-password"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowEditPasswordModal(true)
                  }}
                >
                  <h3 className="float-md-end">
                    <IntlMessages id="my_account.update_password" />
                  </h3>
                </div>
              </div>
              <div style={{ backgroundColor: '#f8f7f7' }} className="pb-3">
                <div className="my-account mx-0 mt-4">
                  <div className="row p-sm-3 p-3">
                    <div className="col-12 text-center text-md-auto col-md-4 col-lg-3 gx-5">
                      <div className="round-image-wrapper">
                        <Image
                          src={
                            userProfile?.profile_image
                              ? userProfile?.profile_image
                              : defaultImage
                          }
                          className="editbio-user-image mx-auto my-account"
                        />
                      </div>
                    </div>
                    <div className="col-10 col-md-6 col-lg-6 offset-lg-0">
                      <h2 className="mt-4 mb-0">{userProfile?.name}</h2>
                      <h5 className="mb-0">
                        {userProfile?.profession ? userProfile?.profession : ''}
                      </h5>
                    </div>
                    {/* <div className="col-2 col-md-2 col-lg-3 mt-md-0">
                      <div
                        className="float-lg-end float-end mx-2 mx-md-0 mt-4 mt-sm-0 pt-md-4 px-md-4"
                        onClick={() => openEditProfileModal('profile')}
                        style={{ cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon
                          className="edit-pencil"
                          icon={faPencilAlt}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div
                  className="my-account mt-4 mb-2 mx-3 pr-2"
                  style={{ border: '2px solid #bbbdbf' }}
                >
                  <div className="row">
                    <div className="row justify-content-between">
                      <h4 className="m-3 col-12 col-lg-5">
                        <IntlMessages id="my_account.email_address" />
                      </h4>
                    </div>

                    <InputGroup className="mt-3 mb-3" style={{ width: '98%' }}>
                      <InputGroup.Text
                        style={{
                          border: 0,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <FontAwesomeIcon
                          className="edit-pencil mx-1"
                          icon={faEnvelope}
                        />
                      </InputGroup.Text>
                      <Form.Control
                        className="my-profile-input"
                        type="text"
                        value={userProfile?.email}
                      />
                    </InputGroup>
                  </div>
                </div>

                <InstructorNotes />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-3 border-md-0">
          <div style={{ marginTop: '40px' }}>
            <StudentCountProvider>
              <StudentData fetchStudents={true} />
            </StudentCountProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
export default injectIntl(Profile, {
  withRef: false
})
