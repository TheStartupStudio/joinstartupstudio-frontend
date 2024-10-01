import { useParams } from 'react-router-dom'
import axiosInstance from '../../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ArchiveManager from '../ArchiveManager'
import MentorMeetingTable from './MentorMeetingTable'

const MentorMeetingManager = (props) => {
  let [journal, setJournal] = useState({})
  let [loading, setLoading] = useState(true)
  const [selectedArchive, setSelectedArchive] = useState({
    meetingDate: new Date(),
    title: '',
    mentorName: '',
    expertiseArea: '',
    preMeeting1: '',
    preMeeting2: '',
    duringMeeting: '',
    postMeeting: ''
  })
  const [unChangedArchive, setUnChangedArchive] = useState({})
  const [saveUnchanged, setSaveUnchanged] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
  const [mentorMeetings, setMentorMeetings] = useState([])
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
      .put(`/mentorMeetings/userMentorMeeting`, {
        meeting
      })
      .then((res) => {
        let newMentorMeetings = [...mentorMeetings]
        const foundedIndex = newMentorMeetings?.findIndex(
          (meeting) => meeting.id === res.data?.id
        )
        newMentorMeetings.splice(foundedIndex, 1, res.data)
        setMentorMeeting(res.data)
        setMentorMeetings(newMentorMeetings)
        handleCloseArchiveModal()
        setSaveUnchanged(true)
      })
  }

  useEffect(() => {
    if (saveUnchanged === true) {
      handleAddMentorMeeting()
      setSaveUnchanged(false)
    }
  }, [saveUnchanged])

  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddMentorMeeting()
  }

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateMentorMeeting = async (debounceName, value) => {
    let newMentorMeeting
    let mentorMeeting
    if (isEdit) {
      mentorMeeting = {
        journalId: value.journalId,
        mentorMeetingId: +value?.mentorMeetingId,
        id: value.id,
        meetingDate: value.meetingDate,
        title: value.title,
        mentorName: value.mentorName,
        expertiseArea: value.expertiseArea,
        preMeeting1: value.preMeeting1,
        preMeeting2: value.preMeeting2,
        duringMeeting: value.duringMeeting,
        postMeeting: value.postMeeting
      }
    } else {
      newMentorMeeting = { ...value, meetingDate: new Date() }
    }

    try {
      await axiosInstance
        .put(`/mentorMeetings/userMentorMeeting`, {
          meeting: isEdit ? mentorMeeting : newMentorMeeting
        })
        .then((res) => {
          if (mentorMeetings.length) {
            const newMeetings = [...mentorMeetings]
            const foundedIndex = newMeetings?.findIndex(
              (meeting) => meeting?.id === res.data?.id
            )
            newMeetings[foundedIndex] = res.data

            setSelectedArchive(res.data)
            setMentorMeetings(newMeetings) // Replaced teamMeetings with mentorMeetings
          } else {
            const newMeetings = [...mentorMeetings, res.data] // Replaced teamMeetings with mentorMeetings
            setIsEdit(true)
            setSelectedArchive(res.data)
            setMentorMeetings(newMeetings) // Replaced teamMeetings with mentorMeetings
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

  const [mentorMeeting, setMentorMeeting] = useState({
    journalId: +params.journalId,
    meetingDate: new Date(),
    title: '',
    mentorName: '',
    expertiseArea: '',
    preMeeting1: '',
    preMeeting2: '',
    duringMeeting: '',
    postMeeting: ''
  })
  useEffect(() => {
    if (!isEdit) {
      setMentorMeeting({
        ...mentorMeeting,
        mentorMeetingId: selectedArchive.id
      })
    }
  }, [selectedArchive])

  useEffect(() => {
    if (isEdit) {
      const latestUpdatedElement = getLatestUpdatedElement(mentorMeetings)
      setSelectedArchive(latestUpdatedElement)
    }
  }, [mentorMeetings])

  const handleChangeMentorMeeting = async (name, value, meetingIndex, fb) => {
    if (mentorMeetings?.length === 0) {
      const newMentorMeeting = {
        ...mentorMeeting,
        [name]: value
      }
      setSelectedArchive({ ...selectedArchive, [name]: value })
      setMentorMeeting(newMentorMeeting)
      debounce(updateMentorMeeting, newMentorMeeting)
      const hasChanged = !isEqual(newMentorMeeting, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    } else {
      const newMentorMeeting = { ...mentorMeeting }
      newMentorMeeting[name] = value
      setMentorMeeting(newMentorMeeting)
      const newSelectedMentorMeeting = { ...selectedArchive }
      newSelectedMentorMeeting[name] = value
      setSelectedArchive(newSelectedMentorMeeting)
      debounce(updateMentorMeeting, newSelectedMentorMeeting)
      const hasChanged = !isEqual(newSelectedMentorMeeting, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    }
  }

  function getMentorMeetings() {
    try {
      axiosInstance
        .get(`/ltsJournals/${params.journalId}/student/${0}`)
        .then((res) => {
          const data = res.data
          if (data?.userMentorMeetings && data?.userMentorMeetings?.length) {
            const latestElement = getLatestUpdatedElement(
              data?.userMentorMeetings
            )
            if (latestElement) {
              setIsEdit(latestElement.hasOwnProperty('mentorMeetingId'))
              setSelectedArchive(latestElement)
            }
          } else if (
            data?.mentorMeetings &&
            data?.userMentorMeetings?.length === 0
          ) {
            const selectedArchive = {
              ...data?.mentorMeetings,
              mentorMeetingId: data?.mentorMeetings?.id,
              meetingDate: new Date()
            }

            setSelectedArchive(selectedArchive)
          }
        })
    } catch (err) {}
  }

  useEffect(
    function () {
      getMentorMeetings()
    },
    [params.journalId]
  )

  useEffect(() => {
    if (props.journal?.userMentorMeetings?.length) {
      // Replaced userTeamMeetings with userMentorMeetings
      setMentorMeetings([...props.journal.userMentorMeetings]) // Replaced teamMeetings with mentorMeetings
      const latestElement = getLatestUpdatedElement(
        props.journal?.userMentorMeetings
      )
      setUnChangedArchive(latestElement)
    }
  }, [props.journal.userMentorMeetings, props.journal.mentorMeetings]) // Replaced userTeamMeetings with userMentorMeetings

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

  const handleAddMentorMeeting = () => {
    const mentorMeeting = {
      journalId: +params.journalId,
      meetingDate: new Date(),
      mentorMeetingId: selectedArchive.mentorMeetingId,
      title: '',
      mentorName: '',
      expertiseArea: '',
      preMeeting1: '',
      preMeeting2: '',
      duringMeeting: '',
      postMeeting: ''
    }
    axiosInstance
      .post(`/mentorMeetings/userMentorMeeting`, {
        mentorMeeting
      })
      .then((res) => {
        const newMentorMeetings = [...mentorMeetings, res.data]
        setMentorMeetings([...mentorMeetings, res.data])
        const latestElement = getLatestUpdatedElement(newMentorMeetings)
        setSelectedArchive(latestElement)
        handleCloseArchiveModal()
      })
  }

  const handleDeleteMentorMeeting = (mentorMeeting) => {
    axiosInstance
      .delete(`/mentorMeetings/userMentorMeeting/${mentorMeeting.id}`)
      .then((res) => {
        const deletedMentorMeetingId = res.data.existingMentorMeeting.id
        setJournal((prevJournal) => {
          const newMentorMeetings = mentorMeetings?.filter(
            // Replaced teamMeetings with mentorMeetings
            (mentorMeeting) => mentorMeeting.id !== deletedMentorMeetingId
          )
          const latestElement = getLatestUpdatedElement(newMentorMeetings)
          setSelectedArchive(latestElement)
          handleCloseDeleteArchiveModal()
          setMentorMeetings(newMentorMeetings) // Replaced teamMeetings with mentorMeetings
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
      {props.journal.userMentorMeetings.length !== 0 && (
        <ArchiveManager
          title={'mentorMeeting'}
          archives={mentorMeetings}
          selectedArchive={selectedArchive}
          handleSelectedArchive={handleSelectedArchive}
          hasUnsavedChanges={hasUnsavedChanges}
          onAdd={handleAddMentorMeeting}
          onDelete={() => handleDeleteMentorMeeting(selectedArchive)}
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
            <MentorMeetingTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              mentorMeetings={mentorMeetings}
              isEditable={props.isEditable}
              selectedArchive={selectedArchive}
              handleChangeMentorMeeting={(name, value) =>
                handleChangeMentorMeeting(name, value)
              }
            />
          }
        />
      )}

      {props.journal?.userMentorMeetings?.length === 0 && (
        <ArchiveManager
          title={'mentorMeeting'}
          archives={mentorMeetings}
          selectedArchive={selectedArchive}
          handleSelectedArchive={handleSelectedArchive}
          hasUnsavedChanges={hasUnsavedChanges}
          onAdd={handleAddMentorMeeting}
          onDelete={() => handleDeleteMentorMeeting(selectedArchive)}
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
            <MentorMeetingTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              mentorMeetings={mentorMeetings}
              isEditable={props.isEditable}
              selectedArchive={selectedArchive}
              handleChangeMentorMeeting={(name, value) =>
                handleChangeMentorMeeting(name, value)
              }
            />
          }
        />
      )}
    </>
  )
}

export default MentorMeetingManager
