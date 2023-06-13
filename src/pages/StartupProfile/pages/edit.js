import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useLayoutEffect, useState } from 'react'
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
import '../style/toggle.css'
import '../style/index.css'
import { CreateNewStartupProfile } from '../../../components/StartupProfile/modals/createNew'
import {
  faGlobe,
  faImage,
  faPencilAlt as faPen,
  faPlay,
  faShareAltSquare,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import FoundersEdit from '../components/FoundersEdit'
import VideoModal from '../components/VideoModal'
import EditVideoModal from '../components/Modals/EditVideoModal'
import EditFounderModal from '../components/Modals/EditFounderModal'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import ConnectionRequestsBox from '../../../components/Connections/connectionRequestBox'
import { IsUserLevelAuthorized, ShowMessenger } from '../../../utils/helpers'
import Share from '../components/Modals/Share'
import ApplyForPitch from '../components/Modals/ApplyForPitch'
import EditImageOfVideoModal from '../components/Modals/EditImageOfVideoModal'

const EditProject = (props) => {
  const [project, setProjects] = useState()
  const [createStartUpProfile, SetCreateStartupProfile] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [OpenEditVideoModal, setopenEditVideoModal] = useState(false)
  const [OpenEditVideoImageModal, setopenEditVideoImageModal] = useState(false)
  const [image_url, setImage_url] = useState()
  const [endIndex, setEndIndex] = useState(4)
  const [showVideo, setShowVideo] = useState(false)
  const [toggle, setToggle] = useState(0)
  const [connections, setConnections] = useState([])
  const [PitchApplyModal, setPitchApplyModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const id = useParams().id
  const history = useHistory()
  const [OpenShareModal, setOpenShareModal] = useState(false)

  const updateStatus = async () => {
    // in db we dont have a column for this so we used the show_tags to check if project is published or not
    await axiosInstance
      .put(`/Business/update/Business`, {
        id: project.id,
        show_tags: !toggle
      })
      .then(() => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => err)
  }

  const updateState = (data) => {
    setProjects(data)
  }
  const updateProjectImage = (data) => {
    setProjects((project) => ({
      ...project,
      videoImage: data
    }))
  }
  const handleSubmit = async (video) => {
    await axiosInstance
      .put(`/Business/update/Business`, {
        id: project.id,
        company_video: video
      })
      .then((response) => {
        setProjects((old) => ({ ...old, company_video: video }))
        toast.success('The video url was updated successful.')
        setopenEditVideoModal(false)
      })
      .catch((err) => err)
  }

  useEffect(() => {
    getProject()
  }, [])
  useLayoutEffect(() => {
    getProject()
  }, [])

  const getProject = async () =>
    await axiosInstance
      .get('/business/edit/' + id)
      .then((res) => {
        setProjects(res.data.data)
        setToggle(res.data.data.show_tags)
      })
      .catch((error) => {
        if (error.response.status == 403) {
          history.push(`/PublishedProject/${id}`)
        } else if (error.response.status == 404) {
          history.push(`/MyStartupProfile`)
        }
      })

  const closeModal = (name) => {
    if (name == 'startup') {
      SetCreateStartupProfile(false)
    }
  }
  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  useEffect(() => {
    getUserConnections()
  }, [])

  const updateShowPreference = async (e, id, value) => {
    const name = e.target.name
    if (name == 'showVideo') {
      if (
        e.target.checked &&
        (project.company_video == '' || !project.company_video)
      ) {
        e.target.click()
        toast.error('Project video is required!')
        return
      }

      if (
        e.target.checked &&
        (project.videoImage == '' || !project.videoImage)
      ) {
        e.target.click()
        toast.error('Project thumbnail is required!')
        return
      }

      await axiosInstance
        .put('/Business/update/Business', {
          id: project.id,
          show_company_video: !project.show_company_video
        })
        .then((res) => {
          setProjects((oldData) => ({
            ...oldData,
            show_company_video: !oldData.show_company_video
          }))
        })
    } else if (name == 'showFounders') {
      await axiosInstance
        .put('/Business/update/Business', {
          show_founders: value,
          id: project.id
        })
        .then((res) => {
          setProjects((oldData) => ({
            ...oldData,
            show_founders: !oldData.show_founders
          }))
        })
        .catch((err) => err)
    } else if (name == 'showFounder') {
      await axiosInstance
        .put('/Business/update/founder', {
          is_visible: value,
          user_id: id,
          business_id: project.id
        })
        .then((res) => {
          setProjects((oldData) => ({
            ...oldData,
            show_founders: !oldData.show_founders
          }))
        })
        .catch((err) => err)
    }
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
    <div className="row">
      <div className="pt-5 px-4 col-lg-9 page-border">
        <div className="px-2 rounded mx-3 mx-md-auto row">
          <div className="col-12 col-lg-6 row pb-4">
            <p className="edit-project-page-title pb-0 mb-0">
              MY PROJECT |{' '}
              <Link to={`/PreviewMyStartupProfile/${id}`} className="blue-text">
                PREVIEW
              </Link>
            </p>
            <p className="delete-project-description pt-0 mt-0">
              Sharing my solutions with the global community.
            </p>
          </div>
          <div className="col-12 col-lg-6 px-0 mx-0 gx-0 view-button pb-5 pb-lg-0">
            <Link to={'/MyStartupProfile'}>
              {' '}
              <span className="float-end px-4 py-3">VIEW ALL PROJECTS</span>
            </Link>
          </div>
        </div>
        <div
          className={`border border-2 px-4 rounded pt-4 my-account ${
            project?.description.length == 0 && 'pb-4'
          }`}
        >
          <div className="d-flex flex-wrap pb-0 mb-3">
            <div className="d-flex my-auto">
              <img
                id="myProjectImage"
                src={project?.image ? project?.image : defaultImage}
                style={{ objectFit: 'cover' }}
                className="me-2 rounded-circle float-start user-image"
              />
            </div>
            <div className="portfolio-user-info pt-md-4" style={{ flex: 1 }}>
              <div className="row">
                <div className="col-10">
                  <div className="ps-md-2">
                    <span className="startup_project_name d-block">
                      {project?.company_name}
                    </span>
                    <span className="startup_project_slogane d-block">
                      {project?.company_slogan}
                    </span>
                    <span className="social_media">
                      {(project?.social_links?.linkedin ||
                        project?.social_links?.twitter ||
                        project?.social_links?.instagram ||
                        project?.social_links?.facebook ||
                        project?.social_links?.website) && (
                        <div
                          className="mt-0 d-flex flex-wrap pt-md-auto"
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
                              rel="noreferrer"
                              target="_blank"
                              className="link me-1"
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
                              rel="noreferrer"
                              target="_blank"
                              className="link me-1"
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
                              rel="noreferrer"
                              target="_blank"
                              className="link me-1"
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
                              rel="noreferrer"
                              target="_blank"
                              className="link me-1"
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
                              rel="noreferrer"
                              target="_blank"
                              className="link me-1"
                            >
                              <FontAwesomeIcon icon={faGlobe} />
                            </a>
                          )}
                        </div>
                      )}
                    </span>
                  </div>
                </div>
                <div className="col-2">
                  <FontAwesomeIcon
                    icon={faPen}
                    className="float-end startup_project_pen_edit_icon mt-3 mt-md-1 me-3"
                    onClick={() => SetCreateStartupProfile(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="published_company_description mb-4">
              {project?.description}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-lg-6">
            <div className="col-12 border border-2 rounded px-4 py-3 h-100">
              <div className="edit_project_video py-2">
                <span className="edit_project_video_title d-block pb-3">
                  PROMO VIDEO
                  <FontAwesomeIcon
                    icon={faImage}
                    className="float-end ms-2"
                    onClick={() => setopenEditVideoImageModal(true)}
                  />
                  <FontAwesomeIcon
                    icon={faPen}
                    className="ms-auto float-end"
                    onClick={() => setopenEditVideoModal(true)}
                  />
                </span>
                <span className="edit_project_video_info mt-3 d-block text-start text-md-end justify-content-between justify-content-md-end d-flex">
                  <label className="px-0 ps-sm-1 ps-md-1 float-md-end my-auto form-switch d-flex order-1">
                    <input
                      type="checkbox"
                      name="showVideo"
                      checked={project?.show_company_video}
                      onChange={(e) => updateShowPreference(e)}
                    />
                    <i className="my-auto me-0"></i>
                  </label>
                  <span className="ms-md-auto align-start float-md-end me-2 order-0">
                    Show on Project Page
                  </span>
                </span>
              </div>
              <div className="vide mx-auto my-auto mb-4 pt-4 col-12 row">
                <div className="col-12 w-100" style={{ position: 'relative' }}>
                  <img
                    src={
                      project?.videoImage == null
                        ? project?.image
                        : project?.videoImage
                    }
                    alt={project?.company_video}
                    className="w-100"
                    height={'250px'}
                    style={{ objectFit: 'cover' }}
                    onClick={
                      project?.hasOwnProperty('company_video') &&
                      project?.company_video
                        ? (e) => {
                            setShowVideo(true)
                          }
                        : () => {
                            setopenEditVideoModal(true)
                          }
                    }
                  />
                  <div className="video-play-icon">
                    <FontAwesomeIcon
                      icon={faPlay}
                      onClick={
                        // project?.company_video &&
                        // project?.company_video != null &&
                        // project?.company_video != undefined &&
                        // project?.company_video.length == 0 &&
                        project?.hasOwnProperty('company_video') &&
                        project?.company_video
                          ? (e) => {
                              setShowVideo(true)
                            }
                          : () => {
                              setopenEditVideoModal(true)
                            }
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="vide mx-auto my-auto mb-4 px-2 col-12 row">
                <div
                  className="border border-1 vimeo-or-youtube my-auto d-flex"
                  style={{ height: '48px' }}
                >
                  <span className="my-auto flex-grow-1">
                    {!project?.company_video ? (
                      <>Vimeo or Youtube link</>
                    ) : (
                      <>{project?.company_video}</>
                    )}
                  </span>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="float-end my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <FoundersEdit
            data={project && project}
            updateShowPreference={(e, id, value) =>
              updateShowPreference(e, id, value)
            }
          />
        </div>
      </div>
      <div className="col-12 col-lg-3 px-4">
        <div className="col-12 mt-4 d-flex flex-wrap d-flex justify-content-start">
          <h3 className="publish-my-project d-flex ">
            Publish My Project
            <label className="px-0 ps-sm-1 ms-3 ps-md-1 form-switch">
              <input
                type="checkbox"
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

          <p className=" pe-xxl-5 break d-flex publish-my-project-community">
            Set your startup to live and build a powerful network inside your
            community.
          </p>
        </div>
        <div
          className="col-12 mt-3 d-flex flex-wrap d-flex justify-content-start mx-auto"
          onClick={() => {
            setOpenShareModal(true)
          }}
        >
          <FontAwesomeIcon
            icon={faShareAltSquare}
            style={{ fontSize: '35px' }}
            className={'my-auto'}
          />
          <div className="d-flex flex-column ps-3">
            <p className="d-block py-0 my-0 share-widget-share-this-project ">
              Share This Project
            </p>
            <p className="d-block py-0 my-0 share-widget-Startup-must-be-published-first">
              Startup must be published first.
            </p>
          </div>
        </div>
        {/*  */}
        <div className="col-12 mt-4">
          <span
            className="px-4 py-2 mt-4 pitch_button d-block"
            onClick={() => setPitchApplyModal(true)}
          >
            PITCH APPLICATIONS OPEN 2023
          </span>
        </div>
        {/*  */}
        <ConnectionRequestsBox from="MyProject" />
        <ShowMessenger />
        {/* <div
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
        </div> */}
      </div>
      <EditImageOfVideoModal
        show={OpenEditVideoImageModal}
        id={id}
        updateProjectImage={(data) => updateProjectImage(data)}
        setImage_url={(url) => setImage_url(url)}
        image_url={project?.videoImage ? project?.videoImage : project?.image}
        onHide={() => setopenEditVideoImageModal(false)}
        setSelectedImage={(e) => setSelectedImage(e)}
        selectedImage={selectedImage ? selectedImage : project?.image}
      />
      <CreateNewStartupProfile
        from={'edit'}
        data={project}
        show={createStartUpProfile}
        updateState={(data) => updateState(data)}
        onHide={() => closeModal('startup')}
      />
      <VideoModal
        show={showVideo}
        onHide={() => setShowVideo(false)}
        url={project?.company_video}
        thumbnail={
          project?.videoImage == null ? project?.image : project?.videoImage
        }
      />
      <EditVideoModal
        show={OpenEditVideoModal}
        onHide={() => setopenEditVideoModal(false)}
        handleSubmit={(video) => {
          handleSubmit(video)
        }}
        project={project}
      />
      <Share
        show={OpenShareModal}
        onHide={() => setOpenShareModal(false)}
        project={project && project}
        connections={connections && connections}
      />
      <ApplyForPitch
        show={PitchApplyModal}
        onHide={() => setPitchApplyModal(false)}
      />
    </div>
  )
}

export default EditProject
