import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { EditRecommendationModal } from './editRecommendationModal'
import { RcmdRequestModal } from './rcmdRequestModal'
import { RespondRcmdRequestModal } from './respondRcmdRequestModal'
import { RecommendationDetails } from './recommendationDetails'
import { AllRcmdRequestsModal } from './allRcmdRequestsModal'
import '../Experience/style.css'
import { toast } from 'react-toastify'

export const Recommendation = (props) => {
  const [showRecommendationModal, setShowRecommendationModal] = useState(false)
  const [showRcmdRequestModal, setShowRcmdRequestModal] = useState(false)
  const [showAllRequestsModal, setShowAllRequestsModal] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [givenRecommendations, setGivenRecommendations] = useState([])
  const [pendingRecommendations, setPendingRecommendations] = useState([])
  const [connections, setConnections] = useState([])
  const [requestId, setRequestId] = useState()

  useEffect(() => {
    getUserRecommendations()
    getGivenRecommendations()
    getUserConnections()
  }, [])

  useEffect(() => {
    setRequestId(props.requestId)
  }, [props.requestId])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      const result = res.data.data
      setConnections(
        result.filter((connection) => {
          const level = connection.level
          return level !== 'ES' && level !== 'MS' && level !== 'HS'
        })
      )
    })
  }

  const getUserRecommendations = async () => {
    await axiosInstance.get(`/recommendations?status=approved`).then((res) => {
      setRecommendations(res.data.filter((rcmd) => rcmd.description.length > 0))
    })
  }

  const getGivenRecommendations = async () => {
    await axiosInstance.get(`/recommendations/given`).then((res) => {
      setGivenRecommendations(
        res.data.filter(
          (rcmd) => rcmd.status === 'approved' && rcmd.description
        )
      )

      setPendingRecommendations(
        res.data.filter(
          (rcmd) =>
            rcmd.status === 'pending' ||
            (rcmd.status === 'approved' && !rcmd.description)
        )
      )
    })
  }

  const deleteRecommendations = async (data) => {
    if (data.errors) return getUserRecommendations()
    setRecommendations(
      recommendations.filter((rcmd) => !data?.values?.includes(rcmd.id))
    )
  }

  const updateGivenRecommendations = async (data) => {
    if (data.errors) return getGivenRecommendations()
    setGivenRecommendations(data.values)
  }

  const userBlocked = (id) => {
    setPendingRecommendations(
      pendingRecommendations.filter((rcmd) => rcmd.toUser.id !== id)
    )
  }

  const removePendingRcmd = (id) => {
    setPendingRecommendations(
      pendingRecommendations.filter((rcmd) => rcmd.id !== id)
    )
  }

  const addGivenRecommendation = (data) => {
    setGivenRecommendations([data, ...givenRecommendations])
  }

  const updatePendingRecommendation = (data) => {
    setPendingRecommendations(
      pendingRecommendations.map((rcmd) => {
        if (rcmd.id === data.id) rcmd = data
        return rcmd
      })
    )
  }

  return (
    <>
      <div className='experiences-container mx-0 mt-4'>
        <div className='rcmd-header'>
          <div className='d-flex m-3 experience-header rcmd-desktop-header'>
            <h4
              className='title p-0 my-auto float-start'
              // style={{ width: '20%' }}
            >
              RECOMMENDATIONS
            </h4>
            <div className='break-experience'></div>
            <div className='d-flex show_in_portfolio'>
              <p
                className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2'
                onClick={() => setShowRcmdRequestModal(true)}
                style={{ cursor: 'pointer' }}
              >
                Request a Recommendation
              </p>
              <p className='my-auto'>|</p>
              <p
                className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2'
                onClick={() => setShowAllRequestsModal(true)}
                style={{ cursor: 'pointer' }}
              >
                Respond to Requests (
                {pendingRecommendations.length > 0
                  ? pendingRecommendations.length
                  : 0}
                )
              </p>
              <span className='float-end my-auto pe-1 pe-md-0 ps-xl-4'>
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className=''
                  style={{ height: '25px', width: '25px', cursor: 'pointer' }}
                  onClick={() => setShowRecommendationModal(true)}
                />
              </span>
            </div>
          </div>
          <div className='d-flex m-3 experience-header rcmd-mobile-header d-none'>
            <div className='d-inline-block w-100'>
              <h4
                className='title p-0 my-auto float-start'
                style={{ width: '80%' }}
              >
                RECOMMENDATIONS
              </h4>
              <span className='float-end my-auto pe-1 pe-md-0'>
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className=''
                  style={{ height: '25px', width: '25px', cursor: 'pointer' }}
                  onClick={() => setShowRecommendationModal(true)}
                />
              </span>
            </div>

            <div className='d-flex mt-md-2 show_in_portfolio flex-wrap'>
              <p
                className='py-md-0 my-auto px-md-3 p-0 pe-2'
                onClick={() => setShowRcmdRequestModal(true)}
                style={{ cursor: 'pointer' }}
              >
                Request a Recommendation
              </p>
              <p
                className='py-md-0 my-auto px-md-3 p-0 pe-2'
                onClick={() => setShowAllRequestsModal(true)}
                style={{ cursor: 'pointer' }}
              >
                Respond to Requests
              </p>
            </div>
          </div>
        </div>

        {recommendations.length !== 0 ? (
          <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 row'>
            {recommendations.map((recommendation, index, { length }) => {
              return (
                <RecommendationDetails
                  recommendation={recommendation}
                  key={recommendation.id}
                  index={index}
                  length={length}
                />
              )
            })}
          </div>
        ) : (
          <>
            <p className='no-experience-added'>
              You don’t have any recommendations… yet! Click the box below to
              request a recommendation from someone you know.
            </p>
            <div className='m-3 experiences-container d-flex justify-content-center'>
              <FontAwesomeIcon
                icon={faPlus}
                className='my-5'
                style={{
                  height: '56px',
                  width: '56px',
                  cursor: 'pointer',
                  color: '#BBBDBF'
                }}
                onClick={() => setShowRcmdRequestModal(true)}
              />
            </div>
          </>
        )}
      </div>
      <EditRecommendationModal
        show={showRecommendationModal}
        onHide={() => {
          setShowRecommendationModal(false)
        }}
        recommendations={recommendations}
        givenRecommendations={givenRecommendations}
        initialValues={{ recommendations, givenRecommendations }}
        deleteRecommendations={(data) => deleteRecommendations(data)}
        updateGivenRecommendations={(data) => updateGivenRecommendations(data)}
        // updateRecommendation={(exp) => updateRecommendation(exp)}
        // addRecommendation={(exp) => addRecommendation(exp)}
        // deleteBackground={(id) => deleteBackground(id)}
      />
      <RcmdRequestModal
        show={showRcmdRequestModal}
        onHide={() => {
          setShowRcmdRequestModal(false)
        }}
        connections={connections}
      />
      {/* <RespondRcmdRequestModal show={false} /> */}
      <AllRcmdRequestsModal
        allRcmdRequests={pendingRecommendations}
        show={showAllRequestsModal}
        userBlocked={(id) => userBlocked(id)}
        removePendingRcmd={(id) => removePendingRcmd(id)}
        addGivenRecommendation={(data) => addGivenRecommendation(data)}
        updatePendingRecommendation={(data) =>
          updatePendingRecommendation(data)
        }
        showRcmdmodal={() => setShowAllRequestsModal(true)}
        onHide={() => setShowAllRequestsModal(false)}
        requestId={requestId}
      />
    </>
  )
}
