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

const FeedbackManager = (props) => {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState({})
  const [unChangedArchive, setUnChangedArchive] = useState({})
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

  const saveUnChanged = () => {
    const feedback = unChangedArchive
    axiosInstance
      .put(`/feedbacks/${selectedArchive.id}/journal/${+params.journalId}`, {
        feedback
      })
      .then((res) => {
        let newJournal = { ...journal }
        let newFeedbacks = newJournal.feedbacks
        const foundedIndex = newFeedbacks.findIndex(
          (feedback) => feedback.id === res.data.id
        )
        newFeedbacks[foundedIndex] = res.data
        newJournal.feedbacks = newFeedbacks
        setSelectedArchive({ ...selectedArchive, ...res.data })
        setJournal({ ...newJournal, feedbacks: newFeedbacks })
        handleCloseArchiveModal()
        handleAddFeedback()
      })
  }

  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddFeedback()
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const handleChangeFeedback = (name, value) => {
    let newSelectedFeedback = { ...selectedArchive }
    newSelectedFeedback[name] = value
    setSelectedArchive(newSelectedFeedback)
    const hasChanged = !isEqual(newSelectedFeedback, selectedArchive)
    setHasUnsavedChanges(hasChanged)

    debounce(updateFeedback, newSelectedFeedback)
  }

  const updateFeedback = async (name, value) => {
    try {
      await axiosInstance
        .put(`/feedbacks/${selectedArchive?.id}/journal/${+params.journalId}`, {
          feedback: value
        })
        .then((res) => console.log(res.data))

      setJournal((prevJournal) => {
        const newJournal = { ...prevJournal }
        const newFeedbacks = [...newJournal.feedbacks]
        const feedbackIndex = newFeedbacks.findIndex(
          (feedback) => feedback.id === selectedArchive?.id
        )
        newFeedbacks[feedbackIndex] = value
        newJournal.feedbacks = newFeedbacks
        return newJournal
      })
    } catch (error) {
      // Handle errors
      console.error('Error updating feedback:', error)
    }
  }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/${params.journalId}`)
      return data
    } catch (err) {}
  }

  function getFeedbacks() {
    try {
      axiosInstance.get(`/ltsJournals/${params.journalId}`).then((res) => {
        const data = res.data
        if (data?.feedbacks && data?.feedbacks?.length) {
          const latestFeedback = getLatestUpdatedElement(data?.feedbacks)
          if (latestFeedback) {
            setUnChangedArchive(latestFeedback)
            setSelectedArchive(latestFeedback)
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
      loadData()
      getFeedbacks()
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

  const handleAddFeedback = () => {
    const feedback = {
      ltsJournalId: params.journalId,
      feedbackDate: '',
      feedbackGiver: '',
      receivedFeedback: '',
      relevantFeedback: '',
      relevantFeedbackAct: ''
    }

    axiosInstance
      .post(`/feedbacks/`, {
        feedback
      })
      .then((res) => {
        const newFeedbacks = [...journal.feedbacks, res.data]
        setJournal({ ...journal, feedbacks: newFeedbacks })
        const latestFeedback = getLatestUpdatedElement(newFeedbacks)
        setSelectedArchive(latestFeedback)
        handleCloseArchiveModal()
      })
  }

  const handleDeleteFeedback = (feedback) => {
    axiosInstance
      .delete(`/feedbacks/${feedback.id}`)
      .then((res) => {
        const deletedFeedbackId = res.data.existingFeedback.id
        setJournal((prevJournal) => {
          const newJournal = { ...prevJournal }
          const newFeedbacks = newJournal.feedbacks.filter(
            (feedback) => feedback.id !== deletedFeedbackId
          )
          newJournal.feedbacks = newFeedbacks
          const latestFeedback = getLatestUpdatedElement(newFeedbacks)
          setSelectedArchive(latestFeedback)
          handleCloseDeleteArchiveModal()
          return newJournal
        })
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error deleting feedback:', error)
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
      <ArchiveManager
        title={'feedback'}
        archives={journal?.feedbacks}
        selectedArchive={selectedArchive}
        handleSelectedArchive={handleSelectedArchive}
        hasUnsavedChanges={hasUnsavedChanges}
        onAdd={handleAddFeedback}
        onDelete={() => handleDeleteFeedback(selectedArchive)}
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
            title={selectedArchive.title}
            isDelete
            onDelete={() => handleOpenDeleteArchiveModal()}
          >
            <Table bordered hover style={{ marginBottom: 0 }}>
              <tbody>
                <JournalTableRow>
                  <JournalTableCell isGray>
                    <JournalTableCellInput
                      title={'Feedback date:'}
                      type={'date'}
                      value={new Date(
                        selectedArchive.feedbackDate
                      ).toLocaleDateString('en-CA')}
                      handleChange={(value) =>
                        handleChangeFeedback('feedbackDate', value)
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
                      title={'Who gave you feedback:'}
                      type={'text'}
                      value={selectedArchive.feedbackGiver}
                      handleChange={(value) =>
                        handleChangeFeedback('feedbackGiver', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>

                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'Feedback you received:'}
                      type={'text'}
                      value={selectedArchive.receivedFeedback}
                      handleChange={(value) =>
                        handleChangeFeedback('receivedFeedback', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'Which feedback is relevant:'}
                      type={'text'}
                      value={selectedArchive.relevantFeedback}
                      handleChange={(value) =>
                        handleChangeFeedback('relevantFeedback', value)
                      }
                    />
                  </JournalTableCell>
                </JournalTableRow>
                <JournalTableRow>
                  <JournalTableCell colSpan={2}>
                    <JournalTableCellInput
                      title={'How will you act on this relevant feedback:'}
                      type={'text'}
                      value={selectedArchive.relevantFeedbackAct}
                      handleChange={(value) =>
                        handleChangeFeedback('relevantFeedbackAct', value)
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

export default FeedbackManager
