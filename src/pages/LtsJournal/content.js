import React, { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlus, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaLightbox from '../../components/MediaLightbox'
import parse from 'html-react-parser'
import EntriesBox from './EntriesBox'
import TableWrapper from './TableWrapper/index'
import TableReflections from './TableReflections/index.js'
import _, { debounce, isEqual } from 'lodash'
import MeetingManager from './ArchiveManager/MeetingManager'
import FeedbackManager from './ArchiveManager/FeedbackManager'
import AccordionItemWrapper from './AccordionItemWrapper'
import MentorMeetingManager from './ArchiveManager/MentorMeetingManager'
import ContentUploads from './ContentUploads/ContentUploads'

const JournalTableRow = (props) => {
  return (
    <tr
      style={{
        borderTopColor: '#f0f0f0',
        borderBottomColor: '#f0f0f0',
        borderWidth: 2
      }}
    >
      {props.children}
    </tr>
  )
}
const JournalTableCell = (props) => {
  const { isGray, colSpan, additionalStyling } = props
  return (
    <td
      colSpan={colSpan}
      style={{
        ...additionalStyling,
        backgroundColor: isGray ? '#dfdfdf' : '#fff'
      }}
    >
      {props.children}
    </td>
  )
}

function LtsJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [meeting, setMeeting] = useState({})
  const [selectedMeeting, setSelectedMeeting] = useState({})
  const [unChangedMeeting, setUnChangedMeeting] = useState({})
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)

  // console.log('unChangedMeeting', unChangedMeeting)

  const handleCloseMeetingModal = () => {
    setShowMeetingModal(false)
  }

  const handleOpenMeetingModal = () => {
    setShowMeetingModal(true)
  }

  const handleCloseDeleteArchiveModal = () => {
    setShowDeleteArchiveModal(false)
  }
  const handleOpenDeleteArchiveModal = () => {
    setShowDeleteArchiveModal(true)
  }

  const saveUnChanged = () => {
    const meeting = unChangedMeeting
    axiosInstance
      .put(
        `/teamMeetings/${selectedMeeting.id}/journal/${+props.match.params
          .journalId}`,
        {
          meeting
        }
      )
      .then((res) => {
        let newJournal = { ...journal }
        let newMeetings = newJournal.meetings
        const foundedIndex = newMeetings.findIndex(
          (meet) => meet.id === res.data.id
        )
        newMeetings[foundedIndex] = res.data
        newJournal.meetings = newMeetings
        setSelectedMeeting({ ...selectedMeeting, ...res.data })
        setJournal({ ...newJournal, meetings: newMeetings })
        setShowMeetingModal(false)
        handleAddMeeting()
      })
  }

  const saveChanged = () => {
    setShowMeetingModal(false)
    handleAddMeeting()
  }

  const handleShowAddReflection = (showAddReflection) => {
    setShowAddReflection(showAddReflection)
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
      `/ltsJournals/${props.match.params.journalId}/watchedVideo`
    )
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}`
      )
      return data
    } catch (err) {}
  }

  async function getUserJournalEntries() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}/userEntries`
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

  useEffect(
    function () {
      loadData()
    },
    [props.match.params.journalId]
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

  const handleAddMeeting = () => {
    const meeting = {
      title: '',
      journalId: props.match.params.journalId,
      meetingDate: '',
      purpose: '',
      attendance: '',
      meetingAgenda: '',
      notes: '',
      resultsOfMeeting: ''
    }
    axiosInstance
      .post(`/teamMeetings/`, {
        meeting
      })
      .then((res) => {
        const newMeetings = [...journal.meetings, res.data]
        setJournal({ ...journal, meetings: newMeetings })
        const latestMeeting = getLatestUpdatedElement(newMeetings)
        setSelectedMeeting(latestMeeting)
        setShowMeetingModal(false)
      })
  }

  const getLatestUpdatedElement = (array) => {
    const latestUpdatedElement = array?.reduce((latest, current) => {
      if (!latest || new Date(current.updatedAt) > new Date(latest.updatedAt)) {
        return current
      }
      return latest
    }, null)
    return latestUpdatedElement
  }

  const handleDeleteMeeting = (meeting) => {
    axiosInstance
      .delete(`/teamMeetings/${meeting.id}`)
      .then((res) => {
        const deletedMeetingId = res.data.existingMeeting.id
        setJournal((prevJournal) => {
          const newJournal = { ...prevJournal }
          const newMeetings = newJournal.meetings.filter(
            (meet) => meet.id !== deletedMeetingId
          )
          newJournal.meetings = newMeetings
          const latestMeeting = getLatestUpdatedElement(newMeetings)
          setSelectedMeeting(latestMeeting)
          handleCloseDeleteArchiveModal()
          return newJournal
        })
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error deleting meeting:', error)
      })
  }

  const handleSelectedArchive = (value) => {
    if (value) {
      setSelectedMeeting(value)
      setUnChangedMeeting(value)
    }
    // setUnChangedMeeting(value)
  }

  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="journal-entries__back">
            <NavLink to={props.backRoute}>Back</NavLink>
          </div>

          <h4 className="page-card__content-title">{journal.title}</h4>

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

          {journal?.content?.includes('<div') ||
          journal?.content?.includes('<p') ? (
            parse(`${journal.content}`)
          ) : (
            <p className="page-card__content-description">{journal.content}</p>
          )}
        </div>
      </div>

      <div className="row">
        {journal.accordions && journal.accordions.length && journal.accordions.map(accordion => (
        <div className="col-12">
          <AccordionItemWrapper
              isOpened={openAccordion === `accordion-${accordion.id}`}
              handleAccordionClick={() =>
                handleAccordionClick(`accordion-${accordion.id}`)
              }
              isExanded={false}
              title={accordion.title}
            >
              {openAccordion === `accordion-${accordion.id}` && (
                <>
                  <div className="accordion-content">
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
                          marginBottom: 20,
                          textAlign: 'start',
                          width: '100%'
                        }}
                      >
                        <div className="col-12">
                          <div className="">
                            <EntriesBox
                              entries={accordion.ltsJournalAccordionEntries}
                              entryBoxTitle={journal?.title}
                              journal={journal}
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
                      </div>
                    </div>
                  </div>
                </>
              )}
            </AccordionItemWrapper>
          </div>
        ))}
        {journal.reflectionsTable && journal.reflectionsTable.length ? (
          <>
            {journal.reflectionsTable.map((reflectionTable) => (
              <div className="col-12" key={reflectionTable.id}>
                <TableWrapper title={reflectionTable.title}>
                  <TableReflections
                    loadData={loadData}
                    start={reflectionTable.startDate}
                    end={reflectionTable.endDate}
                    reflectionTable={reflectionTable}
                    reflectionTableEntries={
                      reflectionTable.reflectionsTableEntries
                    }
                    userReflectionTableEntries={
                      reflectionTable.userReflectionsTableEntries
                    }
                  />
                </TableWrapper>
              </div>
            ))}
          </>
        ) : null}

        {journal?.meetings && journal?.meetings?.length ? (
          <MeetingManager journal={journal} />
        ) : null}
        {journal?.feedbacks && journal?.feedbacks?.length ? (
          <FeedbackManager journal={journal} />
        ) : null}
        {journal?.mentorMeetings && journal?.mentorMeetings?.length ? (
          <MentorMeetingManager journal={journal} />
        ) : null}

        {journal?.contentUploads ? <ContentUploads journal={journal} /> : null}
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
