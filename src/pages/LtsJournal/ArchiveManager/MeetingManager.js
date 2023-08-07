import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ArchiveManager from './ArchiveManager'

import { Table } from 'react-bootstrap'
import TableWrapper from '../TableWrapper/index'

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
  const { title, type, value, handleChange, width, inputName } = props
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
          name={inputName ?? ''}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  )
}

const MeetingManager = (props) => {
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
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)

  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false)
  }
  const handleOpenArchiveModal = () => {
    setShowArchiveModal(true)
  }
  const params = useParams()

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

  useEffect(() => {
    setJournal(props.journal)
  }, [props.journal])

  const saveUnChanged = () => {
    const meeting = unChangedMeeting
    axiosInstance
      .put(`/teamMeetings/${selectedMeeting.id}/journal/${+params.journalId}`, {
        meeting
      })
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
        handleCloseArchiveModal()
        handleAddMeeting()
      })
  }

  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddMeeting()
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
          `/teamMeetings/${selectedMeeting?.id}/journal/${+params.journalId}`,
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
      let { data } = await axiosInstance.get(`/ltsJournals/${params.journalId}`)
      return data
    } catch (err) {}
  }

  function getMeetings() {
    try {
      axiosInstance.get(`/ltsJournals/${params.journalId}`).then((res) => {
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

  function loadData() {
    setLoading(true)
    Promise.all([getJournal()])

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
      // loadData()
      getMeetings()
    },
    [params.journalId]
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

  const handleAddMeeting = () => {
    const meeting = {
      title: '',
      journalId: params.journalId,
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
        handleCloseArchiveModal()
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
  }
  return (
    <>
      <ArchiveManager
        title={'meetingTeam'}
        archives={journal?.meetings}
        selectedArchive={selectedMeeting}
        handleSelectedArchive={handleSelectedArchive}
        hasUnsavedChanges={hasUnsavedChanges}
        onAdd={handleAddMeeting}
        onDelete={() => handleDeleteMeeting(selectedMeeting)}
        saveChanged={saveChanged}
        saveUnChanged={saveUnChanged}
        onOpenArchiveModal={handleOpenArchiveModal}
        onCloseArchiveModal={handleCloseArchiveModal}
        onOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
        onCloseDeleteArchiveModal={handleCloseDeleteArchiveModal}
        showArchiveModal={showArchiveModal}
        showDeleteArchiveModal={showDeleteArchiveModal}
        tableContent={
          <TableWrapper
            title={selectedMeeting.title}
            isDelete
            onDelete={() => handleOpenDeleteArchiveModal()}
          >
            <Table bordered hover style={{ marginBottom: 0 }}>
              <tbody>
                <JournalTableRow>
                  <JournalTableCell isGray colSpan={2}>
                    <JournalTableCellInput
                      title={'Meeting date:'}
                      type={'date'}
                      value={new Date(
                        selectedMeeting.meetingDate
                      ).toLocaleDateString('en-CA')}
                      handleChange={(value) =>
                        handleChangeMeeting('meetingDate', value)
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
                      value={selectedMeeting.purpose}
                      handleChange={(value) =>
                        handleChangeMeeting('purpose', value)
                      }
                    />
                  </JournalTableCell>
                  <JournalTableCell isGray>
                    <JournalTableCellInput
                      title={'Attendance:'}
                      type={'text'}
                      value={selectedMeeting.attendance}
                      handleChange={(value) =>
                        handleChangeMeeting('attendance', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>

                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'Meeting Agenda:'}
                      type={'text'}
                      value={selectedMeeting.meetingAgenda}
                      handleChange={(value) =>
                        handleChangeMeeting('meetingAgenda', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'Notes:'}
                      type={'text'}
                      value={selectedMeeting.notes}
                      handleChange={(value) =>
                        handleChangeMeeting('notes', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'Results of meeting:'}
                      type={'text'}
                      value={selectedMeeting.resultsOfMeeting}
                      handleChange={(value) =>
                        handleChangeMeeting('resultsOfMeeting', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
              </tbody>
            </Table>
          </TableWrapper>
        }
      />
    </>
  )
}

export default MeetingManager
