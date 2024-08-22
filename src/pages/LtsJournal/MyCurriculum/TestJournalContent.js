import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaLightbox from '../../../components/MediaLightbox'
import triangleIcon from '../../../assets/images/triangle.png'
import LtsDiagram from '../../../assets/images/LTS Model - Triangle - All.png'
import LtsCertification from '../../../assets/images/iamr/Certified L1.png'
import BreakdownPopup from '../../../components/Modals/BreakdownPopup'
import './TestJournalContent.css'
import AccordionItemWrapper from '../UI/AccordionItemWrapper'
import SelectTaskButton from '../UI/SelectTaskButton'
import StepsBox from '../Steps/StepsBox'
import CurriculumOverview from './CurriculumOverview'
import ExpectedOutcomes from '../ExpectedOutcomes'
import ProgramOpportunities from '../ProgramOpportunities'
import ReactQuill from 'react-quill'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setBackButton } from '../../../redux/backButtonReducer'

function TestJournalContent(props) {
  const dispatch = useDispatch()
  let [journal, setJournal] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
  const [selectedStepIndex, setSelectedStepIndex] = useState(null)

  useEffect(() => {
    dispatch(setBackButton(true, 'my-curriculum'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  const [instructorDebrief, setInstructorDebrief] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    textEditorContent: '',
    journalId: +props.match.params.id,
    journalCategory: null
  })

  useEffect(() => {
    getInstructorDebriefData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.id, props.match.params.weekId])

  const insertJournalCategory = (category) => {
    let result = ''

    switch (category) {
      case 'hs1':
        result = 'lts1'
        break
      case 'hs2':
        result = 'lts2'
        break
      case 'hs3':
        result = 'lts3'
        break
      case 'hs4':
        result = 'lts4'
        break
      case 'financial-literacy':
        result = 'finlit'
        break
      default:
        break
    }

    return result
  }

  const newInstructorBriefData = {
    checkbox1: instructorDebrief?.checkbox1,
    checkbox2: instructorDebrief?.checkbox2,
    checkbox3: instructorDebrief?.checkbox3,
    textEditorContent: instructorDebrief?.textEditorContent,
    journalCategory: insertJournalCategory(journal?.category)
  }

  const onSubmitInstructorDebrief = (data) => {
    const isEdit = { ...data, id: instructorDebrief.id }
    const isCreate = {
      ...data,
      id: null
    }
    const instructorDebriefData = instructorDebrief.id ? isEdit : isCreate
    const url = `/ltsJournals/${
      props.view === 'task' ? +props.match.params.id : 0
    }/${
      props.view === 'week' ? +props.match.params.weekId : 0
    }/instructor-debrief`

    axiosInstance
      .post(url, {
        ...instructorDebriefData
      })
      .then((res) => {
        const updatedInstructorDebriefData = res.data
        toast.success('Instructor debrief submitted successfully!')
        setInstructorDebrief({
          ...instructorDebrief,
          checkbox1: updatedInstructorDebriefData.checkbox1,
          checkbox2: updatedInstructorDebriefData.checkbox2,
          checkbox3: updatedInstructorDebriefData.checkbox3,
          textEditorContent: updatedInstructorDebriefData.textEditorContent,
          id: updatedInstructorDebriefData.id
        })
        toast.success('Changes saved!')
      })
      .catch((error) => {
        toast.error('Error submitting instructor debrief.')
      })
  }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/tasks/${+props.match.params.id}`
      )
      return data
    } catch (err) {}
  }
  async function getJournalWeek() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/week/${+props.match.params.weekId}`
      )
      return data
    } catch (err) {}
  }

  async function getUserJournalEntries() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${+props.match.params.id}/userEntries`
      )

      let groupedByJournalEntry = {}

      if (data) {
        for (var userJournalEntry of data) {
          if (groupedByJournalEntry[userJournalEntry.journalEntryId]) {
            groupedByJournalEntry[userJournalEntry.journalEntryId].push(
              userJournalEntry
            )
          } else {
            groupedByJournalEntry[userJournalEntry.journalEntryId] = [
              userJournalEntry
            ]
          }
        }
      }

      return groupedByJournalEntry
    } catch (err) {}
  }

  async function getUserJournalWeekEntries() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${+props.match.params.weekId}/userEntries`
      )

      let groupedByJournalEntry = {}

      if (data) {
        for (var userJournalEntry of data) {
          if (groupedByJournalEntry[userJournalEntry.journalEntryId]) {
            groupedByJournalEntry[userJournalEntry.journalEntryId].push(
              userJournalEntry
            )
          } else {
            groupedByJournalEntry[userJournalEntry.journalEntryId] = [
              userJournalEntry
            ]
          }
        }
      }

      return groupedByJournalEntry
    } catch (err) {}
  }

  const getInstructorDebriefData = async () => {
    const url = `/ltsJournals/${
      props.view === 'task' ? +props.match.params.id : 0
    }/${
      props.view === 'week' ? +props.match.params.weekId : 0
    }/instructor-debrief`
    try {
      let { data } = await axiosInstance.get(url)
      return data
    } catch (e) {}
  }

  function loadData() {
    setLoading(true)
    Promise.all([
      getJournal(),
      getUserJournalEntries(),
      getInstructorDebriefData()
    ])
      .then(([journalData, userJournalEntries, instructorDebriefData]) => {
        setJournal(journalData)

        // if (
        //   journalData.userEntry &&
        //   journalData.userEntry.length > 0 &&
        //   journalData.userEntry[0].videoWatchData
        // ) {
        //   try {
        //     setVideoWatchData(
        //       JSON.parse(journalData.userEntry[0].videoWatchData)
        //     )
        //   } catch (err) {}
        // }
        // setUserJournalEntries(userJournalEntries)

        if (props.contentContainer && props.contentContainer.current) {
          props.contentContainer.current.scrollTop = 0
        }
        if (journalData?.hasInstructorDebrief) {
          const isInstructorDebrief =
            Object.keys(instructorDebriefData)?.length > 1
          if (isInstructorDebrief) {
            setInstructorDebrief({
              ...instructorDebrief,
              checkbox1: instructorDebriefData.checkbox1,
              checkbox2: instructorDebriefData.checkbox2,
              checkbox3: instructorDebriefData.checkbox3,
              textEditorContent: instructorDebriefData.textEditorContent,
              id: instructorDebriefData.id
            })
          } else {
            setInstructorDebrief({
              ...instructorDebrief,
              checkbox1: false,
              checkbox2: false,
              checkbox3: false,
              textEditorContent: '',
              id: null
            })
          }
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function loadWeekData() {
    setLoading(true)
    Promise.all([
      getJournalWeek(),
      getUserJournalWeekEntries(),
      getInstructorDebriefData()
    ])
      .then(([journalData, userJournalEntries, instructorDebriefData]) => {
        setJournal(journalData)
        // if (
        //   journalData.userEntry &&
        //   journalData.userEntry.length > 0 &&
        //   journalData.userEntry[0].videoWatchData
        // ) {
        //   try {
        //     setVideoWatchData(
        //       JSON.parse(journalData.userEntry[0].videoWatchData)
        //     )
        //   } catch (err) {}
        // }
        // setUserJournalEntries(userJournalEntries)
        if (journalData?.hasInstructorDebrief) {
          const isInstructorDebrief =
            Object.keys(instructorDebriefData)?.length > 1
          if (isInstructorDebrief) {
            setInstructorDebrief({
              ...instructorDebrief,
              checkbox1: instructorDebriefData.checkbox1,
              checkbox2: instructorDebriefData.checkbox2,
              checkbox3: instructorDebriefData.checkbox3,
              textEditorContent: instructorDebriefData.textEditorContent,
              id: instructorDebriefData.id
            })
          } else {
            setInstructorDebrief({
              ...instructorDebrief,
              checkbox1: false,
              checkbox2: false,
              checkbox3: false,
              textEditorContent: '',
              id: null
            })
          }
        }
        if (props.contentContainer && props.contentContainer.current) {
          props.contentContainer.current.scrollTop = 0
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setIsExpanded(false)
  }, [props.match.params.id])

  useEffect(
    function () {
      if (props.view === 'task') {
        loadData()
      } else if (props.view === 'week') {
        loadWeekData()
      }
    },
    [props.match.params.id, props.match.params.weekId, props.view]
  )

  useEffect(() => {
    setOpenAccordion(null)
    setSelectedStep(null)
    setSelectedStepIndex(null)
  }, [props.match.params.id, props.match.params.weekId, props.view])

  useEffect(() => {
    setSelectedStep(null)
    setSelectedStepIndex(null)
  }, [openAccordion])

  if (!journal) {
    return null
  }

  let videos = (
    journal.videos && journal.videos.constructor === Array
      ? journal.videos
      : [journal.video]
  ).filter(Boolean)

  const handleChangeInstructorDebrief2 = (name, value) => {
    const newInstructorDebrief = {
      ...instructorDebrief,
      [name]: value
    }
    setInstructorDebrief(newInstructorDebrief)
    // debounce(onSubmitInstructorDebrief, newInstructorDebrief)
  }

  const selectStep = (step, index) => {
    setSelectedStep(step)
    setSelectedStepIndex(index)
  }

  const handleOpenPopup = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const handleSelectTask = (task, index) => {
    setSelectedTask({ task, index })
    setSelectedTaskIndex(index)
    setSelectedStep(null)
    setSelectedStepIndex(null)
  }

  return (
    <>
      <>
        <div className={'journal-title'}>{journal?.title}</div>
        <div
          className={'d-flex justify-content-between w-100'}
          style={{ marginTop: 40, gap: 4 }}
        >
          <div className={' full-width'}>
            {videos &&
              videos.constructor === Array &&
              videos.map((video, index) => (
                <MediaLightbox
                  video={video}
                  key={index}
                  show={showVideo === video.id}
                  onClose={() => setShowVideo(false)}
                />
              ))}
            {videos && videos.constructor === Array && videos.length > 0 && (
              <div
                className={`journal-entries__videos journal-entries__videos--${
                  videos.length > 1 ? 'multiple' : 'single'
                }`}
              >
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={`journal-entries__video${
                      journal.content === '' ? '--welcome-video' : ''
                    }`}
                  >
                    <div
                      className={`journal-entries__video-thumbnail${
                        journal.content === '' ? '--welcome-video' : ''
                      }`}
                      onClick={() => setShowVideo(video.id)}
                    >
                      <img src={video.thumbnail} alt='thumbnail' />
                      <div
                        className={`journal-entries__video-thumbnail-icon${
                          journal.content === '' ? '--welcome-video' : ''
                        }`}
                      >
                        <FontAwesomeIcon icon={faPlay} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* <div className={'lts-triangle-container'}>
            <img
              alt={'triangleIcon'}
              className={'triangle-icon'}
              src={triangleIcon}
            />
          </div> */}
        </div>
        <div className={'journal-paragraph my-4'}>{journal?.paragraph}</div>
        <div className={'custom-breakdowns-container'}>
          {!journal?.hasInstructorDebrief && !journal?.tasks?.length && (
            <>
              <CurriculumOverview
                title={'curriculum overview'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'curriculumOverview'}
                handleAccordionClick={() =>
                  handleAccordionClick('curriculumOverview')
                }
                data={journal?.curriculumOverview}
              />
              <ExpectedOutcomes
                title={'expected outcomes'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'expectedOutcomes'}
                handleAccordionClick={() =>
                  handleAccordionClick('expectedOutcomes')
                }
                data={journal?.expectedOutcomes}
              />
              <ProgramOpportunities
                title={'program opportunities'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'programOpportunities'}
                handleAccordionClick={() =>
                  handleAccordionClick('programOpportunities')
                }
                data={journal?.programOpportunities}
              />
            </>
          )}
          {!journal?.hasInstructorDebrief &&
            journal?.tasks?.length &&
            journal?.tasks?.map((task, index) => {
              return (
                <>
                  <CurriculumOverview
                    title={'curriculum overview'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'curriculumOverview'}
                    handleAccordionClick={() =>
                      handleAccordionClick('curriculumOverview')
                    }
                    data={task?.curriculumOverview}
                  />{' '}
                  <ExpectedOutcomes
                    title={'expected outcomes'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'expectedOutcomes'}
                    handleAccordionClick={() =>
                      handleAccordionClick('expectedOutcomes')
                    }
                    data={task?.expectedOutcomes}
                  />
                  <ProgramOpportunities
                    title={'program opportunities'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'programOpportunities'}
                    handleAccordionClick={() =>
                      handleAccordionClick('programOpportunities')
                    }
                    data={task?.programOpportunities}
                  />
                </>
              )
            })}
          {!loading && journal?.hasInstructorDebrief && (
            <div style={{ order: 1 }}>
              {props.view === 'task' && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'steps'}
                  handleAccordionClick={() => handleAccordionClick('steps')}
                  isExanded={isExpanded}
                  title={'task breakdown'}
                >
                  {openAccordion === 'steps' && (
                    <div className='accordion-content'>
                      <StepsBox
                        containsTitle={false}
                        steps={journal?.steps}
                        selectStep={selectStep}
                        selectedStepIndex={selectedStepIndex}
                        handleOpenPopup={handleOpenPopup}
                        selectedStep={selectedStep}
                      />
                    </div>
                  )}
                </AccordionItemWrapper>
              )}
              {props.view === 'week' && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'steps'}
                  handleAccordionClick={() => handleAccordionClick('steps')}
                  isExanded={isExpanded}
                  title={'weeks and their breakdowns'}
                >
                  {openAccordion === 'steps' && (
                    <div>
                      {journal?.tasks?.length === 1 && (
                        <div className='accordion-content'>
                          <StepsBox
                            task={journal?.tasks[0]}
                            steps={journal?.tasks[0]?.steps}
                            selectStep={selectStep}
                            selectedStepIndex={selectedStepIndex}
                            handleOpenPopup={handleOpenPopup}
                            selectedStep={selectedStep}
                          />
                        </div>
                      )}
                      {journal?.tasks?.length > 1 && (
                        <>
                          <div
                            className={'select-task-buttons'}
                            style={{
                              backgroundColor: selectedTask ? '#f8f7f7' : '#fff'
                            }}
                          >
                            {journal?.tasks.map((task, index) => (
                              <SelectTaskButton
                                key={index}
                                handleSelectTask={() =>
                                  handleSelectTask(task, index)
                                }
                                task={task}
                                index={index}
                                selectedTaskIndex={selectedTaskIndex}
                              />
                            ))}
                          </div>
                          {journal?.tasks.map((task) => {
                            if (task?.id === selectedTask?.task?.id) {
                              return (
                                <div
                                  key={task.id}
                                  className='accordion-content'
                                >
                                  <StepsBox
                                    task={task}
                                    steps={task?.steps}
                                    selectStep={selectStep}
                                    selectedStepIndex={selectedStepIndex}
                                    handleOpenPopup={handleOpenPopup}
                                    selectedStep={selectedStep}
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                        </>
                      )}
                    </div>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )}

          {journal?.category !== 'financial-literacy' && (
            <div style={{ order: 2 }}>
              {!loading && journal?.hasInstructorDebrief && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'connection'}
                  handleAccordionClick={() =>
                    handleAccordionClick('connection')
                  }
                  isExanded={isExpanded}
                  title={'Connection to lts model and outcomes'}
                >
                  {openAccordion === 'connection' && (
                    <>
                      <div className='accordion-content'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                font: 'normal normal 600 17px/17px Montserrat',
                                letterSpacing: 0.68,
                                color: '#333D3D',
                                textAlign: 'center'
                              }}
                            >
                              THE LEARN TO START MODEL
                            </div>
                            <img
                              style={{
                                width: 340,
                                height: 300,
                                objectFit: 'contain'
                              }}
                              alt={'lts-triangle'}
                              src={LtsDiagram}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              // marginBottom: 20,
                              textAlign: 'start',
                              width: '100%',
                              flexDirection: 'column'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.firstParagraph
                            }}
                          />

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                font: 'normal normal 600 17px/17px Montserrat',
                                letterSpacing: 0.68,
                                color: '#333D3D',
                                textAlign: 'center'
                              }}
                            >
                              MARKET-READY OUTCOMES
                            </div>
                            <img
                              style={{
                                width: 180,
                                height: 180,
                                objectFit: 'contain'
                                // marginBottom: 20
                              }}
                              alt={'lts-triangle'}
                              src={LtsCertification}
                            />
                          </div>

                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              display: 'flex',
                              justifyContent: 'start',
                              width: '100%',
                              flexDirection: 'column'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.secondParagraph
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )}
          {journal?.category === 'financial-literacy' && (
            <div style={{ order: 2 }}>
              {!loading && journal?.hasInstructorDebrief && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'connection'}
                  handleAccordionClick={() =>
                    handleAccordionClick('connection')
                  }
                  isExanded={isExpanded}
                  title={'Extending task'}
                >
                  {openAccordion === 'connection' && (
                    <>
                      <div className='accordion-content'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              // marginBottom: 20,
                              textAlign: 'start',
                              width: '100%'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.firstParagraph
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )}
          <div style={{ order: 3 }}>
            {!loading && journal?.hasInstructorDebrief && (
              <AccordionItemWrapper
                isOpened={openAccordion === 'instructor'}
                handleAccordionClick={() => handleAccordionClick('instructor')}
                isExanded={isExpanded}
                title={'Instructor debrief'}
              >
                {openAccordion === 'instructor' && (
                  <div className='accordion-content'>
                    <div
                      style={{
                        font: 'normal normal 500 11px/17px Montserrat',
                        letterSpacing: 0.18,
                        color: '#333D3D'
                      }}
                    >
                      Welcome to the instructor debrief section of this task.
                      This tool is designed to help you use the LTS program and
                      platform to their maximum potential, and to provide LTS
                      with feedback so we can continue to meet your needs.
                    </div>

                    <>
                      <div
                        style={{
                          font: 'normal normal 600 11px/17px Montserrat',
                          letterSpacing: 0.18,
                          color: '#000000',
                          paddingTop: '20px',
                          paddingBottom: '10px'
                        }}
                      >
                        In completing this task did you:
                      </div>
                      <div className='d-flex mb-1 '>
                        <div
                          style={{
                            width: '25px',
                            flexShrink: 0,
                            marginRight: 5
                          }}
                        >
                          <input
                            style={{ width: '15px', height: '15px' }}
                            className='form-check-input '
                            type='checkbox'
                            checked={instructorDebrief.checkbox1}
                            id='flexCheckDefault'
                            onChange={(e) =>
                              handleChangeInstructorDebrief2(
                                'checkbox1',
                                e.target.checked
                              )
                            }
                          />
                        </div>
                        <div
                          className='form-check-label'
                          htmlFor='flexCheckDefault'
                          style={{
                            font: 'normal normal 500 12px/18px Montserrat !important',
                            letterSpacing: 0.24,
                            color: '#231F20',
                            marginTop: '0.250rem',
                            fontSize: 12
                          }}
                        >
                          Give each student an opportunity to use their voice.
                        </div>
                      </div>
                      <div className='d-flex mb-1'>
                        <div
                          style={{
                            width: '25px',
                            flexShrink: 0,
                            marginRight: 5
                          }}
                        >
                          <input
                            style={{ width: '15px', height: '15px' }}
                            className='form-check-input '
                            type='checkbox'
                            checked={instructorDebrief.checkbox2}
                            id='flexCheckDefault'
                            onChange={(e) =>
                              handleChangeInstructorDebrief2(
                                'checkbox2',
                                e.target.checked
                              )
                            }
                          />
                        </div>
                        <div
                          className='form-check-label'
                          htmlFor='flexCheckDefault'
                          style={{
                            font: 'normal normal 500 12px/18px Montserrat !important',
                            letterSpacing: 0.24,
                            color: '#231F20',
                            marginTop: '0.250rem',
                            fontSize: 12
                          }}
                        >
                          Conduct at least one news briefing to start class.
                        </div>
                      </div>
                      <div className='d-flex mb-1 '>
                        <div
                          style={{
                            width: '25px',
                            flexShrink: 0,
                            marginRight: 5
                          }}
                        >
                          <input
                            style={{ width: '15px', height: '15px' }}
                            className='form-check-input '
                            type='checkbox'
                            checked={instructorDebrief.checkbox3}
                            id='flexCheckDefault'
                            onChange={(e) =>
                              handleChangeInstructorDebrief2(
                                'checkbox3',
                                e.target.checked
                              )
                            }
                          />
                        </div>

                        <div
                          className='form-check-label'
                          htmlFor='flexCheckDefault'
                          style={{
                            font: 'normal normal 500 12px/18px Montserrat !important',
                            letterSpacing: 0.24,
                            color: '#231F20',
                            marginTop: '0.250rem',
                            fontSize: 12
                          }}
                        >
                          Give students adequate time to complete work inside of
                          their Journal or Portfolio.
                        </div>
                      </div>
                    </>
                    <div
                      className={'row'}
                      // style={{ height: 270, minHeight: 270 }}
                    >
                      <div
                        style={{
                          font: 'normal normal 600 11px/17px Montserrat !important',
                          letterSpacing: 0.18,
                          color: '#000000',
                          paddingTop: '15px',
                          paddingBottom: '6px'
                        }}
                      >
                        Please submit any questions or feedback regarding this
                        task in the curriculum to the LTS team.
                      </div>
                      <ReactQuill
                        theme='snow'
                        name={'textEditorContent'}
                        id={'textEditorContent'}
                        className='instructor-debrief-editor w-100 rounded-0 '
                        onChange={(e) =>
                          handleChangeInstructorDebrief2('textEditorContent', e)
                        }
                        // style={{ height: 180 }}
                        value={instructorDebrief?.textEditorContent}
                      />
                    </div>
                    <div
                      className={
                        ' d-flex justify-content-end instructor-debrief-button'
                      }
                    >
                      <button
                        style={{
                          backgroundColor: '#51c7df',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          zIndex: 999
                        }}
                        className='px-4 py-2 border-0 color transform my-1'
                        onClick={() =>
                          onSubmitInstructorDebrief(newInstructorBriefData)
                        }
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </AccordionItemWrapper>
            )}
          </div>
          <div style={{ order: 4 }}>
            {!loading && journal?.studentAssignments && (
              <AccordionItemWrapper
                isOpened={openAccordion === 'studentAssignment'}
                handleAccordionClick={() =>
                  handleAccordionClick('studentAssignment')
                }
                isExanded={isExpanded}
                title={'ASSIGNMENT TO POST FOR STUDENTS'}
              >
                {openAccordion === 'studentAssignment' && (
                  <div className='accordion-content'>
                    <div
                      style={{
                        fontFamily: 'Montserrat',
                        backgroundColor: '#fff',
                        // marginBottom: 20,
                        textAlign: 'start',
                        width: '100%',
                        flexDirection: 'column'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: journal?.studentAssignments
                      }}
                    />
                  </div>
                )}
              </AccordionItemWrapper>
            )}
          </div>
        </div>

        <BreakdownPopup
          show={openPopup}
          onHide={handleClosePopup}
          popupContent={selectedStep?.popupContent}
        />
      </>
      <div className='row'>
        <div className='col-12'>
          <div className='journal-entries__back'>
            <NavLink to={props.backRoute}>Back</NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default injectIntl(TestJournalContent, {
  withRef: false
})
