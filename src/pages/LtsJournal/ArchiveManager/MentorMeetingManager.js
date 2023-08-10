import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ArchiveManager from './ArchiveManager'

import { Table } from 'react-bootstrap'
import TableWrapper from '../TableWrapper/index'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from '../TableWrapper/TableComponents'

const MentorMeetingManager = (props) => {
  const [loading, setLoading] = useState(false)
  let [journal, setJournal] = useState({})
  const [selectedMentorMeeting, setSelectedMentorMeeting] = useState({})
  const [unChangedMentorMeeting, setUnChangedMentorMeeting] = useState({})
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
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

  useEffect(() => {
    setJournal(props.journal)
  }, [props.journal])

  const saveUnChanged = () => {
    const mentorMeeting = unChangedMentorMeeting
    axiosInstance
      .put(
        `/mentorMeetings/${
          selectedMentorMeeting.id
        }/journal/${+params.journalId}`,
        {
          mentorMeeting
        }
      )
      .then((res) => {
        let newJournal = { ...journal }
        let newMentorMeetings = newJournal.mentorMeetings
        const foundedIndex = newMentorMeetings.findIndex(
          (meet) => meet.id === res.data.id
        )
        newMentorMeetings[foundedIndex] = res.data
        newJournal.mentorMeetings = newMentorMeetings
        setSelectedMentorMeeting({ ...selectedMentorMeeting, ...res.data })
        setJournal({ ...newJournal, mentorMeetings: newMentorMeetings })
        handleCloseArchiveModal()
        handleAddMentorMeeting()
      })
  }

  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddMentorMeeting()
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const handleChangeMentorMeeting = (name, value) => {
    let newSelectedMentorMeeting = { ...selectedMentorMeeting }
    newSelectedMentorMeeting[name] = value
    setSelectedMentorMeeting(newSelectedMentorMeeting)
    const hasChanged = !isEqual(newSelectedMentorMeeting, selectedMentorMeeting)
    setHasUnsavedChanges(hasChanged)

    debounce(updateMentorMeeting, newSelectedMentorMeeting)
  }

  const updateMentorMeeting = async (name, value) => {
    try {
      await axiosInstance
        .put(
          `/mentorMeetings/${
            selectedMentorMeeting?.id
          }/journal/${+params.journalId}`,
          {
            mentorMeeting: value
          }
        )
        .then((res) => console.log(res.data))

      setJournal((prevJournal) => {
        const newJournal = { ...prevJournal }
        const newMentorMeetings = [...newJournal.mentorMeetings]
        const mentorMeetingIndex = newMentorMeetings.findIndex(
          (meet) => meet.id === selectedMentorMeeting?.id
        )
        newMentorMeetings[mentorMeetingIndex] = value
        newJournal.mentorMeetings = newMentorMeetings
        return newJournal
      })
    } catch (error) {
      // Handle errors
      console.error('Error updating mentorMeeting:', error)
    }
  }

  function getMentorMeetings() {
    try {
      axiosInstance.get(`/ltsJournals/${params.journalId}`).then((res) => {
        const data = res.data
        if (data?.mentorMeetings && data?.mentorMeetings?.length) {
          const latestMentorMeeting = getLatestUpdatedElement(
            data?.mentorMeetings
          )
          if (latestMentorMeeting) {
            setUnChangedMentorMeeting(latestMentorMeeting)
            setSelectedMentorMeeting(latestMentorMeeting)
          }
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

  const getLatestUpdatedElement = (array) => {
    const latestUpdatedElement = array?.reduce((latest, current) => {
      if (!latest || new Date(current.updatedAt) > new Date(latest.updatedAt)) {
        return current
      }
      return latest
    }, null)
    return latestUpdatedElement
  }

  const handleAddMentorMeeting = () => {
    const mentorMeeting = {
      title: '',
      journalId: params.journalId,
      meetingDate: '',
      mentorName: '',
      expertiseArea: '',
      preMeeting1: '',
      preMeeting2: '',
      duringMeeting: '',
      postMeeting: ''
    }
    axiosInstance
      .post(`/mentorMeetings/`, {
        mentorMeeting
      })
      .then((res) => {
        const newMentorMeetings = [...journal.mentorMeetings, res.data]
        setJournal({ ...journal, mentorMeetings: newMentorMeetings })
        const latestMentorMeeting = getLatestUpdatedElement(newMentorMeetings)
        setSelectedMentorMeeting(latestMentorMeeting)
        handleCloseArchiveModal()
      })
  }

  const handleDeleteMentorMeeting = (mentorMeeting) => {
    axiosInstance
      .delete(`/mentorMeetings/${mentorMeeting.id}`)
      .then((res) => {
        const deletedMentorMeetingId = res.data.existingMeeting.id
        setJournal((prevJournal) => {
          const newJournal = { ...prevJournal }
          const newMentorMeetings = newJournal.mentorMeetings.filter(
            (meet) => meet.id !== deletedMentorMeetingId
          )
          newJournal.mentorMeetings = newMentorMeetings
          const latestMentorMeeting = getLatestUpdatedElement(newMentorMeetings)
          setSelectedMentorMeeting(latestMentorMeeting)
          handleCloseDeleteArchiveModal()
          return newJournal
        })
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error deleting mentorMeeting:', error)
      })
  }

  const handleSelectedArchive = (value) => {
    if (value) {
      setSelectedMentorMeeting(value)
      setUnChangedMentorMeeting(value)
    }
  }
  return (
    <>
      <ArchiveManager
        title={'mentorMeeting'}
        archives={journal?.mentorMeetings}
        selectedArchive={selectedMentorMeeting}
        handleSelectedArchive={handleSelectedArchive}
        hasUnsavedChanges={hasUnsavedChanges}
        onAdd={handleAddMentorMeeting}
        onDelete={() => handleDeleteMentorMeeting(selectedMentorMeeting)}
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
            title={selectedMentorMeeting.title}
            isDelete={journal?.mentorMeetings?.length > 1}
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
                        selectedMentorMeeting.meetingDate
                      ).toLocaleDateString('en-CA')}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('meetingDate', value)
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
                      title={'Mentor name:'}
                      type={'text'}
                      value={selectedMentorMeeting.mentorName}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('mentorName', value)
                      }
                    />
                  </JournalTableCell>
                  <JournalTableCell isGray>
                    <JournalTableCellInput
                      title={'Area of expertise:'}
                      type={'text'}
                      value={selectedMentorMeeting.expertiseArea}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('expertiseArea', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>

                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      isBold={true}
                      title={'Pre-meeting:'}
                      type={'text'}
                      value={selectedMentorMeeting.preMeeting1}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('preMeeting1', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      isBold={true}
                      title={'Pre-meeting:'}
                      type={'text'}
                      value={selectedMentorMeeting.preMeeting2}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('preMeeting2', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      isBold={true}
                      title={'During the meeting:'}
                      type={'text'}
                      value={selectedMentorMeeting.duringMeeting}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('duringMeeting', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      isBold={true}
                      title={'Post-meeting:'}
                      type={'text'}
                      value={selectedMentorMeeting.postMeeting}
                      handleChange={(value) =>
                        handleChangeMentorMeeting('postMeeting', value)
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

export default MentorMeetingManager
