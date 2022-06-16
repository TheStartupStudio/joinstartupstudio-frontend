import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import ReactPlayer from 'react-player'
import defaultImage from '../../assets/images/profile-image.png'
import './style/index.css'
import './style/toggle.css'
import ConnectionBox from '../../components/Connections/connectionBox'
import { CreateNewStartupProfile } from '../../components/StartupProfile/modals/createNew'
import {
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faLink,
  faMousePointer,
  faPencilAlt as faPen,
  faPlay,
  faShareAltSquare,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import FoundersEdit from './components/FoundersEdit'
import VideoModal from './components/VideoModal'
import EditVideoModal from './components/Modals/EditVideoModal'
import EditFounderModal from './components/Modals/EditFounderModal'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import { IsUserLevelAuthorized, ShowMessenger } from '../../utils/helpers'
import Share from './components/Modals/Share'
import FoundersPreview from './components/FoundersPreview'
import VideoPreview from './components/VideoPreview'

const Preview = () => {
  const [project, setProjects] = useState()
  const id = useParams().id
  const history = useHistory()
  const [toggle, setToggle] = useState(0)
  const [OpenShareModal, setOpenShareModal] = useState(false)
  const [connections, setConnections] = useState([])

  useEffect(() => {
    getProject()
    getUserConnections()
  }, [])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const updateStatus = async () => {
    // in db we dont have a column for this so we used the show_tags to check if project is published or not
    await axiosInstance
      .put(`/Business/update/Business`, {
        id: project.id,
        show_tags: !toggle
      })
      .then(() => {
        toast.success(<IntlMessages id='alerts.success_change' />)
        setToggle(!toggle)
      })
      .catch((err) => err)
  }

  const getProject = async () =>
    await axiosInstance
      .get(`/business/check-if-user-have-this-business/${id}`)
      .then(
        async (res) =>
          await axiosInstance.get('/business/byId/' + id).then((res) => {
            setProjects(res.data.data)
          })
      )
      .catch((error) => {
        if (error.response.status == 403) {
          history.push(`/MyStartupProfile`)
        }
      })

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
      <div className='pt-5 px-md-4 col-lg-9 page-border'>
        <div className='px-3 rounded mb-5'>
          <div className='col-12 row pb-4'>
            <p className='edit-project-page-title pb-0 mb-0'>
              MY PROJECT |{' '}
              <Link to={`/editProject/${id}`} className='blue-text'>
                EDIT
              </Link>
            </p>
            <p className='delete-project-description pt-0 mt-0'>
              Sharing my solutions with the global community.
            </p>
          </div>
          <div className='row'>
            <div
              className={`px-3 rounded pt-4 my-account ${
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
                    <div className='col-12 mt-md-4 ms-2'>
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

              <div className='published_company_description mb-4 mt-4'>
                {project?.description}
              </div>
            </div>
          </div>
        </div>
        <div className='rounded mx-3 mx-md-auto pt-md-4 row mb-4'>
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

      <div className='col-12 col-lg-3 px-4'>
        <div className='col-12 px-3 px-xl-0 mt-4 d-flex flex-wrap d-flex justify-content-start'>
          <h3 className='publish-my-project d-flex '>
            Publish My Project
            <label className='px-0 ps-sm-1 ms-3 ps-md-1 form-switch'>
              <input
                type='checkbox'
                checked={toggle}
                onChange={() => {
                  updateStatus()
                }}
              />
              <i></i>
            </label>
          </h3>
          <div
            style={{
              flexBasis: '100%',
              height: 0
            }}
          ></div>

          <p className=' pe-xxl-5 break d-flex publish-my-project-community'>
            Set your startup to live and build a powerful network inside your
            community.
          </p>
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
        <div
          className={`community-connect px-3 ${
            !IsUserLevelAuthorized() && 'notAllowed'
          } my-2`}
        >
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
      </div>
      <Share
        show={OpenShareModal}
        onHide={() => setOpenShareModal(false)}
        project={project && project}
        connections={connections && connections}
      />
    </div>
  )
}

export default Preview
