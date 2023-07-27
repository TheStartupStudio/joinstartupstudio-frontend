import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaLightbox from '../../components/MediaLightbox'
import triangleIcon from '../../assets/images/triangle.png'
import { EditorTools } from '@progress/kendo-react-editor'
import './MyTrainingContent.css'
import PedagogyBoxes from './PedagogyBoxes/PedagogyBoxes'
import AccordionItemWrapper from '../LtsJournal/AccordionItemWrapper'
import StepsBox from '../LtsJournal/Steps/StepsBox'

function MyTrainingContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
  const [selectedStepIndex, setSelectedStepIndex] = useState(null)

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

  function loadData() {
    setLoading(true)
    Promise.all([
      getJournal(),
      getUserJournalEntries(),
      getInstructorDebriefData()
    ])
      .then(([journalData, userJournalEntries, instructorDebriefData]) => {
        setJournal(journalData)
        console.log(journalData)

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

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function loadWeekData() {
    setLoading(true)
    Promise.all([getUserJournalWeekEntries(), getInstructorDebriefData()])
      .then(([journalData, userJournalEntries, instructorDebriefData]) => {
        setJournal(journalData)
        console.log(journalData)
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
  }
  return (
    <>
      <>
        <div className={'journal-title'}>{journal?.title}</div>
        <div
          className={'d-flex justify-content-between w-100'}
          style={{ marginTop: 40, gap: 4 }}
        >
          <div className={'video-container'}>
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
          <div className={'lts-triangle-container'}>
            <img
              alt={'triangleIcon'}
              className={'triangle-icon'}
              src={triangleIcon}
            />
          </div>
        </div>
        <div className={'journal-paragraph my-4'}>{journal?.paragraph}</div>
        <div className={'custom-breakdowns-container'}>
          {/*<div style={{ order: 0 }}>*/}
          {/*  {!loading &&*/}
          {/*    journal?.breakdowns*/}
          {/*      ?.slice()*/}
          {/*      ?.sort((a, b) => a.breakdownOrder - b.breakdownOrder)*/}
          {/*      ?.map((breakdown, index) => {*/}
          {/*        return (*/}
          {/*          <React.Fragment key={index}>*/}
          {/*            <BreakdownTextAccordion*/}
          {/*              title={breakdown?.title}*/}
          {/*              content={breakdown?.content}*/}
          {/*              breakdown={breakdown}*/}
          {/*              isOpen={openAccordion === index}*/}
          {/*              toggleAccordion={() => handleAccordionClick(index)}*/}
          {/*              closeOthers={closeOthers}*/}
          {/*            />*/}
          {/*          </React.Fragment>*/}
          {/*        )*/}
          {/*      })}*/}
          {/*</div>*/}

          {!loading && (
            <div style={{ order: 1 }}>
              {
                <AccordionItemWrapper
                  isOpened={openAccordion === 'pedagogy'}
                  handleAccordionClick={() => handleAccordionClick('pedagogy')}
                  isExanded={isExpanded}
                  title={'task breakdown'}
                >
                  {openAccordion === 'pedagogy' && (
                    <div className="accordion-content">
                      <PedagogyBoxes
                        containsTitle={false}
                        boxes={journal?.pedagogy}
                        selectStep={selectStep}
                        selectedStepIndex={selectedStepIndex}
                        handleOpenPopup={handleOpenPopup}
                        selectedStep={selectedStep}
                      />
                    </div>
                  )}
                </AccordionItemWrapper>
              }
            </div>
          )}
          {!loading && (
            <div style={{ order: 2 }}>
              {
                <AccordionItemWrapper
                  isOpened={openAccordion === 'implementationSteps'}
                  handleAccordionClick={() =>
                    handleAccordionClick('implementationSteps')
                  }
                  isExanded={isExpanded}
                  title={'task breakdown'}
                >
                  {openAccordion === 'implementationSteps' && (
                    <div className="accordion-content">
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
              }
            </div>
          )}
        </div>
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
    </>
  )
}

export default injectIntl(MyTrainingContent, {
  withRef: false
})
