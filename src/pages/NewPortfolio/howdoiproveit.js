import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Portfolio.css'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
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

import myComunityInvolvementIcon from '../../assets/images/my-comunity-involvement.svg'
import workExperienceIcon from '../../assets/images/work-exprience-icon.svg'

const HowDoIProveIt = (props) => {
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [editMode, setEditMode] = useState('add')
  const [selectedItem, setSelectedItem] = useState(null)
  const [errors, setErrors] = useState({})
  const [communityInvolvements, setCommunityInvolvements] = useState([])

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

  const [workExperiences, setWorkExperiences] = useState([])
  const [showWorkModal, setShowWorkModal] = useState(false)

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

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        const response = await axiosInstance.get(
          '/hsPortfolio/user-work-experience'
        )
        setWorkExperiences(response.data)
      } catch (error) {
        console.error('Failed to fetch work experience', error)
      }
    }

    fetchWorkExperience()
  }, [])

  // Fetch community involvement data
  useEffect(() => {
    const fetchCommunityInvolvement = async () => {
      try {
        const response = await axiosInstance.get(
          '/hsPortfolio/user-comunity-involvement'
        )
        setCommunityInvolvements(response.data)
      } catch (error) {
        console.error('Failed to fetch community involvement', error)
      }
    }

    fetchCommunityInvolvement()
  }, [])

  const handleEducationInputChange = (field, value) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCommunityInputChange = (field, value) => {
    setCommunityForm((prev) => ({ ...prev, [field]: value }))
  }

  const openEducationModal = (mode = 'add', item = null) => {
    setEditMode(mode)
    setSelectedItem(item)
    if (mode === 'edit' && item) {
      setEducationForm({
        school_name: item.school_name,
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_graduated: item.date_graduated
          ? new Date(item.date_graduated)
          : null,
        current_education: item.current_education,
        skills_developed: item.skills_developed,
        opportunities_experienced: item.opportunities_experienced,
        school_logo: item.school_logo,
        network_of_mentors: item.network_of_mentors
      })
      setImageUrl(item.school_logo)
    } else {
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
      setImageUrl(null)
    }
    setShowEducationModal(true)
  }

  const openCommunityModal = (mode = 'add', item = null) => {
    setEditMode(mode)
    setSelectedItem(item)
    if (mode === 'edit' && item) {
      setCommunityForm({
        organization_name: item.organization_name,
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_ended: item.date_ended ? new Date(item.date_ended) : null,
        current_involved: item.current_involved,
        skills_developed: item.skills_developed,
        opportunities_experienced: item.opportunities_experienced,
        organization_logo: item.organization_logo,
        network_of_mentors: item.network_of_mentors
      })
      setImageUrl(item.organization_logo)
    } else {
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
      setImageUrl(null)
    }
    setShowCommunityModal(true)
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

  const handleEducationSubmit = async () => {
    const requiredFields = ['school_name', 'date_started']
    const newErrors = {}

    let imageToSend = educationForm.school_logo // Keep existing image by default
    if (imageProperties.croppedImage) {
      imageToSend = await uploadImage(imageProperties.croppedImage)
    }

    requiredFields.forEach((field) => {
      if (!educationForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const payload = {
        school_name: educationForm.school_name,
        date_started: educationForm.date_started,
        date_graduated: educationForm.date_graduated,
        current_education: educationForm.current_education,
        skills_developed: educationForm.skills_developed,
        opportunities_experienced: educationForm.opportunities_experienced,
        school_logo: imageToSend,
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

      setShowEducationModal(false)
      props?.onDataUpdated?.()
    } catch (error) {
      console.error('Failed to save education', error)
      alert('Failed to save education')
    }
  }

  const handleCommunitySubmit = async () => {
    const requiredFields = ['organization_name', 'date_started']
    const newErrors = {}

    let imageToSend = communityForm.organization_logo // Keep existing image by default
    if (imageProperties.croppedImage) {
      imageToSend = await uploadImage(imageProperties.croppedImage)
    }

    requiredFields.forEach((field) => {
      if (!communityForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const payload = {
        organization_name: communityForm.organization_name,
        date_started: communityForm.date_started,
        date_ended: communityForm.date_ended,
        current_involved: communityForm.current_involved ? 1 : 0, // Convert to 1/0
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

      setShowCommunityModal(false)
      // Refresh community involvement data
      const response = await axiosInstance.get(
        '/hsPortfolio/user-comunity-involvement'
      )
      setCommunityInvolvements(response.data)
    } catch (error) {
      console.error('Failed to save community involvement', error)
      alert('Failed to save community involvement')
    }
  }

  const handleWorkInputChange = (field, value) => {
    setWorkForm((prev) => ({ ...prev, [field]: value }))
  }

  const openWorkModal = (mode = 'add', item = null) => {
    setEditMode(mode)
    setSelectedItem(item)
    if (mode === 'edit' && item) {
      setWorkForm({
        organization_name: item.organization_name,
        date_started: item.date_started ? new Date(item.date_started) : null,
        date_ended: item.date_ended ? new Date(item.date_ended) : null,
        current_involved: item.current_involved,
        skills_developed: item.skills_developed,
        opportunities_experienced: item.opportunities_experienced,
        organization_logo: item.organization_logo,
        network_of_mentors: item.network_of_mentors
      })
      setImageUrl(item.organization_logo)
    } else {
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
      setImageUrl(null)
    }
    setShowWorkModal(true)
  }

  const handleWorkSubmit = async () => {
    const requiredFields = ['organization_name', 'date_started']
    const newErrors = {}

    let imageToSend = workForm.organization_logo // Keep existing image by default
    if (imageProperties.croppedImage) {
      imageToSend = await uploadImage(imageProperties.croppedImage)
    }

    requiredFields.forEach((field) => {
      if (!workForm[field]) newErrors[field] = 'This field is required'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const payload = {
        organization_name: workForm.organization_name,
        date_started: workForm.date_started,
        date_ended: workForm.date_ended,
        current_involved: workForm.current_involved ? 1 : 0,
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

      setShowWorkModal(false)
      // Refresh work experience data
      const response = await axiosInstance.get(
        '/hsPortfolio/user-work-experience'
      )
      setWorkExperiences(response.data)
    } catch (error) {
      console.error('Failed to save work experience', error)
      alert('Failed to save work experience')
    }
  }

  const handleDeleteEducation = async () => {
    try {
      await axiosInstance.delete(`/hsPortfolio/educations/${selectedItem.id}`)
      // Refresh education data
      props?.onDataUpdated?.()
      setShowEducationModal(false)
    } catch (error) {
      console.error('Failed to delete education', error)
      alert('Failed to delete education')
    }
  }

  const handleDeleteCommunityInvolvement = async () => {
    try {
      await axiosInstance.delete(
        `/hsPortfolio/comunity-involvement/${selectedItem.id}`
      )
      // Refresh community involvement data
      const response = await axiosInstance.get(
        '/hsPortfolio/user-comunity-involvement'
      )
      setCommunityInvolvements(response.data)
      setShowCommunityModal(false)
    } catch (error) {
      console.error('Failed to delete community involvement', error)
      alert('Failed to delete community involvement')
    }
  }

  const handleDeleteWorkExperience = async () => {
    try {
      await axiosInstance.delete(
        `/hsPortfolio/work-experience/${selectedItem.id}`
      )
      // Refresh work experience data
      const response = await axiosInstance.get(
        '/hsPortfolio/user-work-experience'
      )
      setWorkExperiences(response.data)
      setShowWorkModal(false)
    } catch (error) {
      console.error('Failed to delete work experience', error)
      alert('Failed to delete work experience')
    }
  }

  return (
    <div>
      <div className='section-description-container'>
        <div className='portf-section-maintitle'>
          <div className='pe-2'>
            <img src={HowDoIProveItIcon} alt='What Can I Do' />
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
        <div style={{ marginTop: '40px' }}>
          <MultiCard
            title='Education & Credentials'
            icon={educationCredentials}
            onClick={() => openEducationModal('add')}
          >
            {props?.educations?.length > 0 ? (
              <CarouselComponent
                data={props.educations}
                renderItems={(item, index) => (
                  <MainCard
                    key={index}
                    onClick={() => openEducationModal('edit', item)}
                    multi={true}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '50%',
                              overflow: 'hidden'
                            }}
                          >
                            <img
                              src={item?.school_logo}
                              alt='Profile'
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <div style={{ marginLeft: '20px' }}>
                            <p
                              style={{
                                fontSize: '20px',
                                color: 'black',
                                fontWeight: '600'
                              }}
                            >
                              {item.school_name}
                            </p>
                            <p>{item.date_started}</p>
                          </div>
                        </div>

                        <div style={{ width: '50%' }}>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%'
                            }}
                          >
                            <div>SKILLS DEVELOPED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.skills_developed?.replace(/<[^>]*>/g, '') ||
                                ''}
                            </div>
                          </div>

                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>OPPURTUNITIES EXPRIENCED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.opportunities_experienced?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>NETWORK OF MENTORS</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.network_of_mentors?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MainCard>
                )}
              />
            ) : (
              <MainCard multi={true} />
            )}
          </MultiCard>
        </div>

        <div style={{ marginTop: '40px' }}>
          <MultiCard
            title='My Community Involvement'
            icon={myComunityInvolvementIcon}
            onClick={() => openCommunityModal('add')}
          >
            {communityInvolvements?.length > 0 ? (
              <CarouselComponent
                data={communityInvolvements}
                renderItems={(item, index) => (
                  <MainCard
                    key={index}
                    onClick={() => openCommunityModal('edit', item)}
                    multi={true}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          {item.organization_logo && (
                            <div
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden'
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
                          <div style={{ marginLeft: '20px' }}>
                            <p
                              style={{
                                fontSize: '20px',
                                color: 'black',
                                fontWeight: '600'
                              }}
                            >
                              {item.organization_name}
                            </p>
                            <p>
                              {item.date_started &&
                                new Date(
                                  item.date_started
                                ).toLocaleDateString()}
                              {item.date_ended &&
                                ` - ${new Date(
                                  item.date_ended
                                ).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>

                        <div style={{ width: '50%' }}>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%'
                            }}
                          >
                            <div>SKILLS DEVELOPED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.skills_developed?.replace(/<[^>]*>/g, '') ||
                                ''}
                            </div>
                          </div>

                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>OPPORTUNITIES EXPERIENCED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.opportunities_experienced?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>NETWORK OF MENTORS</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.network_of_mentors?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MainCard>
                )}
              />
            ) : (
              <MainCard />
            )}
          </MultiCard>
        </div>

        <div style={{ marginTop: '40px' }}>
          <MultiCard
            title='Work Experience'
            icon={workExperienceIcon}
            onClick={() => openWorkModal('add')}
          >
            {workExperiences?.length > 0 ? (
              <CarouselComponent
                data={workExperiences}
                renderItems={(item, index) => (
                  <MainCard
                    key={index}
                    onClick={() => openWorkModal('edit', item)}
                    multi={true}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          {item.organization_logo && (
                            <div
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden'
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
                          <div style={{ marginLeft: '20px' }}>
                            <p
                              style={{
                                fontSize: '20px',
                                color: 'black',
                                fontWeight: '600'
                              }}
                            >
                              {item.organization_name}
                            </p>
                            <p>
                              {item.date_started &&
                                new Date(
                                  item.date_started
                                ).toLocaleDateString()}
                              {item.date_ended &&
                                ` - ${new Date(
                                  item.date_ended
                                ).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>

                        <div style={{ width: '50%' }}>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%'
                            }}
                          >
                            <div>SKILLS DEVELOPED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.skills_developed?.replace(/<[^>]*>/g, '') ||
                                ''}
                            </div>
                          </div>

                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>OPPORTUNITIES EXPERIENCED</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.opportunities_experienced?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '15px',
                              boxShadow: '0px 3px 14px #00000029',
                              borderRadius: '14px',
                              width: '100%',
                              marginTop: '10px'
                            }}
                          >
                            <div>NETWORK OF MENTORS</div>
                            <div
                              style={{ fontSize: '12px', marginTop: '10px' }}
                            >
                              {item.network_of_mentors?.replace(
                                /<[^>]*>/g,
                                ''
                              ) || ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MainCard>
                )}
              />
            ) : (
              <MainCard />
            )}
          </MultiCard>
        </div>

        {/* Education Modal */}
        {showEducationModal && (
          <EditCard
            title={editMode === 'add' ? 'Add Education' : 'Edit Education'}
            icon={educationCredentials}
            toggle={() => setShowEducationModal(false)}
            handleSubmit={handleEducationSubmit}
            onDelete={handleDeleteEducation}
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
              <ReactImageUpload
                value={userImageUrl}
                {...imageProperties}
                onChangeImageCrop={updateCroppedProfileImage}
                onImageLoadSuccess={handleImageLoadSuccess}
                onLabelClick={handleLabelClick}
                onFileInputChange={handleFileInputChange}
                onPositionChange={handlePositionChange}
                actions={avatarEditorActions}
                title='School logo'
                editorRef={editorRef}
                fullSize={true}
              />
              <div style={{ position: 'relative' }} className='mt-4'>
                <label>School Name</label>
                <input
                  className='form-control'
                  value={educationForm.school_name}
                  onChange={(e) =>
                    handleEducationInputChange('school_name', e.target.value)
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
              <div className='d-flex gap-3 mt-3'>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>Start Date</label>
                  <DatePicker
                    selected={educationForm.date_started}
                    onChange={(date) =>
                      handleEducationInputChange('date_started', date)
                    }
                    className='form-control'
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
                    <span className='text-danger'>{errors.date_started}</span>
                  )}
                </div>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>End Date</label>
                  <DatePicker
                    selected={educationForm.date_graduated}
                    onChange={(date) =>
                      handleEducationInputChange('date_graduated', date)
                    }
                    className='form-control'
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
                  <label>Current Education</label>
                  <Switch
                    checked={educationForm.current_education}
                    onChange={(checked) =>
                      handleEducationInputChange('current_education', checked)
                    }
                  />
                </div>
              </div>
              <div className='mt-3'>
                <label>Skills Developed</label>
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
                <label>Opportunities Experienced</label>
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
                <label>Network of Mentors</label>
                <ReactQuill
                  value={educationForm.network_of_mentors}
                  onChange={(content) =>
                    handleEducationInputChange('network_of_mentors', content)
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

        {/* Community Involvement Modal */}
        {showCommunityModal && (
          <EditCard
            title={
              editMode === 'add'
                ? 'Add Community Involvement'
                : 'Edit Community Involvement'
            }
            icon={myComunityInvolvementIcon}
            toggle={() => setShowCommunityModal(false)}
            handleSubmit={handleCommunitySubmit}
            onDelete={handleDeleteCommunityInvolvement}
            deleteText={'Exprience'}
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
              <ReactImageUpload
                value={userImageUrl}
                {...imageProperties}
                onChangeImageCrop={updateCroppedProfileImage}
                onImageLoadSuccess={handleImageLoadSuccess}
                onLabelClick={handleLabelClick}
                onFileInputChange={handleFileInputChange}
                onPositionChange={handlePositionChange}
                actions={avatarEditorActions}
                title='Organization logo'
                editorRef={editorRef}
                fullSize={true}
              />
              <div style={{ position: 'relative' }} className='mt-4'>
                <label>Organization Name</label>
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
              <div className='d-flex gap-3 mt-3'>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>Start Date</label>
                  <DatePicker
                    selected={communityForm.date_started}
                    onChange={(date) =>
                      handleCommunityInputChange('date_started', date)
                    }
                    className='form-control'
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
                    <span className='text-danger'>{errors.date_started}</span>
                  )}
                </div>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>End Date</label>
                  <DatePicker
                    selected={communityForm.date_ended}
                    onChange={(date) =>
                      handleCommunityInputChange('date_ended', date)
                    }
                    className='form-control'
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
                  <label>Current Involvement</label>
                  <Switch
                    checked={communityForm.current_involved}
                    onChange={(checked) =>
                      handleCommunityInputChange('current_involved', checked)
                    }
                  />
                </div>
              </div>
              <div className='mt-3'>
                <label>Skills Developed</label>
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
                <label>Opportunities Experienced</label>
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
                <label>Network of Mentors</label>
                <ReactQuill
                  value={communityForm.network_of_mentors}
                  onChange={(content) =>
                    handleCommunityInputChange('network_of_mentors', content)
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
        {showWorkModal && (
          <EditCard
            title={
              editMode === 'add'
                ? 'Add Work Experience'
                : 'Edit Work Experience'
            }
            icon={workExperienceIcon}
            toggle={() => setShowWorkModal(false)}
            handleSubmit={handleWorkSubmit}
            onDelete={handleDeleteWorkExperience}
            deleteText={'Work Exprience'}
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
              <ReactImageUpload
                value={userImageUrl}
                {...imageProperties}
                onChangeImageCrop={updateCroppedProfileImage}
                onImageLoadSuccess={handleImageLoadSuccess}
                onLabelClick={handleLabelClick}
                onFileInputChange={handleFileInputChange}
                onPositionChange={handlePositionChange}
                actions={avatarEditorActions}
                title='Organization logo'
                editorRef={editorRef}
                fullSize={true}
              />
              <div style={{ position: 'relative' }} className='mt-4'>
                <label>Organization Name</label>
                <input
                  className='form-control'
                  value={workForm.organization_name}
                  onChange={(e) =>
                    handleWorkInputChange('organization_name', e.target.value)
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
              <div className='d-flex gap-3 mt-3'>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>Start Date</label>
                  <DatePicker
                    selected={workForm.date_started}
                    onChange={(date) =>
                      handleWorkInputChange('date_started', date)
                    }
                    className='form-control'
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
                    <span className='text-danger'>{errors.date_started}</span>
                  )}
                </div>
                <div className='w-100'>
                  <label style={{ display: 'block' }}>End Date</label>
                  <DatePicker
                    selected={workForm.date_ended}
                    onChange={(date) =>
                      handleWorkInputChange('date_ended', date)
                    }
                    className='form-control'
                    disabled={workForm.current_involved}
                    customInput={
                      <div className='d-flex align-items-center gap-2'>
                        <FaRegCalendarAlt className='calendar-icon' />
                        <input
                          className='cursor-pointer'
                          placeholder='Choose Date'
                          readOnly
                          value={
                            workForm.date_ended && !workForm.current_involved
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
                  <label>Current Position</label>
                  <Switch
                    checked={workForm.current_involved}
                    onChange={(checked) =>
                      handleWorkInputChange('current_involved', checked)
                    }
                  />
                </div>
              </div>
              <div className='mt-3'>
                <label>Skills Developed</label>
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
                <label>Opportunities Experienced</label>
                <ReactQuill
                  value={workForm.opportunities_experienced}
                  onChange={(content) =>
                    handleWorkInputChange('opportunities_experienced', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div className='mt-3'>
                <label>Network of Mentors</label>
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
      </div>
    </div>
  )
}

export default HowDoIProveIt
