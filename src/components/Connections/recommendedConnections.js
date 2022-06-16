import React, { useEffect, useState } from 'react'
import ConnectionBox from './connectionBox'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'

export default function RecommendedConnections(props) {
  const [recommendedConnections, setRecommendedConnections] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(4)

  useEffect(() => {
    getRecommendedConnections()
  }, [])

  useEffect(() => {
    setStartIndex(0)
    if (props.width >= 1800) {
      setEndIndex(4)
    } else if (props.width > 1340 && props.width <= 1800) {
      setEndIndex(3)
    } else if (props.width > 1200 && props.width <= 1340) {
      setEndIndex(2)
    } else if (props.width > 860 && props.width <= 1200) {
      setEndIndex(3)
    } else if (props.width > 620 && props.width <= 860) {
      setEndIndex(2)
    } else {
      setEndIndex(1)
    }
  }, [props])

  const handlePreviousConnection = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
  }

  const handleNextConnection = () => {
    if (endIndex < recommendedConnections.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  const getRecommendedConnections = async () => {
    await axiosInstance
      .get('/connect/recommended')
      .then((res) => {
        if (res.data.users.length) setRecommendedConnections(res.data.users)
      })
      .catch((e) => e)
  }

  const newConnectionRequest = async (id, connectionId) => {
    await axiosInstance
      .post('/connect', {
        toUserId: id
      })
      .then((res) => {
        let changedUserIndexRecommended = recommendedConnections.findIndex(
          (x) => x.id === id
        )
        if (changedUserIndexRecommended < 0) return
        const updatedAllRecommended = [...recommendedConnections]
        updatedAllRecommended[changedUserIndexRecommended].status = 'requested'
        setRecommendedConnections(updatedAllRecommended)

        toast.success(<IntlMessages id='connection.request.successful' />)
      })
      .catch((e) =>
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      )
  }

  return (
    <div className='row mx-auto mt-2'>
      <div
        className={`card-group desktop-menu ps-0 ms-0 d-flex justify-content-around mx-auto`}
      >
        {/* {recommendedConnections.length > 4 && ( */}
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handlePreviousConnection}
            style={{ visibility: startIndex < 1 ? 'hidden' : 'visible' }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='videos-track-icon'
            />
          </button>
        </div>
        {/* )} */}

        {recommendedConnections
          ?.slice(startIndex, endIndex)
          .map((user, index) => (
            <ConnectionBox
              key={index}
              data={user}
              newConnectionRequest={newConnectionRequest}
            />
          ))}

        {recommendedConnections.length < endIndex &&
          [...Array(endIndex - recommendedConnections.length)].map(
            (item, index) => (
              <div
                className='col-auto my-connection-box empty-connection-box mx-2 p-3'
                key={index}
              ></div>
            )
          )}
        {/* {recommendedConnections.length > 4 && ( */}
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handleNextConnection}
            style={{
              visibility:
                recommendedConnections.length <= endIndex ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className='videos-track-icon'
            />
          </button>
        </div>
        {/* )} */}
      </div>
      <div className='card-group mobile-menu justify-content-center'>
        {/* {recommendedConnections.length > 1 && ( */}
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handlePreviousConnection}
            style={{
              visibility: startIndex < 1 ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='videos-track-icon'
            />
          </button>
        </div>
        {/* )} */}
        <div className='mx-2 d-flex justify-content-center'>
          {recommendedConnections
            ?.slice(startIndex, endIndex)
            .map((user, index) => (
              <ConnectionBox
                key={index}
                data={user}
                //   toggleRespondConnectionModal={toggleRespondConnectionModal}
                newConnectionRequest={newConnectionRequest}
              />
            ))}
        </div>
        {/* {recommendedConnections.length > 1 && ( */}
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handleNextConnection}
            style={{
              visibility:
                recommendedConnections.length <= endIndex ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className='videos-track-icon'
            />
          </button>
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
