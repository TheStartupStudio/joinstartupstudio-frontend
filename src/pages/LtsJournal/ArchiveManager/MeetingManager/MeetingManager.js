import { useParams } from 'react-router-dom'
import axiosInstance from '../../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ArchiveManager from '../ArchiveManager'
import MeetingTable from './MeetingTable'

const MeetingManager = (props) => {
  let [journal, setJournal] = useState({})
  let [loading, setLoading] = useState(true)
  const [selectedArchive, setSelectedArchive] = useState({
    meetingDate: new Date(),
    purpose: '',
    attendance: '',
    meetingAgenda: '',
    notes: '',
    resultsOfMeeting: ''
  })
  const [unChangedArchive, setUnChangedArchive] = useState({})
  const [saveUnchanged, setSaveUnchanged] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
  const [teamMeetings, setTeamMeetings] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false)
  }
  const handleOpenArchiveModal = () => {
    setShowArchiveModal(true)
  }
  const params = useParams()

  const handleCloseDeleteArchiveModal = () => {
    setShowDeleteArchiveModal(false)
  }
  const handleOpenDeleteArchiveModal = () => {
    setShowDeleteArchiveModal(true)
  }

  const saveUnChanged = () => {
    const meeting = unChangedArchive
    axiosInstance
      .put(`/teamMeetings/userTeamMeeting`, {
        meeting
      })
      .then((res) => {
        let newTeamMeetings = [...teamMeetings]
        const foundedIndex = newTeamMeetings?.findIndex(
          (meeting) => meeting.id === res.data?.id
        )
        newTeamMeetings.splice(foundedIndex, 1, res.data)
        setTeamMeeting(res.data)
        setTeamMeetings(newTeamMeetings)
        handleCloseArchiveModal()
        setSaveUnchanged(true)
      })
  }

  useEffect(() => {
    if (saveUnchanged === true) {
      handleAddTeamMeeting()
      setSaveUnchanged(false)
    }
  }, [saveUnchanged])
  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddTeamMeeting()
  }

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateTeamMeeting = async (debounceName, value) => {
    let newTeamMeeting
    let teamMeeting
    if (isEdit) {
      teamMeeting = {
        journalId: value.journalId,
        teamMeetingId: +value?.teamMeetingId,
        id: value.id,
        meetingDate: value.meetingDate,
        purpose: value.purpose,
        attendance: value.attendance,
        meetingAgenda: value.meetingAgenda,
        notes: value.notes,
        resultsOfMeeting: value.resultsOfMeeting
      }
    } else {
      newTeamMeeting = { ...value, meetingDate: new Date() }
    }

    try {
      await axiosInstance
        .put(`/teamMeetings/userTeamMeeting`, {
          meeting: isEdit ? teamMeeting : newTeamMeeting
        })
        .then((res) => {
          if (teamMeetings.length) {
            const newMeetings = [...teamMeetings]
            const foundedIndex = newMeetings?.findIndex(
              (meeting) => meeting?.id === res.data?.id
            )
            newMeetings[foundedIndex] = res.data

            setSelectedArchive(res.data)
            setTeamMeetings(newMeetings)
          } else {
            const newMeetings = [...teamMeetings, res.data]
            setIsEdit(true)
            setSelectedArchive(res.data)
            setTeamMeetings(newMeetings)
          }
        })
    } catch (error) {
      console.error('Error updating meeting:', error)
    }
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  const [teamMeeting, setTeamMeeting] = useState({
    journalId: +params.journalId,
    meetingDate: '',
    purpose: '',
    attendance: '',
    meetingAgenda: '',
    notes: '',
    resultsOfMeeting: ''
  })
  useEffect(() => {
    if (!isEdit) {
      setTeamMeeting({ ...teamMeeting, teamMeetingId: selectedArchive.id })
    }
  }, [selectedArchive])

  useEffect(() => {
    if (isEdit) {
      const latestUpdatedElement = getLatestUpdatedElement(teamMeetings)
      setSelectedArchive(latestUpdatedElement)
    }
  }, [teamMeetings])

  const handleChangeTeamMeeting = async (name, value, meetingIndex, fb) => {
    if (teamMeetings?.length === 0) {
      const newTeamMeeting = {
        ...teamMeeting,
        [name]: value
      }
      setSelectedArchive({ ...selectedArchive, [name]: value })
      setTeamMeeting(newTeamMeeting)
      debounce(updateTeamMeeting, newTeamMeeting)
      const hasChanged = !isEqual(newTeamMeeting, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    } else {
      const newTeamMeeting = { ...teamMeeting }
      newTeamMeeting[name] = value
      // debugger
      setTeamMeeting(newTeamMeeting)
      const newSelectedTeamMeeting = { ...selectedArchive }
      newSelectedTeamMeeting[name] = value
      // debugger
      setSelectedArchive(newSelectedTeamMeeting)
      debounce(updateTeamMeeting, newSelectedTeamMeeting)
      const hasChanged = !isEqual(newSelectedTeamMeeting, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    }
  }
  function getTeamMeetings() {
    try {
      axiosInstance
        .get(`/ltsJournals/${params.journalId}/student/${0}`)
        .then((res) => {
          const data = res.data

          if (data?.userTeamMeetings && data?.userTeamMeetings?.length) {
            const latestElement = getLatestUpdatedElement(
              data?.userTeamMeetings
            )
            if (latestElement) {
              setIsEdit(latestElement.hasOwnProperty('teamMeetingId'))

              setSelectedArchive(latestElement)
              // const latestUpdatedElement = getLatestUpdatedElement(teamMeetings)
              // setSelectedArchive(latestUpdatedElement)
            }
          } else if (
            data?.teamMeetings &&
            data?.userTeamMeetings?.length === 0
          ) {
            const selectedArchive = {
              ...data?.teamMeetings,
              teamMeetingId: data?.teamMeetings?.id,
              meetingDate: new Date()
            }

            setSelectedArchive(selectedArchive)
          }
        })
    } catch (err) {}
  }
  useEffect(() => {
    getTeamMeetings()
  }, [params.journalId])

  useEffect(() => {
    if (props.journal?.userTeamMeetings?.length) {
      setTeamMeetings([...props.journal.userTeamMeetings])
      const latestElement = getLatestUpdatedElement(
        props.journal?.userTeamMeetings
      )
      setUnChangedArchive(latestElement)
    }
  }, [props.journal.userTeamMeetings, props.journal.teamMeetings])
  const getLatestUpdatedElement = (array) => {
    if (array) {
      const latestUpdatedElement = array?.reduce((latest, current) => {
        if (
          !latest ||
          new Date(current.updatedAt) > new Date(latest.updatedAt)
        ) {
          return current
        }
        return latest
      }, null)
      return latestUpdatedElement
    }
  }
  const handleAddTeamMeeting = () => {
    const teamMeeting = {
      journalId: +params.journalId,
      meetingDate: new Date(),
      purpose: '',
      attendance: '',
      meetingAgenda: '',
      notes: '',
      resultsOfMeeting: '',
      teamMeetingId: selectedArchive.teamMeetingId
    }
    axiosInstance
      .post(`/teamMeetings/userTeamMeeting`, {
        teamMeeting
      })
      .then((res) => {
        const newTeamMeetings = [...teamMeetings, res.data]
        setTeamMeetings([...teamMeetings, res.data])
        const latestElement = getLatestUpdatedElement(newTeamMeetings)

        setSelectedArchive(latestElement)
        handleCloseArchiveModal()
      })
  }

  const handleDeleteTeamMeeting = (teamMeeting) => {
    axiosInstance
      .delete(`/teamMeetings/userTeamMeeting/${teamMeeting.id}`)
      .then((res) => {
        const deletedTeamMeetingId = res.data.existingTeamMeeting.id
        setJournal((prevJournal) => {
          const newTeamMeetings = teamMeetings?.filter(
            (teamMeeting) => teamMeeting.id !== deletedTeamMeetingId
          )
          const latestElement = getLatestUpdatedElement(newTeamMeetings)
          setSelectedArchive(latestElement)
          handleCloseDeleteArchiveModal()
          setTeamMeetings(newTeamMeetings)
        })
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error deleting meeting:', error)
      })
  }

  const handleSelectedArchive = (value) => {
    if (value) {
      setSelectedArchive(value)
      setUnChangedArchive(value)
    }
  }

  return (
    <>
      {props.journal.userTeamMeetings.length !== 0 && (
        <ArchiveManager
          title={'teamMeeting'}
          archives={teamMeetings}
          selectedArchive={selectedArchive}
          handleSelectedArchive={handleSelectedArchive}
          hasUnsavedChanges={hasUnsavedChanges}
          onAdd={handleAddTeamMeeting}
          onDelete={() => handleDeleteTeamMeeting(selectedArchive)}
          saveChanged={saveChanged}
          saveUnChanged={saveUnChanged}
          onOpenArchiveModal={handleOpenArchiveModal}
          onCloseArchiveModal={handleCloseArchiveModal}
          onOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
          onCloseDeleteArchiveModal={handleCloseDeleteArchiveModal}
          showArchiveModal={showArchiveModal}
          showDeleteArchiveModal={showDeleteArchiveModal}
          isEditable={props.isEditable}
          tableContent={
            <MeetingTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              teamMeetings={teamMeetings}
              isEditable={props.isEditable}
              selectedArchive={selectedArchive}
              handleChangeTeamMeeting={(name, value) =>
                handleChangeTeamMeeting(name, value)
              }
              setLoading={setLoading}
            />
          }
        />
      )}

      {props.journal?.userTeamMeetings?.length === 0 && (
        <ArchiveManager
          title={'teamMeeting'}
          archives={teamMeetings}
          selectedArchive={selectedArchive}
          handleSelectedArchive={handleSelectedArchive}
          hasUnsavedChanges={hasUnsavedChanges}
          onAdd={handleAddTeamMeeting}
          onDelete={() => handleDeleteTeamMeeting(selectedArchive)}
          saveChanged={saveChanged}
          saveUnChanged={saveUnChanged}
          onOpenArchiveModal={handleOpenArchiveModal}
          onCloseArchiveModal={handleCloseArchiveModal}
          onOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
          onCloseDeleteArchiveModal={handleCloseDeleteArchiveModal}
          showArchiveModal={showArchiveModal}
          showDeleteArchiveModal={showDeleteArchiveModal}
          isEditable={props.isEditable}
          tableContent={
            <MeetingTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              teamMeetings={teamMeetings}
              isEditable={props.isEditable}
              selectedArchive={selectedArchive}
              handleChangeTeamMeeting={(name, value) =>
                handleChangeTeamMeeting(name, value)
              }
            />
          }
        />
      )}
    </>
  )
}

export default MeetingManager
