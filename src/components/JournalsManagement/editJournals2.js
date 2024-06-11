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
import KendoTextEditor from './TextEditor'
import { EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import { v4 as uuidv4 } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import PositionSelector from '../PositionSelector/PositionSelector'
import CustomContent from './CustomContent/CustomContent'

export default function EditJournals2(props) {
  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)
  const [journalType, setJournalType] = useState(null)
  const [journalId, setJournalId] = useState(null)
  const randomUUID = uuidv4()

  const breakdownInitialState = [
    {
      content: '',
      title: '',
      type: '',

      customContent: {
        paragraphs: [],
        buttons: [],
        popupButtons: [],
        imageGallery: {}
      }
    }
  ]

  const [breakdowns, setBreakdowns] = useState(breakdownInitialState)
  useEffect(() => {
    getJournals2()
    getJournals2Weeks()
    getTrainings()
  }, [])

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
    console.log(e, 'eeee')
    setSelectedJournal({
      value: e.value,
      label: e.label
    })

    setBreakdowns(
      e.value?.breakdowns
        ?.slice()
        ?.sort((a, b) => a?.breakdownOrder - b?.breakdownOrder)
    )
  }

  const history = useHistory()

  useEffect(() => {
    console.log('hereeee', selectedJournal)
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
        setJournals(data.filter((d) => d.category.includes('new')))
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

  const getJournals2 = async () => {
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
  const getJournals2Weeks = async () => {
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
    if (!journalType.includes('my-training')) {
      await axiosInstance
        .put(`LtsJournals/${journalId}/editJournal2`, {
          breakdowns: breakdowns,
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

  return (
    <div>
      {console.log(selectedJournal, 'selectedJournal')}
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
                    `<img src="${uploadedImageUrl}" class="w-100"><br>`
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
        <div style={{ width: 530 }} className="mt-2">
          <div>Title</div>
          <input
            type="text"
            className="w-100 p-2"
            name="title"
            value={selectedJournal?.value?.title}
            onChange={handleJournalUpdate}
          />
          {selectedJournal?.value?.paragraph && (
            <>
              <div>Paragraph</div>

              <textarea
                className="p-2 w-100 mt-2"
                value={selectedJournal?.value?.paragraph}
                onChange={handleJournalUpdate}
                name="paragraph"
                id=""
                cols="30"
                rows="4"
              ></textarea>
            </>
          )}{' '}
          {selectedJournal?.value?.openingText && (
            <>
              <div>Opening text</div>

              <textarea
                className="p-2 w-100 mt-2"
                value={selectedJournal?.value?.openingText}
                onChange={handleTrainingsUpdate}
                name="openingText"
                id=""
                cols="30"
                rows="4"
              ></textarea>
            </>
          )}
          {selectedJournal?.value &&
            selectedJournal?.value?.steps?.map((step, index) => {
              return (
                <>
                  <h2>{step?.type.split('-').join(' ')}</h2>
                  <div>Step title</div>
                  <input
                    type="text"
                    className="form-control"
                    value={step?.title}
                    onChange={(e) =>
                      handleChangeSteps(index, 'title', e.target.value)
                    }
                  />

                  <div>Step content</div>
                  <KendoTextEditor
                    value={step?.stepContent}
                    handleChange={(e) =>
                      handleChangeSteps(index, 'stepContent', e)
                    }
                  />
                  <div>Popup content</div>
                  <KendoTextEditor
                    value={step?.popupContent}
                    handleChange={(e) =>
                      handleChangeSteps(index, 'popupContent', e)
                    }
                    minHeight={200}
                  />
                </>
              )
            })}{' '}
          {selectedJournal?.value?.pedagogyOptions &&
            selectedJournal?.value?.pedagogyOptions?.map((step, index) => {
              return (
                <>
                  <h2>Pedagogy Option {index + 1}</h2>
                  <div>Pedagogy box title</div>
                  <input
                    type="text"
                    className="form-control"
                    value={step?.title}
                    onChange={(e) =>
                      handleChangePedagogyOptions(
                        index,
                        'title',
                        e.target.value
                      )
                    }
                  />
                  <div>Step box content</div>
                  <KendoTextEditor
                    value={step?.content}
                    handleChange={(e) =>
                      handleChangePedagogyOptions(index, 'content', e)
                    }
                    minHeight={100}
                  />
                </>
              )
            })}
          {selectedJournal?.value?.implementationSteps &&
            selectedJournal?.value?.implementationSteps?.map((step, index) => {
              return (
                <>
                  <h2>Step {index + 1}</h2>
                  <div>Step title</div>
                  <input
                    type="text"
                    className="form-control"
                    value={step?.title}
                    onChange={(e) =>
                      handleChangeImplementationSteps(
                        index,
                        'title',
                        e.target.value
                      )
                    }
                  />
                  <div>Step content</div>
                  <KendoTextEditor
                    value={step?.stepContent}
                    handleChange={(e) =>
                      handleChangeImplementationSteps(index, 'stepContent', e)
                    }
                  />
                </>
              )
            })}
          {/* {selectedJournal.value?.studentAssignments && ( */}
          <>
            <h2>Student assignment content</h2>
            <KendoTextEditor
              value={selectedJournal?.value?.studentAssignments || ''}
              handleChange={handleChangeStudentAssignments}
              minHeight={150}
            />
          </>
          {/* )} */}
          <>
            <h2>Lts Connection Model</h2>
            {selectedJournal?.value?.ltsConnection && (
              <>
                <div># First paragraph</div>
                <KendoTextEditor
                  value={selectedJournal?.value?.ltsConnection?.firstParagraph}
                  handleChange={(e) =>
                    handleChangeLtsConnection('firstParagraph', e)
                  }
                  minHeight={150}
                />
                {selectedJournal?.value?.ltsConnection?.secondParagraph !=
                  null &&
                  typeof selectedJournal?.value?.ltsConnection
                    ?.secondParagraph !== 'undefined' && (
                    <>
                      <div># Second paragraph</div>
                      <KendoTextEditor
                        value={
                          selectedJournal?.value?.ltsConnection?.secondParagraph
                        }
                        handleChange={(e) =>
                          handleChangeLtsConnection('secondParagraph', e)
                        }
                        minHeight={150}
                      />
                    </>
                  )}
              </>
            )}
          </>
          {selectedJournal?.value?.programOpportunities && (
            <>
              <h1>Program Opportunities</h1>

              {selectedJournal?.value?.programOpportunities?.map((x, i) => {
                return (
                  <div>
                    <div>
                      <h3>Image Url {i + 1}</h3>
                      <input
                        type="text"
                        className="form-control"
                        value={x?.imageUrl}
                        onChange={(e) =>
                          handleChangeProgramOpportunities(
                            i,
                            'imageUrl',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <h3>Content {i + 1}</h3>
                      <KendoTextEditor
                        value={x?.content}
                        handleChange={(e) =>
                          handleChangeProgramOpportunities(i, 'content', e)
                        }
                        minHeight={150}
                      />
                    </div>
                  </div>
                )
              })}
            </>
          )}
          {selectedJournal?.value?.curriculumOverview && (
            <>
              <h1>Curriculum Overview</h1>

              {selectedJournal?.value?.curriculumOverview?.map((x, i) => {
                return (
                  <div>
                    <div>
                      <h3>Image Url {i + 1}</h3>
                      <input
                        type="text"
                        className="form-control"
                        value={x?.imageUrl}
                        onChange={(e) =>
                          handleChangeCurriculumOverview(
                            i,
                            'imageUrl',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <h3>Content {i + 1}</h3>
                      <KendoTextEditor
                        value={x?.content}
                        handleChange={(e) =>
                          handleChangeCurriculumOverview(i, 'content', e)
                        }
                        minHeight={150}
                      />
                    </div>
                  </div>
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
                      <h3>Image Url {i + 1}</h3>
                      <input
                        type="text"
                        className="form-control"
                        value={x?.imageUrl}
                        onChange={(e) =>
                          handleChangeExpectedOutcomes(
                            i,
                            'imageUrl',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="row">
                      <div className={'col-sm-6'}>
                        <h6>Padding of image {i + 1}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={x?.padding}
                          onChange={(e) =>
                            handleChangeExpectedOutcomes(
                              i,
                              'padding',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className={'col-sm-6'}>
                        <h6>Width of image {i + 1}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={x?.width}
                          onChange={(e) =>
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
                      <h3>Content {i + 1}</h3>
                      <KendoTextEditor
                        value={x?.content}
                        handleChange={(e) =>
                          handleChangeExpectedOutcomes(i, 'content', e)
                        }
                        minHeight={150}
                      />
                    </div>
                  </div>
                )
              })}
            </>
          )}
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
      )}
    </div>
  )
}
