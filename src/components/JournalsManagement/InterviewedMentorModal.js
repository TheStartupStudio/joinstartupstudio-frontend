import React, { useEffect, useRef, useState } from 'react'
import ModalWrapper from '../Modals/Spotlight/ModalWrapper'
import LtsButton from '../LTSButtons/LTSButton'
import { SlCloudUpload } from 'react-icons/sl'
import ReactTable from '../ReactTable/ReactTable'
import InterviewModal from './InterviewModal'
import MediaLightbox from '../MediaLightbox'
import { v4 as uuidv4 } from 'uuid'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'

function InterviewedMentorModal(props) {
  const { selectedAccordion, setSelectedAccordion } = props

  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)

  const [video, setVideo] = useState(null)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState(null)

  useEffect(() => {
    if (editingInterview) handleShowInterviewModal()
  }, [editingInterview])
  const handleShowInterviewModal = () => {
    setShowInterviewModal(true)
  }
  const handleHideInterviewModal = () => {
    setShowInterviewModal(false)
  }

  const imageUpload = async (image) => {
    setImageUploadingLoader(true)
    const formData = new FormData()
    formData.append('img', image)

    try {
      const response = await axiosInstance.post(
        '/upload/journal-img',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const fileLocation = response.data.fileLocation

      const updatedAccordion = {
        ...selectedAccordion,
        interviewedMentor: {
          ...selectedAccordion.interviewedMentor,
          mentorLogoUrl: fileLocation
        }
      }

      const putResponse = await axiosInstance.put(
        `/manageJournals/interviewed-mentors/${selectedAccordion.interviewedMentor.id}`,
        {
          mentorLogoUrl: fileLocation
        }
      )
      if (putResponse && putResponse.data) {
        setSelectedAccordion({
          ...selectedAccordion,
          interviewedMentor: {
            ...selectedAccordion.interviewedMentor,
            ...putResponse.data
          }
        })
        setImageUploadingLoader(false)
        toast.success('Image uploaded and updated successfully!')
      } else {
        toast.error('Failed to update state with PUT response data')
      }
    } catch (error) {
      setImageUploadingLoader(false)
      toast.error('Image upload and update failed, please try again!')
      console.error('Error uploading and updating image:', error)
    }
  }

  const [selectedImage, setSelectedImage] = useState('')

  const general = useSelector((state) => state.general)
  const inputImage = useRef(null)

  const onAddInterviewMentor = async (accordion) => {
    try {
      const newInterview = {
        mentorLogoUrl: '',
        mentorName: '',
        mentorDescription: [],
        accordionId: accordion.id
      }

      const response = await axiosInstance.post(
        '/manageJournals/interviewed-mentors',
        newInterview
      )
      const createdInterviewedMentor = response.data

      setSelectedAccordion({
        ...selectedAccordion,
        interviewedMentor: createdInterviewedMentor
      })
    } catch (error) {
      console.error('Error creating interviewed mentor:', error)
    }
  }

  const onSaveMentorInfo = async () => {
    try {
      const putResponse = await axiosInstance.put(
        `/manageJournals/interviewed-mentors/${selectedAccordion.interviewedMentor.id}`,
        {
          mentorDescription:
            selectedAccordion?.interviewedMentor?.mentorDescription,
          mentorName: selectedAccordion?.interviewedMentor?.mentorName
        }
      )

      setSelectedAccordion({
        ...selectedAccordion,
        interviewedMentor: {
          ...selectedAccordion?.interviewedMentor,
          mentorDescription: putResponse.data
        }
      })
      toast.success('Mentor info saved')
      return putResponse
    } catch (error) {
      console.error('Error saving description:', error)
      toast.error('Mentor occurred during saving mentor info')
    }
  }

  const onChangeDescription = (description) => {
    const updatedAccordion = { ...selectedAccordion }
    if (!updatedAccordion.interviewedMentor) {
      updatedAccordion.interviewedMentor = {}
    }
    if (!updatedAccordion.interviewedMentor.mentorDescription) {
      updatedAccordion.interviewedMentor.mentorDescription = []
    }
    updatedAccordion.interviewedMentor.mentorDescription = description

    setSelectedAccordion(updatedAccordion)
  }

  const onChangeMentorName = (e) => {
    const updatedAccordion = { ...selectedAccordion }

    updatedAccordion.interviewedMentor.mentorName = e.target.value

    setSelectedAccordion(updatedAccordion)
  }

  const getInterviewColumns = ({ onEdit, onDelete, onView }) => [
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ row }) => {
        return <div>{row.original?.description}</div>
      }
    },
    {
      Header: 'Interview',
      accessor: 'interview',
      Cell: ({ row }) => {
        return (
          <button
            onClick={() => onView?.(row.original?.interview)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            <FaEye size={20} color='#51c7df' />
          </button>
        )
      }
    },
    {
      Header: 'Part',
      accessor: 'part',
      Cell: ({ row }) => {
        if (row?.original?.part === 'part-1') {
          return 'Part 1'
        } else if (row?.original?.part === 'part-2') {
          return 'Part 2'
        }
      }
    },

    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div>
          <button
            onClick={() => onEdit?.(row.original)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            <FaEdit size={20} color='#99CC33' />
          </button>
          <button
            onClick={() => onDelete?.(row.original)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaTrash size={20} color='#FE43A1' />
          </button>
        </div>
      )
    }
  ]
  const onViewInterview = (interview) => {
    setVideo(interview)
  }

  const onSaveInterview = async (interview, mentor) => {
    const newInterview = {
      interviewId: interview.interviewId,
      part: interview.part,
      description: interview.description,
      mentorId: mentor.id
    }
    const response = await axiosInstance.post(
      '/manageJournals/mentor-interview',
      newInterview
    )
    handleHideInterviewModal()
    setSelectedAccordion((prevState) => ({
      ...prevState,
      interviewedMentor: {
        ...prevState.interviewedMentor,
        interviews: [
          ...(prevState.interviewedMentor?.interviews || []),
          response.data
        ]
      }
    }))
  }
  const onUpdateInterview = async (interview, mentor) => {
    const updatedInterview = {
      interviewId: interview.interviewId,
      part: interview.part,
      description: interview.description,
      mentorId: mentor.id
    }
    try {
      const response = await axiosInstance.put(
        `/manageJournals/mentor-interview/${interview.id}`,
        updatedInterview
      )
      handleHideInterviewModal()

      const interviewIndex = mentor.interviews.findIndex(
        (interview) => interview.id === response.data.id
      )

      if (interviewIndex !== -1) {
        const updatedInterviews = [...mentor.interviews]
        updatedInterviews[interviewIndex] = response.data

        setSelectedAccordion((prevState) => ({
          ...prevState,
          interviewedMentor: {
            ...prevState.interviewedMentor,
            interviews: updatedInterviews
          }
        }))
      }
    } catch (error) {
      console.error(error)
      // Handle error
    }
  }

  const onDeleteInterview = async (interview) => {
    try {
      await axiosInstance.delete(
        `/manageJournals/mentor-interview/${interview.id}`
      )

      setSelectedAccordion((prevState) => ({
        ...prevState,
        interviewedMentor: {
          ...prevState.interviewedMentor,
          interviews: prevState.interviewedMentor.interviews.filter(
            (item) => item.id !== interview.id
          )
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ModalWrapper onHide={props.onHide} show={props.show} title={props.title}>
      <>
        <div className={'col-md-12'}>
          {selectedAccordion && (
            <>
              <div className={'my-2'}>
                <strong className={'me-2'}>Accordion title:</strong>
                {selectedAccordion?.title}
              </div>
              {!selectedAccordion?.interviewedMentor && (
                <LtsButton
                  name={'Add interviewed mentor'}
                  width={'40%'}
                  align={'end'}
                  onClick={() => onAddInterviewMentor(selectedAccordion)}
                />
              )}
              {selectedAccordion?.interviewedMentor && (
                <>
                  <div>
                    {selectedAccordion?.interviewedMentor && (
                      <>
                        {selectedAccordion?.interviewedMentor?.mentorLogoUrl
                          ?.length > 0 ? (
                          <label
                            className={'upload-image-box p-0 '}
                            onClick={() => inputImage.current.click()}
                          >
                            <input
                              ref={inputImage}
                              onChange={(event) =>
                                imageUpload(event.target.files[0])
                              }
                              accept='image/*'
                              type='file'
                              className='d-none h-100'
                            />
                            <img
                              src={
                                selectedAccordion?.interviewedMentor
                                  ?.mentorLogoUrl
                                  ? selectedAccordion?.interviewedMentor
                                      ?.mentorLogoUrl
                                  : selectedImage
                              }
                              style={{
                                width: '100%',
                                height: '100%'
                              }}
                              alt='Thumb'
                            />
                          </label>
                        ) : (
                          <label
                            className={'upload-image-box '}
                            onClick={() => inputImage.current.click()}
                          >
                            <input
                              ref={inputImage}
                              onChange={(event) =>
                                imageUpload(event.target.files[0])
                              }
                              accept='image/*'
                              type='file'
                              className='d-none h-100'
                            />

                            <div
                              className={
                                'border-dashed d-flex align-items-center flex-column justify-content-between py-3 px-2 '
                              }
                            >
                              <div className={'upload-image_box-title'}>
                                Mentor Logo
                              </div>
                              <SlCloudUpload
                                className={'upload-to-cloud_logo'}
                              />

                              <div className={'upload-image_click-here'}>
                                Click to upload file
                              </div>
                            </div>
                          </label>
                        )}
                      </>
                    )}
                  </div>
                  <div className={'row'}>
                    <div className={'col-md-8'}>
                      <label>
                        Mentor name:
                        <input
                          value={
                            selectedAccordion?.interviewedMentor?.mentorName
                          }
                          onChange={onChangeMentorName}
                          placeholder={'Mentor name'}
                          className={'ms-2'}
                          style={{ height: 40 }}
                        />
                      </label>
                      <MentorDescription
                        description={
                          selectedAccordion?.interviewedMentor
                            ?.mentorDescription
                        }
                        onChange={onChangeDescription}
                      />

                      <LtsButton
                        name={'Save Info'}
                        onClick={onSaveMentorInfo}
                        align={'start'}
                        width={'40%'}
                      />
                    </div>
                    <div className={'col-md-12'}>
                      <LtsButton
                        onClick={handleShowInterviewModal}
                        name={`Add new interview`}
                        align={'end'}
                        width={'30%'}
                      />
                      <ReactTable
                        // data={selectedAccordion?.interviewedMentor?.interviews}
                        data={selectedAccordion?.interviewedMentor?.interviews?.sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )}
                        getColumns={getInterviewColumns}
                        onAdd={handleShowInterviewModal}
                        onView={onViewInterview}
                        onEdit={(interview) => {
                          handleShowInterviewModal()
                          setEditingInterview(interview)
                        }}
                        onDelete={(interview) => {
                          onDeleteInterview(interview)
                        }}
                      />
                      {showInterviewModal && (
                        <InterviewModal
                          show={showInterviewModal}
                          onHide={() => {
                            handleHideInterviewModal()
                            setEditingInterview(null)
                          }}
                          onSave={(interview) =>
                            onSaveInterview(
                              interview,
                              selectedAccordion?.interviewedMentor
                            )
                          }
                          onUpdate={(interview) => {
                            onUpdateInterview(
                              interview,
                              selectedAccordion?.interviewedMentor
                            )
                          }}
                          editingInterview={editingInterview}
                          title={'Update interview'}
                        />
                      )}
                      <MediaLightbox
                        video={video}
                        show={!!video}
                        onClose={() => setVideo(false)}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </>
    </ModalWrapper>
  )
}

export default InterviewedMentorModal

const MentorDescription = (props) => {
  const [newDescription, setNewDescription] = useState('')
  const [description, setDescription] = useState([])
  const [editIndex, setEditIndex] = useState(null) // Track the index of the description being edited

  // console.log('description', description)
  useEffect(() => {
    if (props.description) setDescription(props.description)
  }, [])

  useEffect(() => {
    props.onChange(description)
  }, [description])

  const handleAddDescription = () => {
    if (newDescription.trim() === '') {
      return
    }

    const updatedDescription = [
      ...description,
      { title: newDescription.trim() }
    ]
    props.onAddDescription?.(updatedDescription)
    setDescription(updatedDescription)
    setNewDescription('')
  }

  const handleEditDescription = (index) => {
    setEditIndex(index)
    setNewDescription(description[index].title)
  }

  const handleSaveEdit = () => {
    const updatedDescription = [...description]
    updatedDescription[editIndex].title = newDescription.trim()
    props.onAddDescription?.(updatedDescription)
    setDescription(updatedDescription)
    setEditIndex(null)
    setNewDescription('')
  }

  return (
    <div>
      {editIndex === null && (
        <div className={'row my-2'}>
          <div className={'col-md-12'}>
            <div className={'row'}>
              <div className={'col-md-6'}>
                <input
                  type='text'
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder='Enter new description'
                  className={'h-100 w-100 me-1'}
                />
              </div>
              <div className={'col-md-6'}>
                <LtsButton
                  onClick={handleAddDescription}
                  name={'Add description'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={'mt-2 mb-1'}>List of mentor description:</div>

      <ul className={'my-2'} style={{ paddingLeft: 0, listStyle: 'none' }}>
        {description &&
          description.map((desc, index) => (
            <li
              key={index}
              onClick={() => handleEditDescription(index)}
              style={{ cursor: 'pointer' }}
              className={'my-2'}
            >
              {editIndex === index ? (
                <input
                  type='text'
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  onBlur={handleSaveEdit}
                  style={{
                    outline: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px'
                  }}
                />
              ) : (
                <div
                  style={{
                    outline: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    height: 30
                  }}
                >
                  {desc.title}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}
