import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import defaultImage from '../../assets/images/profile-image.png'
import Chat from '../../components/NoteAndChat/chat'

function ProfilePreview() {
  const [userData, setUserData] = useState({})
  const [editBio, setEditBio] = useState(false)
  const { user } = useSelector((state) => state.user.user)
  const userId = useSelector((state) => state.user.user.user.id)

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    await axiosInstance
      .get(`/users/${userId}`)
      .then((response) => {
        setUserData(response.data)
      })
      .catch((err) => err)
  }

  const saveBio = async (e) => {
    e.preventDefault()
    await axiosInstance
      .put(`/users`, userData)
      .then(() => {
        setEditBio(false)
      })
      .catch((err) => err)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setUserData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-9 px-0'>
            <div className='page-padding page-border'>
              <div className='row'>
                <div className='col-2 col-lg-2 col-md-12 profile-preview'>
                  <img
                    src={
                      userData.profileImage
                        ? userData.profileImage
                        : defaultImage
                    }
                    alt='Profile Image'
                  />
                </div>
                <div className='col-12 col-lg-10 mt-3 profile-preview pp-left-padding'>
                  <div className='d-flex link'>
                    <h3>{user.name}</h3>
                    {editBio ? (
                      <Link
                        href='#'
                        onClick={saveBio}
                        style={{ marginLeft: 'auto' }}
                      >
                        <IntlMessages id='general.save' />
                      </Link>
                    ) : (
                      <Link
                        href='#'
                        onClick={() => setEditBio(true)}
                        style={{ marginLeft: 'auto' }}
                      >
                        <IntlMessages id='general.edit' />
                      </Link>
                    )}
                  </div>
                  <h5>{userData.profession ? userData.profession : null}</h5>
                  <div>
                    {userData?.socialMedia?.linkedIn && (
                      <a
                        href={
                          userData.socialMedia.linkedIn.startsWith('https')
                            ? userData.socialMedia.linkedIn
                            : `https://${userData.socialMedia.linkedIn}`
                        }
                        target='_blank'
                        className='mr-2'
                      >
                        <FontAwesomeIcon icon={faLinkedinIn} />
                      </a>
                    )}
                    {userData?.socialMedia?.twitter && (
                      <a
                        href={
                          userData.socialMedia.twitter.startsWith('https')
                            ? userData.socialMedia.twitter
                            : `https://${userData.socialMedia.twitter}`
                        }
                        target='_blank'
                        className='mr-2'
                      >
                        <FontAwesomeIcon icon={faTwitterSquare} />
                      </a>
                    )}
                    {userData?.socialMedia?.instagram && (
                      <a
                        href={
                          userData.socialMedia.instagram.startsWith('https')
                            ? userData?.socialMedia.instagram
                            : `https://${userData.socialMedia.instagram}`
                        }
                        target='_blank'
                        className='mr-2'
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {userData?.socialMedia?.facebook && (
                      <a
                        href={
                          userData.socialMedia.facebook.startsWith('https')
                            ? userData.socialMedia.facebook
                            : `https://${userData.socialMedia.facebook}`
                        }
                        target='_blank'
                        className='mr-2'
                      >
                        <FontAwesomeIcon icon={faFacebookSquare} />
                      </a>
                    )}
                    {userData?.socialMedia?.website && (
                      <a
                        href={
                          userData.socialMedia.website.startsWith('https')
                            ? userData.socialMedia.website
                            : `https://${userData.socialMedia.website}`
                        }
                        target='_blank'
                        className='mr-2'
                      >
                        <FontAwesomeIcon icon={faGlobe} />
                      </a>
                    )}
                  </div>
                  <div className={` mt-3 mb-5 ${editBio ? 'edit-mode' : null}`}>
                    {userData?.bio || editBio === true ? (
                      <textarea
                        name='bio'
                        value={userData.bio || ''}
                        onChange={handleChange}
                        readOnly={editBio ? false : true}
                        placeholder='Write your bio...'
                      />
                    ) : (
                      <textarea>You can write your biography here.</textarea>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3 px-0 h-100'>
            <div className='my-page-right'>
              <Chat page='my-profile-chat' room={'PROFILE'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePreview
