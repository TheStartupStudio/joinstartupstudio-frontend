import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import ConnectionBox from '../Connections/connectionBox'

export default function ConnectionsSlider(props) {
  const [connections, setConnections] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(4)

  useEffect(() => {
    setEndIndex(checkWidth())
  }, [props.width])

  useEffect(() => {
    setStartIndex(0)
    setEndIndex(checkWidth())
    setConnections(props.data)
  }, [props.data])

  const checkWidth = () => {
    if (props.width >= 1800) {
      return 4
    } else if (props.width > 1360 && props.width <= 1800) {
      return 3
    } else if (props.width > 1200 && props.width <= 1360) {
      return 2
    } else if (props.width > 860 && props.width <= 1200) {
      return 3
    } else if (props.width > 620 && props.width <= 860) {
      return 2
    } else {
      return 1
    }
  }

  const handlePreviousConnection = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
  }

  const handleNextConnection = () => {
    if (endIndex < connections.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  return (
    <div className='row mx-auto mt-2'>
      <div className='card-group desktop-menu ps-0 ms-0 d-flex justify-content-around mx-auto'>
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handlePreviousConnection}
            style={{
              width: '2%',
              visibility: startIndex < 1 ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='videos-track-icon'
            />
          </button>
        </div>
        {connections.length > 0 &&
          connections?.slice(startIndex, endIndex).map((user, index) => (
            <ConnectionBox
              key={index}
              data={user}
              removeConnection={props.removeConnection}
              //   toggleRespondConnectionModal={toggleRespondConnectionModal}
              newConnectionRequest={props.newConnectionRequest}
              toggleRespondConnectionModal={props.toggleRespondConnectionModal}
            />
          ))}
        {connections.length < endIndex &&
          [...Array(endIndex - connections.length)].map((item, index) => (
            <div
              className='col-auto my-connection-box empty-connection-box mx-2 p-3'
              key={index}
            ></div>
          ))}
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handleNextConnection}
            style={{
              width: '2%',
              visibility: connections.length <= endIndex ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className='videos-track-icon'
            />
          </button>
        </div>
      </div>
      <div className='card-group mobile-menu justify-content-center'>
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
        <div className='text-center mx-3 d-flex'>
          {connections?.slice(startIndex, endIndex).map((user, index) => (
            <ConnectionBox
              key={index}
              data={user}
              removeConnection={props.removeConnection}
              toggleRespondConnectionModal={props.toggleRespondConnectionModal}
              newConnectionRequest={props.newConnectionRequest}
            />
          ))}
          {connections.length < endIndex &&
            [...Array(endIndex - connections.length)].map((key, index) => (
              <div
                className='col-auto my-connection-box empty-connection-box mx-2 p-3'
                key={index}
              ></div>
            ))}
        </div>
        <div className='my-auto'>
          <button
            className='videos-track'
            onClick={handleNextConnection}
            style={{
              visibility: connections.length <= endIndex ? 'hidden' : 'visible'
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className='videos-track-icon'
            />
          </button>
        </div>
      </div>
    </div>
  )
}
