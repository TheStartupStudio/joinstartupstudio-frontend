import React, { useEffect, useMemo, useRef, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faPlay } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import './index.css'
import searchIcon from '../../assets/images/search-icon.png'
import copy from '../../assets/images/copy.svg'
import 'react-quill/dist/quill.snow.css'
import KendoTextEditor from './TextEditor'
import { EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import { v4 as uuidv4 } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import PositionSelector from '../PositionSelector/PositionSelector'
import CustomContent from './CustomContent/CustomContent'
import AccordionItemWrapper from '../../pages/LtsJournal/AccordionItemWrapper'
import LtsButton from '../LTSButtons/LTSButton'
import { useDispatch, useSelector } from 'react-redux'
import { readFile } from '../../utils/canvasUtils'
import { setImageCropperData } from '../../redux'
import { SlCloudUpload } from 'react-icons/sl'
import ImageCropper from '../ImageCropper'
import { ReflectionInfoBox } from '../Modals/ReflectionInfoBox'
import LtsJournalReflection from '../../pages/LtsJournal/reflection'
import ReactTable from '../ReactTable/ReactTable'
import MediaLightbox from '../MediaLightbox'

export default function MentorshipJournal(props) {
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
  const [selectedAccordion, setSelectedAccordion] = useState({})
  const [selectedInterview, setSelectedInterview] = useState({})
  const [video, setVideo] = useState(null)

  // console.log('selectedJournal', selectedJournal)
  // console.log('accordions', accordions)
  console.log('selectedAccordion', selectedAccordion)
  const [interviewParts, setInterviewParts] = useState([
    {
      value: '',
      label: 'part-1'
    },
    {
      value: '',
      label: 'part-2'
    }
  ])

  useEffect(() => {
    getJournals2()
  }, [])

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
          interviewedMentor: putResponse.data
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
          debugger
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
      debugger
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
        // debugger
        const updatedAccordions = newAccordions.filter(
          (_, index) => index !== indexToRemove
        )
        setNewAccordions(updatedAccordions)
        setAccordions([...accordions, data])
        // setSelectedJournal((prevSelectedJournal) => ({
        //   ...prevSelectedJournal,
        //   value: {
        //     ...prevSelectedJournal?.value,
        //     ltsJournalAccordions: [
        //       ...prevSelectedJournal?.value?.ltsJournalAccordions,
        //       data
        //     ]
        //   }
        // }))
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

  const onSaveData = async () => {
    // try {
    //   // const imageUrl = await onSaveImage()
    //   const imageUrl = '';
    //   return imageUrl
    //
    //   // let newWorkExperienceData = { ...workExperienceData }
    //   // newWorkExperienceData.imageUrl = imageUrl
    //   // setWorkExperienceData(newWorkExperienceData)
    //
    //   // const existImageUrl = typeof imageUrl !== undefined && imageUrl !== null
    //   // if (existImageUrl) props.onSave?.(newWorkExperienceData)
    //   else {
    //     toast.error('You need to upload an organization logo')
    //   }
    // } catch (error) {
    //   console.error(error.message)
    // }
  }

  const videoUpload = async (video) => {
    // setVideoUploadingLoader(true);
    const formData = new FormData()
    formData.append('video', video)
    console.log('formData', formData)
    debugger
    try {
      const uploadedVideo = await axiosInstance.post(
        '/upload/journal-video/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const createContentData = {
        url: uploadedVideo.data.fileLocation,

        thumbnail: '',
        description: '',
        subtitle: '',
        type: 'video',
        title: ''
      }
      debugger

      const createdContent = await axiosInstance.post(
        '/contents/',
        createContentData
      )

      debugger
      // setVideoUploadingLoader(false);
      // debugger;
      // setUploadedVideoUrl(response.data.fileLocation);
      toast.success('Video uploaded successfully!')
    } catch (error) {
      // setVideoUploadingLoader(false);
      toast.error('Video upload failed, please try again!')
    }
  }
  const onSelectRow = (row, type) => {
    console.log(row)
    if (type !== 'interview') {
      setSelectedAccordion(row)
    } else {
      setSelectedInterview(row)
    }
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

      debugger
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

  const getColumns = ({ onSelectRow, handleEdit, handleDelete }) => [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ row }) => {
        // console.log(row)
        return (
          <div
            onClick={() => onSelectRow(row.original)}
            style={{ cursor: 'pointer' }}
          >
            {row.original.title}
          </div>
        )
      }
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ value }) => (
        <div>
          <button onClick={() => handleEdit(value)}>Edit</button>
          <button onClick={() => handleDelete(value)}>Delete</button>
        </div>
      )
    }
  ]
  const getInterviewColumns = ({
    onSelectRow,
    handleEdit,
    handleDelete,
    onView
  }) => [
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
      Header: 'Entry',
      accessor: 'entry',
      Cell: ({ row }) => {
        return <>{row.original?.entry?.id ? <div>1</div> : <div>0</div>}</>
      }
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ value }) => (
        <div>
          <button onClick={() => handleEdit(value)}>Edit</button>
          <button onClick={() => handleDelete(value)}>Delete</button>
        </div>
      )
    }
  ]
  const onViewInterview = (interview) => {
    setVideo(interview)
  }

  console.log(selectedAccordion?.interviewedMentor?.mentorLogoUrl?.length > 0)
  console.log(selectedAccordion?.interviewedMentor?.mentorLogoUrl)
  console.log(selectedAccordion?.interviewedMentor)
  console.log(selectedImage?.length > 0)
  return (
    <div>
      {!fetchingJournals ? (
        <div className="row">
          <div className="col-9">
            <Select
              value={
                selectedJournal?.label
                  ? { label: selectedJournal?.label }
                  : {
                      label: 'SEARCH JOURNALS BY NAME OR CATEGORY'
                    }
              }
              onChange={handleJournalSelect}
              options={journalOptions}
              placeholder={'SEARCH FOR A JOURNAL'}
              // openMenuOnClick={false}
              // isDisabled={selectDisabled}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                outLine: 'none',
                colors: {
                  ...theme.colors,
                  // primary25: 'hotpink',
                  primary: '#e4e4e4',
                  neutral0: '#e4e4e4',
                  opacity: 1,
                  zIndex: 100
                },
                spacing: {
                  ...theme.spacing,
                  controlHeight: 32
                },
                zIndex: 100
              })}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  boxShadow: 'none',
                  border: 'none',
                  fontSize: '14px',
                  height: '50px'
                }),
                menu: (base) => ({
                  ...base,
                  border: 'none',
                  boxShadow: 'none',
                  fontSize: '14px'
                }),
                valueContainer: (base) => ({
                  ...base,
                  paddingLeft: 50
                })
              }}
              components={{
                ValueContainer,
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null
              }}
              classNamePrefix="vyrill"
              // autoFocus={false}
            />
          </div>
          <div className="col-3 image-upload-widget d-flex align-items-center">
            <label htmlFor="file-input" className="d-flex m-0 p-0">
              <FontAwesomeIcon
                icon={faFileUpload}
                style={{
                  color: '#333d3d',
                  height: '30px',
                  width: '30px',
                  cursor: 'pointer'
                }}
              />
            </label>

            {imageUploadingLoader && (
              <p style={{ color: '#01c5d1' }} className="ms-2 p-0 my-auto">
                Uploading image, please wait!
              </p>
            )}

            {!uploadedImageUrl && !imageUploadingLoader && (
              <p className="ms-2 p-0 my-auto" style={{ color: '#707070' }}>
                Upload image to generate html
              </p>
            )}

            {uploadedImageUrl && !imageUploadingLoader && (
              <span
                className="input-group-text bg-transparent text-dark ms-2 w-100 justify-content-center"
                style={{ borderLeft: '0px !important' }}
                onClick={() => {
                  toast.success(
                    'HTML Code Copied, you can paste it on the journal content!'
                  )
                  navigator.clipboard.writeText(
                    `<img src='${uploadedImageUrl}' class='w-100'><br>`
                  )
                }}
              >
                <span
                  className="copy-portfolio-span"
                  style={{ fontSize: '15px' }}
                >
                  Copy Generated Html Code
                  <img src={copy} width="22px" alt="#" className="ms-2" />
                </span>
              </span>
            )}

            <input
              type="file"
              name="myImage"
              className="d-none"
              id="file-input"
              disabled={imageUploadingLoader}
              onChange={(event) => {
                // setSelectedImage(event.target.files[0]);
                imageUpload(event.target.files[0])
              }}
            />
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-column mt-5 pt-5">
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p style={{ color: '#01c5d1' }}>Loading journals, please wait!</p>
        </div>
      )}
      {selectedJournal && (
        <div className={'row'}>
          <div className="mt-2 col-md-6">
            <div>Title</div>
            <input
              type="text"
              className="w-100 p-2"
              name="title"
              value={selectedJournal?.value?.title}
              onChange={handleJournalUpdate}
            />
            {accordions && accordions?.length && (
              <>
                <ReactTable
                  data={accordions}
                  getColumns={getColumns}
                  onAdd={onAddAccordion}
                  onSelectRow={onSelectRow}
                />
                {/*{selectedInterview}*/}
              </>
            )}

            {/*{accordions && accordions?.length*/}
            {/*  ? accordions?.map((accordion, index) => (*/}
            {/*      <div className="col-12 mt-2">*/}
            {/*        <AccordionItemWrapper*/}
            {/*          isOpened={openAccordion === `accordion-${accordion.id}`}*/}
            {/*          handleAccordionClick={() =>*/}
            {/*            handleAccordionClick(`accordion-${accordion.id}`)*/}
            {/*          }*/}
            {/*          isExanded={false}*/}
            {/*          title={accordion.title}*/}
            {/*        >*/}
            {/*          {openAccordion === `accordion-${accordion.id}` && (*/}
            {/*            <>*/}
            {/*              {accordion.interviewedMentor ? (*/}
            {/*                <React.Fragment>*/}
            {/*                  <div className={'row'}>*/}
            {/*                    <div className={'col-md-4'}>*/}
            {/*                      <div className="upload-organization-logo p-0 mb-1">*/}
            {/*                        {general.imageCropperData ? (*/}
            {/*                          <div*/}
            {/*                            // className="img-placeholder position-relative"*/}
            {/*                            className="img-placeholder position-relative"*/}
            {/*                            style={{ height: '150px' }}*/}
            {/*                          >*/}
            {/*                            <img*/}
            {/*                              src={*/}
            {/*                                // data.imageUrl*/}
            {/*                                //   ? data.imageUrl*/}
            {/*                                //   :*/}
            {/*                                selectedImage*/}
            {/*                              }*/}
            {/*                              style={{*/}
            {/*                                width: '100%',*/}
            {/*                                height: '100%'*/}
            {/*                              }}*/}
            {/*                              alt="Thumb"*/}
            {/*                            />*/}
            {/*                          </div>*/}
            {/*                        ) : (*/}
            {/*                          <>*/}
            {/*                            {selectedImage ? (*/}
            {/*                              <img*/}
            {/*                                src={*/}
            {/*                                  // data.imageUrl*/}
            {/*                                  //   ? data.imageUrl*/}
            {/*                                  //   :*/}
            {/*                                  selectedImage*/}
            {/*                                }*/}
            {/*                                style={{*/}
            {/*                                  width: '100%',*/}
            {/*                                  height: '100%'*/}
            {/*                                }}*/}
            {/*                                alt="Thumb"*/}
            {/*                              />*/}
            {/*                            ) : (*/}
            {/*                              <label*/}
            {/*                                className={'upload-image-box '}*/}
            {/*                                onClick={() =>*/}
            {/*                                  inputImage.current.click()*/}
            {/*                                }*/}
            {/*                              >*/}
            {/*                                <input*/}
            {/*                                  ref={inputImage}*/}
            {/*                                  onChange={imageChange}*/}
            {/*                                  accept="image/*"*/}
            {/*                                  type="file"*/}
            {/*                                  className="d-none h-100"*/}
            {/*                                />*/}

            {/*                                <div*/}
            {/*                                  className={*/}
            {/*                                    'border-dashed d-flex align-items-center flex-column justify-content-between py-3 px-2 '*/}
            {/*                                  }*/}
            {/*                                >*/}
            {/*                                  <div*/}
            {/*                                    className={*/}
            {/*                                      'upload-image_box-title'*/}
            {/*                                    }*/}
            {/*                                  >*/}
            {/*                                    Mentor Logo*/}
            {/*                                  </div>*/}
            {/*                                  <SlCloudUpload*/}
            {/*                                    className={'upload-to-cloud_logo'}*/}
            {/*                                  />*/}

            {/*                                  <div*/}
            {/*                                    className={*/}
            {/*                                      'upload-image_click-here'*/}
            {/*                                    }*/}
            {/*                                  >*/}
            {/*                                    Click to upload file*/}
            {/*                                  </div>*/}
            {/*                                </div>*/}
            {/*                              </label>*/}
            {/*                            )}*/}
            {/*                          </>*/}
            {/*                        )}*/}
            {/*                      </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={'col-md-8'}>*/}
            {/*                      {accordion?.interviewedMentor?.podcasts?.map(*/}
            {/*                        (podcast, index) => {*/}
            {/*                          return (*/}
            {/*                            <div>*/}
            {/*                              <div*/}
            {/*                                className={*/}
            {/*                                  'd-flex gap-1 align-items-center'*/}
            {/*                                }*/}
            {/*                              >*/}
            {/*                                /!*<FontAwesomeIcon*!/*/}
            {/*                                /!*  icon={faPlay}*!/*/}
            {/*                                /!*  onClick={() => {*!/*/}
            {/*                                /!*    // data.url(data.data.url)*!/*/}
            {/*                                /!*    // // data.url(data.data.url)*!/*/}
            {/*                                /!*    // data.setAudioPlaying(true)*!/*/}
            {/*                                /!*    // setSong(data.data.url)*!/*/}
            {/*                                /!*    // handlePlayPause()*!/*/}
            {/*                                /!*  }}*!/*/}
            {/*                                /!*  style={{*!/*/}
            {/*                                /!*    fontSize: '17px',*!/*/}
            {/*                                /!*    color: 'rgb(153, 204, 51)'*!/*/}
            {/*                                /!*  }}*!/*/}
            {/*                                /!*></FontAwesomeIcon>*!/*/}

            {/*                                <div>*/}
            {/*                                  <input*/}
            {/*                                    type="file"*/}
            {/*                                    accept="video/*"*/}
            {/*                                    onChange={(e) =>*/}
            {/*                                      videoUpload(e.target.files[0])*/}
            {/*                                    }*/}
            {/*                                  />*/}
            {/*                                  /!*{uploadedVideoUrl && (*!/*/}
            {/*                                  /!*  <div>*!/*/}
            {/*                                  /!*    <video*!/*/}
            {/*                                  /!*      controls*!/*/}
            {/*                                  /!*      src={uploadedVideoUrl}*!/*/}
            {/*                                  /!*      width="320"*!/*/}
            {/*                                  /!*      height="240"*!/*/}
            {/*                                  /!*    >*!/*/}
            {/*                                  /!*      Your browser does not support*!/*/}
            {/*                                  /!*      the video tag.*!/*/}
            {/*                                  /!*    </video>*!/*/}
            {/*                                  /!*  </div>*!/*/}
            {/*                                  /!*)}*!/*/}
            {/*                                  /!*{videoUploadingLoader && (*!/*/}
            {/*                                  /!*  <div>Loading...</div>*!/*/}
            {/*                                  /!*)}*!/*/}
            {/*                                </div>*/}

            {/*                                <div>Podcast title:</div>*/}
            {/*                                <input*/}
            {/*                                  type={'text'}*/}
            {/*                                  value={podcast.podcastUrl}*/}
            {/*                                  onChange={(e) =>*/}
            {/*                                    onChangeAccordionTitles(*/}
            {/*                                      index,*/}
            {/*                                      e.target.value*/}
            {/*                                    )*/}
            {/*                                  }*/}
            {/*                                  className={*/}
            {/*                                    'w-100 py-2 px-3 mt-2 text-uppercase'*/}
            {/*                                  }*/}
            {/*                                  style={{*/}
            {/*                                    // background: '#3c3c3c',*/}
            {/*                                    // color: '#fff',*/}
            {/*                                    font: 'normal normal 600 16px / 22px Montserrat'*/}
            {/*                                  }}*/}
            {/*                                />*/}
            {/*                                /!*{podcast.videoUrl}*!/*/}
            {/*                              </div>*/}
            {/*                              /!*<LtsJournalReflection />*!/*/}
            {/*                              /!*<div>{podcast}</div>*!/*/}
            {/*                            </div>*/}
            {/*                          )*/}
            {/*                        }*/}
            {/*                      )}*/}
            {/*                      <LtsButton*/}
            {/*                        name={'Add new podcast'}*/}
            {/*                        width={'30%'}*/}
            {/*                        align={'end'}*/}
            {/*                        onClick={() => onAddPodcastReflection(index)}*/}
            {/*                      />*/}
            {/*                    </div>*/}
            {/*                  </div>*/}
            {/*                </React.Fragment>*/}
            {/*              ) : (*/}
            {/*                <></>*/}
            {/*              )}*/}

            {/*              <LtsButton*/}
            {/*                name={'Add new interview'}*/}
            {/*                width={'30%'}*/}
            {/*                align={'end'}*/}
            {/*                onClick={() => onAddInterviewMentor(index)}*/}
            {/*              />*/}
            {/*            </>*/}
            {/*          )}*/}
            {/*        </AccordionItemWrapper>*/}
            {/*      </div>*/}
            {/*    ))*/}
            {/*  : null}*/}
            {/*<div>*/}
            {/*  {newAccordions.map((accordion, index) => {*/}
            {/*    return (*/}
            {/*      <React.Fragment>*/}
            {/*        <input*/}
            {/*          type={'text'}*/}
            {/*          value={accordion.title}*/}
            {/*          onChange={(e) =>*/}
            {/*            onChangeAccordionTitles(index, e.target.value)*/}
            {/*          }*/}
            {/*          className={'w-100 py-2 px-3 mt-2 text-uppercase'}*/}
            {/*          style={{*/}
            {/*            background: '#3c3c3c',*/}
            {/*            color: '#fff',*/}
            {/*            font: 'normal normal 600 16px / 22px Montserrat'*/}
            {/*          }}*/}
            {/*        />*/}
            {/*        <div className={'mt-2'}>*/}
            {/*          <LtsButton*/}
            {/*            name={'Save'}*/}
            {/*            width={'30%'}*/}
            {/*            align={'end'}*/}
            {/*            onClick={() => onSaveAccordion(accordion, index)}*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      </React.Fragment>*/}
            {/*    )*/}
            {/*  })}*/}
            {/*</div>*/}
            {/*<div className={'mt-2'}>*/}
            {/*  <LtsButton*/}
            {/*    name={'Add new accordion'}*/}
            {/*    width={'30%'}*/}
            {/*    align={'end'}*/}
            {/*    onClick={() => onAddAccordion()}*/}
            {/*  />*/}
            {/*</div>*/}

            <button
              className="float-end mt-2 px-md-5 save-button add-new-note-button-text"
              style={{ fontSize: '16px', height: 'auto' }}
              onClick={() => {
                return handleSubmit()
              }}
              disabled={loading}
            >
              {loading ? 'SAVING..' : 'SAVE'}
            </button>
          </div>
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
                          onClick={() => {
                            onSaveDescription()
                            // debugger
                          }}
                        />
                      </div>
                      <div className={'col-md-12'}>
                        {/*{selectedAccordion &&*/}
                        {/*  selectedAccordion?.interviewedMentor?.interviews*/}
                        {/*    ?.length > 0 && (*/}
                        <ReactTable
                          data={
                            selectedAccordion?.interviewedMentor?.interviews
                          }
                          getColumns={getInterviewColumns}
                          onAdd={() =>
                            onAddInterview(selectedAccordion?.interviewedMentor)
                          }
                          onSelectRow={(data) => onSelectRow(data, 'interview')}
                          onView={onViewInterview}
                        />
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
        </div>
      )}
    </div>
  )
}

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
