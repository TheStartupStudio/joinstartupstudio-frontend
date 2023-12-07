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
import CoreVectorsImage from '../../assets/images/CoreVectors - LTS-1200px.png'
import LtsJournalReflection from '../LtsJournal/reflection'
import markdown from '../LtsJournal/markdown'
import EntriesBox from '../LtsJournal/EntriesBox'

const WelcomeToTraining = () => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '40px 20px 10px 20px'
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #e3e3e3',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          paddingBottom: 30
        }}
      >
        <div
          style={{
            textAlign: 'center',
            font: 'normal normal normal 25px/17px Montserrat',
            letterSpacing: 1,
            color: '#333D3D'
          }}
        >
          Understanding{' '}
          <span
            style={{
              textAlign: 'center',
              font: 'normal normal bold 25px/17px Montserrat',
              letterSpacing: 1,
              color: '#51C7DF'
            }}
          >
            OUR MISSION
          </span>
        </div>
        <div
          style={{
            textAlign: 'center',
            font: 'normal normal normal 14px/17px Montserrat',
            letterSpacing: 0.56,
            color: '#333D3D'
          }}
        >
          Our mission is to provide education a solution capable of transforming
          classrooms so students can discover who they are, what they can do,
          and how they can prove it.
        </div>
        <div
          style={{
            textAlign: 'center',
            font: 'normal normal normal 16px/17px Montserrat',
            letterSpacing: 0.64,
            color: '#FF3399'
          }}
        >
          Learn to Start has been built{' '}
          <span style={{ fontWeight: 'bold' }}>FROM</span> the markets,{' '}
          <span style={{ fontWeight: 'bold' }}>FOR</span> education.
        </div>
      </div>
      <div
        style={{
          padding: '30px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 15
        }}
      >
        <div
          style={{
            textAlign: 'center',
            font: 'normal normal bold 25px/17px Montserrat',
            letterSpacing: 1,
            color: '#51C7DF',
            lineHeight: 1
          }}
        >
          ONE POWERFUL SOLUTION
        </div>
        <div
          style={{
            textAlign: 'center',
            font: 'normal normal normal 20px/17px Montserrat',
            letterSpacing: 0.8,
            color: '#333D3D'
          }}
        >
          Five Critical Parts
        </div>
        <div>
          <img style={{ width: '100%' }} src={CoreVectorsImage} />
        </div>
      </div>
    </div>
  )
}

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
  const [selectedPedagogy, setSelectedPedagogy] = useState(null)
  const [selectedPedagogyIndex, setSelectedPedagogyIndex] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null)
  const [selectedStepIndex, setSelectedStepIndex] = useState(null)
  // let [showAddReflection, setShowAddReflection] = useState({})

  // console.log(selectedPedagogy)
  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
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
        `/my-training/${+props.match.params.id}`
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

  function loadData() {
    setLoading(true)
    Promise.all([getJournal(), getUserJournalEntries()])
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

  function loadWeekData() {
    setLoading(true)
    Promise.all([getUserJournalWeekEntries()])
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
    setSelectedPedagogy(null)
    setSelectedPedagogyIndex(null)
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

  const selectPedagogyOption = (option, index) => {
    setSelectedPedagogy(option)
    setSelectedPedagogyIndex(index)
  }

  const handleShowAddReflection = (showAddReflection) => {
    setShowAddReflection(showAddReflection)
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

  const trainingIndex = props.trainings.findIndex(
    (training) => training.id === journal.id
  )

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
        <div className={'journal-paragraph my-4'}>{journal?.openingText}</div>
        <div className={'custom-breakdowns-container'}>
          {!journal?.hasValueProposition ? (
            <>
              {!loading && (
                <div style={{ order: 1 }}>
                  {
                    <AccordionItemWrapper
                      isOpened={openAccordion === 'pedagogy'}
                      handleAccordionClick={() =>
                        handleAccordionClick('pedagogy')
                      }
                      isExanded={isExpanded}
                      title={'Lts Pedagogy'}
                    >
                      {openAccordion === 'pedagogy' && (
                        <>
                          {trainingIndex === 0 && <WelcomeToTraining />}
                          <div className="accordion-content">
                            <PedagogyBoxes
                              containsTitle={false}
                              boxes={journal?.pedagogyOptions}
                              selectPedagogy={selectPedagogyOption}
                              selectedPedagogyIndex={selectedPedagogyIndex}
                              handleOpenPopup={handleOpenPopup}
                              selectedPedagogy={selectedPedagogy}
                            />
                          </div>
                        </>
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
                      title={'Lts Implementation'}
                    >
                      {openAccordion === 'implementationSteps' && (
                        <div
                          // className="accordion-content"
                          style={{
                            padding: '10px 20px ',
                            backgroundColor: '#ffffff',
                            fontSize: 13,
                            fontWeight: 500,
                            textAlign: 'left',
                            color: '#333D3D'
                          }}
                        >
                          <StepsBox
                            containsTitle={false}
                            steps={journal?.implementationSteps}
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
            </>
          ) : (
            <>
              {!loading && (
                <div style={{ order: 2 }}>
                  {
                    <AccordionItemWrapper
                      isOpened={openAccordion === 'valueProposition'}
                      handleAccordionClick={() =>
                        handleAccordionClick('valueProposition')
                      }
                      isExanded={isExpanded}
                      title={'INDIVIDUAL VALUE PROPOSITION'}
                    >
                      {openAccordion === 'valueProposition' && (
                        <div
                          // className="accordion-content"
                          style={{
                            padding: '30px 20px ',
                            backgroundColor: '#ffffff',
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: 'left',
                            color: '#333D3D'
                          }}
                        >
                          <div>
                            <p>
                              Your value proposition consists of three parts:
                              your passions/interests, your skill(s), and the
                              outcomes you can create consistently. In other
                              words, the answers to the three program questions:
                              Who are you? What can you do? How do you prove it?
                            </p>
                            <p>
                              The table below is the same one inside of the
                              students’ LTS Journal. Once you complete it for
                              yourself, you now have a model to use when giving
                              this task to students. You will have an
                              understanding of the experience and be able to
                              speak to how you took all of your data and turned
                              it into this unique statement of value.
                            </p>

                            <EntriesBox
                              entries={journal.entries}
                              entryBoxTitle={journal?.title}
                              journal={journal}
                              isEditable={true}
                              userJournalEntries={userJournalEntries}
                              deleteReflection={(entry, userJournalEntry) =>
                                deleteReflection(entry, userJournalEntry)
                              }
                              updateReflection={(entry, userJournalEntry) =>
                                updateReflection(entry, userJournalEntry)
                              }
                              addReflection={(entry) => addReflection(entry)}
                              handleShowAddReflection={(reflection) =>
                                handleShowAddReflection(reflection)
                              }
                              showAddReflection={showAddReflection}
                            />
                          </div>
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
                      isOpened={openAccordion === 'portfolio'}
                      handleAccordionClick={() =>
                        handleAccordionClick('portfolio')
                      }
                      isExanded={isExpanded}
                      title={'PORTFOLIO'}
                    >
                      {openAccordion === 'portfolio' && (
                        <div
                          // className="accordion-content"
                          style={{
                            padding: '30px 20px ',
                            backgroundColor: '#ffffff',
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: 'left',
                            color: '#333D3D'
                          }}
                        >
                          <p>
                            Your portfolio represents the full communication of
                            your value proposition. It tells the world: this is
                            who I am, this is what I can do, and this is how I
                            prove it. It includes a biography, market-ready
                            content, and your resume. The button below will take
                            you to the My Portfolio section of this platform.
                            You should complete the biography section - you will
                            be able to use it as a model for the first task
                            students do when you introduce them to the platform.
                            Then, add at least two pieces of content to the
                            portfolio. Some examples of content are: lesson
                            plans, slide decks, social media content, articles
                            you have written. Finally, complete your work and
                            education experiences so the students can see your
                            resume.
                          </p>
                          <a
                            className="btn btn-info text-light default-btn"
                            href={`/preview-portfolio`}
                          >
                            MY PORTFOLIO
                          </a>
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
                      isOpened={openAccordion === 'certificate'}
                      handleAccordionClick={() =>
                        handleAccordionClick('certificate')
                      }
                      isExanded={isExpanded}
                      title={'CERTIFICATE'}
                    >
                      {openAccordion === 'certificate' && (
                        <div
                          // className="accordion-content"
                          style={{
                            padding: '30px 20px ',
                            backgroundColor: '#ffffff',
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: 'left',
                            color: '#333D3D'
                          }}
                        >
                          <p>
                            The Certification Process allows students to prove
                            they have specific employability skills that can
                            transcend industries. You already have these skills,
                            that’s why you’re in the position you are in. You
                            need to understand the Certification Process from
                            the student perspective and be able to guide them to
                            earning proficiency in each skill. Click the My
                            Certification button below and choose two of the
                            skills to complete. Upload one or more of your
                            portfolio items, and complete the explanation
                            portion for each. Now, you have a model for
                            students.
                          </p>
                          <button className="default-btn">
                            MY CERTIFICATION
                          </button>
                        </div>
                      )}
                    </AccordionItemWrapper>
                  }
                </div>
              )}
            </>
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
