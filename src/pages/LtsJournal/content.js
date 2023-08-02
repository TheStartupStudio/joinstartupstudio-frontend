import React, { useState, useEffect } from 'react'
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

function LtsJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [meeting, setMeeting] = useState({})

  // console.log(userJournalEntries);

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

  useEffect(() => {
    axiosInstance
      .put(
        `/teamMeetings/${meeting.id}/journal/${+props.match.params.journalId}`,
        {
          meeting
        }
      )
      .then((res) => {
        setJournal({ ...journal, meeting: res.data })
      })
  }, [meeting])
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
      console.log(data)
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
        console.log(journalData, userJournalEntries)
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

  console.log('journal', journal)

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

  const handleDeleteMeeting = (meeting) => {
    console.log(meeting)
  }

  const handleChangeMeeting = (name, value, meetingIndex) => {
    let newJournal = { ...journal }
    let newMeetings = newJournal?.meetings
    newMeetings.map((meeting, index) => {
      if (index === meetingIndex) {
        return (meeting[name] = value)
      } else {
        return meeting
      }
    })
    const newMeeting = newMeetings[meetingIndex]
    setMeeting(newMeeting)
    newJournal.meetings = newMeetings
    setJournal(newJournal)
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
        {journal.reflectionsTable && journal.reflectionsTable.length ? (
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
        {journal?.meetings && journal.meetings.length ? (
          <>
            {journal?.meetings?.map((meeting, meetingIndex) => (
              <div className="col-12" key={meeting.id}>
                <TableWrapper
                  title={meeting.title}
                  isDelete
                  onDelete={() => handleDeleteMeeting(meeting)}
                >
                  <Table bordered hover style={{ marginBottom: 0 }}>
                    <tbody>
                      <JournalTableRow>
                        <JournalTableCell isGray colSpan={2}>
                          <JournalTableCellInput
                            title={'Meeting date:'}
                            type={'date'}
                            value={new Date(
                              meeting.meetingDate
                            ).toLocaleDateString('en-CA')}
                            handleChange={(value) =>
                              handleChangeMeeting(
                                'meetingDate',
                                value,
                                meetingIndex
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                      <JournalTableRow>
                        <JournalTableCell
                          isGray
                          additionalStyling={{
                            borderRightColor: '#f0f0f0',
                            borderWidth: 2
                          }}
                        >
                          <JournalTableCellInput
                            title={'Purpose:'}
                            type={'text'}
                            value={meeting.purpose}
                            handleChange={(value) =>
                              handleChangeMeeting(
                                'purpose',
                                value,
                                meetingIndex
                              )
                            }
                          />
                        </JournalTableCell>
                        <JournalTableCell isGray>
                          <JournalTableCellInput
                            title={'Attendance:'}
                            type={'text'}
                            value={meeting.attendance}
                            handleChange={(value) =>
                              handleChangeMeeting(
                                'attendance',
                                value,
                                meetingIndex
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>

                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            title={'Meeting Agenda:'}
                            type={'text'}
                            value={meeting.meetingAgenda}
                            handleChange={(value) =>
                              handleChangeMeeting(
                                'meetingAgenda',
                                value,
                                meetingIndex
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            title={'Notes:'}
                            type={'text'}
                            value={meeting.notes}
                            handleChange={(value) =>
                              handleChangeMeeting('notes', value, meetingIndex)
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            title={'Results of meeting:'}
                            type={'text'}
                            value={meeting.resultsOfMeeting}
                            handleChange={(value) =>
                              handleChangeMeeting(
                                'resultsOfMeeting',
                                value,
                                meetingIndex
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                    </tbody>
                  </Table>
                </TableWrapper>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
