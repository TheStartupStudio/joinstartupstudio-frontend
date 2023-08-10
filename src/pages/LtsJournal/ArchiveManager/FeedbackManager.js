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

const FeedbackManager = (props) => {
  let [journal, setJournal] = useState({})
  let [loading, setLoading] = useState(true)
  const [selectedArchive, setSelectedArchive] = useState({})
  const [unChangedArchive, setUnChangedArchive] = useState({})
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteArchiveModal, setShowDeleteArchiveModal] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])

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
  const handleChangeFeedback = (name, value, feedbackIndex, fb) => {
    const feedback = {
      journalId: fb.journalId,
      feedbackDate: fb.feedbackDate,
      feedbackGiver: fb.feedbackGiver,
      receivedFeedback: fb.receivedFeedback,
      relevantFeedback: fb.relevantFeedback,
      relevantFeedbackAct: fb.relevantFeedbackAct,
      feedbackId: +fb?.id
    }
    let newSelectedFeedback = { ...feedback }
    newSelectedFeedback[name] = value

    // _.debounce(async (func,value) => updateFeedback(newSelectedFeedback), 5000)
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000)
  }

  const updateFeedback = async (value) => {
    // console.log(value)

    // debugger

    try {
      await axiosInstance
        .put(`/feedbacks/${selectedArchive?.id}/journal/${+params.journalId}`, {
          feedback: value
        })
        .then((res) => {
          const newFeedbacks = [...feedbacks]
          const foundedIndex = newFeedbacks.findIndex(
            (feedback) =>
              feedback.hasOwnProperty('feedbackId') &&
              feedback.id === res.data.id
          )
          newFeedbacks[foundedIndex] = res.data
          setFeedbacks(newFeedbacks)
        })
    } catch (error) {
      console.error('Error updating feedback:', error)
    }
  }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/${params.journalId}`)
      return data
    } catch (err) {}
  }

  // function getFeedbacks() {
  //   try {
  //     axiosInstance.get(`/ltsJournals/${params.journalId}`).then((res) => {
  //       const data = res.data
  //       if (data?.feedbacks && data?.feedbacks?.length) {
  //         const latestFeedback = getLatestUpdatedElement(data?.feedbacks)
  //         if (latestFeedback) {
  //           setUnChangedArchive(latestFeedback)
  //           setSelectedArchive(latestFeedback)
  //         }
  //       }
  //     })
  //   } catch (err) {}
  // }

  // useEffect(() => {
  //   if (props.journal.feedbacks && props.journal.userFeedbacks.length === 0) {
  //     setFeedbacks(props.journal.feedbacks)
  //   } else if (props.journal.userFeedbacks) {
  //     setFeedbacks(props.journal.userFeedbacks)
  //   }
  //   // setJournal(props.journal)
  // }, [props.journal])
  // console.log(selectedArchive)
  useEffect(
    function () {
      // getFeedbacks()
    },
    [params.journalId]
  )

  useEffect(() => {
    const ids = props.journal.userFeedbacks.map((item1) => item1.feedbackId)

    const differentFeedbacks = props.journal.feedbacks.filter(
      (item1) => !ids.includes(item1.id)
    )
    setFeedbacks([...differentFeedbacks, ...props.journal.userFeedbacks])
  }, [props.journal.userFeedbacks, props.journal.feedbacks])
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
      {feedbacks.map((feedback, feedbackIndex, feedbacks) => {
        return (
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
              <>
                <TableWrapper
                  title={feedback.title}
                  isDelete={
                    feedback?.feedbacks?.length > 1 ||
                    feedback?.userFeedbacks?.length > 1
                  }
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
                              feedback.feedbackDate
                            ).toLocaleDateString('en-CA')}
                            handleChange={(value) =>
                              handleChangeFeedback(
                                'feedbackDate',
                                value,
                                feedbackIndex,
                                feedback
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
                            title={'Who gave you feedback:'}
                            type={'text'}
                            value={feedback.feedbackGiver}
                            handleChange={(value) =>
                              handleChangeFeedback(
                                'feedbackGiver',
                                value,
                                feedbackIndex,
                                feedback
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>

                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            isBold={true}
                            title={'Feedback you received:'}
                            type={'text'}
                            value={feedback.receivedFeedback}
                            handleChange={(value) =>
                              handleChangeFeedback(
                                'receivedFeedback',
                                value,
                                feedbackIndex,
                                feedback
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            isBold={true}
                            title={'Which feedback is relevant:'}
                            type={'text'}
                            value={feedback.relevantFeedback}
                            handleChange={(value) =>
                              handleChangeFeedback(
                                'relevantFeedback',
                                value,
                                feedbackIndex,
                                feedback
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                      <JournalTableRow>
                        <JournalTableCell colSpan={2}>
                          <JournalTableCellInput
                            isBold={true}
                            title={
                              'How will you act on this relevant feedback:'
                            }
                            type={'text'}
                            value={feedback.relevantFeedbackAct}
                            handleChange={(value) =>
                              handleChangeFeedback(
                                'relevantFeedbackAct',
                                value,
                                feedbackIndex,
                                feedback
                              )
                            }
                          />
                        </JournalTableCell>
                      </JournalTableRow>
                    </tbody>
                  </Table>
                </TableWrapper>
              </>
            }
          />
        )
      })}
    </>
  )
}

export default FeedbackManager
