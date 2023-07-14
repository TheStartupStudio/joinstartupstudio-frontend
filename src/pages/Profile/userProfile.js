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
  const [userTags, setUserTags] = useState({})
  const [allTags, setAllTags] = useState({})
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const [userPortfolio, setUserPortfolio] = useState({})
  const [userTagsId, setUserTagsId] = useState([])
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
        setAllTags(response.data.filter((tag) => !userTagsId.includes(tag.id)))
      })
      .catch((err) => err)
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
