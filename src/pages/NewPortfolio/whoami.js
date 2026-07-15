import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Portfolio.css'
import whoami from '../../assets/images/whoami.svg'
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
import ImageUploader from '../../components/NewPortfolio/ImageUploader/index'
import linkIcon from '../../assets/images/link.svg'
import {
  saveUserBasicData,
  saveMyRelationships,
  createMyFailure,
  updateMyFailure,
  createMyMentor,
  updateMyMentor,
  deleteMyMentor,
  deleteMyFailure
} from '../../redux/newPortfolio/Actions'
import { deleteImage, uploadImage } from '../../utils/helpers'
import useImageEditor from '../../hooks/useImageEditor'
import who from '../../assets/icons/Who.png'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
import ReactImageUpload from '../Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import nothingAdded from '../../assets/images/nothing-added.svg'

const WhoAmI = (props) => {
  const isPublicView = props?.isPublicView || props?.portfolioType === 'public'

  const userData = useSelector((state) => state.user?.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner

  const dispatch = useDispatch()
  const [showMoreValueProp, setShowMoreValueProp] = useState(false)
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [playingVideos, setPlayingVideos] = useState({})
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isAddingDetails, setIsAddingDetails] = useState(false)
  const [showMoreStates, setShowMoreStates] = useState({})
  const [showMoreTextBlocks, setShowMoreTextBlocks] = useState({
    failure: false,
    pivot: false,
    outcomes: false
  })
  const [changedUser, setChangedUser] = useState({
    name: props?.userBasicInfo?.name || '',
    userTitle: props?.userBasicInfo?.userTitle || '',
    userImageUrl: props?.userBasicInfo?.userImageUrl || '',
    company: props?.userBasicInfo?.company || '',
    socialMediaLinks: props?.userBasicInfo?.socialMediaLinks || {
      linkedIn: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      x: ''
    },
    primaryInterest: props?.userBasicInfo?.primaryInterest || '',
    valueProposition: props?.userBasicInfo?.valueProposition || '',
    id: props?.userBasicInfo?.id || null
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
    if (!canEdit) return
    setIsEditingStory(true)
  }

  const handleSaveStory = () => {
    if (!canEdit) return
    const userData = {
      story: editedStory,
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
      name: props?.userBasicInfo?.name || '',
      userTitle: props?.userBasicInfo?.userTitle || '',
      userImageUrl: props?.userBasicInfo?.userImageUrl || '',
      company: props?.userBasicInfo?.company || '',
      socialMediaLinks: props?.userBasicInfo?.socialMediaLinks || {
        linkedIn: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        x: ''
      },
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

  const handleSaveRelationships = () => {
    if (!canEdit) return
    const relationshipsData = {
      teamRole: editedRelationships.teamRole,
      collaborationStyle: editedRelationships.collaborationStyle,
      leadershipPhilosophy: editedRelationships.leadershipPhilosophy,
      id: props?.myRelationships?.id || null
    }

    dispatch(saveMyRelationships(relationshipsData, relationshipsData?.id))

    setIsEditingRelationships(false)
  }

  const handleCancelRelationshipsEdit = () => {
    setIsEditingRelationships(false)
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

  const handleEditFailure = (failure) => {
    if (!canEdit) return
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
    if (!canEdit) return
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

  const handleSaveFailure = () => {
    if (!canEdit) return
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

  const handleCancelFailureEdit = () => {
    setIsEditingFailure(false)
  }

  const valueProposition = props?.userBasicInfo?.valueProposition || ''

  // const myStory = props?.userBasicInfo?.story?.replace(/<[^>]*>/g, '') || ''
  const myStory = props?.userBasicInfo?.story || ''

  const toggleVideoVisibility = () => setIsVideoVisible(true)

  const toggleVideoPlay = (index) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleEditDetails = () => {
    if (!canEdit) return
    setIsEditingDetails(true)
  }

  const handleAddDetails = () => {
    if (!canEdit) return
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
    if (!canEdit) return
    const userData = {
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl,
      story: props?.userBasicInfo?.story || '',
      primaryInterest: props?.userBasicInfo?.primaryInterest || '',
      valueProposition: props?.userBasicInfo?.valueProposition || '',
      userImageUrl: props?.userBasicInfo?.userImageUrl || '',
      userTitle: props?.userBasicInfo?.userTitle || '',
      name: props?.userBasicInfo?.name || '',
      organization: props?.userBasicInfo?.organization || '',
      company: props?.userBasicInfo?.company || '',
      socialMediaLinks: props?.userBasicInfo?.socialMediaLinks || {},
      id: props?.userBasicInfo?.id || null
    }

    dispatch(saveUserBasicData(userData, props?.userBasicInfo?.id))
    setIsEditingVideo(false)
    setIsVideoVisible(false)
  }

  const handleEditVideo = () => {
    if (!canEdit) return
    // Set the current data from props when opening edit modal
    setVideoData({
      videoUrl: props?.userBasicInfo?.videoUrl || '',
      thumbnailUrl: props?.userBasicInfo?.thumbnailUrl || ''
    })
    setIsEditingVideo(true)
  }

  const handleSaveDetails = () => {
    if (!canEdit) return
    const userData = {
      id: changedUser.id,
      name: changedUser.name,
      userTitle: changedUser.userTitle,
      company: changedUser.company,
      userImageUrl: changedUser.userImageUrl,
      primaryInterest: changedUser.primaryInterest,
      valueProposition: changedUser.valueProposition,
      socialMediaLinks: changedUser.socialMediaLinks
    }

    dispatch(saveUserBasicData(userData, changedUser.id))
    setIsEditingDetails(false)
    setIsAddingDetails(false)
  }

  const handleCancelEdit = () => {
    setIsEditingDetails(false)
    setIsAddingDetails(false)
    setChangedUser({
      name: props?.userBasicInfo?.name || '',
      userTitle: props?.userBasicInfo?.userTitle || '',
      userImageUrl: props?.userBasicInfo?.userImageUrl || '',
      company: props?.userBasicInfo?.company || '',
      socialMediaLinks: props?.userBasicInfo?.socialMediaLinks || {
        linkedIn: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        x: ''
      },
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [itemsToShow, setItemsToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)

      if (width < 750) {
        setItemsToShow(1)
      } else if (width < 1030) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEditMentor = (mentor) => {
    if (!canEdit) return
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
    if (!canEdit) return
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
    if (!canEdit) return
    dispatch(deleteMyMentor(editedMentor.id))
    setIsEditingMentor(false)
  }

  const handleDeleteFailure = async () => {
    if (!canEdit) return
    dispatch(deleteMyFailure(editedFailure.id))
    setIsEditingFailure(false)
  }

  const handleSaveMentor = async () => {
    if (!canEdit) return
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
      dispatch(updateMyMentor(mentorData, editedMentor.id))
    } else {
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

  // Mobile-safe visibility: if there's a video but no thumbnail, show the player on mobile
  useEffect(() => {
    const thumb = props?.userBasicInfo?.thumbnailUrl
    if (videoUrl && !thumb) {
      const isMobile =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(max-width: 768px)').matches
      if (isMobile) setIsVideoVisible(true)
    }
    if (!videoUrl) setIsVideoVisible(false)
  }, [videoUrl, props?.userBasicInfo?.thumbnailUrl])

  // Extract YouTube ID and thumbnails for fallback when no custom thumbnail is provided
  const getYouTubeId = (url) => {
    if (!url) return null
    try {
      const u = new URL(url)
      // youtu.be/<id>
      if (u.hostname.includes('youtu.be')) {
        const seg = u.pathname.split('/').filter(Boolean)
        return seg[0] || null
      }
      // youtube.com/watch?v=<id>
      const vParam = u.searchParams.get('v')
      if (vParam) return vParam
      // youtube.com/embed/<id> or /shorts/<id>
      const parts = u.pathname.split('/').filter(Boolean)
      const embedIndex = parts.indexOf('embed')
      if (embedIndex !== -1 && parts[embedIndex + 1])
        return parts[embedIndex + 1]
      const shortsIndex = parts.indexOf('shorts')
      if (shortsIndex !== -1 && parts[shortsIndex + 1])
        return parts[shortsIndex + 1]
    } catch (e) {
      // ignore and try regex
    }
    const m = url.match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/
    )
    return m ? m[1] : null
  }

  const getYouTubeThumbnail = (url, quality = 'maxresdefault') => {
    const id = getYouTubeId(url)
    if (!id) return null
    return `https://img.youtube.com/vi/${id}/${quality}.jpg`
  }

  const derivedBrandThumbnail =
    props?.userBasicInfo?.thumbnailUrl ||
    (isYouTubeLink ? getYouTubeThumbnail(videoUrl, 'maxresdefault') : null)

  // Detect if the thumbnail is portrait to decide player/thumbnail sizing
  const [isPortraitThumb, setIsPortraitThumb] = useState(null)
  useEffect(() => {
    let cancelled = false
    if (!derivedBrandThumbnail) {
      setIsPortraitThumb(null)
      return
    }
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      setIsPortraitThumb(img.naturalHeight >= img.naturalWidth)
    }
    img.onerror = () => {
      if (cancelled) return
      setIsPortraitThumb(null)
    }
    img.src = derivedBrandThumbnail
    return () => {
      cancelled = true
    }
  }, [derivedBrandThumbnail])

  const getYouTubeEmbedUrl = (url) => {
    const id = getYouTubeId(url)
    if (id) return `https://www.youtube.com/embed/${id}`
    return url
  }

  const truncateAtWord = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    let lastSpace = text.lastIndexOf(' ', maxLength)
    if (lastSpace === -1) lastSpace = maxLength
    return text.substring(0, lastSpace)
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

  const userRole = useSelector((state) => state.user?.user?.role)

  const hasDetails =
    props?.userBasicInfo?.primaryInterest ||
    props?.userBasicInfo?.valueProposition ||
    props?.userBasicInfo?.id

  const hasContentBesidesTags = (htmlString) => {
    if (!htmlString) return false
    const textContent = htmlString.replace(/<[^>]*>/g, '').trim()
    const isEmpty =
      htmlString === '<p><br></p>' ||
      htmlString === '<p></p>' ||
      htmlString === '<br>' ||
      htmlString === '<p>&nbsp;</p>' ||
      textContent === ''
    return !isEmpty && textContent.length > 0
  }

  const hasRelationshipsContent = () => {
    const fields = ['teamRole', 'collaborationStyle', 'leadershipPhilosophy']
    return fields.some((field) => {
      const value = props?.myRelationships?.[field]
      return hasContentBesidesTags(value)
    })
  }

  if (!props?.userBasicInfo) {
    return <div>Loading user data...</div>
  }

  return (
    <div>
      <div className='section-description-container'>
        <div className='portf-section-maintitle '>
          <div className='pe-3'>
            <img
              src={who}
              alt='Who am I'
              style={{ width: '72px', height: '70px' }}
            />
          </div>
          <div>
            <div className='align-items-center portfolio-section-title'>
              <div className='section-title' style={{ fontSize: '20px' }}>
                {props?.sectionTitle || 'WHO AM I?'}
              </div>
            </div>
            <div
              className='section-description'
              dangerouslySetInnerHTML={{
                __html:
                  props?.sectionDescription ||
                  'LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
              }}
            />
          </div>
        </div>
      </div>

      <div
        className='whoami-container'
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px'
          }}
          className='userdetails-whoami-container'
        >
          {/* My Details Card */}
          <div style={{ width: '100%' }}>
            <MainCard
              title={'My Details'}
              icon={myDetailsIcon}
              onClick={
                canEdit
                  ? hasDetails
                    ? handleEditDetails
                    : handleAddDetails
                  : () => {}
              }
              canEdit={canEdit}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '30px',
                  gap: windowWidth <= 768 ? '12px' : '30px'
                }}
                className='user-basic-info'
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    minWidth: '100px',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={props?.userBasicInfo?.userImageUrl || blankProfile}
                    alt='Profile'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div
                  style={{ textAlign: 'left', width: '70%' }}
                  className='userinfo-right-text-portf'
                >
                  <p
                    style={{
                      color: '#000',
                      padding: '0',
                      margin: '0',
                      fontFamily: 'Montserrat',
                      fontSize: '27px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      fontVariant: 'all-small-caps'
                    }}
                  >
                    {props?.userBasicInfo?.name}
                  </p>
                  <p
                    style={{
                      color: '#000',
                      fontFamily: 'Montserrat',
                      fontSize: '15px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal'
                    }}
                  >
                    {props?.userBasicInfo?.userTitle}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Montserrat',
                      fontSize: '15px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal'
                    }}
                  >
                    {props?.userBasicInfo?.company}
                  </p>
                  <UserSocialMedia
                    data={props?.userBasicInfo?.socialMediaLinks}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '15px'
                  }}
                >
                  My Primary Interest
                </div>
                <div
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: '15px',
                    fontStyle: 'normal',
                    color: '#000000',
                    fontWeight: 400,
                    lineHeight: '20px'
                  }}
                >
                  {props?.userBasicInfo?.primaryInterest ||
                    (canEdit
                      ? 'No content has been added. Click the edit button to add.'
                      : 'No content has been added.')}
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div>My Value Proposition</div>
                <div
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: '15px',
                    color: '#000000',
                    wordBreak: 'break-word',
                    fontWeight: 400,
                    lineHeight: '20px'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: showMoreValueProp
                      ? valueProposition ||
                        (canEdit
                          ? 'No content has been added. Click the edit button to add.'
                          : 'No content has been added.')
                      : truncateAtWord(
                          valueProposition ||
                            (canEdit
                              ? 'No content has been added. Click the edit button to add.'
                              : 'No content has been added.'),
                          150
                        )
                  }}
                  onClick={() => setShowMoreValueProp(!showMoreValueProp)}
                />

                {(showMoreValueProp ||
                  (valueProposition?.length || 0) > 150) && (
                  <span
                    onClick={() => setShowMoreValueProp(!showMoreValueProp)}
                    style={{
                      color: '#52C7D3',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreValueProp ? ' Read less' : ' Read more'}
                  </span>
                )}
              </div>
            </MainCard>

            {/* Only show EditCard in private mode */}
            {canEdit && (isEditingDetails || isAddingDetails) && (
              <EditCard
                title={'Add My Details'}
                icon={myDetailsIcon}
                handleSubmit={handleSaveDetails}
                toggle={handleCancelEdit}
              >
                {/* Edit form content - same as before */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Name:
                    </label>
                    <input
                      type='text'
                      value={changedUser.name}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          name: e.target.value
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  {/* Headshot Upload */}
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Headshot:
                    </label>
                    <ImageUploader
                      currentImageUrl={changedUser.userImageUrl}
                      onImageUploaded={(url) =>
                        setChangedUser({ ...changedUser, userImageUrl: url })
                      }
                      onImageDeleted={() =>
                        setChangedUser({ ...changedUser, userImageUrl: null })
                      }
                      title='Upload Your Headshot'
                      maxSizeMB={10}
                    />
                  </div>

                  {/* Position */}
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Position:
                    </label>
                    <input
                      type='text'
                      value={changedUser.userTitle}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          userTitle: e.target.value
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Company:
                    </label>
                    <input
                      type='text'
                      value={changedUser.company || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          company: e.target.value
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>

                  {/* Social Media Links */}
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      LinkedIn:
                    </label>
                    <input
                      type='text'
                      value={changedUser.socialMediaLinks?.linkedIn || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          socialMediaLinks: {
                            ...changedUser.socialMediaLinks,
                            linkedIn: e.target.value
                          }
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Facebook:
                    </label>
                    <input
                      type='text'
                      value={changedUser.socialMediaLinks?.facebook || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          socialMediaLinks: {
                            ...changedUser.socialMediaLinks,
                            facebook: e.target.value
                          }
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      TikTok:
                    </label>
                    <input
                      type='text'
                      value={changedUser.socialMediaLinks?.tiktok || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          socialMediaLinks: {
                            ...changedUser.socialMediaLinks,
                            tiktok: e.target.value
                          }
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      X:
                    </label>
                    <input
                      type='text'
                      value={changedUser.socialMediaLinks?.x || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          socialMediaLinks: {
                            ...changedUser.socialMediaLinks,
                            x: e.target.value
                          }
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', display: 'block' }}>
                      Instagram:
                    </label>
                    <input
                      type='text'
                      value={changedUser.socialMediaLinks?.instagram || ''}
                      onChange={(e) =>
                        setChangedUser({
                          ...changedUser,
                          socialMediaLinks: {
                            ...changedUser.socialMediaLinks,
                            instagram: e.target.value
                          }
                        })
                      }
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>

                  {/* Primary Interest */}
                  <div style={{ marginTop: '10px' }}>
                    <label
                      style={{ fontSize: '14px', display: 'block' }}
                      className='adddetails-interest-text'
                    >
                      My Primary Interest:
                    </label>

                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        className='primaryinterest-input'
                        type='text'
                        value={changedUser.primaryInterest}
                        onChange={(e) =>
                          setChangedUser({
                            ...changedUser,
                            primaryInterest: e.target.value
                          })
                        }
                        style={{ width: '100%', padding: '8px' }}
                      />
                      <span
                        className='details-edit-pencil-icon'
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M11.9696 4.7098L12.9672 3.71218C13.7483 2.93113 15.0146 2.93113 15.7957 3.71218L16.5028 4.41928C17.2838 5.20033 17.2838 6.46666 16.5028 7.24771L15.5052 8.24533M11.9696 4.7098L4.04225 12.6372C3.71017 12.9692 3.50555 13.4076 3.46422 13.8754L3.29065 15.8402C3.23588 16.4602 3.75476 16.9791 4.37477 16.9243L6.33956 16.7507C6.80736 16.7094 7.24571 16.5048 7.57778 16.1727L15.5052 8.24533M11.9696 4.7098L15.5052 8.24533'
                            stroke='black'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Value Proposition */}
                  <div style={{ marginTop: '10px' }}>
                    <label
                      style={{ fontSize: '14px', display: 'block' }}
                      className='adddetails-interest-text'
                    >
                      My Value Proposition:
                    </label>
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
                </div>
              </EditCard>
            )}

            {/* Show AddCard when adding new details */}
          </div>

          {/* My Personal Brand Story Card */}
          <div
            style={{ width: '100%', position: 'relative' }}
            className='mypersonal-brand-story'
          >
            <MainCard
              title={'My Personal Brand Story'}
              icon={myPersonalBrandStory}
              onClick={canEdit ? handleEditVideo : () => {}}
              canEdit={canEdit}
            >
              <div
                className='personal-brand-story'
                style={{ textAlign: 'center' }}
              >
                {/* Check if there's any video content */}
                {!props?.userBasicInfo?.thumbnailUrl &&
                !props?.userBasicInfo?.videoUrl ? (
                  <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                    <img src={nothingAdded} alt='nothing-added' />
                    <p
                      className='text-uppercase text-medium nodata-portf-text'
                      style={{ color: '#6F6F6F' }}
                    >
                      {canEdit
                        ? 'Nothing has been added yet. click the edit button to get started.'
                        : 'Nothing has been added yet.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Thumbnail Image (real or auto-fetched from YouTube) with play button */}
                    <div style={{ position: 'relative' }}>
                      {!isVideoVisible && derivedBrandThumbnail && (
                        <div
                          className='mybrandstory-media brandstory-thumbnail-wrapper'
                          onClick={toggleVideoVisibility}
                          style={{
                            width: isPortraitThumb ? '295px' : '612px',
                            maxWidth: '100%',
                            aspectRatio: isPortraitThumb
                              ? '1 / 1'
                              : '612 / 295',
                            overflow: 'hidden',
                            borderRadius: '10px',
                            margin: '0 auto'
                          }}
                        >
                          <img
                            src={derivedBrandThumbnail}
                            alt='Brand Thumbnail'
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            onError={(e) => {
                              if (
                                isYouTubeLink &&
                                e?.currentTarget?.dataset?.fallbacked !== 'true'
                              ) {
                                e.currentTarget.dataset.fallbacked = 'true'
                                e.currentTarget.src = getYouTubeThumbnail(
                                  videoUrl,
                                  'hqdefault'
                                )
                              }
                            }}
                          />
                          <div className='play-overlay'>
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: '30px solid transparent',
                                borderBottom: '30px solid transparent',
                                borderLeft: '45px solid white',
                                marginLeft: '8px'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Fallback tap-target: non-YouTube or cannot derive thumbnail */}
                    {isVideoVisible && videoUrl && (
                      <div style={{ marginTop: '10px' }}>
                        {isYouTubeLink ? (
                          <div
                            style={{
                              width: isPortraitThumb ? '295px' : '612px',
                              maxWidth: '100%',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              // Keep portrait videos square to match the thumbnail
                              aspectRatio: isPortraitThumb
                                ? '1 / 1'
                                : '612 / 295',
                              margin: '0 auto'
                            }}
                          >
                            <iframe
                              className='mybrandstory-media'
                              src={getYouTubeEmbedUrl(videoUrl)}
                              title='YouTube video player'
                              frameBorder='0'
                              allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                              allowFullScreen
                              loading='lazy'
                              style={{
                                width: '100%',
                                height: '100%',
                                border: '0'
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: isPortraitThumb ? '295px' : '612px',
                              maxWidth: '100%',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              // Keep portrait videos square to match the thumbnail
                              aspectRatio: isPortraitThumb
                                ? '1 / 1'
                                : '612 / 295',
                              margin: '0 auto'
                            }}
                          >
                            <video
                              className='mybrandstory-media'
                              src={videoUrl}
                              controls
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'black'
                              }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </MainCard>

            {/* Only show edit modal in private mode - positioned absolutely on top */}
            {!isPublicView && isEditingVideo && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000
                }}
              >
                <EditCard
                  title={'Edit My Personal Brand Story'}
                  icon={myPersonalBrandStory}
                  handleSubmit={handleSaveVideo}
                  toggle={handleCancelVideoEdit}
                  modalDialogClassName={'brandstory-modal-dialog'}
                >
                  <div style={{ marginTop: '10px' }}>
                    <div
                      style={{ marginBottom: '10px', fontSize: '14px' }}
                      className='adddetails-interest-text'
                    >
                      Instructions:
                    </div>
                    <div
                      style={{
                        marginBottom: '20px',
                        color: '#000',
                        fontFamily: 'Montserrat',
                        fontSize: '15px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '20px'
                      }}
                    >
                      Add link to your personal brand story video. Make sure
                      it's viewable
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                      className='brandvideo-modal-content-container'
                    >
                      <div
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          padding: '1rem 0.625rem 0.625rem',
                          boxShadow: '0px 3px 6px #00000029',
                          background: '#fff',
                          position: 'relative',
                          display: 'flex',
                          width: '60%',
                          height: '50px'
                        }}
                        className='link-input-resp'
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
                        <span
                          style={{
                            display: 'flex',
                            width: '35px',
                            height: '35px',
                            padding: '7.5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            flexShrink: 0,
                            borderRadius: '17.5px',
                            background: '#E4E9F4',
                            marginTop: '-8px'
                          }}
                        >
                          <img
                            src={linkIcon}
                            width={20}
                            height={20}
                            alt='link icon'
                          />
                        </span>
                      </div>
                      <div
                        style={{ width: '35%' }}
                        className='video-container-resp'
                      >
                        <ImageUploader
                          currentImageUrl={videoData.thumbnailUrl}
                          onImageUploaded={(url) => {
                            setVideoData({
                              ...videoData,
                              thumbnailUrl: url
                            })
                          }}
                          onImageDeleted={() => {
                            setVideoData({
                              ...videoData,
                              thumbnailUrl: null
                            })
                          }}
                          title='Add Video Thumbnail'
                          maxSizeMB={20}
                        />
                      </div>
                    </div>
                  </div>
                </EditCard>
              </div>
            )}
          </div>
        </div>

        {/* My Story Card */}
        <div style={{ position: 'relative' }}>
          <MainCard
            title={'My Story'}
            icon={myStoryIcon}
            onClick={canEdit ? handleEditStory : () => {}}
            canEdit={canEdit} // Add this prop
          >
            <div style={{ position: 'relative' }}>
              {!hasContentBesidesTags(props?.userBasicInfo?.story) ? (
                <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                  <img src={nothingAdded} alt='nothing-added' />
                  <p
                    className='text-uppercase text-medium nodata-portf-text'
                    style={{ color: '#6F6F6F' }}
                  >
                    {canEdit
                      ? 'Nothing has been added yet. click the edit button to get started.'
                      : 'Nothing has been added yet.'}
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontFamily: 'Montserrat',
                      fontSize: '15px',
                      fontStyle: 'normal',
                      fontWeight: 390,
                      lineHeight: 'normal',
                      wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: showMoreMyStory
                        ? props?.userBasicInfo?.story || ''
                        : truncateAtWord(myStory || '', 500)
                    }}
                  />
                  {!isEditingStory &&
                    hasContentBesidesTags(myStory) &&
                    myStory?.length > 500 && (
                      <span
                        onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                        style={{
                          color: '#52C7D3',
                          cursor: 'pointer',
                          marginLeft: '5px',
                          fontWeight: '500'
                        }}
                      >
                        {showMoreMyStory ? ' Read less' : ' Read more'}
                      </span>
                    )}
                </>
              )}
            </div>
          </MainCard>

          {/* Only show edit modal in private mode */}
          {!isPublicView && isEditingStory && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
              }}
            >
              <EditCard
                title={'Edit My Story'}
                icon={myStoryIcon}
                handleSubmit={handleSaveStory}
                toggle={handleCancelStoryEdit}
              >
                <div
                  style={{ marginTop: '10px' }}
                  className='whoami-edit-container'
                >
                  <ReactQuill
                    value={editedStory}
                    onChange={setEditedStory}
                    placeholder='Add your story here...'
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
        <div style={{ position: 'relative' }}>
          <MainCard
            title={'My Relationships'}
            icon={myRelationshipIcon}
            onClick={canEdit ? () => setIsEditingRelationships(true) : () => {}}
            canEdit={canEdit} // Add this prop
          >
            <div style={{ position: 'relative' }}>
              {!hasRelationshipsContent() ? (
                <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                  <img src={nothingAdded} alt='nothing-added' />
                  <p
                    className='text-uppercase text-medium nodata-portf-text'
                    style={{ color: '#6F6F6F' }}
                  >
                    {canEdit
                      ? 'Nothing has been added yet. click the edit button to get started.'
                      : 'Nothing has been added yet.'}
                  </p>
                </div>
              ) : (
                <div className='my-relationships-container'>
                  {[
                    'teamRole',
                    'collaborationStyle',
                    'leadershipPhilosophy'
                  ].map((field) => {
                    const value =
                      props?.myRelationships?.[field] ||
                      (canEdit
                        ? 'No content has been added. Click the edit button to add.'
                        : 'No content has been added.')
                    const isLong = value.length > 150
                    const isExpanded = showMoreStates[field] || false

                    return (
                      <div key={field} className='my-relationships-card'>
                        <div
                          style={{
                            color: '#000',
                            textAlign: 'center',
                            fontFamily: 'Montserrat',
                            fontSize: '15px',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: 'normal',
                            fontVariant: 'all-small-caps',
                            marginBottom: '6px'
                          }}
                        >
                          {field
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div
                          style={{
                            maxWidth: '100%',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            color: '#000',
                            textAlign: 'center',
                            fontFamily: 'Montserrat',
                            fontSize: '15px',
                            fontStyle: 'normal',
                            fontWeight: 300,
                            lineHeight: 'normal'
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: isExpanded
                                ? value
                                : truncateAtWord(value, 150)
                            }}
                          />
                          {isLong && (
                            <span
                              onClick={() =>
                                setShowMoreStates((prev) => ({
                                  ...prev,
                                  [field]: !prev[field]
                                }))
                              }
                              style={{
                                color: '#52C7D3',
                                cursor: 'pointer',
                                marginLeft: '5px',
                                fontWeight: '500',
                                fontSize: '12px'
                              }}
                            >
                              {isExpanded ? ' Read less' : ' Read more'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </MainCard>

          {/* Only show edit modal in private mode */}
          {!isPublicView && isEditingRelationships && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
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
                          fontSize: '15px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          color: '#000'
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
                        placeholder='Add explanation here...'
                        style={{
                          height: '150px',
                          overflowY: 'auto',
                          marginBottom: '40px',
                          borderRadius: '10px',
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

        {/* My Failures */}
        <div style={{ position: 'relative' }}>
          <MultiCard
            title={'My Failures'}
            icon={myFailures}
            onAddClick={canEdit ? handleAddFailure : () => {}}
            canEdit={canEdit} // Add this prop
          >
            {props?.myFailures?.length > 0 ? (
              <CarouselComponent
                data={props?.myFailures}
                renderItems={(item, index) => {
                  const itemVideoUrl = item?.videoUrl || ''
                  const itemThumbnailUrl = item?.thumbnailUrl || ''
                  const itemFailure = item?.failure || ''
                  const itemPivot = item?.pivot || ''
                  const itemOutcomes = item?.outcomes || ''
                  const itemIsYouTube =
                    itemVideoUrl.includes('youtube.com') ||
                    itemVideoUrl.includes('youtu.be')
                  const computedItemThumb =
                    itemThumbnailUrl ||
                    (itemIsYouTube
                      ? getYouTubeThumbnail(itemVideoUrl, 'maxresdefault')
                      : null)

                  return (
                    <MainCard
                      key={index}
                      onClick={
                        canEdit ? () => handleEditFailure(item) : () => {}
                      }
                      multi={true}
                      canEdit={canEdit} // Add this prop
                    >
                      {/* Failure card content - same as before */}
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                          className='myfailure-card-container'
                        >
                          {/* Left side - Video */}
                          <div
                            style={{ minWidth: '48%' }}
                            className='my-failure-video-div'
                          >
                            {itemVideoUrl ? (
                              <div
                                onClick={() =>
                                  window.open(itemVideoUrl, '_blank')
                                }
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '319px',
                                  cursor: 'pointer',
                                  overflow: 'hidden',
                                  marginBottom: '10px',
                                  borderRadius: '20px',
                                  boxShadow:
                                    '0px 3px 6px 0px rgba(0, 0, 0, 0.25)'
                                }}
                              >
                                {computedItemThumb ? (
                                  <img
                                    src={computedItemThumb}
                                    alt='Failure Thumbnail'
                                    onError={(e) => {
                                      if (
                                        itemIsYouTube &&
                                        e?.currentTarget?.dataset
                                          ?.fallbacked !== 'true'
                                      ) {
                                        e.currentTarget.dataset.fallbacked =
                                          'true'
                                        e.currentTarget.src =
                                          getYouTubeThumbnail(
                                            itemVideoUrl,
                                            'hqdefault'
                                          )
                                      }
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                      borderRadius: '20px',
                                      padding: '10px'
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
                                      Click to open link
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 0,
                                      height: 0,
                                      borderTop: '30px solid transparent',
                                      borderBottom: '30px solid transparent',
                                      borderLeft: '45px solid white',
                                      marginLeft: '8px'
                                    }}
                                  />
                                </div>
                              </div>
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
                                  No link available
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
                              style={{ width: '100%', margin: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  maxWidth: '100%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 600,
                                  lineHeight: 'normal',
                                  fontVariant: 'all-small-caps',
                                  marginBottom: '6px',
                                  textAlign: 'left'
                                }}
                              >
                                MY FAILURE
                              </div>
                              <div
                                style={{
                                  maxWidth: '100%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 300,
                                  lineHeight: '1.4',
                                  display: showMoreTextBlocks.failure
                                    ? 'block'
                                    : '-webkit-box',
                                  WebkitLineClamp: showMoreTextBlocks.failure
                                    ? 'none'
                                    : 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: showMoreTextBlocks.failure
                                      ? itemFailure?.replace(/&nbsp;/g, ' ') ||
                                        ''
                                      : itemFailure?.replace(/&nbsp;/g, ' ') ||
                                        ''
                                  }}
                                />
                              </div>
                              {itemFailure?.length > 150 && (
                                <span
                                  onClick={() =>
                                    setShowMoreTextBlocks((prev) => ({
                                      ...prev,
                                      failure: !prev.failure
                                    }))
                                  }
                                  style={{
                                    color: '#52C7D3',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontWeight: '500',
                                    fontSize: '12px'
                                  }}
                                >
                                  {showMoreTextBlocks.failure
                                    ? ' Read less'
                                    : ' Read more'}
                                </span>
                              )}
                            </div>

                            <div
                              style={{ width: '100%', margin: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 600,
                                  lineHeight: 'normal',
                                  fontVariant: 'all-small-caps',
                                  marginBottom: '6px',
                                  textAlign: 'left'
                                }}
                              >
                                MY PIVOT
                              </div>
                              <div
                                style={{
                                  maxWidth: '100%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 300,
                                  lineHeight: '1.4',
                                  display: showMoreTextBlocks.pivot
                                    ? 'block'
                                    : '-webkit-box',
                                  WebkitLineClamp: showMoreTextBlocks.pivot
                                    ? 'none'
                                    : 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: showMoreTextBlocks.pivot
                                      ? itemPivot?.replace(/&nbsp;/g, ' ') || ''
                                      : itemPivot?.replace(/&nbsp;/g, ' ') || ''
                                  }}
                                />
                              </div>
                              {itemPivot?.length > 150 && (
                                <span
                                  onClick={() =>
                                    setShowMoreTextBlocks((prev) => ({
                                      ...prev,
                                      pivot: !prev.pivot
                                    }))
                                  }
                                  style={{
                                    color: '#52C7D3',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontWeight: '500',
                                    fontSize: '12px'
                                  }}
                                >
                                  {showMoreTextBlocks.pivot
                                    ? ' Read less'
                                    : ' Read more'}
                                </span>
                              )}
                            </div>

                            <div
                              style={{ width: '100%', margin: '15px' }}
                              className='my-relationships-card'
                            >
                              <div
                                style={{
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 600,
                                  lineHeight: 'normal',
                                  fontVariant: 'all-small-caps',
                                  marginBottom: '6px',
                                  textAlign: 'left'
                                }}
                              >
                                MY OUTCOMES
                              </div>
                              <div
                                style={{
                                  maxWidth: '100%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  fontFamily: 'Montserrat',
                                  fontSize: '15px',
                                  fontStyle: 'normal',
                                  fontWeight: 300,
                                  lineHeight: '1.4',
                                  display: showMoreTextBlocks.outcomes
                                    ? 'block'
                                    : '-webkit-box',
                                  WebkitLineClamp: showMoreTextBlocks.outcomes
                                    ? 'none'
                                    : 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: showMoreTextBlocks.outcomes
                                      ? itemOutcomes?.replace(/&nbsp;/g, ' ') ||
                                        ''
                                      : itemOutcomes?.replace(/&nbsp;/g, ' ') ||
                                        ''
                                  }}
                                />
                              </div>
                              {itemOutcomes?.length > 150 && (
                                <span
                                  onClick={() =>
                                    setShowMoreTextBlocks((prev) => ({
                                      ...prev,
                                      outcomes: !prev.outcomes
                                    }))
                                  }
                                  style={{
                                    color: '#52C7D3',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontWeight: '500',
                                    fontSize: '12px'
                                  }}
                                >
                                  {showMoreTextBlocks.outcomes
                                    ? ' Read less'
                                    : ' Read more'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </MainCard>
                  )
                }}
              />
            ) : (
              <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                <img src={nothingAdded} alt='nothing-added' />
                <p
                  className='text-uppercase text-medium nodata-portf-text'
                  style={{ color: '#6F6F6F' }}
                >
                  {canEdit
                    ? 'Nothing has been added yet. click the plus button to get started.'
                    : 'Nothing has been added yet.'}
                </p>
              </div>
            )}
          </MultiCard>

          {/* Only show edit modal in private mode */}
          {!isPublicView && isEditingFailure && (
            <EditCard
              title={editingFailureId ? 'Edit My Failure' : 'Add My Failure'}
              icon={myFailures}
              handleSubmit={handleSaveFailure}
              toggle={handleCancelFailureEdit}
              onDelete={editingFailureId ? handleDeleteFailure : null}
              deleteText={'My Failure'}
            >
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                  className='failure-modal-link-content-container'
                >
                  <div
                    style={{
                      width: '65%'
                    }}
                    className='failure-modal-left-content'
                  >
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                        My Failure Story Video:
                      </div>
                      <div style={{ marginBottom: '8px', fontSize: '15px' }}>
                        Add link to your failure story evidence. Make sure it's
                        viewable.
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        height: '50px'
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
                        placeholder='Add link to evidence'
                      />
                      <img src={linkIcon} alt='pen-icon' />
                    </div>
                  </div>
                  <div
                    style={{ marginBottom: '20px', width: '30%' }}
                    className='failure-modal-right-content'
                  >
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                      Add Evidence Thumbnail:
                    </div>
                    <ImageUploader
                      currentImageUrl={editedFailure.thumbnailUrl}
                      onImageUploaded={(url) => {
                        setEditedFailure({
                          ...editedFailure,
                          thumbnailUrl: url
                        })
                      }}
                      onImageDeleted={() => {
                        setEditedFailure({
                          ...editedFailure,
                          thumbnailUrl: null
                        })
                      }}
                      title='Click to upload or drag and drop'
                      description='Only png, jpg, or jpeg file format supported (max. 2Mb)'
                      maxSizeMB={2}
                      style={{
                        border: '1px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* My Failure */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    fontSize: '15px'
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
                    borderRadius: '4px'
                  }}
                  placeholder='Explain the context and outcomes of your failure...'
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>

              {/* My Pivot */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    fontSize: '15px'
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
                    borderRadius: '4px'
                  }}
                  placeholder='Explain how you turned your failure experience into an opportunity...'
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link']
                    ]
                  }}
                />
              </div>

              {/* My Outcomes */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    fontSize: '15px'
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
                    borderRadius: '4px'
                  }}
                  placeholder='Explain how you turned your failure experience into an opportunity...'
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
        <div style={{ position: 'relative' }}>
          <MultiCard
            title={'My Mentors'}
            icon={myMentors}
            onAddClick={canEdit ? handleAddMentor : () => {}}
            canEdit={canEdit} // Add this prop
          >
            <CarouselComponent
              key={`${props?.myMentors?.length}-${itemsToShow}`}
              data={
                props?.myMentors?.length > 0
                  ? props?.myMentors
                  : [{ isEmpty: true }]
              }
              itemsToShow={itemsToShow}
              renderItems={(item, index) => {
                // Check if this is the skeleton/empty card
                if (item.isEmpty) {
                  return (
                    <div
                      key='empty-skeleton'
                      style={{
                        width: '95%',
                        minHeight: '350px',
                        // background: 'linear-gradient(rgb(228, 233, 244), rgb(255, 255, 255))',
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '20px 0',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
                        <img src={nothingAdded} alt='nothing-added' />
                        <p
                          className='text-uppercase text-medium nodata-portf-text'
                          style={{
                            color: '#6F6F6F',
                            textAlign: 'center',
                            padding: '0 20px'
                          }}
                        >
                          {canEdit
                            ? 'Nothing has been added yet. click the plus button to get started.'
                            : 'Nothing has been added yet.'}
                        </p>
                      </div>
                    </div>
                  )
                }

                // Render normal mentor card
                return (
                  <MentorCard
                    mentor={item}
                    onClick={() => handleEditMentor(item)}
                    width={'95%'}
                    canEdit={canEdit}
                  />
                )
              }}
            />
          </MultiCard>

          {/* Only show edit modal in private mode */}
          {!isPublicView && isEditingMentor && (
            <EditCard
              title={editingMentorId ? 'Edit My Mentor' : 'Add My Mentor'}
              icon={myMentors}
              handleSubmit={handleSaveMentor}
              toggle={handleCancelMentorEdit}
              onDelete={handleDeleteMentor}
              deleteText={'Mentor'}
              modalDialogClassName={'mymentor-modal-dialog'}
            >
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  Mentor Headshot:
                </div>
                <ImageUploader
                  currentImageUrl={editedMentor.mentorImage}
                  onImageUploaded={(url) => {
                    setEditedMentor({
                      ...editedMentor,
                      mentorImage: url
                    })
                  }}
                  onImageDeleted={() => {
                    setEditedMentor({
                      ...editedMentor,
                      mentorImage: null
                    })
                  }}
                  title='Click to upload or drag and drop'
                  description='Only png, jpg, or jpeg file format supported (max. 2Mb)'
                  maxSizeMB={2}
                  style={{
                    border: '1px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center'
                  }}
                />
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
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '12px',
                      color: '#888',
                      backgroundColor: 'white',
                      padding: '0 4px',
                      zIndex: 2
                    }}
                  >
                    Mentor Name:
                  </span>
                  <input
                    type='url'
                    style={{
                      background: 'transparent',
                      width: '100%',
                      paddingTop: '20px'
                    }}
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
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '12px',
                      color: '#888',
                      backgroundColor: 'white',
                      padding: '0 4px',
                      zIndex: 2
                    }}
                  >
                    Mentor Position:
                  </span>
                  <input
                    type='url'
                    style={{
                      background: 'transparent',
                      width: '100%',
                      paddingTop: '20px'
                    }}
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
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '12px',
                      color: '#888',
                      backgroundColor: 'white',
                      padding: '0 4px',
                      zIndex: 2
                    }}
                  >
                    Mentor Name:
                  </span>
                  <input
                    type='url'
                    style={{
                      background: 'transparent',
                      width: '100%',
                      paddingTop: '20px'
                    }}
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
