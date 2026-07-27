import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux' // Add this import
import './Portfolio.css'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
import ImageUploader from '../../components/NewPortfolio/ImageUploader/index'
import { FaRegCalendarAlt } from 'react-icons/fa'
import Switch from 'react-switch'
import ReactQuill from 'react-quill'
import educationCredentials from '../../assets/images/education.svg'
import CarouselComponent from '../../components/Carousel/CarouselComponent'
import whatCanIDo from '../../assets/images/whatcanido.png'
import HowDoIProveItIcon from '../../assets/images/howDoIProveit.svg'
import ReactImageUpload from '../Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../hooks/useImageEditor'
import EditPencil from '../../assets/images/edit-pencil.png'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axiosInstance from '../../utils/AxiosInstance'
import { deleteImage, uploadImage } from '../../utils/helpers'
import myComunityInvolvementIcon from '../../assets/images/Icon.team-handshake.png'
import workExperienceIcon from '../../assets/images/building.png'
import ConfirmationModal from '../../components/NewPortfolio/ConfirmationModal'
import what from '../../assets/icons/What.png'
import nothingAdded from '../../assets/images/nothing-added.svg'

const HowDoIProveIt = (props) => {
  const isPublicView = props.isPublicView || props.portfolioType === 'public'

  const userData = useSelector((state) => state.user.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner

  // Initialize state with props data first, then fallback to empty arrays
  const [communityInvolvements, setCommunityInvolvements] = useState(
    props.communityInvolvements || []
  )
  const [educations, setEducations] = useState(props.educations || [])
  const [workExperiences, setWorkExperiences] = useState(
    props.workExperiences || []
  )

  const [showEducationModal, setShowEducationModal] = useState(false)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [editMode, setEditMode] = useState('add')
  const [selectedItem, setSelectedItem] = useState(null)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showWorkModal, setShowWorkModal] = useState(false)
  const [deleteAction, setDeleteAction] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showMoreStates, setShowMoreStates] = useState({})

  const [educationForm, setEducationForm] = useState({
    school_name: '',
    date_started: null,
    date_graduated: null,
    current_education: false,
    skills_developed: '',
    opportunities_experienced: '',
    school_logo: null,
    network_of_mentors: ''
  })

  const [communityForm, setCommunityForm] = useState({
    organization_name: '',
    date_started: null,
    date_ended: null,
    current_involved: false,
    skills_developed: '',
    opportunities_experienced: '',
    organization_logo: null,
    network_of_mentors: ''
  })

  const [workForm, setWorkForm] = useState({
    organization_name: '',
    date_started: null,
    date_ended: null,
    current_involved: false,
    skills_developed: '',
    opportunities_experienced: '',
    organization_logo: null,
    network_of_mentors: ''
  })

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

  const fetchWorkExperience = async () => {
    if (!isOwner) return
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(
        '/hsPortfolio/user-work-experience'
      )
      setWorkExperiences(response.data)
    } catch (error) {
      console.error('Failed to fetch work experience', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCommunityInvolvement = async () => {
    if (!isOwner) return
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(
        '/hsPortfolio/user-comunity-involvement'
      )
      setCommunityInvolvements(response.data)
    } catch (error) {
      console.error('Failed to fetch community involvement', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEducationData = async () => {
    if (!isOwner) return
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/hsPortfolio/userEducations')
      setEducations(response.data)
      if (props?.onDataUpdated) {
        props.onDataUpdated(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch education data', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (props.communityInvolvements && props.communityInvolvements.length > 0) {
      setCommunityInvolvements(props.communityInvolvements)
    }

    if (props.educations && props.educations.length > 0) {
      setEducations(props.educations)
    }

    if (props.workExperiences && props.workExperiences.length > 0) {
      setWorkExperiences(props.workExperiences)
    }
  }, [props.communityInvolvements, props.educations, props.workExperiences])

  useEffect(() => {
    // Public view relies on props from the shared portfolio API — never call
    // owner-only endpoints for guests.
    if (isPublicView) return

    fetchWorkExperience()
    fetchCommunityInvolvement()
    fetchEducationData()
  }, [isPublicView, canEdit])

  const openEducationModal = (mode = 'add', item = null) => {
    if (!canEdit) return

    resetErrors()
    setEditMode(mode)
    if (mode === 'edit' && item) {
      setSelectedItem(item)
      setEducationForm({
        school_name: item.school_name || '',
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_graduated: item.date_graduated
          ? new Date(item.date_graduated)
          : null,
        current_education: item.current_education || false,
        skills_developed: item.skills_developed || '',
        opportunities_experienced: item.opportunities_experienced || '',
        school_logo: item.school_logo || null,
        network_of_mentors: item.network_of_mentors || ''
      })
    } else {
      setSelectedItem(null)
      setEducationForm({
        school_name: '',
        date_started: null,
        date_graduated: null,
        current_education: false,
        skills_developed: '',
        opportunities_experienced: '',
        school_logo: null,
        network_of_mentors: ''
      })
    }
    setShowEducationModal(true)
  }

  const openCommunityModal = (mode = 'add', item = null) => {
    if (!canEdit) return // Add this check

    resetErrors()
    setEditMode(mode)
    if (mode === 'edit' && item) {
      setSelectedItem(item)
      setCommunityForm({
        organization_name: item.organization_name || '',
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_ended: item.date_ended ? new Date(item.date_ended) : null,
        current_involved: item.current_involved || false,
        skills_developed: item.skills_developed || '',
        opportunities_experienced: item.opportunities_experienced || '',
        organization_logo: item.organization_logo || null,
        network_of_mentors: item.network_of_mentors || ''
      })
    } else {
      setSelectedItem(null)
      setCommunityForm({
        organization_name: '',
        date_started: null,
        date_ended: null,
        current_involved: false,
        skills_developed: '',
        opportunities_experienced: '',
        organization_logo: null,
        network_of_mentors: ''
      })
    }
    setShowCommunityModal(true)
  }

  const openWorkModal = (mode = 'add', item = null) => {
    if (!canEdit) return // Add this check

    resetErrors()
    setEditMode(mode)
    if (mode === 'edit' && item) {
      setSelectedItem(item)
      setWorkForm({
        organization_name: item.organization_name || '',
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_ended: item.date_ended ? new Date(item.date_ended) : null,
        current_involved: item.current_involved || false,
        skills_developed: item.skills_developed || '',
        opportunities_experienced: item.opportunities_experienced || '',
        organization_logo: item.organization_logo || null,
        network_of_mentors: item.network_of_mentors || ''
      })
    } else {
      setSelectedItem(null)
      setWorkForm({
        organization_name: '',
        date_started: null,
        date_ended: null,
        current_involved: false,
        skills_developed: '',
        opportunities_experienced: '',
        organization_logo: null,
        network_of_mentors: ''
      })
    }
    setShowWorkModal(true)
  }

  const handleEducationInputChange = (field, value) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCommunityInputChange = (field, value) => {
    setCommunityForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkInputChange = (field, value) => {
    setWorkForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEducationSubmit = async () => {
    const requiredFields = ['school_name', 'date_started']
    const newErrors = {}

    requiredFields.forEach((field) => {
      if (!educationForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      let imageToSend = educationForm.school_logo
      if (imageProperties.croppedImage) {
        imageToSend = await uploadImage(imageProperties.croppedImage)
      }

      const payload = {
        school_name: educationForm.school_name,
        date_started: educationForm.date_started,
        date_graduated: educationForm.date_graduated,
        current_education: educationForm.current_education,
        skills_developed: educationForm.skills_developed,
        opportunities_experienced: educationForm.opportunities_experienced,
        school_logo: educationForm.school_logo,
        network_of_mentors: educationForm.network_of_mentors
      }

      if (editMode === 'edit' && selectedItem) {
        await axiosInstance.put(
          `/hsPortfolio/educations/${selectedItem.id}`,
          payload
        )
      } else {
        await axiosInstance.post('/hsPortfolio/educations', payload)
      }

      setSelectedItem(null)
      await fetchEducationData()
      setShowEducationModal(false)
    } catch (error) {
      console.error('Failed to save education', error)
      toast.error('Failed to save education')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommunitySubmit = async () => {
    const requiredFields = ['organization_name', 'date_started']
    const newErrors = {}

    requiredFields.forEach((field) => {
      if (!communityForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      let imageToSend = communityForm.organization_logo
      if (imageProperties.croppedImage) {
        imageToSend = await uploadImage(imageProperties.croppedImage)
      }

      const payload = {
        organization_name: communityForm.organization_name,
        date_started: communityForm.date_started,
        date_graduated: communityForm.date_ended,
        current_involved: communityForm.current_involved,
        skills_developed: communityForm.skills_developed,
        opportunities_experienced: communityForm.opportunities_experienced,
        organization_logo: imageToSend,
        network_of_mentors: communityForm.network_of_mentors
      }

      if (editMode === 'edit' && selectedItem) {
        await axiosInstance.put(
          `/hsPortfolio/comunity-involvement/${selectedItem.id}`,
          payload
        )
      } else {
        await axiosInstance.post('/hsPortfolio/comunity-involvement', payload)
      }

      await fetchCommunityInvolvement()
      setShowCommunityModal(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to save community involvement', error)
      toast.error('Failed to save community involvement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWorkSubmit = async () => {
    const requiredFields = ['organization_name', 'date_started']
    const newErrors = {}

    requiredFields.forEach((field) => {
      if (!workForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      let imageToSend = workForm.organization_logo
      if (imageProperties.croppedImage) {
        imageToSend = await uploadImage(imageProperties.croppedImage)
      }

      const payload = {
        organization_name: workForm.organization_name,
        date_started: workForm.date_started,
        date_graduated: workForm.date_ended,
        current_involved: workForm.current_involved,
        skills_developed: workForm.skills_developed,
        opportunities_experienced: workForm.opportunities_experienced,
        organization_logo: imageToSend,
        network_of_mentors: workForm.network_of_mentors
      }

      if (editMode === 'edit' && selectedItem) {
        await axiosInstance.put(
          `/hsPortfolio/work-experience/${selectedItem.id}`,
          payload
        )
      } else {
        await axiosInstance.post('/hsPortfolio/work-experience', payload)
      }

      await fetchWorkExperience()
      setShowWorkModal(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to save work experience', error)
      toast.error('Failed to save work experience')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEducation = async (item) => {
    try {
      setIsDeleting(true)

      if (item.school_logo) {
        await deleteImage(item.school_logo)
      }
      await axiosInstance.delete(`/hsPortfolio/educations/${item.id}`)
      await fetchEducationData()
    } catch (error) {
      console.error('Failed to delete education', error)
      setDeleteError('Failed to delete education')
      return
    } finally {
      setIsDeleting(false)
    }
    setShowDeleteConfirmation(false)
  }

  const handleDeleteCommunityInvolvement = async (itemToDelete) => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(
        `/hsPortfolio/comunity-involvement/${itemToDelete.id}`
      )
      await fetchCommunityInvolvement()
      setShowDeleteConfirmation(false)
    } catch (error) {
      console.error('Failed to delete community involvement', error)
      setDeleteError('Failed to delete community involvement')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteWorkExperience = async (itemToDelete) => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(
        `/hsPortfolio/work-experience/${itemToDelete.id}`
      )
      await fetchWorkExperience()
      setShowDeleteConfirmation(false)
    } catch (error) {
      console.error('Failed to delete work experience', error)
      setDeleteError('Failed to delete work experience')
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmDelete = (item, type) => {
    setItemToDelete(item)
    setDeleteError(null)

    let action
    if (type === 'education') {
      action = () => handleDeleteEducation(item)

      setShowEducationModal(false)
    } else if (type === 'community') {
      action = () => handleDeleteCommunityInvolvement(item)
      setShowCommunityModal(false)
    } else if (type === 'work') {
      action = () => handleDeleteWorkExperience(item)
      setShowWorkModal(false)
    }

    setDeleteAction(() => action)
    setShowDeleteConfirmation(true)
  }

  const resetErrors = () => {
    setErrors({})
  }

  const toggleEducationModal = () => {
    resetErrors()
    setShowEducationModal(!showEducationModal)
  }

  const toggleCommunityModal = () => {
    resetErrors()
    setShowCommunityModal(!showCommunityModal)
  }

  const toggleWorkModal = () => {
    resetErrors()
    setShowWorkModal(!showWorkModal)
  }

  const truncateAtWord = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    let lastSpace = text.lastIndexOf(' ', maxLength)

    if (lastSpace === -1) lastSpace = maxLength

    return text.substring(0, lastSpace)
  }

  const getStateKey = (section, itemId, field) => {
    return `${section}-${itemId}-${field}`
  }

  return (
    <>
      {isLoading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
        >
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {!props.hideSectionHeader && (
            <div className='section-description-container'>
              <div className='portf-section-maintitle'>
                <div className='pe-2'>
                  <img
                    src={what}
                    alt='What can I do'
                    style={{ width: '72px', height: '70px' }}
                  />
                </div>
                <div>
                  <div className='align-items-center portfolio-section-title'>
                    <div className='section-title' style={{ fontSize: '20px' }}>
                      {props?.sectionTitle}
                    </div>
                  </div>
                  <div
                    className='section-description'
                    dangerouslySetInnerHTML={{
                      __html: props?.sectionDescription
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className='whoami-container howdoiproveit-container'>
            <div>
              <MultiCard
                title='Education & Credentials'
                icon={educationCredentials}
                onAddClick={
                  canEdit ? () => openEducationModal('add') : () => {}
                } // Add canEdit check
                canEdit={canEdit} // Add this prop
              >
                {educations?.length > 0 ? (
                  <CarouselComponent
                    data={educations}
                    renderItems={(item, index) => (
                      <MainCard
                        key={index}
                        onClick={
                          canEdit
                            ? () => openEducationModal('edit', item)
                            : () => {}
                        } // Add canEdit check
                        multi={true}
                        canEdit={canEdit} // Add this prop
                      >
                        <div>
                          <div
                            className='education-card-content-container'
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                gap: window.innerWidth <= 768 ? '8px' : '10px'
                              }}
                            >
                              <div
                                style={{
                                  // Keep circular shape across breakpoints
                                  width:
                                    window.innerWidth <= 768 ? '60px' : '70px',
                                  height:
                                    window.innerWidth <= 768 ? '60px' : '70px',
                                  minWidth:
                                    window.innerWidth <= 768 ? '60px' : '70px',
                                  flexShrink: 0,
                                  borderRadius: '50%',
                                  overflow: 'hidden'
                                }}
                              >
                                {item?.school_logo ? (
                                  <img
                                    src={item.school_logo}
                                    alt='School Logo'
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                ) : (
                                  <span></span>
                                )}
                              </div>

                              <div>
                                <p
                                  style={{
                                    fontSize: '21px',
                                    color: 'black',
                                    fontWeight: '500',
                                    fontFamily: 'Montserrat',
                                    fontStyle: 'normal',
                                    lineHeight: 'normal'
                                  }}
                                >
                                  {item.school_name}
                                </p>
                                <span
                                  style={{
                                    /* Text - 15 Medium Regular */

                                    fontSize: '15px',
                                    color: '#000',
                                    fontWeight: '500',
                                    fontFamily: 'Montserrat',
                                    fontStyle: 'normal',
                                    lineHeight: 'normal'
                                  }}
                                >
                                  {item.date_started &&
                                    new Date(
                                      item.date_started
                                    ).toLocaleDateString()}

                                  {item.date_graduated &&
                                  !item.current_education
                                    ? ` - ${new Date(
                                        item.date_graduated
                                      ).toLocaleDateString()}`
                                    : ' - Present'}
                                </span>
                              </div>
                            </div>

                            <div
                              style={{ width: '50%' }}
                              className='education-card-skill-container'
                            >
                              {/* SKILLS DEVELOPED */}
                              <div
                                style={{
                                  padding: '15px',
                                  boxShadow: '0px 3px 14px #00000029',
                                  borderRadius: '14px',
                                  width: '100%'
                                }}
                              >
                                <div className='skills-developed-title'>
                                  SKILLS DEVELOPED
                                </div>
                                <div
                                  style={{
                                    fontFamily: 'Montserrat',
                                    fontSize: '15px',
                                    fontStyle: 'normal',
                                    fontWeight: 300,
                                    lineHeight: 'normal',
                                    marginTop: '10px',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {(() => {
                                    const stateKey = getStateKey(
                                      'education',
                                      item.id,
                                      'skills'
                                    )
                                    const isExpanded =
                                      showMoreStates[stateKey] || false
                                    const content =
                                      item.skills_developed || 'Not specified'
                                    const isLong =
                                      content.replace(/<[^>]*>/g, '').length >
                                      150

                                    console.log(content, 'contentEducation')

                                    return (
                                      <div>
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
                                            ...(isLong &&
                                              !isExpanded && {
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                              })
                                          }}
                                        >
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: isExpanded
                                                ? content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                                : content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                            }}
                                          />
                                        </div>
                                        {isLong && (
                                          <span
                                            onClick={() =>
                                              setShowMoreStates((prev) => ({
                                                ...prev,
                                                [stateKey]: !prev[stateKey]
                                              }))
                                            }
                                            style={{
                                              color: '#52C7D3',
                                              cursor: 'pointer',
                                              fontWeight: '500',
                                              fontSize: '12px'
                                            }}
                                          >
                                            {isExpanded
                                              ? ' Read less'
                                              : 'Read more'}
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>

                              {/* OPPORTUNITIES EXPERIENCED */}
                              <div
                                style={{
                                  padding: '15px',
                                  boxShadow: '0px 3px 14px #00000029',
                                  borderRadius: '14px',
                                  width: '100%',
                                  marginTop: '10px'
                                }}
                              >
                                <div className='skills-developed-title'>
                                  OPPURTUNITIES EXPERIENCED
                                </div>
                                <div
                                  style={{
                                    fontFamily: 'Montserrat',
                                    fontSize: '15px',
                                    fontStyle: 'normal',
                                    fontWeight: 300,
                                    lineHeight: 'normal',
                                    marginTop: '10px',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {(() => {
                                    const stateKey = getStateKey(
                                      'education',
                                      item.id,
                                      'opportunities'
                                    )
                                    const isExpanded =
                                      showMoreStates[stateKey] || false
                                    const content =
                                      item.opportunities_experienced ||
                                      'Not specified'
                                    const isLong =
                                      content.replace(/<[^>]*>/g, '').length >
                                      150

                                    return (
                                      <div>
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
                                            display: isExpanded
                                              ? 'block'
                                              : '-webkit-box',
                                            WebkitLineClamp: isExpanded
                                              ? 'none'
                                              : 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                          }}
                                        >
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: isExpanded
                                                ? content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                                : content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                            }}
                                          />
                                        </div>
                                        {isLong && (
                                          <span
                                            onClick={() =>
                                              setShowMoreStates((prev) => ({
                                                ...prev,
                                                [stateKey]: !prev[stateKey]
                                              }))
                                            }
                                            style={{
                                              color: '#52C7D3',
                                              cursor: 'pointer',
                                              fontWeight: '500',
                                              fontSize: '12px'
                                            }}
                                          >
                                            {isExpanded
                                              ? ' Read less'
                                              : 'Read more'}
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>

                              {/* NETWORK OF MENTORS */}
                              <div
                                style={{
                                  padding: '15px',
                                  boxShadow: '0px 3px 14px #00000029',
                                  borderRadius: '14px',
                                  width: '100%',
                                  marginTop: '10px'
                                }}
                              >
                                <div className='skills-developed-title'>
                                  NETWORK OF MENTORS
                                </div>
                                <div
                                  style={{
                                    fontFamily: 'Montserrat',
                                    fontSize: '15px',
                                    fontStyle: 'normal',
                                    fontWeight: 300,
                                    lineHeight: 'normal',
                                    marginTop: '10px',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {(() => {
                                    const stateKey = getStateKey(
                                      'education',
                                      item.id,
                                      'mentors'
                                    )
                                    const isExpanded =
                                      showMoreStates[stateKey] || false
                                    const content =
                                      item.network_of_mentors || 'Not specified'
                                    const isLong =
                                      content.replace(/<[^>]*>/g, '').length >
                                      150

                                    return (
                                      <div>
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
                                            display: isExpanded
                                              ? 'block'
                                              : '-webkit-box',
                                            WebkitLineClamp: isExpanded
                                              ? 'none'
                                              : 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                          }}
                                        >
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: isExpanded
                                                ? content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                                : content?.replace(
                                                    /&nbsp;/g,
                                                    ' '
                                                  ) || ''
                                            }}
                                          />
                                        </div>
                                        {isLong && (
                                          <span
                                            onClick={() =>
                                              setShowMoreStates((prev) => ({
                                                ...prev,
                                                [stateKey]: !prev[stateKey]
                                              }))
                                            }
                                            style={{
                                              color: '#52C7D3',
                                              cursor: 'pointer',
                                              fontWeight: '500',
                                              fontSize: '12px'
                                            }}
                                          >
                                            {isExpanded
                                              ? ' Read less'
                                              : 'Read more'}
                                          </span>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MainCard>
                    )}
                  />
                ) : (
                  <MainCard
                    multi={true}
                    canEdit={canEdit} // Add this prop
                  >
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
                  </MainCard>
                )}
              </MultiCard>
            </div>

            <div style={{ marginTop: '40px' }}>
              <MultiCard
                title='My Community Involvement'
                icon={myComunityInvolvementIcon}
                onAddClick={
                  canEdit ? () => openCommunityModal('add') : () => {}
                } // Add canEdit check
                canEdit={canEdit} // Add this prop
              >
                {communityInvolvements && communityInvolvements.length > 0 ? (
                  <CarouselComponent
                    data={communityInvolvements}
                    renderItems={(item, index) => (
                      <MainCard
                        key={index}
                        onClick={
                          canEdit
                            ? () => openCommunityModal('edit', item)
                            : () => {}
                        }
                        onDelete={
                          canEdit
                            ? () => confirmDelete(item, 'community')
                            : undefined
                        }
                        multi={true}
                        canEdit={canEdit}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                            className='workexperience-card-content-container'
                          >
                            <div style={{ display: 'flex', gap: '10px' }}>
                              {item.organization_logo && (
                                <div
                                  style={{
                                    width: '70px',
                                    height: '70px',
                                    minWidth: '70px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: item?.organization_logo
                                      ? '#fff'
                                      : 'transparent',
                                    flexShrink: 0
                                  }}
                                >
                                  <img
                                    src={item.organization_logo}
                                    alt='Organization'
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <p
                                  style={{
                                    color: '#000',
                                    fontFamily: 'Montserrat',
                                    fontSize: '21px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: 'normal'
                                  }}
                                >
                                  {item.organization_name}
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
                                  {item.date_started &&
                                    new Date(
                                      item.date_started
                                    ).toLocaleDateString()}
                                  {item.date_graduated && !item.current_involved
                                    ? ` - ${new Date(
                                        item.date_graduated
                                      ).toLocaleDateString()}`
                                    : ' - Present'}
                                </p>
                              </div>
                            </div>

                            <div
                              style={{ width: '50%' }}
                              className='workexperience-card-skill-container '
                            >
                              {/* Apply the same pattern for all three fields */}
                              {[
                                'skills_developed',
                                'opportunities_experienced',
                                'network_of_mentors'
                              ].map((field) => {
                                const stateKey = getStateKey(
                                  'community',
                                  item.id,
                                  field
                                )
                                const isExpanded =
                                  showMoreStates[stateKey] || false
                                const content = item[field] || 'Not specified'
                                const isLong =
                                  content.replace(/<[^>]*>/g, '').length > 150

                                const titles = {
                                  skills_developed: 'SKILLS DEVELOPED',
                                  opportunities_experienced:
                                    'OPPORTUNITIES EXPERIENCED',
                                  network_of_mentors: 'NETWORK OF MENTORS'
                                }

                                return (
                                  <div
                                    key={field}
                                    style={{
                                      padding: '15px',
                                      boxShadow: '0px 3px 14px #00000029',
                                      borderRadius: '14px',
                                      width: '100%',
                                      marginTop:
                                        field !== 'skills_developed'
                                          ? '10px'
                                          : '0'
                                    }}
                                  >
                                    <div className='skills-developed-title'>
                                      {titles[field]}
                                    </div>
                                    <div
                                      style={{
                                        fontFamily: 'Montserrat',
                                        fontSize: '15px',
                                        fontStyle: 'normal',
                                        fontWeight: 300,
                                        lineHeight: 'normal',
                                        marginTop: '10px',
                                        wordBreak: 'break-word'
                                      }}
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
                                          fontWeight: 300,
                                          lineHeight: '1.4',
                                          display: isExpanded
                                            ? 'block'
                                            : '-webkit-box',
                                          WebkitLineClamp: isExpanded
                                            ? 'none'
                                            : 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: isExpanded
                                              ? content?.replace(
                                                  /&nbsp;/g,
                                                  ' '
                                                ) || ''
                                              : content?.replace(
                                                  /&nbsp;/g,
                                                  ' '
                                                ) || ''
                                          }}
                                        />
                                      </div>
                                      {isLong && (
                                        <span
                                          onClick={() =>
                                            setShowMoreStates((prev) => ({
                                              ...prev,
                                              [stateKey]: !prev[stateKey]
                                            }))
                                          }
                                          style={{
                                            color: '#52C7D3',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '12px'
                                          }}
                                        >
                                          {isExpanded
                                            ? ' Read less'
                                            : 'Read more'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </MainCard>
                    )}
                  />
                ) : (
                  <MainCard
                    multi={true}
                    canEdit={canEdit} // Add this prop
                  >
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
                  </MainCard>
                )}
              </MultiCard>
            </div>

            <div style={{ marginTop: '40px' }}>
              <MultiCard
                title='Work Experience'
                icon={workExperienceIcon}
                onAddClick={canEdit ? () => openWorkModal('add') : () => {}} // Add canEdit check
                canEdit={canEdit} // Add this prop
              >
                {workExperiences?.length > 0 ? (
                  <CarouselComponent
                    data={workExperiences}
                    renderItems={(item, index) => (
                      <MainCard
                        key={index}
                        onClick={
                          canEdit ? () => openWorkModal('edit', item) : () => {}
                        } // Add canEdit check
                        onDelete={
                          canEdit ? () => confirmDelete(item, 'work') : () => {}
                        } // Add canEdit check
                        multi={true}
                        canEdit={canEdit} // Add this prop
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                            className='workexperience-card-content-container'
                          >
                            <div
                              style={{
                                display: 'flex',
                                gap: window.innerWidth <= 768 ? '8px' : '10px'
                              }}
                            >
                              {item.organization_logo && (
                                <div
                                  style={{
                                    width: '70px',
                                    height: '70px',
                                    minWidth: '70px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                  }}
                                >
                                  <img
                                    src={item.organization_logo}
                                    alt='Organization'
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <p
                                  style={{
                                    color: '#000',
                                    fontFamily: 'Montserrat',
                                    fontSize: '21px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: 'normal'
                                  }}
                                >
                                  {item.organization_name}
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
                                  {item.date_started &&
                                    new Date(
                                      item.date_started
                                    ).toLocaleDateString()}
                                  {item.date_graduated && !item.current_involved
                                    ? ` - ${new Date(
                                        item.date_graduated
                                      ).toLocaleDateString()}`
                                    : ' - Present'}
                                </p>
                              </div>
                            </div>

                            <div
                              style={{ width: '50%' }}
                              className='workexperience-card-skill-container '
                            >
                              {/* Apply the same pattern for all three fields */}
                              {[
                                'skills_developed',
                                'opportunities_experienced',
                                'network_of_mentors'
                              ].map((field) => {
                                const stateKey = getStateKey(
                                  'work',
                                  item.id,
                                  field
                                )
                                const isExpanded =
                                  showMoreStates[stateKey] || false
                                const content = item[field] || 'Not specified'
                                const isLong =
                                  content.replace(/<[^>]*>/g, '').length > 150

                                const titles = {
                                  skills_developed: 'SKILLS DEVELOPED',
                                  opportunities_experienced:
                                    'OPPORTUNITIES EXPERIENCED',
                                  network_of_mentors: 'NETWORK OF MENTORS'
                                }

                                return (
                                  <div
                                    key={field}
                                    style={{
                                      padding: '15px',
                                      boxShadow: '0px 3px 14px #00000029',
                                      borderRadius: '14px',
                                      width: '100%',
                                      marginTop:
                                        field !== 'skills_developed'
                                          ? '10px'
                                          : '0'
                                    }}
                                  >
                                    <div className='skills-developed-title'>
                                      {titles[field]}
                                    </div>
                                    <div
                                      style={{
                                        fontFamily: 'Montserrat',
                                        fontSize: '15px',
                                        fontStyle: 'normal',
                                        fontWeight: 300,
                                        lineHeight: 'normal',
                                        marginTop: '10px',
                                        wordBreak: 'break-word'
                                      }}
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
                                          fontWeight: 300,
                                          lineHeight: '1.4',
                                          display: isExpanded
                                            ? 'block'
                                            : '-webkit-box',
                                          WebkitLineClamp: isExpanded
                                            ? 'none'
                                            : 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: isExpanded
                                              ? content?.replace(
                                                  /&nbsp;/g,
                                                  ' '
                                                ) || ''
                                              : content?.replace(
                                                  /&nbsp;/g,
                                                  ' '
                                                ) || ''
                                          }}
                                        />
                                      </div>
                                      {isLong && (
                                        <span
                                          onClick={() =>
                                            setShowMoreStates((prev) => ({
                                              ...prev,
                                              [stateKey]: !prev[stateKey]
                                            }))
                                          }
                                          style={{
                                            color: '#52C7D3',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '12px'
                                          }}
                                        >
                                          {isExpanded
                                            ? ' Read less'
                                            : 'Read more'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </MainCard>
                    )}
                  />
                ) : (
                  <MainCard
                    multi={true}
                    canEdit={canEdit} // Add this prop
                  >
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
                  </MainCard>
                )}
              </MultiCard>
            </div>

            {/* Only show modals when user can edit */}
            {canEdit && showEducationModal && (
              <EditCard
                title={
                  editMode === 'add'
                    ? 'Add Education & Credentials'
                    : 'Edit Education & Credentials'
                }
                icon={educationCredentials}
                toggle={toggleEducationModal}
                handleSubmit={handleEducationSubmit}
                onDelete={() => confirmDelete(selectedItem, 'education')}
                deleteText={'Education'}
              >
                <div>
                  <div style={{ marginTop: '50px', fontWeight: '500' }}>
                    School Logo
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      fontWeight: '400',
                      marginBottom: '20px'
                    }}
                  >
                    Upload an image of your school's logo
                  </div>
                  <ImageUploader
                    currentImageUrl={educationForm.school_logo}
                    onImageUploaded={(url) => {
                      setEducationForm((prev) => ({
                        ...prev,
                        school_logo: url
                      }))
                    }}
                    onImageDeleted={() => {
                      setEducationForm((prev) => ({
                        ...prev,
                        school_logo: null
                      }))
                    }}
                    title='School Logo'
                    description="Upload an image of your school's logo"
                    maxSizeMB={20}
                    enableDragAndDrop={true}
                  />

                  <div style={{ position: 'relative' }} className='mt-4'>
                    <label className='howdoiproveit-label-text'>
                      School Name
                    </label>

                    <input
                      className='form-control'
                      value={educationForm.school_name}
                      onChange={(e) =>
                        handleEducationInputChange(
                          'school_name',
                          e.target.value
                        )
                      }
                      style={{
                        border: 'none',
                        width: '100%',
                        fontSize: '0.875rem',
                        color: 'black',
                        background: 'transparent',
                        boxShadow: '0px 3px 14px #00000029'
                      }}
                    />
                    {errors.school_name && (
                      <span className='text-danger'>{errors.school_name}</span>
                    )}
                  </div>
                  <div className='d-flex gap-3 mt-3 date-inputs-container-resp'>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        Start Date
                      </label>
                      <DatePicker
                        selected={educationForm.date_started}
                        onChange={(date) =>
                          handleEducationInputChange('date_started', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                educationForm.date_started
                                  ? new Date(
                                      educationForm.date_started
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                      {errors.date_started && (
                        <span className='text-danger'>
                          {errors.date_started}
                        </span>
                      )}
                    </div>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        End Date
                      </label>
                      <DatePicker
                        selected={educationForm.date_graduated}
                        onChange={(date) =>
                          handleEducationInputChange('date_graduated', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        disabled={educationForm.current_education}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                educationForm.date_graduated &&
                                !educationForm.current_education
                                  ? new Date(
                                      educationForm.date_graduated
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                      <label className='howdoiproveit-label-text'>
                        Current Education
                      </label>
                      <Switch
                        checked={educationForm.current_education}
                        onChange={(checked) =>
                          handleEducationInputChange(
                            'current_education',
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Skills Developed
                    </label>
                    <ReactQuill
                      value={educationForm.skills_developed}
                      onChange={(content) =>
                        handleEducationInputChange('skills_developed', content)
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Opportunities Experienced
                    </label>
                    <ReactQuill
                      value={educationForm.opportunities_experienced}
                      onChange={(content) =>
                        handleEducationInputChange(
                          'opportunities_experienced',
                          content
                        )
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Network of Mentors
                    </label>
                    <ReactQuill
                      value={educationForm.network_of_mentors}
                      onChange={(content) =>
                        handleEducationInputChange(
                          'network_of_mentors',
                          content
                        )
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                </div>
              </EditCard>
            )}

            {canEdit && showCommunityModal && (
              <EditCard
                title={
                  editMode === 'add'
                    ? 'Add Community Involvement'
                    : 'Edit Community Involvement'
                }
                icon={myComunityInvolvementIcon}
                toggle={toggleCommunityModal}
                handleSubmit={handleCommunitySubmit}
                onDelete={() => confirmDelete(selectedItem, 'community')}
                deleteText={'Experience'}
              >
                <div>
                  <div style={{ marginTop: '50px', fontWeight: '500' }}>
                    Organization Logo
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      fontWeight: '400',
                      marginBottom: '20px'
                    }}
                  >
                    Upload an image of the organization's logo
                  </div>
                  <ImageUploader
                    currentImageUrl={communityForm.organization_logo}
                    onImageUploaded={(url) => {
                      setCommunityForm((prev) => ({
                        ...prev,
                        organization_logo: url
                      }))
                    }}
                    onImageDeleted={() => {
                      setCommunityForm((prev) => ({
                        ...prev,
                        organization_logo: null
                      }))
                    }}
                    title='Organization Logo'
                    description="Upload an image of your Organization's logo"
                    maxSizeMB={20}
                  />

                  <div style={{ position: 'relative' }} className='mt-4'>
                    <label className='howdoiproveit-label-text'>
                      Organization Name
                    </label>
                    <input
                      className='form-control'
                      value={communityForm.organization_name}
                      onChange={(e) =>
                        handleCommunityInputChange(
                          'organization_name',
                          e.target.value
                        )
                      }
                      style={{
                        border: 'none',
                        width: '100%',
                        fontSize: '0.875rem',
                        color: 'black',
                        background: 'transparent',
                        boxShadow: '0px 3px 14px #00000029'
                      }}
                    />
                    {errors.organization_name && (
                      <span className='text-danger'>
                        {errors.organization_name}
                      </span>
                    )}
                  </div>
                  <div className='d-flex gap-3 mt-3 date-inputs-container-resp'>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        Start Date
                      </label>
                      <DatePicker
                        selected={communityForm.date_started}
                        onChange={(date) =>
                          handleCommunityInputChange('date_started', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                communityForm.date_started
                                  ? new Date(
                                      communityForm.date_started
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                      {errors.date_started && (
                        <span className='text-danger'>
                          {errors.date_started}
                        </span>
                      )}
                    </div>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        End Date
                      </label>
                      <DatePicker
                        selected={communityForm.date_ended}
                        onChange={(date) =>
                          handleCommunityInputChange('date_ended', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        disabled={communityForm.current_involved}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                communityForm.date_ended &&
                                !communityForm.current_involved
                                  ? new Date(
                                      communityForm.date_ended
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                      <label className='howdoiproveit-label-text'>
                        Current Involvement
                      </label>
                      <Switch
                        checked={communityForm.current_involved}
                        onChange={(checked) =>
                          handleCommunityInputChange(
                            'current_involved',
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Skills Developed
                    </label>
                    <ReactQuill
                      value={communityForm.skills_developed}
                      onChange={(content) =>
                        handleCommunityInputChange('skills_developed', content)
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Opportunities Experienced
                    </label>
                    <ReactQuill
                      value={communityForm.opportunities_experienced}
                      onChange={(content) =>
                        handleCommunityInputChange(
                          'opportunities_experienced',
                          content
                        )
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Network of Mentors
                    </label>
                    <ReactQuill
                      value={communityForm.network_of_mentors}
                      onChange={(content) =>
                        handleCommunityInputChange(
                          'network_of_mentors',
                          content
                        )
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                </div>
              </EditCard>
            )}

            {canEdit && showWorkModal && (
              <EditCard
                title={
                  editMode === 'add'
                    ? 'Add Work Experience'
                    : 'Edit Work Experience'
                }
                icon={workExperienceIcon}
                toggle={toggleWorkModal}
                handleSubmit={handleWorkSubmit}
                onDelete={() => confirmDelete(selectedItem, 'work')}
                deleteText={'Work Experience'}
              >
                <div>
                  <div style={{ marginTop: '50px', fontWeight: '500' }}>
                    Organization Logo
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      fontWeight: '400',
                      marginBottom: '20px'
                    }}
                  >
                    Upload an image of the organization's logo
                  </div>
                  <ImageUploader
                    currentImageUrl={workForm.organization_logo}
                    onImageUploaded={(url) => {
                      setWorkForm((prev) => ({
                        ...prev,
                        organization_logo: url
                      }))
                    }}
                    onImageDeleted={() => {
                      setWorkForm((prev) => ({
                        ...prev,
                        organization_logo: null
                      }))
                    }}
                    title='Organization Logo'
                    description="Upload an image of your Organization's logo"
                    maxSizeMB={20}
                  />
                  <div style={{ position: 'relative' }} className='mt-4'>
                    <label className='howdoiproveit-label-text'>
                      Organization Name
                    </label>
                    <input
                      className='form-control'
                      value={workForm.organization_name}
                      onChange={(e) =>
                        handleWorkInputChange(
                          'organization_name',
                          e.target.value
                        )
                      }
                      style={{
                        border: 'none',
                        width: '100%',
                        fontSize: '0.875rem',
                        color: 'black',
                        background: 'transparent',
                        boxShadow: '0px 3px 14px #00000029'
                      }}
                    />
                    {errors.organization_name && (
                      <span className='text-danger'>
                        {errors.organization_name}
                      </span>
                    )}
                  </div>
                  <div className='d-flex gap-3 mt-3 date-inputs-container-resp'>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        Start Date
                      </label>
                      <DatePicker
                        selected={workForm.date_started}
                        onChange={(date) =>
                          handleWorkInputChange('date_started', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                workForm.date_started
                                  ? new Date(
                                      workForm.date_started
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                      {errors.date_started && (
                        <span className='text-danger'>
                          {errors.date_started}
                        </span>
                      )}
                    </div>
                    <div className='w-100'>
                      <label
                        style={{ display: 'block' }}
                        className='howdoiproveit-label-text'
                      >
                        End Date
                      </label>
                      <DatePicker
                        selected={workForm.date_ended}
                        onChange={(date) =>
                          handleWorkInputChange('date_ended', date)
                        }
                        className='form-control'
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={50}
                        maxDate={new Date()}
                        disabled={workForm.current_involved}
                        customInput={
                          <div className='d-flex align-items-center gap-2'>
                            <FaRegCalendarAlt className='calendar-icon' />
                            <input
                              className='cursor-pointer'
                              placeholder='Choose Date'
                              readOnly
                              value={
                                workForm.date_ended &&
                                !workForm.current_involved
                                  ? new Date(
                                      workForm.date_ended
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''
                              }
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        }
                      />
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                      <label className='howdoiproveit-label-text'>
                        Current Position
                      </label>
                      <Switch
                        checked={workForm.current_involved}
                        onChange={(checked) =>
                          handleWorkInputChange('current_involved', checked)
                        }
                      />
                    </div>
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Skills Developed
                    </label>
                    <ReactQuill
                      value={workForm.skills_developed}
                      onChange={(content) =>
                        handleWorkInputChange('skills_developed', content)
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Opportunities Experienced
                    </label>
                    <ReactQuill
                      value={workForm.opportunities_experienced}
                      onChange={(content) =>
                        handleWorkInputChange(
                          'opportunities_experienced',
                          content
                        )
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                  <div className='mt-3'>
                    <label className='howdoiproveit-label-text'>
                      Network of Mentors
                    </label>
                    <ReactQuill
                      value={workForm.network_of_mentors}
                      onChange={(content) =>
                        handleWorkInputChange('network_of_mentors', content)
                      }
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                        borderRadius: '15px'
                      }}
                    />
                  </div>
                </div>
              </EditCard>
            )}

            {canEdit && showDeleteConfirmation && (
              <ConfirmationModal
                isOpen={showDeleteConfirmation}
                onClose={() => !isDeleting && setShowDeleteConfirmation(false)}
                onConfirm={deleteAction}
                title='Confirm Delete'
                message={
                  deleteError ? (
                    <span style={{ color: 'red' }}>{deleteError}</span>
                  ) : isDeleting ? (
                    'Deleting...'
                  ) : (
                    'Are you sure you want to delete this item? This action cannot be undone.'
                  )
                }
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                cancelText='Cancel'
                disabled={isDeleting}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default HowDoIProveIt
