import React, { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlus, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LtsJournalReflection from './reflection'
import ReactPlayer from 'react-player'
import MediaLightbox from '../../components/MediaLightbox'
import markdown from './markdown'
import parse from 'html-react-parser'
import EntriesBox from './EntriesBox'
import TableWrapper from './TableWrapper/index'
import TableReflections from './TableReflections.js'
import { Table } from 'react-bootstrap'
import ArchiveSelector from '../../components/Modals/ArchiveSelector/ArchiveSelector'
import MeetingModal from '../../components/Modals/MeetingModal'
import _, { debounce, isEqual } from 'lodash'
import DeleteArchiveModal from '../../components/Modals/DeleteArchiveModal'
import MeetingManager from './ArchiveManager/MeetingManager'
import FeedbackManager from './ArchiveManager/FeedbackManager'
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

const JournalTableCellInput = (props) => {
  const { title, type, value, handleChange, width } = props
  return (
    <div
      style={{
        display: 'flex',
        gap: 20
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', textWrap: 'nowrap' }}
      >
        {title}
      </div>
      <div className={` ${width ? '' : 'w-100'}`}>
        <input
          className={`my-1  py-2 px-2 text-dark `}
          type={type}
          style={{
            borderRadius: '0.25rem',
            backgroundColor: 'white',
            color: '#000',
            width: width ?? '100%',
            border: '1px solid #e3e3e3'
          }}
          name={'meetingDate'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const handleChangeMeeting = (name, value) => {
    let newSelectedMeeting = { ...selectedMeeting }
    newSelectedMeeting[name] = value
    setSelectedMeeting(newSelectedMeeting)
    const hasChanged = !isEqual(newSelectedMeeting, selectedMeeting)
    setHasUnsavedChanges(hasChanged)

    debounce(updateMeeting, newSelectedMeeting)
  }

  const updateMeeting = async (name, value) => {
    try {
      await axiosInstance
        .put(
          `/teamMeetings/${selectedMeeting?.id}/journal/${+props.match.params
            .journalId}`,
          {
            meeting: value
          }
        )
        .then((res) => console.log(res.data))

      setJournal((prevJournal) => {
        const newJournal = { ...prevJournal }
        const newMeetings = [...newJournal.meetings]
        const meetingIndex = newMeetings.findIndex(
          (meet) => meet.id === selectedMeeting?.id
        )
        newMeetings[meetingIndex] = value
        newJournal.meetings = newMeetings
        return newJournal
      })
    } catch (error) {
      // Handle errors
      console.error('Error updating meeting:', error)
    }
  }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}`
      )
      return data
    } catch (err) {}
  }

  function getMeetings() {
    try {
      axiosInstance
        .get(`/ltsJournals/${props.match.params.journalId}`)
        .then((res) => {
          const data = res.data
          if (data?.meetings && data?.meetings?.length) {
            const latestMeeting = getLatestUpdatedElement(data?.meetings)
            if (latestMeeting) {
              setUnChangedMeeting(latestMeeting)
              setSelectedMeeting(latestMeeting)
            }
          }
        })
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
      getMeetings()
    },
    [props.match.params.journalId]
  )

  const getLatestUpdatedElement = (array) => {
    const latestUpdatedElement = array?.reduce((latest, current) => {
      if (!latest || new Date(current.updatedAt) > new Date(latest.updatedAt)) {
        return current
      }
      return latest
    }, null)
    return latestUpdatedElement
  }

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
        <div className="col-12">
          <div className="journal-entries">
            <EntriesBox
              entries={journal.entries}
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
        {journal?.reflectionsTable && journal?.reflectionsTable?.length ? (
          <>
            {journal.reflectionsTable.map((reflectionTable) => (
              <div className="col-12" key={reflectionTable.id}>
                <TableWrapper title={reflectionTable.title}>
                  <TableReflections
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
        {/*{journal?.meetings?.length ? (*/}
        {/*  <>*/}
        {/*    <div className="col-12">*/}
        {/*      <TableWrapper*/}
        {/*        title={selectedMeeting.title}*/}
        {/*        isDelete*/}
        {/*        onDelete={() => handleOpenDeleteArchiveModal()}*/}
        {/*      >*/}
        {/*        <Table bordered hover style={{ marginBottom: 0 }}>*/}
        {/*          <tbody>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell isGray colSpan={2}>*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Meeting date:'}*/}
        {/*                  type={'date'}*/}
        {/*                  value={new Date(*/}
        {/*                    selectedMeeting.meetingDate*/}
        {/*                  ).toLocaleDateString('en-CA')}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('meetingDate', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell*/}
        {/*                isGray*/}
        {/*                additionalStyling={{*/}
        {/*                  borderRightColor: '#f0f0f0',*/}
        {/*                  borderWidth: 2*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Purpose:'}*/}
        {/*                  type={'text'}*/}
        {/*                  value={selectedMeeting.purpose}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('purpose', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*              <JournalTableCell isGray>*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Attendance:'}*/}
        {/*                  type={'text'}*/}
        {/*                  value={selectedMeeting.attendance}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('attendance', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}

        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell colSpan={2}>*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Meeting Agenda:'}*/}
        {/*                  type={'text'}*/}
        {/*                  value={selectedMeeting.meetingAgenda}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('meetingAgenda', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell colSpan={2}>*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Notes:'}*/}
        {/*                  type={'text'}*/}
        {/*                  value={selectedMeeting.notes}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('notes', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell colSpan={2}>*/}
        {/*                <JournalTableCellInput*/}
        {/*                  title={'Results of meeting:'}*/}
        {/*                  type={'text'}*/}
        {/*                  value={selectedMeeting.resultsOfMeeting}*/}
        {/*                  handleChange={(value) =>*/}
        {/*                    handleChangeMeeting('resultsOfMeeting', value)*/}
        {/*                  }*/}
        {/*                />*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*          </tbody>*/}
        {/*        </Table>*/}
        {/*      </TableWrapper>*/}
        {/*      <div className={'d-flex justify-content-between py-1'}>*/}
        {/*        <div className="col-md-6 px-1">*/}
        {/*          <ArchiveSelector*/}
        {/*            archives={journal.meetings}*/}
        {/*            selectedArchive={selectedMeeting}*/}
        {/*            handleSelectedArchive={(value) =>*/}
        {/*              handleSelectedArchive(value)*/}
        {/*            }*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*        <div className="col-md-6 px-1">*/}
        {/*          <button*/}
        {/*            style={{*/}
        {/*              backgroundColor: '#51c7df',*/}
        {/*              color: '#fff',*/}
        {/*              fontSize: 14*/}
        {/*            }}*/}
        {/*            onClick={*/}
        {/*              hasUnsavedChanges*/}
        {/*                ? handleOpenMeetingModal*/}
        {/*                : handleAddMeeting*/}
        {/*            }*/}
        {/*            className="px-4 py-2 border-0 color transform text-uppercase  w-100 my-1"*/}
        {/*          >*/}
        {/*            Add a new team meeting*/}
        {/*          </button>*/}
        {/*        </div>*/}
        {/*        {showMeetingModal && hasUnsavedChanges && (*/}
        {/*          <MeetingModal*/}
        {/*            show={showMeetingModal}*/}
        {/*            onHide={handleCloseMeetingModal}*/}
        {/*            saveChanged={saveChanged}*/}
        {/*            saveUnChanged={saveUnChanged}*/}
        {/*            onSave={() => handleAddMeeting()}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*        {showDeleteArchiveModal && (*/}
        {/*          <DeleteArchiveModal*/}
        {/*            show={showDeleteArchiveModal}*/}
        {/*            onHide={handleCloseDeleteArchiveModal}*/}
        {/*            onDelete={() => handleDeleteMeeting(selectedMeeting)}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </>*/}
        {/*) : null}*/}
        {journal?.meetings?.length ? (
          <MeetingManager journal={journal} />
        ) : null}
        {journal?.feedbacks && journal?.feedbacks?.length ? (
          <FeedbackManager journal={journal} />
        ) : null}
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
