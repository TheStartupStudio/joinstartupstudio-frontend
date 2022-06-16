import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RcmdSlider from './rcmdSlider'
import { RespondRcmdRequestModal } from './respondRcmdRequestModal'
import { GiveRecommendationModal } from './giveRecommendationModal'
import BlockedUserModal from '../../Modals/Connections/blockedUserModal'

export const AllRcmdRequestsModal = (props) => {
  const [allRcmdRequests, setAllRcmdRequests] = useState([])
  const [width, setWidth] = useState([])
  const [showRespondModal, setShowRespondModal] = useState(false)
  const [currentRcmdRequest, setCurrentRcmdRequest] = useState()
  const [currentResponseStatus, setCurrentResponseStatus] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [showGiveRcmdModal, setShowGiveRcmdModal] = useState(false)
  const [currentUnfinishedRcmdId, setCurrentUnfinishedRcmdId] = useState()
  const loggedUserId = useSelector((state) => state.user.user.user.id)

  useEffect(() => {
    const myWidth = window.innerWidth
    setWidth(myWidth)
  }, [])

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    setAllRcmdRequests(props.allRcmdRequests)
  }, [props.allRcmdRequests])

  useEffect(() => {
    !isNaN(props.requestId) && getRecommendation(props.requestId)
  }, [props.requestId])

  const getRecommendation = async (id) => {
    await axiosInstance
      .get(`/recommendations/${id}`)
      .then((res) => {
        if (
          res.data.status === 'pending' &&
          res.data.fromUserId === loggedUserId
        ) {
          setCurrentRcmdRequest(res.data)
          setShowRespondModal(true)
        } else if (res.data.status === 'approved' && !res.data.description) {
          continueResponding(id)
        }
      })
      .catch((e) => e)
  }

  const closeModal = () => {
    props.onHide()
    setCurrentRcmdRequest()
  }

  const respondRequest = (id, status) => {
    setShowRespondModal(false)
    props.onHide()
    if (status === 'block') blockUser()
    if (status === 'ignore') ignoreRequest()
    if (status === 'accept') acceptRequest()
  }

  const respondModal = (id) => {
    const rcmd = allRcmdRequests.find((elem) => elem.id === id)
    if (!rcmd) return

    setCurrentRcmdRequest(rcmd)
    setShowRespondModal(true)
  }

  const continueResponding = (id) => {
    setCurrentUnfinishedRcmdId(id)
    setShowGiveRcmdModal(true)
  }

  const ignoreRequest = async () => {
    props.removePendingRcmd(currentRcmdRequest.id)
    await axiosInstance
      .delete(`/recommendations/${currentRcmdRequest.id}`)
      .then((res) => {
        setCurrentResponseStatus('ignore')
        setCurrentRcmdRequest()
        setShowResponseModal(true)
      })
      .catch((e) => e)
  }

  const blockUser = async () => {
    setShowRespondModal(false)

    const rowsToDelete = []
    allRcmdRequests.forEach((rcmd) => {
      if (rcmd.toUser.id === currentRcmdRequest.toUser.id)
        rowsToDelete.push(rcmd.id)
    })

    props.userBlocked(currentRcmdRequest.toUser.id)

    await axiosInstance
      .post('/connect/block', {
        toUserId: currentRcmdRequest.toUser.id
      })
      .then(async (res) => {
        setCurrentResponseStatus('block')
        setShowResponseModal(true)

        setCurrentRcmdRequest()
      })
      .catch(() =>
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      )

    await axiosInstance
      .post('/recommendations/multiple-delete', {
        deleteRows: rowsToDelete
      })
      .then()
      .catch(() => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

  const acceptRequest = async () => {
    if (isNaN(currentRcmdRequest.id)) {
      closeModal()
      return toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    }

    await axiosInstance
      .put(`/recommendations/${currentRcmdRequest.id}`, {
        status: 'approved'
      })
      .then((res) => {
        continueResponding(currentRcmdRequest.id)
        props.updatePendingRecommendation(res.data)
      })
      .catch((err) => {
        closeModal()
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => closeModal()}
        backdrop='static'
        keyboard={false}
        style={{ marginTop: '3rem' }}
      >
        <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
          <h3 className='mb-0 pt-4 mt-2 '>RESPOND TO REQUESTS</h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => closeModal()}
          />
        </Modal.Header>
        <Modal.Body className='misconduct-modal mx-4 px-0 pt-3 pb-4'>
          <h3 className='m-0'>Give a Recommendation or Endorsement</h3>
          {allRcmdRequests.length ? (
            <RcmdSlider
              data={allRcmdRequests}
              width={width}
              respond={(id) => respondModal(id)}
              continueResponding={(id) => continueResponding(id)}
            />
          ) : (
            <div
              style={{ minHeight: '250px' }}
              className='d-flex align-items-center justify-content-center'
            >
              <p className='fw-bold text-center'>No recommendation requests!</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {currentRcmdRequest && (
        <RespondRcmdRequestModal
          show={showRespondModal}
          rcmdData={currentRcmdRequest}
          onHide={() => {
            setShowRespondModal(false)
            setCurrentRcmdRequest()
          }}
          respondRequest={(id, status) => respondRequest(id, status)}
        />
      )}

      <BlockedUserModal
        show={showResponseModal}
        onHide={() => {
          setShowResponseModal(false)
          setCurrentResponseStatus()
          props.showRcmdmodal()
        }}
        status={currentResponseStatus}
      />
      {currentUnfinishedRcmdId && (
        <GiveRecommendationModal
          show={showGiveRcmdModal}
          requestId={currentUnfinishedRcmdId}
          onHide={() => {
            setShowGiveRcmdModal(false)
            setCurrentUnfinishedRcmdId()
          }}
          updateRecommendation={(data) => {
            props.removePendingRcmd(data.id)
            props.addGivenRecommendation(data)
          }}
        />
      )}
    </>
  )
}
