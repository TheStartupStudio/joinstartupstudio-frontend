import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

export default function PublicProfile() {
  const username = useParams().username
  const [userData, setUserData] = useState({})

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    await axiosInstance
      .get(`/${username}/profile`)
      .then((response) => {
        setUserData(response.data.profile)
      })
      .catch((err) => err)
  }

  return (
    <div className='row public-page'>
      {Object.keys(userData).length === 0 ? (
        <p className='m-3'>User is private</p>
      ) : (
        <>
          <div className='col-lg-1'></div>
          <div className='col-lg-2 col-md-2 px-0 text-center'>
            <img
              src={userData.profile_image ? userData.profile_image : ''}
              alt='user profile'
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                position: 'relative'
              }}
            />
          </div>
          <div className='col-lg-8 col-md-8 profile-preview'>
            <h3 className='public-page-text-align'>{userData.name}</h3>
            <h5 className='public-page-text-align'>
              {userData.profession ? userData.profession : null}
            </h5>
            <div className='public-page-text-align'>
              {userData?.social_links?.linkedIn && (
                <a
                  href={
                    userData?.social_links?.linkedIn.startsWith('https')
                      ? userData?.social_links?.linkedIn
                      : `https://${userData?.social_links?.linkedIn}`
                  }
                  target='_blank'
                  className='me-2'
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              )}
              {userData?.social_links?.twitter && (
                <a
                  href={
                    userData?.social_links?.twitter.startsWith('https')
                      ? userData?.social_links?.twitter
                      : `https://${userData?.social_links?.twitter}`
                  }
                  target='_blank'
                  className='me-2'
                >
                  <FontAwesomeIcon icon={faTwitterSquare} />
                </a>
              )}
              {userData?.social_links?.instagram && (
                <a
                  href={
                    userData?.social_links?.instagram.startsWith('https')
                      ? userData?.social_links?.instagram
                      : `https://${userData?.social_links?.instagram}`
                  }
                  target='_blank'
                  className='me-2'
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              )}
              {userData?.social_links?.facebook && (
                <a
                  href={
                    userData?.social_links?.facebook.startsWith('https')
                      ? userData?.social_links?.facebook
                      : `https://${userData?.social_links?.facebook}`
                  }
                  target='_blank'
                  className='me-2'
                >
                  <FontAwesomeIcon icon={faFacebookSquare} />
                </a>
              )}
              {userData?.social_links?.website && (
                <a
                  href={
                    userData?.social_links?.website.startsWith('https')
                      ? userData?.social_links?.website
                      : `https://${userData?.social_links?.website}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon icon={faGlobe} />
                </a>
              )}
            </div>
            <div className='profile-preview mt-3 mb-5'>
              <textarea
                name='bio'
                value={userData.bio ? userData.bio : null}
                readOnly={true}
              />
            </div>
          </div>
          <div className='col-lg-1'></div>
        </>
      )}
    </div>
  )
}
