import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import './index.css'
import searchIcon from '../../assets/images/search-icon.png'
import copy from '../../assets/images/copy.svg'
import 'react-quill/dist/quill.snow.css'
import { EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import { v4 as uuidv4 } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import PositionSelector from '../PositionSelector/PositionSelector'
import CustomContent from './CustomContent/CustomContent'
import LtsButton from '../LTSButtons/LTSButton'
import ReactTable from '../ReactTable/ReactTable'
import AccordionModal from './AccordionModal'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { QuillEditorBox, TextInput } from '../../ui/ContentItems'

export default function EditAllJournals(props) {
  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)
  const [journalType, setJournalType] = useState(null)
  const [journalId, setJournalId] = useState(null)
  const [accordions, setAccordions] = useState([])
  const [selectedAccordion, setSelectedAccordion] = useState({})

  const [showAccordionModal, setShowAccordionModal] = useState(false)
  const handleShowAccordionModal = () => {
    setShowAccordionModal(true)
  }

  const handleHideAccordionModal = () => {
    setShowAccordionModal(false)
    setSelectedAccordion(null)
  }

  useEffect(() => {
    getJournalsTasks()
    getJournalsWeeks()
    getTrainings()
    getJournals()
  }, [])

  useEffect(() => {
    if (selectedJournal?.value?.ltsJournalAccordions)
      setAccordions(selectedJournal?.value?.ltsJournalAccordions)
  }, [selectedJournal?.value?.ltsJournalAccordions])

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
  }

  useEffect(() => {
    const journalId = selectedJournal?.value?.id
    if (journalId && selectedJournal?.value?.type) {
      setJournalType('journal')
      setJournalId(journalId)
      const url = `/edit-journals2/${selectedJournal?.value?.type}/${journalId}`
      // history.push(url)
    } else if (journalId) {
      setJournalId(journalId)
      setJournalType('my-training')
      const url = `/edit-journals2/my-training/${journalId}`
      // history.push(url)
    }
  }, [selectedJournal?.value?.id])

  const getJournals = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions')
      .then(({ data }) => {
        // setJournals(data.filter((d) => d.category.includes('new')))
        setJournals(data)
        setFetchingJournals(false)
      })
      .catch((e) => e)
  }

  const getTrainings = async () => {
    try {
      const response = await axiosInstance.get('/my-training/')
      setJournals((prevJournals) => [...prevJournals, ...response.data.data])
      setFetchingJournals(false)
    } catch (error) {
      console.error(error)
    }
  }

  const getJournalsTasks = async () => {
    try {
      const response = await axiosInstance.get(
        '/ltsJournals/journals-descriptions2'
      )
      const newData = response.data.map((data) => ({
        ...data,
        type: 'task'
      }))
      setJournals((prevJournals) => [...prevJournals, ...newData])
      setFetchingJournals(false)
      // setBreakdowns(data.breakdowns)
    } catch (error) {
      console.error(error)
    }
  }
  const getJournalsWeeks = async () => {
    try {
      const response = await axiosInstance.get(
        '/ltsJournals/journals-descriptions2-weeks'
      )
      const newData = response.data.map((data) => ({
        ...data,
        type: 'week'
      }))
      setJournals((prevJournals) => [...prevJournals, ...newData])
      setFetchingJournals(false)
      // setBreakdowns(data.breakdowns)
    } catch (error) {
      console.error(error)
    }
  }
  // const { journalId, type } = useParams()

  const handleSubmit = async () => {
    setLoading(true)
    if (selectedJournal.value.hasOwnProperty('type')) {
      if (!journalType?.includes('my-training')) {
        await axiosInstance
          .put(`LtsJournals/${journalId}/editJournal2`, {
            paragraph: selectedJournal?.value?.paragraph,
            title: selectedJournal?.value?.title,
            type: selectedJournal?.value?.type,
            customContent: selectedJournal?.value?.customContent,
            steps: selectedJournal?.value?.steps,
            ltsConnection: selectedJournal?.value?.ltsConnection,
            curriculumOverview: selectedJournal?.value?.curriculumOverview,
            programOpportunities: selectedJournal?.value?.programOpportunities,
            expectedOutcomes: selectedJournal?.value?.expectedOutcomes,
            studentAssignments: selectedJournal?.value?.studentAssignments
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
      } else {
        await axiosInstance
          .put(`my-training/${journalId}`, {
            openingText: selectedJournal?.value?.openingText,
            title: selectedJournal?.value?.title,
            implementationSteps: selectedJournal?.value?.implementationSteps,
            pedagogyOptions: selectedJournal?.value?.pedagogyOptions
            // type: selectedJournal?.value?.type,
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
    } else {
      await axiosInstance
        .put(`LtsJournals/${selectedJournal.value.id}/editJournal`, {
          content: selectedJournal.value?.content,
          title: selectedJournal?.value?.title
        })
        .then((res) => {
          setJournals(
            journals.map((journal) =>
              res.data.id === journal.id ? res.data : journal
            )
          )
          setSelectedJournal((prevState) => ({
            ...prevState,
            value: res.data
          }))
          toast.success('Journal modified successfully!')
          setLoading(false)
        })
        .catch((err) => {
          toast.error('An error occurred, please try again!')
          setLoading(false)
        })
    }
  }

  const imageUpload = async (image) => {
    setImageUploadingLoader(true)
    const formData = new FormData()
    formData.append('img', image)

    await axiosInstance
      .post('/upload/journal-img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        setImageUploadingLoader(false)
        setUploadedImageUrl(response.data.fileLocation)
        toast.success('Image uploaded successfully!')
      })
      .catch((err) => {
        setImageUploadingLoader(false)
        return toast.error('Image upload failed, please try again!')
      })
  }

  const handleJournalUpdate = (event) => {
    const { name, value } = event.target

    setSelectedJournal((prevState) => ({
      ...prevState,
      value: { ...prevState.value, [name]: value }
    }))
  }
  const handleTrainingsUpdate = (event) => {
    const { name, value } = event.target

    setSelectedJournal((prevState) => ({
      ...prevState,
      value: { ...prevState.value, [name]: value }
    }))
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <img
              src={searchIcon}
              alt='#'
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

  const handleChangeSteps = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newSteps = [...selectedJournal?.value?.steps]
    let newStep = newSteps[index]
    newStep[name] = value
    newSteps[index] = newStep
    newJournal.steps = newSteps
    setSelectedJournal(newJournal)
  }
  const handleChangeImplementationSteps = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newSteps = [...selectedJournal?.value?.implementationSteps]
    let newStep = newSteps[index]
    newStep[name] = value
    newSteps[index] = newStep
    newJournal.implementationSteps = newSteps
    setSelectedJournal(newJournal)
  }
  const handleChangePedagogyOptions = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newSteps = [...selectedJournal?.value?.pedagogyOptions]
    let newStep = newSteps[index]
    newStep[name] = value
    newSteps[index] = newStep
    newJournal.pedagogyOptions = newSteps
    setSelectedJournal(newJournal)
  }

  const handleChangeLtsConnection = (name, value) => {
    let newJournal = { ...selectedJournal }
    let newLtsConnection = { ...newJournal?.value?.ltsConnection }
    newLtsConnection[name] = value
    newJournal.value.ltsConnection = newLtsConnection
    setSelectedJournal(newJournal)
  }

  const handleChangeProgramOpportunities = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newProgramOpportunities = [
      ...selectedJournal?.value?.programOpportunities
    ]
    let newProgramOpportunity = newProgramOpportunities[index]
    newProgramOpportunity[name] = value
    newProgramOpportunities[index] = newProgramOpportunity
    newJournal.programOpportunities = newProgramOpportunities
    setSelectedJournal(newJournal)
  }
  const handleChangeCurriculumOverview = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newCurriculumOverviews = [...selectedJournal?.value?.curriculumOverview]
    let newCurriculumOverview = newCurriculumOverviews[index]
    newCurriculumOverview[name] = value
    newCurriculumOverviews[index] = newCurriculumOverview
    newJournal.curriculumOverview = newCurriculumOverviews
    setSelectedJournal(newJournal)
  }
  const handleChangeExpectedOutcomes = (index, name, value) => {
    let newJournal = { ...selectedJournal }
    let newExpectedOutcomes = [...selectedJournal?.value?.expectedOutcomes]
    let newExpectedOutcome = newExpectedOutcomes[index]
    newExpectedOutcome[name] = value
    newExpectedOutcomes[index] = newExpectedOutcome
    newJournal.expectedOutcomes = newExpectedOutcomes
    setSelectedJournal(newJournal)
  }
  const handleChangeStudentAssignments = (value) => {
    let newJournal = {
      ...selectedJournal,
      value: {
        ...selectedJournal.value,
        studentAssignments: value
      }
    }
    setSelectedJournal(newJournal)
  }

  const onAddAccordion = (newAccordion) => {
    setAccordions([...accordions, newAccordion])
  }
  const onUpdateAccordion = (updatedAccordion) => {
    setAccordions(
      accordions.map((acc) =>
        acc.id === updatedAccordion.id ? updatedAccordion : acc
      )
    )
  }
  const handleDeleteAccordion = async (row) => {
    try {
      await axiosInstance.delete(`/manageJournals/accordion/${row?.id}`)
      setAccordions(accordions.filter((acc) => acc.id !== row?.id))
    } catch (error) {
      console.error('Error deleting accordion:', error)
    }
  }

  const getColumns = ({ onSelectRow, onEdit, onDelete }) => [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ row }) => {
        return <div>{row.original.title}</div>
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

  return (
    <div>
      {!fetchingJournals ? (
        <div className='row'>
          <div className='col-9'>
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
              classNamePrefix='vyrill'
              // autoFocus={false}
            />
          </div>
          <div className='col-3 image-upload-widget d-flex align-items-center'>
            <label htmlFor='file-input' className='d-flex m-0 p-0'>
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
              <p style={{ color: '#01c5d1' }} className='ms-2 p-0 my-auto'>
                Uploading image, please wait!
              </p>
            )}
            {!uploadedImageUrl && !imageUploadingLoader && (
              <p className='ms-2 p-0 my-auto' style={{ color: '#707070' }}>
                Upload image to generate html
              </p>
            )}
            <>
              {uploadedImageUrl && !imageUploadingLoader && (
                <span
                  className='input-group-text bg-transparent text-dark ms-2 w-100 justify-content-center'
                  style={{ borderLeft: '0px !important' }}
                  onClick={() => {
                    toast.success(
                      'HTML Code Copied, you can paste it on the journal content!'
                    )
                    navigator.clipboard.writeText(
                      `<img src="${uploadedImageUrl}" class="w-100"><br>`
                    )
                  }}
                >
                  <span
                    className='copy-portfolio-span'
                    style={{ fontSize: '15px' }}
                  >
                    Copy Generated Html Code
                    <img src={copy} width='22px' alt='#' className='ms-2' />
                  </span>
                </span>
              )}

              <input
                type='file'
                name='myImage'
                className='d-none'
                id='file-input'
                disabled={imageUploadingLoader}
                onChange={(event) => {
                  // setSelectedImage(event.target.files[0]);
                  imageUpload(event.target.files[0])
                }}
              />
            </>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center flex-column mt-5 pt-5'>
          <div className='lds-facebook'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p style={{ color: '#01c5d1' }}>Loading journals, please wait!</p>
        </div>
      )}
      {selectedJournal && (
        <div style={{ width: 530 }} className='mt-2'>
          <div>Title</div>
          <input
            type='text'
            className='w-100 p-2'
            name='title'
            value={selectedJournal?.value?.title}
            onChange={handleJournalUpdate}
          />
          {selectedJournal &&
            !selectedJournal?.value?.hasOwnProperty('type') && (
              <textarea
                className='p-2 w-100 mt-2'
                value={selectedJournal?.value?.content}
                onChange={handleJournalUpdate}
                name='content'
                id=''
                cols='30'
                rows='16'
              ></textarea>
            )}
          {selectedJournal?.value?.paragraph && (
            <>
              <div>Paragraph</div>

              <textarea
                className='p-2 w-100 mt-2'
                value={selectedJournal?.value?.paragraph}
                onChange={handleJournalUpdate}
                name='paragraph'
                id=''
                cols='30'
                rows='4'
              ></textarea>
            </>
          )}{' '}
          {selectedJournal?.value?.openingText && (
            <>
              <div>Opening text</div>

              <textarea
                className='p-2 w-100 mt-2'
                value={selectedJournal?.value?.openingText}
                onChange={handleTrainingsUpdate}
                name='openingText'
                id=''
                cols='30'
                rows='4'
              ></textarea>
            </>
          )}
          {selectedJournal?.value &&
            selectedJournal?.value?.steps?.map((step, index) => {
              return (
                <>
                  <h2>{step?.type.split('-').join(' ')}</h2>
                  <TextInput
                    title={'Step title'}
                    value={step?.title}
                    handleChange={(e) =>
                      handleChangeSteps(index, 'title', e.target.value)
                    }
                  />
                  <QuillEditorBox
                    value={step?.stepContent}
                    onChange={(e) => handleChangeSteps(index, 'stepContent', e)}
                    title={'Step content'}
                  />

                  <QuillEditorBox
                    value={step?.popupContent}
                    onChange={(e) =>
                      handleChangeSteps(index, 'popupContent', e)
                    }
                    minHeight={200}
                    title={'Popup content'}
                  />
                </>
              )
            })}{' '}
          {selectedJournal?.value?.pedagogyOptions &&
            selectedJournal?.value?.pedagogyOptions?.map((step, index) => {
              return (
                <>
                  <h2>Pedagogy Option {index + 1}</h2>

                  <TextInput
                    title={`Pedagogy Option ${index + 1}`}
                    value={step?.title}
                    handleChange={(e) =>
                      handleChangePedagogyOptions(
                        index,
                        'title',
                        e.target.value
                      )
                    }
                  />

                  <QuillEditorBox
                    value={step?.content}
                    onChange={(e) =>
                      handleChangePedagogyOptions(index, 'content', e)
                    }
                    minHeight={100}
                    title={'Step box content'}
                  />
                </>
              )
            })}
          {selectedJournal?.value?.implementationSteps &&
            selectedJournal?.value?.implementationSteps?.map((step, index) => {
              return (
                <>
                  <h2>Step {index + 1}</h2>

                  <TextInput
                    title={`Step ${index + 1}`}
                    value={step?.title}
                    handleChange={(e) =>
                      handleChangeImplementationSteps(
                        index,
                        'title',
                        e.target.value
                      )
                    }
                  />
                  <QuillEditorBox
                    value={step?.stepContent}
                    onChange={(e) =>
                      handleChangeImplementationSteps(index, 'stepContent', e)
                    }
                    title={'Step content'}
                  />
                </>
              )
            })}
          {/* {selectedJournal.value?.studentAssignments && ( */}
          {selectedJournal &&
            selectedJournal?.value?.hasOwnProperty('type') && (
              <>
                <>
                  <QuillEditorBox
                    value={selectedJournal?.value?.studentAssignments || ''}
                    onChange={handleChangeStudentAssignments}
                    minHeight={150}
                    title={'Student assignment content'}
                  />
                </>
                {/* )} */}
                <>
                  <h2>Lts Connection Model</h2>
                  {selectedJournal?.value?.ltsConnection && (
                    <>
                      <QuillEditorBox
                        value={
                          selectedJournal?.value?.ltsConnection?.firstParagraph
                        }
                        onChange={(e) =>
                          handleChangeLtsConnection('firstParagraph', e)
                        }
                        minHeight={150}
                        title={'# First paragraph'}
                      />

                      {selectedJournal?.value?.ltsConnection?.secondParagraph !=
                        null &&
                        typeof selectedJournal?.value?.ltsConnection
                          ?.secondParagraph !== 'undefined' && (
                          <>
                            <QuillEditorBox
                              value={
                                selectedJournal?.value?.ltsConnection
                                  ?.secondParagraph
                              }
                              onChange={(e) =>
                                handleChangeLtsConnection('secondParagraph', e)
                              }
                              minHeight={150}
                              title={'# Second paragraph'}
                            />
                          </>
                        )}
                    </>
                  )}
                </>
              </>
            )}
          {selectedJournal?.value?.programOpportunities && (
            <>
              <h1>Program Opportunities</h1>

              {selectedJournal?.value?.programOpportunities?.map((x, i) => {
                return (
                  <React.Fragment>
                    <TextInput
                      title={`Image Url ${i + 1}`}
                      value={x?.imageUrl}
                      handleChange={(e) =>
                        handleChangeProgramOpportunities(
                          i,
                          'imageUrl',
                          e.target.value
                        )
                      }
                    />
                    <QuillEditorBox
                      value={x?.content}
                      onChange={(e) =>
                        handleChangeProgramOpportunities(i, 'content', e)
                      }
                      minHeight={150}
                      title={`Content ${i + 1}`}
                    />
                  </React.Fragment>
                )
              })}
            </>
          )}
          {selectedJournal?.value?.curriculumOverview && (
            <>
              <h1>Curriculum Overview</h1>

              {selectedJournal?.value?.curriculumOverview?.map((x, i) => {
                return (
                  <React.Fragment>
                    <TextInput
                      title={`Image Url ${i + 1}`}
                      value={x?.imageUrl}
                      handleChange={(e) =>
                        handleChangeProgramOpportunities(
                          i,
                          'imageUrl',
                          e.target.value
                        )
                      }
                    />
                    <QuillEditorBox
                      value={x?.content}
                      onChange={(e) =>
                        handleChangeCurriculumOverview(i, 'content', e)
                      }
                      minHeight={150}
                      title={`Content ${i + 1}`}
                    />
                  </React.Fragment>
                )
              })}
            </>
          )}
          {selectedJournal?.value?.expectedOutcomes && (
            <>
              <h1>Expected Outcomes</h1>

              {selectedJournal?.value?.expectedOutcomes?.map((x, i) => {
                return (
                  <div>
                    <div>
                      <TextInput
                        title={`Image Url ${i + 1}`}
                        value={x?.imageUrl}
                        handleChange={(e) =>
                          handleChangeProgramOpportunities(
                            i,
                            'imageUrl',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className='row'>
                      <div className={'col-sm-6'}>
                        <TextInput
                          title={`Padding of image ${i + 1}`}
                          value={x?.padding}
                          handleChange={(e) =>
                            handleChangeExpectedOutcomes(
                              i,
                              'padding',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className={'col-sm-6'}>
                        <TextInput
                          title={`Width of image ${i + 1}`}
                          value={x?.width}
                          handleChange={(e) =>
                            handleChangeExpectedOutcomes(
                              i,
                              'width',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <QuillEditorBox
                        value={x?.content}
                        onChange={(e) =>
                          handleChangeExpectedOutcomes(i, 'content', e)
                        }
                        minHeight={150}
                        title={`Content ${i + 1}`}
                      />
                    </div>
                  </div>
                )
              })}
            </>
          )}
          <button
            className='float-end mt-2 px-md-5 save-button add-new-note-button-text'
            style={{ fontSize: '16px', height: 'auto' }}
            onClick={() => {
              return handleSubmit()
            }}
            disabled={loading}
          >
            {loading ? 'SAVING..' : 'SAVE'}
          </button>
        </div>
      )}

      <div className={'row mt-4'}>
        <div className={'col-md-6'}>
          {selectedJournal?.value?.category === 'my-mentorship' &&
            selectedJournal?.value?.title
              ?.toLowerCase()
              ?.includes('My Story in Motion Research'.toLowerCase()) && (
              <LtsButton
                onClick={handleShowAccordionModal}
                name={`Add new accordion`}
                align={'end'}
                width={'70%'}
              />
            )}
          {accordions && accordions?.length > 0 && (
            <ReactTable
              // data={accordions}
              data={accordions?.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )}
              getColumns={getColumns}
              addNew={'accordion'}
              onAdd={handleShowAccordionModal}
              onEdit={(row) => {
                handleShowAccordionModal(row)
                setSelectedAccordion(row)
              }}
              onDelete={handleDeleteAccordion}
            />
          )}
        </div>
      </div>

      {showAccordionModal && (
        <AccordionModal
          show={showAccordionModal}
          onHide={handleHideAccordionModal}
          selectedAccordion={selectedAccordion}
          setSelectedAccordion={setSelectedAccordion}
          selectedJournal={selectedJournal}
          onAddAccordion={onAddAccordion}
          onUpdateAccordion={onUpdateAccordion}
        />
      )}
    </div>
  )
}
