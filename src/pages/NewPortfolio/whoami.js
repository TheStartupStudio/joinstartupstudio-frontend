import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './Portfolio.css'
import whoami from '../../assets/images/whoami.png'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
import MentorCard from '../../components/NewPortfolio/MyMentors/index'
import myDetailsIcon from '../../assets/images/my-details.svg'
import myPersonalBrandStory from '../../assets/images/personal-brand-story.svg'
import UserSocialMedia from '../Portfolio2024/Components/UserSocialMedia'
import myStoryIcon from '../../assets/images/my-story.svg'
import myRelationshipIcon from '../../assets/images/my-relationship.svg'
import myFailures from '../../assets/images/my-failuress.svg'
import myMentors from '../../assets/images/my-mentors.svg'
import EditPencil from '../../assets/images/edit-pencil.png'
import CarouselComponent from '../../components/Carousel/CarouselComponent'
import EditCard from '../../components/NewPortfolio/EditCard'
import AddCard from '../../components/NewPortfolio/AddCard'
import ReactQuill from 'react-quill'
import penIcon from '../../assets/images/pen-icon.svg'
import {
  saveUserBasicData,
  saveMyRelationships,
  createMyFailure,
  updateMyFailure,
  createMyMentor,
  updateMyMentor,
  deleteMyMentor
} from '../../redux/portfolio/Actions'
import { deleteImage, uploadImage } from '../../utils/helpers'
import useImageEditor from '../../hooks/useImageEditor'

import ReactImageUpload from '../Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'

const WhoAmI = (props) => {
  const dispatch = useDispatch()
  const [showMoreValueProp, setShowMoreValueProp] = useState(false)
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [playingVideos, setPlayingVideos] = useState({})
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isAddingDetails, setIsAddingDetails] = useState(false)
  const [changedUser, setChangedUser] = useState({
    primaryInterest: '',
    valueProposition: '',
    id: null
  })

  const [isEditingRelationships, setIsEditingRelationships] = useState(false)
  const [editedRelationships, setEditedRelationships] = useState({
    teamRole: props?.myRelationships?.teamRole || '',
    collaborationStyle: props?.myRelationships?.collaborationStyle || '',
    leadershipPhilosophy: props?.myRelationships?.leadershipPhilosophy || ''
  })

  const [isEditingVideo, setIsEditingVideo] = useState(false)
  const [videoData, setVideoData] = useState({
    videoUrl: props?.userBasicInfo?.videoUrl || '',
    thumbnailUrl: props?.userBasicInfo?.thumbnailUrl || ''
  })

  const [isEditingStory, setIsEditingStory] = useState(false)
  const [editedStory, setEditedStory] = useState(
    props?.userBasicInfo?.story || ''
  )

  const handleEditStory = () => {
    setIsEditingStory(true)
  }

  const handleSaveStory = () => {
    const userData = {
      story: editedStory,
      // Include other fields that need to be preserved
      primaryInterest: props?.userBasicInfo?.primaryInterest || '',
      valueProposition: props?.userBasicInfo?.valueProposition || '',
      videoUrl: props?.userBasicInfo?.videoUrl || '',
      id: props?.userBasicInfo?.id || null
    }

    dispatch(saveUserBasicData(userData, props?.userBasicInfo?.id))
    setIsEditingStory(false)
  }
  const handleCancelStoryEdit = () => {
    setIsEditingStory(false)
    setEditedStory(props?.userBasicInfo?.story || '')
  }
  useEffect(() => {
    setChangedUser({
      primaryInterest: props?.userBasicInfo?.primaryInterest || '',
      valueProposition: props?.userBasicInfo?.valueProposition || '',
      id: props?.userBasicInfo?.id || null
    })
    setEditedStory(props?.userBasicInfo?.story || '')
  }, [props?.userBasicInfo])

  useEffect(() => {
    setEditedRelationships({
      teamRole: props?.myRelationships?.teamRole || '',
      collaborationStyle: props?.myRelationships?.collaborationStyle || '',
      leadershipPhilosophy: props?.myRelationships?.leadershipPhilosophy || ''
    })
  }, [props?.myRelationships])

  // useEffect(() => {
  //   setEditedRelationships({
  //     teamRole: props?.myRelationships?.teamRole || '',
  //     collaborationStyle: props?.myRelationships?.collaborationStyle || '',
  //     leadershipPhilosophy: props?.myRelationships?.leadershipPhilosophy || ''
  //   })
  // }, [props?.myMentors])

  const handleSaveRelationships = () => {
    // Prepare data to save (you'll need to implement this API call)
    const relationshipsData = {
      teamRole: editedRelationships.teamRole,
      collaborationStyle: editedRelationships.collaborationStyle,
      leadershipPhilosophy: editedRelationships.leadershipPhilosophy,
      // Include other necessary fields
      id: props?.myRelationships?.id || null
    }

    dispatch(saveMyRelationships(relationshipsData, relationshipsData?.id))

    setIsEditingRelationships(false)
  }

  const handleCancelRelationshipsEdit = () => {
    setIsEditingRelationships(false)
    // Reset to original values
    setEditedRelationships({
      teamRole: props?.myRelationships?.teamRole || '',
      collaborationStyle: props?.myRelationships?.collaborationStyle || '',
      leadershipPhilosophy: props?.myRelationships?.leadershipPhilosophy || ''
    })
  }

  const [isEditingFailure, setIsEditingFailure] = useState(false)
  const [editingFailureId, setEditingFailureId] = useState(null)
  const [editedFailure, setEditedFailure] = useState({
    videoUrl: '',
    failure: '',
    pivot: '',
    outcomes: '',
    thumbnailUrl: '',
    showSection: true,
    category: 'my-failures'
  })

  const [isAddingFailure, setIsAddingFailure] = useState(false)

  // Handle edit failure
  const handleEditFailure = (failure) => {
    setEditingFailureId(failure.id)
    setEditedFailure({
      videoUrl: failure.videoUrl || '',
      failure: failure.failure || '',
      pivot: failure.pivot || '',
      outcomes: failure.outcomes || '',
      thumbnailUrl: failure.thumbnailUrl || '',
      showSection: failure.showSection ?? true,
      id: failure.id || null
    })
    setIsEditingFailure(true)
  }

  const handleAddFailure = () => {
    setEditingFailureId(null)
    setEditedFailure({
      videoUrl: '',
      failure: '',
      pivot: '',
      outcomes: '',
      thumbnailUrl: '',
      showSection: true,
      category: 'my-failures',
      id: null
    })
    setIsEditingFailure(true)
  }

  // Handle save failure
  const handleSaveFailure = () => {
    const failureData = {
      videoUrl: editedFailure.videoUrl,
      failure: editedFailure.failure,
      pivot: editedFailure.pivot,
      outcomes: editedFailure.outcomes,
      thumbnailUrl: editedFailure.thumbnailUrl,
      showSection: editedFailure.showSection,
      category: 'my-failures'
    }

    if (editedFailure.id) {
      dispatch(updateMyFailure(failureData, editedFailure.id))
    } else {
      dispatch(createMyFailure(failureData))
    }

    setIsEditingFailure(false)
  }

  // Handle cancel edit
  const handleCancelFailureEdit = () => {
    setIsEditingFailure(false)
  }

  const valueProposition =
    props?.userBasicInfo?.valueProposition?.replace(/<[^>]*>/g, '') || ''

  const myStory = props?.userBasicInfo?.story?.replace(/<[^>]*>/g, '') || ''

  const toggleVideoVisibility = () => setIsVideoVisible(true)

  const toggleVideoPlay = (index) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleEditDetails = () => {
    setIsEditingDetails(true)
  }

  const handleAddDetails = () => {
    setIsAddingDetails(true)
  }

  const handleCancelVideoEdit = () => {
    setIsEditingVideo(false)
    setVideoData({
      videoUrl: props?.userBasicInfo?.videoUrl || '',
      thumbnailUrl: props?.userBasicInfo?.thumbnailUrl || ''
    })
  }

  const handleSaveVideo = () => {
    const userData = {
      videoUrl: videoData.videoUrl,
      // Include other fields that need to be preserved
      primaryInterest: props?.userBasicInfo?.primaryInterest || '',
      valueProposition: props?.userBasicInfo?.valueProposition || '',
      id: props?.userBasicInfo?.id || null
    }

    dispatch(saveUserBasicData(userData, props?.userBasicInfo?.id))
    setIsEditingVideo(false)
    setIsVideoVisible(false) // Reset video visibility
  }
  const handleEditVideo = () => {
    setIsEditingVideo(true)
  }

  const handleSaveDetails = () => {
    const userData = {
      primaryInterest: changedUser.primaryInterest,
      valueProposition: changedUser.valueProposition,
      id: changedUser.id
    }

    dispatch(saveUserBasicData(userData, changedUser.id))
    setIsEditingDetails(false)
    setIsAddingDetails(false)
  }

  const handleCancelEdit = () => {
    setIsEditingDetails(false)
    setIsAddingDetails(false)
    // Reset to original values
    setChangedUser({
      primaryInterest: props?.userBasicInfo?.primaryInterest || '',
      valueProposition: props?.userBasicInfo?.valueProposition || '',
      id: props?.userBasicInfo?.id || null
    })
  }

  const [isEditingMentor, setIsEditingMentor] = useState(false)
  const [editingMentorId, setEditingMentorId] = useState(null)
  const [editedMentor, setEditedMentor] = useState({
    mentorName: '',
    mentorRole: '',
    mentorCompany: '',
    mentorDescription: '',
    mentorImage: '',
    showSection: true,
    category: 'my-mentors'
  })

  const handleEditMentor = (mentor) => {
    setEditingMentorId(mentor.id)
    setEditedMentor({
      mentorName: mentor.mentorName || '',
      mentorRole: mentor.mentorRole || '',
      mentorCompany: mentor.mentorCompany || '',
      mentorDescription: mentor.mentorDescription || '',
      mentorImage: mentor.mentorImage || '',
      showSection: mentor.showSection ?? true,
      id: mentor.id || null
    })
    setIsEditingMentor(true)
  }

  const handleAddMentor = () => {
    setEditingMentorId(null)
    setEditedMentor({
      mentorName: '',
      mentorRole: '',
      mentorCompany: '',
      mentorDescription: '',
      mentorImage: '',
      showSection: true,
      category: 'my-mentors',
      id: null
    })
    setIsEditingMentor(true)
  }

  const handleDeleteMentor = async () => {
    dispatch(deleteMyMentor(editedMentor.id))
    setIsEditingMentor(false)
  }

  const handleSaveMentor = async () => {
    let newImage = null
    if (imageProperties.croppedImage) {
      newImage = await uploadImage(imageProperties.croppedImage)
    }

    const mentorData = {
      mentorName: editedMentor.mentorName,
      mentorRole: editedMentor.mentorRole,
      mentorCompany: editedMentor.mentorCompany,
      mentorDescription: editedMentor.mentorDescription,
      mentorImage: newImage ? newImage : editedMentor.mentorImage,
      showSection: editedMentor.showSection,
      category: 'my-mentors'
    }

    if (editedMentor.id) {
      // For update, we need to send both the data and the ID
      dispatch(updateMyMentor(mentorData, editedMentor.id))
    } else {
      // For create, we just send the data
      dispatch(createMyMentor(mentorData))
    }

    setIsEditingMentor(false)
  }

  const handleCancelMentorEdit = () => {
    setIsEditingMentor(false)
  }

  const videoUrl = props?.userBasicInfo?.videoUrl || ''
  const isYouTubeLink =
    videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes('youtu.be')) {
      const id = url.split('youtu.be/')[1]
      return `https://www.youtube.com/embed/${id}`
    } else if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]
      const ampersandPosition = id.indexOf('&')
      if (ampersandPosition !== -1) {
        return `https://www.youtube.com/embed/${id.substring(
          0,
          ampersandPosition
        )}`
      }
      return `https://www.youtube.com/embed/${id}`
    }
    return url
  }

  const {
    editorRef,
    imageProperties,
    setImageProperties,
    handleImageLoadSuccess,
    handleFileInputChange,
    handleLabelClick,
    handlePositionChange,
    updateCroppedImage: updateCroppedProfileImage,
    imageUrl: userImageUrl,
    setImageUrl,
    avatarEditorActions
  } = useImageEditor()

  // Check if user has any details to show
  const hasDetails =
    props?.userBasicInfo?.primaryInterest ||
    props?.userBasicInfo?.valueProposition ||
    props?.userBasicInfo?.id

  return (
    <div>
      <div className='section-description-container'>
        <div className='portf-section-maintitle'>
          <div className='pe-3'>
            <img src={whoami} alt='Who am I' />
          </div>
          <div>
            <div className='align-items-center portfolio-section-title'>
              <div className='section-title' style={{ fontSize: '20px' }}>
                {props?.sectionTitle}
              </div>
            </div>
            <div
              className='section-description'
              dangerouslySetInnerHTML={{ __html: props?.sectionDescription }}
            />
          </div>
        </div>
      </div>

      <div className='whoami-container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
          {/* My Details Card */}
          <div style={{ width: '100%', marginBottom:'20px' }}>
            {/* Always show MainCard */}
            <MainCard
              title={'My Details'}
              icon={myDetailsIcon}
              onClick={hasDetails ? handleEditDetails : handleAddDetails}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '30px'
                }}
                className='user-basic-info'
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={props?.userBasicInfo?.userImageUrl}
                    alt='Profile'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ textAlign: 'left', width: '70%' }}>
                  <p
                    style={{
                      fontSize: '25px',
                      fontWeight: '800',
                      color: 'black',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                    {props?.userBasicInfo?.name}
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'black'
                    }}
                  >
                    {props?.userBasicInfo?.userTitle}
                  </p>
                  <UserSocialMedia
                    data={props?.userBasicInfo?.socialMediaLinks}
                  />
                </div>
                {/* <img
                  src={EditPencil}
                  style={{ cursor: 'pointer', alignSelf: 'flex-start' }}
                  title={'editpencil icon'}
                  height={20}
                  width={20}
                  alt='editpencil icon'
                  onClick={hasDetails ? handleEditDetails : handleAddDetails}
                /> */}
              </div>

              <div>
                <div style={{fontWeight: '600', marginBottom: '5px'}}>My Primary Interest</div>
                <div style={{ fontSize: '16px', color: 'rgb(54, 54, 54)' }}>
                  {props?.userBasicInfo?.primaryInterest || 'Not specified'}
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div style={{fontWeight:'600', marginBottom: '5px'}}>My Value Proposition</div>
                <div style={{ fontSize: '16px', color: 'rgb(54, 54, 54)' }}>
                  {showMoreValueProp
                    ? valueProposition || 'Not specified'
                    : (valueProposition || 'Not specified').slice(0, 250)}
                  {valueProposition && valueProposition.length > 150 && (
                    <span
                      onClick={() => setShowMoreValueProp(!showMoreValueProp)}
                      style={{
                        color: 'rgb(0, 218, 218)',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {showMoreValueProp ? ' Read Less' : '... Read More'}
                    </span>
                  )}
                </div>
              </div>
            </MainCard>

            {/* Show EditCard when editing existing details */}
            {isEditingDetails && (
              <EditCard
                title={'Edit My Details'}
                icon={myDetailsIcon}
                handleSubmit={handleSaveDetails}
                toggle={handleCancelEdit}
              >
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '14px' }}>
                    To edit your name, position, headshot, and social media
                    links, please update your Profile.
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      My Primary Interest:
                    </div>
                    <div
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background: '#fff',
                        position: 'relative',
                        display: 'flex'
                      }}
                    >
                      <input
                        style={{
                          display: 'block',
                          width: '100%',
                          fontSize: '0.875rem',
                          color: 'black',
                          background: 'transparent'
                        }}
                        value={changedUser.primaryInterest}
                        onChange={(e) =>
                          setChangedUser({
                            ...changedUser,
                            primaryInterest: e.target.value
                          })
                        }
                      />
                      <label
                        style={{ display: 'inline-block' }}
                        className='label-style'
                        for='My Primary Interest'
                      >
                        My Primary Interest:
                      </label>
                      <label
                        style={{ display: 'inline-block' }}
                        for='My Primary Interest'
                      >
                        <img
                          src={EditPencil}
                          style={{ cursor: 'pointer' }}
                          title={'editpencil icon'}
                          height={20}
                          width={20}
                          alt='editpencil icon'
                        />
                      </label>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      My Value Proposition:
                    </div>
                    <ReactQuill
                      value={changedUser.valueProposition}
                      onChange={(content) =>
                        setChangedUser({
                          ...changedUser,
                          valueProposition: content
                        })
                      }
                      style={{
                        boxShadow:
                          ' 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                      }}
                      className='text-black'
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ align: [] }],
                          ['link', 'image']
                        ]
                      }}
                    />
                  </div>
                </div>
              </EditCard>
            )}

            {/* Show AddCard when adding new details */}
            {isAddingDetails && (
              <AddCard
                title={'Add My Details'}
                icon={myDetailsIcon}
                handleSubmit={handleSaveDetails}
                toggle={handleCancelEdit}
              >
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '14px' }}>
                    To edit your name, position, headshot, and social media
                    links, please update your Profile.
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      My Primary Interest:
                    </div>
                    <div
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background: '#fff',
                        position: 'relative',
                        display: 'flex'
                      }}
                    >
                      <input
                        style={{
                          display: 'block',
                          width: '100%',
                          fontSize: '0.875rem',
                          color: 'black',
                          background: 'transparent'
                        }}
                        value={changedUser.primaryInterest}
                        onChange={(e) =>
                          setChangedUser({
                            ...changedUser,
                            primaryInterest: e.target.value
                          })
                        }
                      />
                      <label
                        style={{ display: 'inline-block' }}
                        className='label-style'
                        for='My Primary Interest'
                      >
                        My Primary Interest:
                      </label>
                      <label
                        style={{ display: 'inline-block' }}
                        for='My Primary Interest'
                      >
                        <img
                          src={EditPencil}
                          style={{ cursor: 'pointer' }}
                          title={'editpencil icon'}
                          height={20}
                          width={20}
                          alt='editpencil icon'
                        />
                      </label>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      My Value Proposition:
                    </div>
                    <ReactQuill
                      value={changedUser.valueProposition}
                      onChange={(content) =>
                        setChangedUser({
                          ...changedUser,
                          valueProposition: content
                        })
                      }
                      style={{
                        boxShadow:
                          ' 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                      }}
                      className='text-black'
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ align: [] }],
                          ['link', 'image']
                        ]
                      }}
                    />
                  </div>
                </div>
              </AddCard>
            )}
          </div>

          {/* My Personal Brand Story Card */}

          <div style={{ width: '100%', marginBottom:'20px' }}>
            {isEditingVideo ? (
              <EditCard
                title={'Edit My Personal Brand Story'}
                icon={myPersonalBrandStory}
                handleSubmit={handleSaveVideo}
                toggle={handleCancelVideoEdit}
              >
                <div style={{ marginTop: '10px' }}>
                  <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Instructions:
                  </div>
                  <div style={{ marginBottom: '10px', fontSize: '16px' }}>
                    Add link to your personal brand story video. Make sure it's
                    viewable
                  </div>
                  <div
                    style={{
                      borderRadius: '12px',
                      border: 'none',
                      padding: '1rem 0.625rem 0.625rem',
                      boxShadow: '0px 3px 6px #00000029',
                      background: '#fff',
                      position: 'relative',
                      display: 'flex'
                    }}
                  >
                    <input
                      style={{
                        display: 'block',
                        width: '100%',
                        fontSize: '0.875rem',
                        color: 'black',
                        background: 'transparent'
                      }}
                      value={videoData.videoUrl}
                      onChange={(e) =>
                        setVideoData({
                          ...videoData,
                          videoUrl: e.target.value
                        })
                      }
                      placeholder='Enter YouTube or video URL'
                    />
                  </div>
                </div>
              </EditCard>
            ) : (
              <MainCard
                title={'My Personal Brand Story'}
                icon={myPersonalBrandStory}
                onClick={handleEditVideo}
              >
                <div
                  className='personal-brand-story'
                  style={{ textAlign: 'center' }}
                >
                  {/* Thumbnail Image with play button and edit pencil */}
                  <div style={{ position: 'relative' }}>
                    {!isVideoVisible && props?.userBasicInfo?.thumbnailUrl && (
                      <div
                        onClick={toggleVideoVisibility}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      >
                        <img
                          src={props.userBasicInfo.thumbnailUrl}
                          alt='Brand Thumbnail'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderTop: '12px solid transparent',
                              borderBottom: '12px solid transparent',
                              borderLeft: '18px solid white',
                              marginLeft: '5px'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {/* <img
                      src={EditPencil}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        zIndex: 1
                      }}
                      title={'edit video'}
                      height={20}
                      width={20}
                      alt='edit video'
                      onClick={handleEditVideo}
                    /> */}
                  </div>

                  {/* Video or YouTube Embed */}
                  {isVideoVisible && videoUrl && (
                    <div style={{ marginTop: '10px' }}>
                      {isYouTubeLink ? (
                        <iframe
                          width='100%'
                          height='250'
                          src={getYouTubeEmbedUrl(videoUrl)}
                          title='YouTube video player'
                          frameBorder='0'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                          style={{ borderRadius: '10px' }}
                        />
                      ) : (
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          style={{
                            width: '100%',
                            height: '300px',
                            borderRadius: '10px',
                            backgroundColor: 'black'
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}
                </div>
              </MainCard>
            )}
          </div>
        </div>

        {/* My Story Card */}
        <div style={{ marginTop: '20px', position: 'relative' }}>
          {/* Always show MainCard */}
          <MainCard
            title={'My Story'}
            icon={myStoryIcon}
            onClick={handleEditStory}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '15px', color: 'black' }}>
                {showMoreMyStory
                  ? isEditingStory
                    ? editedStory
                    : myStory
                  : (isEditingStory ? editedStory : myStory).slice(0, 630)}
                {(isEditingStory ? editedStory : myStory).length > 6300 && (
                  <span
                    onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                    style={{
                      color: 'rgb(0, 218, 218)',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreMyStory ? ' Show less' : '... Show more'}
                  </span>
                )}
              </div>
            </div>
          </MainCard>

          {/* Show EditCard on top when editing */}
          {isEditingStory && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10
              }}
            >
              <EditCard
                title={'Edit My Story'}
                icon={myStoryIcon}
                handleSubmit={handleSaveStory}
                toggle={handleCancelStoryEdit}
              >
                <div style={{ marginTop: '10px' }}>
                  <ReactQuill
                    value={editedStory}
                    onChange={setEditedStory}
                    style={{
                      height: '90%',
                      marginBottom: '50px',
                      boxShadow:
                        '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}
                    className='text-black'
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }],
                        ['link', 'image']
                      ]
                    }}
                  />
                </div>
              </EditCard>
            </div>
          )}
        </div>
        {/* My Relationships Card */}
        <div style={{ marginTop: '40px', position: 'relative' }}>
          {/* Always show MainCard */}
          <MainCard
            title={'My Relationships'}
            icon={myRelationshipIcon}
            onClick={() => setIsEditingRelationships(true)}
          >
            <div style={{ position: 'relative' }}>
              <div className='my-relationships-container'>
                {['TEAM ROLE', 'COLLABORATION STYLE', 'LEADERSHIP PHILOSOPHY'].map(
                  (displayTitle, index) => {
                    const field = ['teamRole', 'collaborationStyle', 'leadershipPhilosophy'][index];
                    return (
                      <div key={field} className='my-relationships-card'>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            marginBottom: '6px',
                            textAlign: 'center'
                          }}
                        >
                          {displayTitle}
                        </div>
                        <div style={{ fontSize: '15px' }}>
                          {props?.myRelationships?.[field] 
                            ? props.myRelationships[field].replace(/<[^>]*>/g, '')
                            : 'Not specified'}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </MainCard>

          {/* Edit Card */}
          {isEditingRelationships && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10
              }}
            >
              <EditCard
                title={'Edit My Relationships'}
                icon={myRelationshipIcon}
                handleSubmit={handleSaveRelationships}
                toggle={handleCancelRelationshipsEdit}
              >
                <div style={{ marginTop: '10px' }}>
                  {[
                    'teamRole',
                    'collaborationStyle',
                    'leadershipPhilosophy'
                  ].map((field) => (
                    <div key={field} style={{ marginBottom: '20px' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, ' $1')}
                        :
                      </div>
                      <ReactQuill
                        value={editedRelationships[field]}
                        onChange={(content) =>
                          setEditedRelationships((prev) => ({
                            ...prev,
                            [field]: content
                          }))
                        }
                        style={{
                          // height: '100px',
                          marginBottom: '40px',
                          boxShadow:
                            '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        }}
                        modules={{
                          toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link']
                          ]
                        }}
                      />
                    </div>
                  ))}
                </div>
              </EditCard>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px', position: 'relative' }}>
          <MultiCard
            title={'My Failures'}
            icon={myFailures}
            onClick={handleAddFailure}
          >
            {props?.myFailures?.length > 0 ? (
              <CarouselComponent
                data={props?.myFailures}
                renderItems={(item, index) => {
                  const itemVideoUrl = item?.videoUrl || ''
                  const itemThumbnailUrl = item?.thumbnailUrl || ''
                  const isPlaying = playingVideos[index]
                  const itemFailure =
                    item?.failure?.replace(/<[^>]*>/g, '') || ''
                  const itemPivot = item?.pivot?.replace(/<[^>]*>/g, '') || ''
                  const itemOutcomes =
                    item?.outcomes?.replace(/<[^>]*>/g, '') || ''

                  return (
                    <MainCard
                      key={index}
                      onClick={() => handleEditFailure(item)}
                      multi={true}
                    >
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          {/* Left side - Video */}
                          <div
                            style={{ minWidth: '48%' }}
                            className='my-failure-video-div'
                          >
                            {itemVideoUrl ? (
                              <>
                                {!isPlaying && (
                                  <div
                                    onClick={() => toggleVideoPlay(index)}
                                    style={{
                                      position: 'relative',
                                      width: '100%',
                                      height: '250px',
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      marginBottom: '10px',
                                      boxShadow: '0px 5px 15px rgb(211, 211, 211)',
                                      padding:'20px',
                                      borderRadius: '15px'
                                    }}
                                  >
                                    {itemThumbnailUrl ? (
                                      <img
                                        src={itemThumbnailUrl}
                                        alt='Failure Thumbnail'
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover'
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          backgroundColor: '#f2f2f2',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: '#888',
                                            fontSize: '16px'
                                          }}
                                        >
                                          Click to play video
                                        </span>
                                      </div>
                                    )}
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 0,
                                          height: 0,
                                          borderTop: '12px solid transparent',
                                          borderBottom:
                                            '12px solid transparent',
                                          borderLeft: '18px solid white',
                                          marginLeft: '5px'
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {isPlaying && (
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '250px',
                                      marginBottom: '10px'
                                    }}
                                  >
                                    <video
                                      src={itemVideoUrl}
                                      controls
                                      autoPlay
                                      playsInline
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px'
                                      }}
                                    >
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '250px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: '#f2f2f2',
                                  borderRadius: '10px'
                                }}
                              >
                                <span
                                  style={{ color: '#888', fontSize: '16px' }}
                                >
                                  No video available
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Right side - Text content */}
                          <div
                            style={{ minWidth: '48%' }}
                            className='my-failure-text-div'
                          >
                            <div
                              style={{ width: '100%', marginLeft: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '6px',
                                }}
                              >
                                MY FAILURE
                              </div>
                              <div style={{ fontSize: '15px' }}>
                                {itemFailure}
                              </div>
                            </div>

                            <div
                              style={{ width: '100%', margin: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '6px',
                                }}
                              >
                                MY PIVOT
                              </div>
                              <div style={{ fontSize: '15px' }}>
                                {itemPivot}
                              </div>
                            </div>

                            <div
                              style={{ width: '100%', margin: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '6px',
                                }}
                              >
                                MY OUTCOMES
                              </div>
                              <div style={{ fontSize: '15px' }}>
                                {itemOutcomes}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MainCard>
                  )
                }}
              />
            ) : (
              <div>No failures to show</div>
            )}
          </MultiCard>

          {/* Edit Failure Modal */}
          {isEditingFailure && (
            <EditCard
              title='Edit My Failure'
              icon={myFailures}
              handleSubmit={handleSaveFailure}
              toggle={handleCancelFailureEdit}
            >
              {/* Video URL */}
              <div>Instructions:</div>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Add link to your failure story evidence. Make sure it's
                  viewable.
                </label>
                <div
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <input
                    type='url'
                    value={editedFailure.videoUrl}
                    style={{ background: 'transparent', width: '100%' }}
                    onChange={(e) =>
                      setEditedFailure({
                        ...editedFailure,
                        videoUrl: e.target.value
                      })
                    }
                    placeholder='Add link to video...'
                  />
                  <img src={penIcon} alt='pen-icon' />
                </div>
              </div>

              {/* Failure */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  My Failure:
                </label>
                <ReactQuill
                  value={editedFailure.failure}
                  onChange={(content) =>
                    setEditedFailure({ ...editedFailure, failure: content })
                  }
                  style={{
                    marginBottom: '40px',
                    border: 'none',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    borderRadius: '30px'
                  }}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>

              {/* Pivot */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  My Pivot:
                </label>
                <ReactQuill
                  value={editedFailure.pivot}
                  onChange={(content) =>
                    setEditedFailure({ ...editedFailure, pivot: content })
                  }
                  style={{
                    marginBottom: '40px',
                    border: 'none',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    borderRadius: '30px'
                  }}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>

              {/* Outcomes */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  My Outcomes:
                </label>
                <ReactQuill
                  value={editedFailure.outcomes}
                  onChange={(content) =>
                    setEditedFailure({ ...editedFailure, outcomes: content })
                  }
                  style={{
                    marginBottom: '40px',
                    border: 'none',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    borderRadius: '30px'
                  }}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>
            </EditCard>
          )}
        </div>
        <div style={{ marginTop: '40px' }}>
          <MultiCard
            title={'My Mentors'}
            icon={myMentors}
            onClick={handleAddMentor}
          >
            {props?.myMentors?.length > 0 ? (
              <CarouselComponent
                data={props?.myMentors}
                itemsToShow={3}
                renderItems={(item, index) => (
                  <MentorCard
                    mentor={item}
                    onClick={() => handleEditMentor(item)}
                    width={'95%'}
                  />
                )}
              />
            ) : (
              <div>No mentors to show</div>
            )}
          </MultiCard>

          {/* Edit Mentor Modal */}
          {isEditingMentor && (
            <EditCard
              title={editingMentorId ? 'Edit My Mentor' : 'Add My Mentor'}
              icon={myMentors}
              handleSubmit={handleSaveMentor}
              toggle={handleCancelMentorEdit}
              onDelete={handleDeleteMentor}
              deleteText={'Mentor'}
            >
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Mentor Headshot
                </div>

                <div>Upload an image of your mentor.</div>
                <div className='d-flex flex-column justify-content-center mentor-modal-imgs'>
                  <ReactImageUpload
                    value={userImageUrl}
                    {...imageProperties}
                    onChangeImageCrop={updateCroppedProfileImage}
                    onImageLoadSuccess={handleImageLoadSuccess}
                    onLabelClick={handleLabelClick}
                    onFileInputChange={handleFileInputChange}
                    onPositionChange={handlePositionChange}
                    actions={avatarEditorActions}
                    title='Mentor Image'
                    editorRef={editorRef}
                    style={{ width: '660px' }}
                    // readOnly={readOnly}
                  />
                </div>
              </div>
              {/* Mentor Name */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Mentor Name:
                </label>
                <div
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <input
                    type='url'
                    style={{ background: 'transparent', width: '100%' }}
                    value={editedMentor.mentorName}
                    onChange={(e) =>
                      setEditedMentor({
                        ...editedMentor,
                        mentorName: e.target.value
                      })
                    }
                    placeholder="Enter mentor's name"
                  />
                  <img src={penIcon} alt='pen-icon' />
                </div>
              </div>

              {/* Mentor Role */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Mentor Role:
                </label>
                <div
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <input
                    type='url'
                    style={{ background: 'transparent', width: '100%' }}
                    value={editedMentor.mentorRole}
                    onChange={(e) =>
                      setEditedMentor({
                        ...editedMentor,
                        mentorRole: e.target.value
                      })
                    }
                    placeholder="Enter mentor's role"
                  />
                  <img src={penIcon} alt='pen-icon' />
                </div>
              </div>

              {/* Mentor Company */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Mentor Company:
                </label>
                <div
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <input
                    type='url'
                    style={{ background: 'transparent', width: '100%' }}
                    value={editedMentor.mentorCompany}
                    onChange={(e) =>
                      setEditedMentor({
                        ...editedMentor,
                        mentorCompany: e.target.value
                      })
                    }
                    placeholder="Enter mentor's company"
                  />
                  <img src={penIcon} alt='pen-icon' />
                </div>
              </div>

              {/* Mentor Description */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Mentor Description:
                </label>
                <ReactQuill
                  value={editedMentor.mentorDescription}
                  onChange={(content) =>
                    setEditedMentor({
                      ...editedMentor,
                      mentorDescription: content
                    })
                  }
                  style={{
                    marginBottom: '40px',
                    border: 'none',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    borderRadius: '30px'
                  }}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>
            </EditCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default WhoAmI
