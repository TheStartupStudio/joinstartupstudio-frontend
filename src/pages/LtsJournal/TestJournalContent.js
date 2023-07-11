import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlus, faPlay, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LtsJournalReflection from './reflection'
import ReactPlayer from 'react-player'
import MediaLightbox from '../../components/MediaLightbox'
import markdown from './markdown'
import parse from 'html-react-parser'
import triangleIcon from '../../assets/images/triangle.png'
import BreakdownTextAccordion from './BreakdownTextAccordion'
import './BreakdownTextAccordion.css'
import KendoTextEditor from '../../components/JournalsManagement/TextEditor'
import { EditorTools } from '@progress/kendo-react-editor'
import StepOne from '../../assets/images/step-1.PNG'
import StepTwo from '../../assets/images/step-2.PNG'
import StepThree from '../../assets/images/step-3.PNG'
import StepFour from '../../assets/images/step-4.PNG'
import BreakdownPopup from '../../components/Modals/BreakdownPopup'

function TestJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [step, setStep] = useState('step-0')
  const [openPopup, setOpenPopup] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [stepData, setStepData] = useState({})

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
    journalId: props.match.params.id
  })

  const newInstructorBriefData = {
    checkbox1: instructorDebrief?.checkbox1,
    checkbox2: instructorDebrief?.checkbox2,
    checkbox3: instructorDebrief?.checkbox3,
    textEditorContent: instructorDebrief?.textEditorContent
  }
  const onSubmitInstructorDebrief = (data) => {
    axiosInstance
      .post(`/ltsJournals/${props.match.params.id}/instructor-debrief`, {
        ...data
      })
      .then((res) => {
        const updatedInstructorDebriefData = res.data
        setInstructorDebrief({
          ...instructorDebrief,
          checkbox1: updatedInstructorDebriefData.checkbox1,
          checkbox2: updatedInstructorDebriefData.checkbox2,
          checkbox3: updatedInstructorDebriefData.checkbox3,
          textEditorContent: updatedInstructorDebriefData.textEditorContent
        })
      })
  }

  async function saveWatchData(data) {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.journalId}/videoWatchData`,
      {
        videoWatchData: JSON.stringify(data)
      }
    )
  }

  async function saveVideoWatched() {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.id}/watchedVideo`
    )
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
      // if (history.location.pathname.includes('week')) {
      //   if (data.length > 0 && redir) {
      //     if (data[0].children && data[0].children.length > 0) {
      //       history.push(`week/${data[0].children[0].id}`)
      //     } else {
      //       history.push(`week/${data[0].id}`)
      //     }
      //   }
      // }
      return data
    } catch (err) {}
  }
  // useEffect(() => {
  //   getJournalView()
  // }, [])

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
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${+props.match.params.id}/instructor-debrief`
      )
      return data
    } catch (e) {}
  }

  const [stepOneData, setStepOneData] = useState(null)
  const [stepTwoData, setStepTwoData] = useState(null)
  const [stepThreeData, setStepThreeData] = useState(null)
  const [stepFourData, setStepFourData] = useState(null)

  function loadData() {
    setLoading(true)
    Promise.all([
      getJournal(),
      getUserJournalEntries(),
      getInstructorDebriefData()
    ])
      .then(([journalData, userJournalEntries, instructorDebriefData]) => {
        setJournal(journalData)

        if (
          journalData.userEntry &&
          journalData.userEntry.length > 0 &&
          journalData.userEntry[0].videoWatchData
        ) {
          try {
            setVideoWatchData(
              JSON.parse(journalData.userEntry[0].videoWatchData)
            )
          } catch (err) {}
        }
        setUserJournalEntries(userJournalEntries)

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
              textEditorContent: instructorDebriefData.textEditorContent
            })
          }
        }
        if (journalData?.steps?.length) {
          console.log(journalData?.steps)
          setStepOneData(journalData.steps.find((s) => s.type === 'step-1'))
          setStepTwoData(journalData.steps.find((s) => s.type === 'step-2'))
          setStepThreeData(journalData.steps.find((s) => s.type === 'step-3'))
          setStepFourData(journalData.steps.find((s) => s.type === 'step-4'))
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function loadWeekData() {
    setLoading(true)
    Promise.all([getJournalWeek(), getUserJournalWeekEntries()])
      .then(([journalData, userJournalEntries]) => {
        setJournal(journalData)
        if (
          journalData.userEntry &&
          journalData.userEntry.length > 0 &&
          journalData.userEntry[0].videoWatchData
        ) {
          try {
            setVideoWatchData(
              JSON.parse(journalData.userEntry[0].videoWatchData)
            )
          } catch (err) {}
        }
        setUserJournalEntries(userJournalEntries)

        if (props.contentContainer && props.contentContainer.current) {
          props.contentContainer.current.scrollTop = 0
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // console.log(journal)
  // useEffect(() => {
  //   console.log(journal)
  //   console.log(step)
  //   if (step) {
  //     const stepData = journal?.steps?.find((s) => s?.type === 'step-1')
  //     console.log(stepData)
  //     setStepData(stepData)
  //   }
  // }, [step])
  // console.log(stepData)
  // const stepDataOne = journal?.steps?.find((s) => s?.type === 'step-1')
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

  function deleteReflection(entry, userJournalEntry) {
    return (data) => {
      let filtered = userJournalEntries[entry.id].filter(
        (mapUserJournalEntry) => {
          return mapUserJournalEntry.id !== userJournalEntry.id
        }
      )

      if (filtered.length) {
        setUserJournalEntries({
          ...userJournalEntries,
          [entry.id]: filtered
        })
      } else {
        delete userJournalEntries[entry.id]

        setUserJournalEntries({
          ...userJournalEntries
        })
      }
    }
  }

  function addReflection(entry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: [...(userJournalEntries[entry.id] || []), data.entry]
      })
      setShowAddReflection({ ...showAddReflection, [entry.id]: false })

      props.saved && props.saved(data.journal)
    }
  }

  function updateReflection(entry, userJournalEntry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: userJournalEntries[entry.id].map((mapUserJournalEntry) => {
          return mapUserJournalEntry.id === userJournalEntry.id
            ? data.entry
            : mapUserJournalEntry
        })
      })

      props.saved && props.saved(data.journal)
    }
  }

  if (!journal) {
    return null
  }

  let videos = (
    journal.videos && journal.videos.constructor == Array
      ? journal.videos
      : [journal.video]
  ).filter(Boolean)

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  const handleChangeInstructorDebrief2 = (name, value) => {
    const newInstructorDebrief = {
      ...instructorDebrief,
      [name]: value
    }
    setInstructorDebrief(newInstructorDebrief)
  }
  const {
    Bold,
    Italic,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FontSize,
    FontName,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml
  } = EditorTools

  const closeOthers = () => {
    setOpenAccordion(null)
  }

  const selectedStep = (step) => {
    setStep(step)
  }

  const handleOpenPopup = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const handleRenderStepContent = () => {
    if (step === 'step-1') {
      return stepOneData
    } else if (step === 'step-2') {
      return stepTwoData
    } else if (step === 'step-3') {
      return stepThreeData
    } else if (step === 'step-4') {
      return stepFourData
    }
  }

  return (
    <>
      <>
        {/*{journals?.map((journal, index) => {*/}
        {/*  return (*/}
        {
          <>
            <div
              style={{
                borderBottom: '1px solid #e3e3e3',
                padding: '15px 10px',
                textTransform: 'uppercase',
                font: 'normal normal bold 20px Montserrat',
                letterSpacing: 0.96,
                color: '#231F20'
              }}
            >
              {journal?.title}
            </div>
            <div
              className={'d-flex justify-content-between w-100'}
              style={{ marginTop: 40 }}
            >
              <div
                style={{
                  width: '60%',
                  // backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'end',
                  height: '100%'
                }}
              >
                {videos &&
                  videos.constructor == Array &&
                  videos.map((video, index) => (
                    <MediaLightbox
                      video={video}
                      key={index}
                      show={showVideo === video.id}
                      onClose={() => setShowVideo(false)}
                      // watchData={videoWatchData}
                      // onVideoData={saveWatchData}
                      // onVideoWatched={saveVideoWatched}
                    />
                  ))}
                {videos && videos.constructor == Array && videos.length > 0 && (
                  <div
                    className={`journal-entries__videos journal-entries__videos--${
                      videos.length > 1 ? 'multiple' : 'single'
                    }`}
                  >
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className={`journal-entries__video${
                          journal.content == '' ? '--welcome-video' : ''
                        }`}
                      >
                        <div
                          className={`journal-entries__video-thumbnail${
                            journal.content == '' ? '--welcome-video' : ''
                          }`}
                          onClick={() => setShowVideo(video.id)}
                        >
                          <img src={video.thumbnail} />
                          <div
                            className={`journal-entries__video-thumbnail-icon${
                              journal.content == '' ? '--welcome-video' : ''
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
              <div style={{ width: '40%' }}>
                <img
                  alt={'triangleIcon'}
                  src={triangleIcon}
                  style={{ width: 180, height: 180 }}
                />
              </div>
            </div>
            <div
              className={'my-4'}
              style={{
                font: 'normal normal 500 10.2px/16px Montserrat',
                letterSpacing: 0.52,
                color: '#333D3D'
              }}
            >
              {journal?.paragraph}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ order: 2 }}>
                {!loading &&
                  journal?.breakdowns
                    ?.slice()
                    ?.sort((a, b) => a.breakdownOrder - b.breakdownOrder)
                    ?.map((breakdown, index) => {
                      return (
                        <React.Fragment key={index}>
                          <BreakdownTextAccordion
                            title={breakdown?.title}
                            content={breakdown?.content}
                            breakdown={breakdown}
                            isOpen={openAccordion === index}
                            toggleAccordion={() => handleAccordionClick(index)}
                            closeOthers={closeOthers}
                          />
                        </React.Fragment>
                      )
                    })}
              </div>
              <div style={{ order: 1 }}>
                {!loading && journal?.hasInstructorDebrief && (
                  <div
                    className={`accordion ${
                      openAccordion === 'steps' ? 'expanded' : ''
                    }`}
                  >
                    <div
                      className="accordion-header"
                      onClick={() => handleAccordionClick('steps')}
                    >
                      <div className={'accordion-header-title'}>
                        {'Task breakdown'}
                      </div>
                      <span
                        className={`accordion-icon ${
                          openAccordion === 'steps' ? 'expanded' : ''
                        }`}
                      >
                        {isExpanded ? (
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="me-2 me-md-0 arrow"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="me-2 me-md-0 arrow"
                          />
                        )}
                      </span>
                    </div>
                    {openAccordion === 'steps' && (
                      <>
                        <div className="accordion-content">
                          <div
                            style={{
                              font: 'normal normal 500 10.2px/17px Montserrat',
                              letterSpacing: 0.18,
                              color: '#333D3D',
                              // display: 'grid',
                              gridTemplateColumns: 'repeat(4,1fr)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '20px 0',
                              marginBottom: '20px',
                              borderBottom:
                                step !== 'step-0'
                                  ? '1px solid #dfdfdf'
                                  : '0px solid #dfdfdf'
                            }}
                          >
                            <img
                              src={StepOne}
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'contain',
                                filter:
                                  step !== null &&
                                  typeof step !== 'undefined' &&
                                  step !== 'step-0'
                                    ? step !== 'step-1'
                                      ? 'grayscale(100%)'
                                      : 'grayscale(0%)'
                                    : 'grayscale(0%)'
                              }}
                              onClick={() => selectedStep('step-1')}
                              alt={'step-1'}
                            />
                            <img
                              src={StepTwo}
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'contain',
                                filter:
                                  step !== null &&
                                  typeof step !== 'undefined' &&
                                  step !== 'step-0'
                                    ? step !== 'step-2'
                                      ? 'grayscale(100%)'
                                      : 'grayscale(0%)'
                                    : 'grayscale(0%)'
                              }}
                              onClick={() => selectedStep('step-2')}
                              alt={'step-2'}
                            />
                            <img
                              src={StepThree}
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'contain',
                                filter:
                                  step !== null &&
                                  typeof step !== 'undefined' &&
                                  step !== 'step-0'
                                    ? step !== 'step-3'
                                      ? 'grayscale(100%)'
                                      : 'grayscale(0%)'
                                    : 'grayscale(0%)'
                              }}
                              onClick={() => selectedStep('step-3')}
                              alt={'step-3'}
                            />

                            <img
                              src={StepFour}
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'contain',
                                filter:
                                  step !== null &&
                                  typeof step !== 'undefined' &&
                                  step !== 'step-0'
                                    ? step !== 'step-4'
                                      ? 'grayscale(100%)'
                                      : 'grayscale(0%)'
                                    : 'grayscale(0%)'
                              }}
                              onClick={() => selectedStep('step-4')}
                              alt={'step-4'}
                            />
                          </div>
                          {step === 'step-1' && (
                            <div
                              style={{
                                fontFamily: 'Montserrat',
                                backgroundColor: '#fff'
                              }}
                              dangerouslySetInnerHTML={{
                                __html: stepOneData && stepOneData?.stepContent
                              }}
                            />
                          )}{' '}
                          {step === 'step-2' && (
                            <div
                              style={{
                                fontFamily: 'Montserrat',
                                backgroundColor: '#fff'
                              }}
                              dangerouslySetInnerHTML={{
                                __html: stepTwoData && stepTwoData?.stepContent
                              }}
                            />
                          )}
                          {step === 'step-3' && (
                            <div
                              style={{
                                fontFamily: 'Montserrat',
                                backgroundColor: '#fff'
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  stepThreeData && stepThreeData?.stepContent
                              }}
                            />
                          )}
                          {step === 'step-4' && (
                            <div
                              style={{
                                fontFamily: 'Montserrat',
                                backgroundColor: '#fff'
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  stepFourData && stepFourData?.stepContent
                              }}
                            />
                          )}
                          {step !== 'step-0' && (
                            <div
                              className={`d-flex justify-content-start
                          mt-2`}
                            >
                              <button
                                style={{
                                  backgroundColor: '#51c7df',
                                  color: '#fff',
                                  fontSize: 9
                                }}
                                onClick={() => handleOpenPopup()}
                                className="px-4 py-3 border-0 color transform text-uppercase my-1"
                              >
                                WHAT TO EXPECT FROM STUDENTS
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div style={{ order: 3 }}>
                {!loading && journal?.hasInstructorDebrief && (
                  <div
                    className={`accordion ${
                      openAccordion === 'instructor' ? 'expanded' : ''
                    }`}
                  >
                    <div
                      className="accordion-header"
                      onClick={() => handleAccordionClick('instructor')}
                    >
                      <div className={'accordion-header-title'}>
                        {'Instructor debrief'}
                      </div>
                      <span
                        className={`accordion-icon ${
                          openAccordion === 'instructor' ? 'expanded' : ''
                        }`}
                      >
                        {isExpanded ? (
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="me-2 me-md-0 arrow"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className="me-2 me-md-0 arrow"
                          />
                        )}
                      </span>
                    </div>
                    {openAccordion === 'instructor' && (
                      <div className="accordion-content">
                        <div
                          style={{
                            font: 'normal normal 500 11px/17px Montserrat',
                            letterSpacing: 0.18,
                            color: '#333D3D'
                          }}
                        >
                          Welcome to the instructor debrief section of this
                          task. This tool is designed to help you use the LTS
                          program and platform to their maximum potential, and
                          to provide LTS with feedback so we can continue to
                          meet your needs.
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
                          <div class="d-flex mb-1 ">
                            <div
                              style={{
                                width: '25px',
                                flexShrink: 0,
                                marginRight: 5
                              }}
                            >
                              <input
                                style={{ width: '15px', height: '15px' }}
                                className="form-check-input "
                                type="checkbox"
                                checked={instructorDebrief.checkbox1}
                                id="flexCheckDefault"
                                onChange={(e) =>
                                  handleChangeInstructorDebrief2(
                                    'checkbox1',
                                    e.target.checked
                                  )
                                }
                              />
                            </div>
                            <div
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                              style={{
                                font: 'normal normal 500 12px/18px Montserrat !important',
                                letterSpacing: 0.24,
                                color: '#231F20',
                                marginTop: '0.250rem',
                                fontSize: 12
                              }}
                            >
                              Give each student an opportunity to use their
                              voice.
                            </div>
                          </div>
                          <div class="d-flex mb-1">
                            <div
                              style={{
                                width: '25px',
                                flexShrink: 0,
                                marginRight: 5
                              }}
                            >
                              <input
                                style={{ width: '15px', height: '15px' }}
                                className="form-check-input "
                                type="checkbox"
                                checked={instructorDebrief.checkbox2}
                                id="flexCheckDefault"
                                onChange={(e) =>
                                  handleChangeInstructorDebrief2(
                                    'checkbox2',
                                    e.target.checked
                                  )
                                }
                              />
                            </div>
                            <div
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
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
                          <div class="d-flex mb-1 ">
                            <div
                              style={{
                                width: '25px',
                                flexShrink: 0,
                                marginRight: 5
                              }}
                            >
                              <input
                                style={{ width: '15px', height: '15px' }}
                                className="form-check-input "
                                type="checkbox"
                                checked={instructorDebrief.checkbox3}
                                id="flexCheckDefault"
                                onChange={(e) =>
                                  handleChangeInstructorDebrief2(
                                    'checkbox3',
                                    e.target.checked
                                  )
                                }
                              />
                            </div>

                            <div
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                              style={{
                                font: 'normal normal 500 12px/18px Montserrat !important',
                                letterSpacing: 0.24,
                                color: '#231F20',
                                marginTop: '0.250rem',
                                fontSize: 12
                              }}
                            >
                              Give students adequate time to complete work
                              inside of their Journal or Portfolio.
                            </div>
                          </div>
                        </>
                        <>
                          <>
                            <div
                              style={{
                                font: 'normal normal 600 11px/17px Montserrat !important',
                                letterSpacing: 0.18,
                                color: '#000000',
                                paddingTop: '15px',
                                paddingBottom: '6px'
                              }}
                            >
                              Please submit any questions or feedback regarding
                              this task in the curriculum to the LTS team.
                            </div>
                            <KendoTextEditor
                              minHeight={150}
                              value={instructorDebrief?.textEditorContent}
                              handleChange={(e) => {
                                handleChangeInstructorDebrief2(
                                  'textEditorContent',
                                  e
                                )
                              }}
                              tools={[
                                [Bold, Italic],
                                [
                                  AlignLeft,
                                  AlignCenter,
                                  AlignRight,
                                  AlignJustify
                                ],
                                [Indent, Outdent],
                                [OrderedList, UnorderedList],
                                FontSize,
                                FontName,
                                FormatBlock,
                                [Undo, Redo],
                                [Link, Unlink, InsertImage, ViewHtml]
                              ]}
                            />
                          </>
                        </>
                        <div className={'d-flex justify-content-end mt-3'}>
                          <button
                            style={{
                              backgroundColor: '#51c7df',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600
                            }}
                            className="px-4 py-2 border-0 color transform my-1"
                            onClick={() =>
                              onSubmitInstructorDebrief(newInstructorBriefData)
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <BreakdownPopup
              show={openPopup}
              onHide={handleClosePopup}
              popupContent={handleRenderStepContent()?.popupContent}
            />
          </>
        }
        {/*// )*/}
        {/*// })}*/}
      </>
      <div className="row">
        <div className="col-12">
          <div className="journal-entries__back">
            <NavLink to={props.backRoute}>Back</NavLink>
          </div>

          {/*<h4 className="page-card__content-title">{journal.title}</h4>*/}

          {/*{journal?.content?.includes('<div') ||*/}
          {/*journal?.content?.includes('<p') ? (*/}
          {/*  parse(`${journal.content}`)*/}
          {/*) : (*/}
          {/*  <p className="page-card__content-description">{journal.content}</p>*/}
          {/*)}*/}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="journal-entries">
            {journal.entries &&
              journal.entries.map((entry) => (
                <div className="journal-entries__entry" key={entry.id}>
                  <h5
                    className={
                      'journal-entries__entry-title' +
                      (entry.title.indexOf('**') !== -1
                        ? ' journal-entries__entry-title--md'
                        : '')
                    }
                    dangerouslySetInnerHTML={{
                      __html:
                        entry.title.indexOf('<h2>') === -1
                          ? markdown(entry.title)
                          : entry.title.replace(
                              new RegExp('\r?\n', 'g'),
                              '<br />'
                            )
                    }}
                  ></h5>

                  <div className="journal-entries__entry-reflections">
                    {/* List created reflections */}
                    {userJournalEntries[entry.id] &&
                      userJournalEntries[entry.id].map((userJournalEntry) => (
                        <LtsJournalReflection
                          key={userJournalEntry.id}
                          journal={journal}
                          journalEntry={entry}
                          entry={userJournalEntry}
                          deleted={deleteReflection(entry, userJournalEntry)}
                          saved={updateReflection(entry, userJournalEntry)}
                        />
                      ))}

                    {/* Add new reflection */}
                    {(!userJournalEntries[entry.id] ||
                      showAddReflection[entry.id]) && (
                      <LtsJournalReflection
                        journal={journal}
                        journalEntry={entry}
                        entry={null}
                        saved={addReflection(entry)}
                        showCancel={!!userJournalEntries[entry.id]}
                        cancel={(e) => {
                          setShowAddReflection({
                            ...showAddReflection,
                            [entry.id]: false
                          })
                        }}
                      />
                    )}

                    {/* Show add new reflection */}
                    <div
                      className={`journal-entries__entry-reflections-actions ${
                        userJournalEntries[entry.id] &&
                        !showAddReflection[entry.id]
                          ? 'active'
                          : ''
                      }`}
                    >
                      <a
                        href="#"
                        className="journal-entries__entry-reflections-action"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowAddReflection({
                            ...showAddReflection,
                            [entry.id]: true
                          })
                        }}
                      >
                        Add reflection <FontAwesomeIcon icon={faPlus} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default injectIntl(TestJournalContent, {
  withRef: false
})
