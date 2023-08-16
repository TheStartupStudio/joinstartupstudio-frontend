import { useParams } from 'react-router-dom'
import axiosInstance from '../../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ArchiveManager from '../ArchiveManager'
import FeedbackTable from './FeedbackTable'

const FeedbackManager = (props) => {
  let [journal, setJournal] = useState({})
  let [loading, setLoading] = useState(true)
  const [selectedArchive, setSelectedArchive] = useState({
    feedbackDate: new Date(),
    feedbackGiver: '',
    receivedFeedback: '',
    relevantFeedback: '',
    relevantFeedbackAct: ''
  })
  const [unChangedArchive, setUnChangedArchive] = useState({})
  const [saveUnchanged, setSaveUnchanged] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
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
    const feedback = unChangedArchive
    axiosInstance
      .put(`/feedbacks/${selectedArchive.id}/journal/${+params.journalId}`, {
        feedback
      })
      .then((res) => {
        let newFeedbacks = [...feedbacks]
        const foundedIndex = newFeedbacks?.findIndex(
          (feedback) => feedback.id === res.data?.id
        )
        newFeedbacks.splice(foundedIndex, 1, res.data)
        setFeedback(res.data)
        setFeedbacks(newFeedbacks)
        handleCloseArchiveModal()
        setSaveUnchanged(true)
      })
  }

  useEffect(() => {
    if (saveUnchanged === true) {
      handleAddFeedback()
      setSaveUnchanged(false)
    }
  }, [saveUnchanged])
  const saveChanged = () => {
    handleCloseArchiveModal()
    handleAddFeedback()
  }

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateFeedback = async (debounceName, value) => {
    let newFeedback
    let feedback
    if (isEdit) {
      const newFeedback = {
        journalId: value.journalId,
        feedbackDate: value.feedbackDate,
        feedbackGiver: value.feedbackGiver,
        receivedFeedback: value.receivedFeedback,
        relevantFeedback: value.relevantFeedback,
        relevantFeedbackAct: value.relevantFeedbackAct,
        feedbackId: +value?.feedbackId,
        id: value.id
      }
      feedback = newFeedback
    } else {
      newFeedback = { ...value, feedbackDate: new Date() }
    }

    try {
      await axiosInstance
        .put(`/feedbacks/userFeedback`, {
          feedback: isEdit ? feedback : newFeedback
        })
        .then((res) => {
          if (feedbacks.length) {
            const newFeedbacks = [...feedbacks]
            const foundedIndex = newFeedbacks?.findIndex(
              (feedback) => feedback?.id === res.data?.id
            )
            newFeedbacks[foundedIndex] = res.data

            setSelectedArchive(res.data)
            setFeedbacks(newFeedbacks)
          } else {
            const newFeedbacks = [...feedbacks, res.data]
            setIsEdit(true)
            setSelectedArchive(res.data)
            setFeedbacks(newFeedbacks)
          }
        })
    } catch (error) {
      console.error('Error updating feedback:', error)
    }
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  const [feedback, setFeedback] = useState({
    journalId: +params.journalId,
    feedbackDate: '',
    feedbackGiver: '',
    receivedFeedback: '',
    relevantFeedback: '',
    relevantFeedbackAct: ''
  })

  useEffect(() => {
    if (!isEdit) {
      setFeedback({ ...feedback, feedbackId: selectedArchive.id })
    }
  }, [selectedArchive])

  useEffect(() => {
    if (isEdit) {
      const latestFeedback = getLatestUpdatedElement(feedbacks)
      setSelectedArchive(latestFeedback)
    }
  }, [feedbacks])

  const handleChangeFeedback = async (name, value, feedbackIndex, fb) => {
    if (feedbacks?.length === 0) {
      const newFeedback = { ...feedback }
      newFeedback[name] = value
      setFeedback(newFeedback)
      debounce(updateFeedback, newFeedback)
      const hasChanged = !isEqual(newFeedback, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    } else {
      const newFeedback = { ...feedback }
      newFeedback[name] = value
      setFeedback(newFeedback)
      const newSelectedFeedback = { ...selectedArchive }
      newSelectedFeedback[name] = value
      setSelectedArchive(newSelectedFeedback)
      debounce(updateFeedback, newSelectedFeedback)
      const hasChanged = !isEqual(newSelectedFeedback, selectedArchive)
      setHasUnsavedChanges(hasChanged)
    }
  }

  function getFeedbacks() {
    try {
      axiosInstance.get(`/ltsJournals/${params.journalId}`).then((res) => {
        const data = res.data
        if (data?.userFeedbacks && data?.userFeedbacks?.length) {
          const latestFeedback = getLatestUpdatedElement(data?.userFeedbacks)
          if (latestFeedback) {
            setIsEdit(latestFeedback.hasOwnProperty('feedbackId'))
            setSelectedArchive(latestFeedback)
          }
        } else if (data?.feedbacks && data?.userFeedbacks?.length === 0) {
          setSelectedArchive({
            ...data?.feedbacks,
            feedbackId: data?.feedbacks?.id,
            feedbackDate: new Date()
          })
        }
      })
    } catch (err) {}
  }

  useEffect(
    function () {
      getFeedbacks()
    },
    [params.journalId]
  )

  useEffect(() => {
    if (props.journal?.userFeedbacks?.length) {
      setFeedbacks([...props.journal.userFeedbacks])
      // setUserFeedbacks(props.journal?.userFeedbacks);
      const latestFeedback = getLatestUpdatedElement(
        props.journal?.userFeedbacks
      )
      setUnChangedArchive(latestFeedback)
    }
  }, [props.journal.userFeedbacks, props.journal.feedbacks])
  const getLatestUpdatedElement = (array) => {
    // console.log(array)
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
  const handleAddFeedback = () => {
    const feedback = {
      journalId: +params.journalId,
      feedbackDate: new Date(),
      feedbackGiver: '',
      receivedFeedback: '',
      relevantFeedback: '',
      relevantFeedbackAct: '',
      feedbackId: selectedArchive.feedbackId
    }
    axiosInstance
      .post(`/feedbacks/userFeedback`, {
        feedback
      })
      .then((res) => {
        const newFeedbacks = [...feedbacks, res.data]
        setFeedbacks([...feedbacks, res.data])
        const latestFeedback = getLatestUpdatedElement(newFeedbacks)
        setSelectedArchive(latestFeedback)
        handleCloseArchiveModal()
      })
  }

  const handleDeleteFeedback = (feedback) => {
    axiosInstance
      .delete(`/feedbacks/userFeedback/${feedback.id}`)
      .then((res) => {
        const deletedFeedbackId = res.data.existingFeedback.id
        setJournal((prevJournal) => {
          const newFeedbacks = feedbacks?.filter(
            (feedback) => feedback.id !== deletedFeedbackId
          )
          const latestFeedback = getLatestUpdatedElement(newFeedbacks)
          setSelectedArchive(latestFeedback)
          handleCloseDeleteArchiveModal()
          setFeedbacks(newFeedbacks)
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
      {props.journal.userFeedbacks.length !== 0 && (
        <ArchiveManager
          title={'feedback'}
          archives={feedbacks}
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
            <FeedbackTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              feedbacks={feedbacks}
              selectedArchive={selectedArchive}
              handleChangeFeedback={(name, value) =>
                handleChangeFeedback(name, value)
              }
            />
          }
        />
      )}

      {props.journal?.userFeedbacks?.length === 0 && (
        <ArchiveManager
          title={'feedback'}
          archives={feedbacks}
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
            <FeedbackTable
              handleOpenDeleteArchiveModal={handleOpenDeleteArchiveModal}
              feedbacks={feedbacks}
              selectedArchive={selectedArchive}
              handleChangeFeedback={(name, value) =>
                handleChangeFeedback(name, value)
              }
            />
          }
        />
      )}
    </>
  )
}

export default FeedbackManager
