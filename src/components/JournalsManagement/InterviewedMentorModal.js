import React, { useEffect, useRef, useState } from 'react'
import ModalWrapper from '../Modals/Spotlight/ModalWrapper'
import LtsButton from '../LTSButtons/LTSButton'
import { SlCloudUpload } from 'react-icons/sl'
import ReactTable from '../ReactTable/ReactTable'
import InterviewModal from './InterviewModal'
import MediaLightbox from '../MediaLightbox'
import { v4 as uuidv4 } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { readFile } from '../../utils/canvasUtils'
import { setImageCropperData } from '../../redux'
import { components } from 'react-select'
import searchIcon from '../../assets/images/search-icon.png'

function InterviewedMentorModal(props) {
  const { selectedAccordion, setSelectedAccordion } = props

  // console.log('selectedAccordion')

  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)
  const randomUUID = uuidv4()
  const [openAccordion, setOpenAccordion] = useState(null)
  const [accordions, setAccordions] = useState([])
  const [newAccordions, setNewAccordions] = useState([])
  // const [selectedAccordion, setSelectedAccordion] = useState({})
  const [selectedInterview, setSelectedInterview] = useState({})
  const [video, setVideo] = useState(null)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [editingInterview, setEditingInterview] = useState(null)

  console.log('editingInterview', editingInterview)

  useEffect(() => {
    if (editingInterview) handleShowInterviewModal()
  }, [editingInterview])
  const handleShowInterviewModal = () => {
    // console.log('rowData', rowData)
    // setEditingInterview(rowData)
    setShowInterviewModal(true)
  }
  const handleHideInterviewModal = () => {
    setShowInterviewModal(false)
  }

  // console.log('selectedAccordion', selectedAccordion)

  useEffect(() => {
    getJournals2()
  }, [])

  useEffect(() => {
    if (selectedJournal.value?.ltsJournalAccordions)
      setAccordions(selectedJournal.value?.ltsJournalAccordions)
  }, [selectedJournal.value?.ltsJournalAccordions])
  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  useEffect(() => {
    if (journals?.length) {
      setJournalOptions(
        journals
          .map((journal, index) => {
            return {
              label:
                `${journal.category ? journal.category : ''}` +
                ' - ' +
                `${journal.type ? journal.type : ''}  ${
                  journal.type ? '-' : ''
                } ` +
                journal.title,
              value: journal,
              key: index
            }
          })
          .sort((a, b) => {
            if (a.value.category && b.value.category) {
              return a.value.category.localeCompare(b.value.category)
            }
          })
      )
    }
  }, [journals])

  const handleJournalSelect = (e) => {
    setSelectedJournal({
      value: e.value,
      label: e.label
    })

    // setBreakdowns(
    //   e.value?.breakdowns
    //     ?.slice()
    //     ?.sort((a, b) => a?.breakdownOrder - b?.breakdownOrder)
    // )
  }

  const handleJournalPart = (e) => {
    setSelectedJournal({
      value: e.value,
      label: e.label
    })

    // setBreakdowns(
    //   e.value?.breakdowns
    //     ?.slice()
    //     ?.sort((a, b) => a?.breakdownOrder - b?.breakdownOrder)
    // )
  }
  const history = useHistory()

  useEffect(() => {
    const journalId = selectedJournal?.value?.id
    if (journalId && selectedJournal?.value?.type) {
      const url = `/edit-mentorship-journal/${selectedJournal?.value?.type}/${journalId}`
      history.push(url)
    }
  }, [selectedJournal?.value?.id])

  const getJournals2 = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions')
      .then(({ data }) => {
        setJournals(data.filter((data) => data.category === 'my-mentorship'))
        setFetchingJournals(false)
      })
      .catch((e) => e)
  }

  const { journalId, type } = useParams()

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(`LtsJournals/${journalId}/editJournal2`, {
        paragraph: selectedJournal?.value?.paragraph
      })
      .then((res) => {
        setJournals(
          journals.map((journal) =>
            res.data.id === journal.id ? res.data : journal
          )
        )
        setSelectedJournal((prevState) => ({
          ...prevState,
          value: res.data?.updatedJournal?.journal
        }))
        toast.success('Journal modified successfully!')
        setLoading(false)
      })
      .catch((err) => {
        toast.error('An error occurred, please try again!')
        setLoading(false)
      })
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

      // Update mentorLogoUrl using a PUT request
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

  const handleJournalUpdate = (event) => {
    const { name, value } = event.target

    setSelectedJournal((prevState) => ({
      ...prevState,
      value: { ...prevState.value, [name]: value }
    }))
  }

  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState('')

  const general = useSelector((state) => state.general)
  const inputImage = useRef(null)
  const imageChange = async (e) => {
    const file = e.target.files[0]
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 0.5) {
        return toast.error('Image size exceeds 512KB.')
      }

      var img = document.createElement('img')

      var reader = new FileReader()
      reader.onloadend = function (ended) {
        img.src = ended.target.result
        const formData = new FormData()
        formData.append('image', ended.target.result)
      }

      reader.readAsDataURL(e.target.files[0])
      img.onload = async function () {
        if (this.width < 120 || this.height < 100) {
          return toast.error('Minimum required format: 120x100px.')
        } else {
          // setExperienceData((prevValues) => ({
          //   ...prevValues,
          //   image_url: null
          // }))

          let imageData = await readFile(file)
          dispatch(setImageCropperData(imageData))
          previewImage(file)
        }
      }
    }
  }

  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      setSelectedImage(reader.result)
    }
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <img
              src={searchIcon}
              alt="#"
              style={{
                color: '#333d3d',
                height: '25px',
                width: '25px',
                position: 'absolute',
                left: '10px'
                // cursor: 'pointer'
              }}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }
  useEffect(() => {
    if (selectedJournal.value?.ltsJournalAccordions)
      setAccordions(selectedJournal.value?.ltsJournalAccordions)
  }, [selectedJournal.value?.ltsJournalAccordions])
  const onAddAccordion = () => {
    setNewAccordions([
      ...newAccordions,
      { title: '', journalId: selectedJournal?.value?.id }
    ])
  }
  const onAddInterviewMentor = async (accordion) => {
    // debugger
    try {
      const newInterview = {
        mentorLogoUrl: '',
        mentorDescription: [{ title: '' }],
        accordionId: accordion.id
      }

      // Make the API call to create a new interviewed mentor
      const response = await axiosInstance.post(
        '/manageJournals/interviewed-mentors',
        newInterview
      )
      const createdInterviewedMentor = response.data
      // debugger

      // Update state with the new interviewed mentor
      setSelectedAccordion({
        ...selectedAccordion,
        interviewedMentor: createdInterviewedMentor
      })

      // Optionally, you can do something with the response or handle success
      console.log('New interviewed mentor created:', createdInterviewedMentor)
    } catch (error) {
      // Handle errors from the API call
      console.error('Error creating interviewed mentor:', error)
    }
  }

  const onAddInterview = async (mentor) => {
    try {
      const newInterview = {
        part: 'part-1',
        description: '',
        mentorId: mentor.id
      }

      // Send POST request to backend route
      const response = await axiosInstance.post(
        '/manageJournals/mentor-interview',
        newInterview
      )
      // Assuming the response contains the created interview data, update the state
      setSelectedAccordion((prevState) => ({
        ...prevState,
        interviewedMentor: {
          ...prevState.interviewedMentor,
          interviews: [...prevState.interviewedMentor.interviews, response.data]
        }
      }))

      console.log('Interview added successfully:', response.data)
    } catch (error) {
      console.error('Error adding interview:', error)
    }
  }

  const onSaveAccordion = async (accordion, indexToRemove) => {
    // debugger
    await axiosInstance
      .post('/ltsJournals/journals-descriptions/accordions', {
        journalId: selectedJournal?.value?.id,
        title: accordion.title
      })
      .then(({ data }) => {
        const updatedAccordions = newAccordions.filter(
          (_, index) => index !== indexToRemove
        )
        setNewAccordions(updatedAccordions)
        setAccordions([...accordions, data])
      })
      .catch((e) => e)
  }

  const onChangeAccordionTitles = (index, newValue) => {
    const updatedAccordions = [...newAccordions]
    updatedAccordions[index] = { ...updatedAccordions[index], title: newValue }
    setNewAccordions(updatedAccordions)
  }

  const onSaveImage = async () => {
    if (general.croppedImage) {
      try {
        const formData = new FormData()
        formData.append('img', general.croppedImage)

        const response = await axiosInstance.post(
          '/upload/img-transform',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        toast.success('Image uploaded successfully')
        return response.data.fileLocation
      } catch (err) {
        console.error(err.message)
        toast.error('Image upload failed, please try again!')
        throw err
      }
    }
  }

  const onSelectRow = (row, type) => {
    console.log(row)
    // if (type !== 'interview') {
    //   setSelectedAccordion(row)
    // } else {
    setSelectedInterview(row)
    // }
  }

  console.log('selectedAccordion', selectedAccordion)
  const onSaveDescription = async () => {
    // debugger
    try {
      const putResponse = await axiosInstance.put(
        `/manageJournals/interviewed-mentors/${selectedAccordion.interviewedMentor.id}`,
        {
          mentorDescription:
            selectedAccordion?.interviewedMentor?.mentorDescription
        }
      )

      setSelectedAccordion({
        ...selectedAccordion,
        interviewedMentor: {
          ...selectedAccordion.interviewedMentor,
          mentorDescription: putResponse.data
        }
      })
      return putResponse
      // if (putResponse && putResponse.data) {
      //   setSelectedAccordion({...selectedAccordion, interviewedMentor: {
      //     ...selectedAccordion.interviewedMentor,
      //       putResponse.data
      //     } });
      // }
    } catch (error) {
      console.error('Error saving description:', error)
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

  const getInterviewColumns = ({ onSelectRow, onEdit, onDelete, onView }) => [
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ row }) => {
        return (
          <div
            onClick={() => onSelectRow(row.original)}
            style={{ cursor: 'pointer' }}
          >
            {row.original?.description}
          </div>
        )
      }
    },
    {
      Header: 'Interview',
      accessor: 'interview',
      Cell: ({ row }) => {
        return (
          <div
            onClick={() => onView(row.original?.interview)}
            style={{ cursor: 'pointer' }}
          >
            <LtsButton name={'View'} />
          </div>
        )
      }
    },
    {
      Header: 'Part',
      accessor: 'part',
      Cell: ({ row }) => {
        return <>{row.original?.part}</>
      }
    },
    // {
    //   Header: 'Entry',
    //   accessor: 'entry',
    //   Cell: ({ row }) => {
    //     return <>{row.original?.entry?.id ? <div>1</div> : <div>0</div>}</>
    //   }
    // },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => onEdit?.(row.original)}>Edit</button>
          <button onClick={() => onDelete?.(row.original)}>Delete</button>
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
        interviews: [...prevState.interviewedMentor.interviews, response.data]
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
    <ModalWrapper onHide={props.onHide} show={props.show}>
      <>
        <div className={'col-md-6'}>
          {selectedAccordion && (
            <>
              <div>{selectedAccordion.title}</div>
              {!selectedAccordion?.interviewedMentor && (
                <LtsButton
                  name={'Add new interview'}
                  width={'30%'}
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
                            className={'upload-image-box p-0'}
                            onClick={() => inputImage.current.click()}
                          >
                            <input
                              ref={inputImage}
                              onChange={(event) =>
                                imageUpload(event.target.files[0])
                              }
                              accept="image/*"
                              type="file"
                              className="d-none h-100"
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
                              alt="Thumb"
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
                              accept="image/*"
                              type="file"
                              className="d-none h-100"
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
                    <div className={'col-md-12'}>
                      <MentorDescription
                        description={
                          selectedAccordion?.interviewedMentor
                            ?.mentorDescription
                        }
                        onChange={onChangeDescription}
                      />

                      <LtsButton
                        name={'Save Description'}
                        onClick={onSaveDescription}
                      />
                    </div>
                    <div className={'col-md-12'}>
                      <ReactTable
                        data={selectedAccordion?.interviewedMentor?.interviews}
                        getColumns={getInterviewColumns}
                        onAdd={handleShowInterviewModal}
                        onSelectRow={(data) => onSelectRow(data, 'interview')}
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
                          // isEdit={}
                        />
                      )}
                      <MediaLightbox
                        video={video}
                        // key={index}
                        show={!!video}
                        onClose={() => setVideo(false)}
                        // watchData={videoWatchData}
                        // onVideoData={saveWatchData}
                        // onVideoWatched={saveVideoWatched}
                      />
                      {/*// )}*/}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </>
      <div className={'mt-2'}>
        <LtsButton
          name={'Save'}
          align={'end'}
          width={'20%'}
          // onClick={() => {
          //   if (!validateInputs()) {
          //     return
          //   } else {
          //     !isEdit()
          //       ? props.onSave?.(interview)
          //       : props.onUpdate?.(interview)
          //   }
          // }}
        />
      </div>
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
    setNewDescription(description[index].title) // Set the input value to the selected description
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
      <ul>
        {description &&
          description.map((desc, index) => (
            <li key={index} onClick={() => handleEditDescription(index)}>
              {editIndex === index ? (
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  onBlur={handleSaveEdit}
                />
              ) : (
                desc.title
              )}
            </li>
          ))}
      </ul>
      {editIndex === null && (
        <div>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new description"
          />
          <button onClick={handleAddDescription}>Add Description</button>
        </div>
      )}
    </div>
  )
}
