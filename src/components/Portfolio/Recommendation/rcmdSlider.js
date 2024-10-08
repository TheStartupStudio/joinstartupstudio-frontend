import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import RcmdRequestBox from './rcmdRequestBox'

export default function RcmdSlider(props) {
  const [rcmdRequests, setRcmdRequests] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(4)

  useEffect(() => {
    setEndIndex(checkWidth())
  }, [props.width])

  useEffect(() => {
    setStartIndex(0)
    setEndIndex(checkWidth())
    setRcmdRequests(props.data)
  }, [props.data])

  const checkWidth = () => {
    if (props.width > 1000) {
      return 3
    } else if (props.width >= 685 && props.width <= 1000) {
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
    if (endIndex < rcmdRequests.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  return (
    <div className='row mx-auto'>
      <div
        className={`card-group desktop-menu ${
          rcmdRequests.length > 3
            ? 'd-flex justify-content-around mx-auto'
            : 'justify-content-center'
        } `}
      >
        {rcmdRequests.length > 3 && (
          <div className='my-auto'>
            <button
              className='videos-track'
              onClick={handlePreviousConnection}
              style={{
                width: '2%'
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon'
              />
            </button>
          </div>
        )}
        {rcmdRequests.length > 0 &&
          rcmdRequests
            ?.slice(startIndex, endIndex)
            .map((user, index) => (
              <RcmdRequestBox
                respond={(id) => props.respond(id)}
                continueResponding={(id) => props.continueResponding(id)}
                key={index}
                data={user}
              />
            ))}
        {rcmdRequests.length > 3 && (
          <div className='my-auto'>
            <button
              className='videos-track'
              style={{ width: '2%' }}
              onClick={handleNextConnection}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className='videos-track-icon'
              />
            </button>
          </div>
        )}
      </div>
      <div className='card-group mobile-menu justify-content-center'>
        {rcmdRequests.length > 1 && (
          <div className='my-auto'>
            <button className='videos-track' onClick={handlePreviousConnection}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon'
              />
            </button>
          </div>
        )}
        <div className='text-center d-flex'>
          {rcmdRequests?.slice(startIndex, endIndex).map((user, index) => (
            <RcmdRequestBox
              respond={(id) => props.respond(id)}
              continueResponding={(id) => props.continueResponding(id)}
              key={index}
              data={user}
            />
          ))}
        </div>
        {rcmdRequests.length > 1 && (
          <div className='my-auto'>
            <button className='videos-track' onClick={handleNextConnection}>
              <FontAwesomeIcon
                icon={faChevronRight}
                className='videos-track-icon'
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
