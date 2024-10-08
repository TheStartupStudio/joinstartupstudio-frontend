import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import ReactPlayer from 'react-player'
import defaultImage from '../../../assets/images/profile-image.png'

import '../style/index.css'
import ConnectionBox from '../../../components/Connections/connectionBox'
import {
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import Share from './Modals/Share'
import FoundersPreview from './FoundersPreview'
import VideoPreview from './VideoPreview'
import IntlMessages from '../../../utils/IntlMessages'
import { toast } from 'react-toastify'
import ConnectionRequestsBox from '../../../components/Connections/connectionRequestBox'
import { ShowMessenger } from '../../../utils/helpers'
import { useSelector } from 'react-redux'

const PublishedProject = (props) => {
  const [project, setProjects] = useState()
  const id = useParams().id
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(2)
  const [width, setWidth] = useState(null)
  const [toggle, setToggle] = useState(0)
  const [OpenShareModal, setOpenShareModal] = useState(false)
  const [connections, setConnections] = useState([])
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const history = useHistory()

  useEffect(() => {
    getProject()
    getUserConnections()
  }, [])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const getProject = () => {
    let havingProject = false
    axiosInstance.get('/business/byId/' + id).then((res) => {
      if (res.data.data.show_tags != 1) {
        res.data.data.founders.map((founder) => {
          if (founder.id == loggedUserId) {
            havingProject = true
            setProjects(res.data.data)
            return
          }
        })
        if (!havingProject) {
          history.push(`/PrivateProject`)
        }
      } else {
        setProjects(res.data.data)
      }
    })
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

  return (
    <div className='row'>
      <div className='pt-5 px-md-4 page-border col-lg-9'>
        <div className='px-2 rounded mx-3 mx-md-auto'>
          <div className='row'>
            <div
              className={`px-3 rounded pt-4 ${
                project?.description.length == 0 && 'pb-4'
              }`}
            >
              <div className='d-flex flex-wrap pb-0 mb-3'>
                <div className='d-flex my-auto'>
                  <img
                    src={project?.image ? project?.image : defaultImage}
                    width={'140px'}
                    height={'140px'}
                    style={{ objectFit: 'cover' }}
                    className='me-2 rounded-circle float-start user-image'
                  />
                </div>
                <div className='portfolio-user-info' style={{ flex: 1 }}>
                  <div className='row'>
                    <div className='col-12 mt-md-4 ps-md-4'>
                      <span className='startup_project_name d-block'>
                        {project?.company_name}
                      </span>
                      <span className='startup_project_slogane d-block'>
                        {project?.company_slogan}
                      </span>
                      <span className='social_media'>
                        {(project?.social_links?.linkedin ||
                          project?.social_links?.twitter ||
                          project?.social_links?.instagram ||
                          project?.social_links?.facebook ||
                          project?.social_links?.website) && (
                          <div
                            className='mt-0 d-flex flex-wrap pt-md-auto'
                            style={style.social_links}
                          >
                            {project?.social_links?.linkedin && (
                              <a
                                href={
                                  project.social_links.linkedin?.startsWith(
                                    'https'
                                  )
                                    ? project.social_links.linkedin
                                    : `https://${project.social_links.linkedin}`
                                }
                                rel='noreferrer'
                                target='_blank'
                                className='link me-1'
                              >
                                <FontAwesomeIcon icon={faLinkedinIn} />
                              </a>
                            )}
                            {project?.social_links?.twitter && (
                              <a
                                href={
                                  project.social_links.twitter?.startsWith(
                                    'https'
                                  )
                                    ? project.social_links.twitter
                                    : `https://${project.social_links.twitter}`
                                }
                                rel='noreferrer'
                                target='_blank'
                                className='link me-1'
                              >
                                <FontAwesomeIcon icon={faTwitterSquare} />
                              </a>
                            )}
                            {project?.social_links?.facebook && (
                              <a
                                href={
                                  project.social_links.facebook?.startsWith(
                                    'https'
                                  )
                                    ? project.social_links.facebook
                                    : `https://${project.social_links.facebook}`
                                }
                                rel='noreferrer'
                                target='_blank'
                                className='link me-1'
                              >
                                <FontAwesomeIcon icon={faFacebookSquare} />
                              </a>
                            )}
                            {project?.social_links?.instagram && (
                              <a
                                href={
                                  project.social_links.instagram?.startsWith(
                                    'https'
                                  )
                                    ? project.social_links.instagram
                                    : `https://${project.social_links.instagram}`
                                }
                                rel='noreferrer'
                                target='_blank'
                                className='link me-1'
                              >
                                <FontAwesomeIcon icon={faInstagram} />
                              </a>
                            )}
                            {project?.social_links?.website && (
                              <a
                                href={
                                  project.social_links.website?.startsWith(
                                    'https'
                                  )
                                    ? project.social_links.website
                                    : `https://${project.social_links.website}`
                                }
                                rel='noreferrer'
                                target='_blank'
                                className='link me-1'
                              >
                                <FontAwesomeIcon icon={faGlobe} />
                              </a>
                            )}
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='published_company_description'>
                {project?.description}
              </div>
            </div>
          </div>
        </div>
        <div className='rounded mx-3 mx-md-auto pt-md-4 row mb-md-4 mt-3'>
          {project && (
            <FoundersPreview
              founders={project.founders.filter(
                (item) => item.Business_Founders.is_visible
              )}
              founder={project}
              data={project}
            />
          )}
          {project &&
            project?.company_video !== null &&
            project?.show_company_video != 0 && (
              <VideoPreview project={project} />
            )}
        </div>
      </div>
      <Share
        show={OpenShareModal}
        onHide={() => setOpenShareModal(false)}
        project={project && project}
        connections={connections && connections}
      />
      <div className='col-12 col-lg-3 px-4'>
        <div className='col-12 px-3 px-xl-0 mt-4 d-flex flex-wrap d-flex justify-content-start'>
          <div
            style={{
              flexBasis: '100%',
              height: 0
            }}
          ></div>
        </div>
        <div
          className='col-12 px-3 px-xl-0 mt-3 d-flex flex-wrap d-flex justify-content-start mx-auto'
          onClick={() => {
            setOpenShareModal(true)
          }}
        >
          <FontAwesomeIcon
            icon={faShareAltSquare}
            style={{ fontSize: '35px' }}
            className={'my-auto'}
          />
          <div className='d-flex flex-column ps-3'>
            <p className='d-block py-0 my-0 share-widget-share-this-project '>
              Share This Project
            </p>
            <p className='d-block py-0 my-0 share-widget-Startup-must-be-published-first'>
              Startup must be published first.
            </p>
          </div>
        </div>
        <ConnectionRequestsBox from='PublishedProject' />
        <ShowMessenger />
      </div>
      <Share
        show={OpenShareModal}
        onHide={() => setOpenShareModal(false)}
        project={project && project}
        connections={connections && connections}
      />
      {/* </div> */}
    </div>
  )
}

export default PublishedProject
