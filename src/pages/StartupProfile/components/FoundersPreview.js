import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import ConnectionBox from '../../../components/Connections/connectionBox'

const FoundersPreview = (props) => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(2)
  const [width, setWidth] = useState(window.innerWidth)

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
    setEndIndex(0)
    if (width >= 2340) {
      setEndIndex(3)
    } else if (width > 1700 && width < 2340) {
      setEndIndex(2)
    } else if (width > 992 && width < 1700) {
      setEndIndex(1)
    } else if (width > 780 && width < 992) {
      setEndIndex(3)
    } else if (width > 735 && width < 780) {
      setEndIndex(2)
    } else if (width > 530 && width < 735) {
      setEndIndex(2)
    } else {
      setEndIndex(1)
    }
  }, [width])

  const handlePreviousConnection = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
  }
  const handleNextConnection = () => {
    if (endIndex < props.founders.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  return (
    <div className='col-12 col-lg-6'>
      <div className='edit_project_video'>
        <span className='edit_project_video_title d-block pb-1'>FOUNDERS</span>
      </div>
      <div className='mx-auto row gx-0 px-0 mt-2 founders-wrapper'>
        {props.data?.show_founders != false &&
          props.data?.show_founders != null && (
            <>
              {/* className={`card-group desktop-menu mobile-menu mt-3  */}
              <div
                className={`card-group  mt-3 
                ${
                  props.founders && props.founders.length > 1
                    ? 'justify-content-between my-auto'
                    : 'ms-2'
                }`}
              >
                <div
                  className='my-auto'
                  style={{
                    visibility: props.founders.length > 1 ? 'visible' : 'hidden'
                  }}
                >
                  <button
                    className='videos-track'
                    onClick={handlePreviousConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className='videos-track-icon'
                    />
                  </button>
                </div>
                {props.data &&
                  props.data?.show_founders != false &&
                  props.founders
                    ?.slice(startIndex, endIndex)
                    .map((data, index) => (
                      <div key={data.id}>
                        {data?.Business_Founders?.is_visible != false ? (
                          <ConnectionBox
                            data={data}
                            key={data.id}
                            from={'PreviewPage'}
                            updateShowPreference={(e, id, value) =>
                              props.updateShowPreference(e, id, value)
                            }
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                <div
                  className='my-auto'
                  style={{
                    visibility: props.founders.length > 1 ? 'visible' : 'hidden'
                  }}
                >
                  <button
                    className='videos-track'
                    onClick={handleNextConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className='videos-track-icon'
                    />
                  </button>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  )
}

export default FoundersPreview
