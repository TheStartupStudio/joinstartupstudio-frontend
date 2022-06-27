import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import Select from 'react-select'
import { useEffect } from 'react'
import { RecommendationDetails } from './recommendationDetails'
import { EditRcmdDetails } from './editRcmdDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './style.css'

export const EditRecommendationModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [isReceivedSelected, setIsReceivedSelected] = useState(true)
  const [receivedRcmd, setReceivedRcmd] = useState([])
  const [givenRcmd, setGivenRcmd] = useState([])
  const [updateActions, setUpdateActions] = useState([])
  const [deleteActions, setDeleteActions] = useState([])

  useEffect(() => {
    setReceivedRcmd([...props.recommendations])
  }, [props.recommendations])

  useEffect(() => {
    setGivenRcmd([...props.givenRecommendations])
  }, [props.givenRecommendations])

  useEffect(() => {
    if (updateActions) {
      setUpdateActions(
        updateActions.filter((action) => !deleteActions.includes(action.id))
      )
    }
  }, [deleteActions])

  const closeModal = () => {
    props.onHide()
    setGivenRcmd(props.givenRecommendations)
    setReceivedRcmd(props.recommendations)
    setDeleteActions([])
    setUpdateActions([])
  }

  const handleDelete = (id) => {
    setDeleteActions((oldValues) => [...oldValues, id])
    setReceivedRcmd(receivedRcmd.filter((rcmd) => rcmd.id !== id))
    setGivenRcmd(givenRcmd.filter((rcmd) => rcmd.id !== id))
  }

  const handleUpdate = (data) => {
    const prevDescription = givenRcmd[data.index]?.description
    if (prevDescription !== data.description) {
      const newGivenRcmdArr = JSON.parse(JSON.stringify(givenRcmd))

      setGivenRcmd(
        newGivenRcmdArr.map((rcmd) => {
          if (rcmd.id === data.id) rcmd.description = data.description
          return rcmd
        })
      )
      setUpdateActions((oldValues) => [
        ...oldValues,
        { id: data.id, description: data.description }
      ])
    }
  }

  const submitRequest = async () => {
    setLoading(true)

    let deleteErrors = false
    let updateErrors = false

    if (!deleteActions.length && !updateActions.length) return closeModal()

    if (deleteActions.length)
      await axiosInstance
        .post('recommendations/multiple-delete', {
          deleteRows: deleteActions
        })
        .then((res) =>
          props.deleteRecommendations({ values: deleteActions, errors: false })
        )
        .catch((e) => {
          props.deleteRecommendations({ values: null, errors: false })
          deleteErrors = true
        })

    if (updateActions.length)
      await axiosInstance
        .post('recommendations/multiple-update', {
          updatedRows: updateActions
        })
        .then((res) => {
          props.updateGivenRecommendations({
            values: givenRcmd,
            errors: false
          })
        })
        .catch((e) => {
          props.updateGivenRecommendations({ values: null, errors: true })
          updateErrors = true
        })

    if (deleteErrors || updateErrors) {
      toast.error('Update finished with some errors!')
      props.onHide()
    } else {
      toast.success(<IntlMessages id='alert.my_account.success_change' />)
      props.onHide()
    }

    setLoading(false)
    setDeleteActions([])
    setUpdateActions([])
  }

  return (
    <Modal
      show={props.show}
      onHide={() => closeModal()}
      backdrop='static'
      keyboard={false}
      className='edit-modal'
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4 general-modal-header'>
        <h3 className='mb-0 pt-4 mt-2 '>Edit Recommendations</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => closeModal()}
        />
      </Modal.Header>
      <Modal.Body className='misconduct-modal mx-2'>
        <div
          className='d-flex justify-content-between flex-wrap'
          style={{ borderBottom: '1px solid #dee2e6' }}
        >
          <h3 className='my-auto'>Recommendations</h3>
          <div className='break-rcmd d-none'></div>
          <div
            className='d-flex float-end my-md-auto mt-2 '
            style={{ cursor: 'pointer' }}
          >
            <p
              className={`my-auto me-3 mx-md-3 ${
                isReceivedSelected && 'fw-bold'
              }`}
              onClick={() => setIsReceivedSelected(true)}
            >
              Received
            </p>
            <p
              className={`my-auto mx-3 ${!isReceivedSelected && 'fw-bold'}`}
              onClick={() => setIsReceivedSelected(false)}
            >
              Given
            </p>
          </div>
        </div>

        <div className='edit-rcmd-container'>
          {isReceivedSelected ? (
            <>
              {receivedRcmd.length > 0 ? (
                receivedRcmd.map((recommendation, index, { length }) => {
                  return (
                    <div
                      className='edit-rcmd-responsive my-3 p-3 pb-0 p-md-0'
                      style={{
                        border: '1px solid #bbbdbf',
                        borderRadius: '6px'
                      }}
                      key={recommendation.id}
                    >
                      <RecommendationDetails
                        recommendation={recommendation}
                        key={recommendation.id}
                        index={index}
                        length={length}
                        modalName={'editRcmdModal'}
                      />
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{
                          width: '22px',
                          height: '20px',
                          color: '#ff2094',
                          cursor: 'pointer'
                        }}
                        className='me-sm-3 mt-sm-3 rcmd-edit-icon'
                        onClick={() => handleDelete(recommendation.id)}
                      />
                    </div>
                  )
                })
              ) : (
                <div className='no-rcmd-yet px-2 my-auto'>
                  <p>You don’t have any recommendations… yet!</p>
                  <p>You can request a recommendation from someone you know.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {givenRcmd.length > 0 ? (
                givenRcmd.map((recommendation, index, { length }) => {
                  return (
                    <EditRcmdDetails
                      recommendation={recommendation}
                      key={recommendation.id}
                      index={index}
                      length={length}
                      handleDelete={(id) => handleDelete(id)}
                      handleUpdate={(data) => handleUpdate(data)}
                    />
                  )
                })
              ) : (
                <div className='no-rcmd-yet px-2 my-auto'>
                  <p>You don’t have any recommendations… yet!</p>
                  <p>You can request a recommendation from someone you know.</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className='contact-us'>
          {(updateActions.length > 0 || deleteActions.length > 0) && (
            <button onClick={() => submitRequest()} className='mt-2 my-auto'>
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'SAVE CHANGES'
              )}
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
