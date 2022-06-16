import React, { useState, useEffect } from 'react'
import ProjectCard from './components/projectCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import AddNew from './components/AddNew'

const NewestProjectsByTheCommunity = (props) => {
  const [sliderStartIndex, setSliderStartIndex] = useState(0)
  const [sliderEndIndex, setSliderEndIndex] = useState(3)
  const [lastetProject, setLastetProject] = useState([])

  useEffect(() => {
    setSliderEndIndex(0)
    if (props.width >= 1800) {
      setSliderEndIndex(4)
    } else if (props.width > 1340 && props.width <= 1800) {
      setSliderEndIndex(3)
    } else if (props.width > 1200 && props.width <= 1340) {
      setSliderEndIndex(2)
    } else if (props.width > 860 && props.width <= 1200) {
      setSliderEndIndex(3)
    } else if (props.width > 620 && props.width <= 860) {
      setSliderEndIndex(2)
    } else {
      setSliderEndIndex(1)
    }
  }, [props.width])

  const getLastetProjcet = async () => {
    await axiosInstance
      .get('/business/')
      .then((res) => setLastetProject(res.data))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getLastetProjcet()
  }, [])

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      if (page == 1) {
        setSliderStartIndex(sliderStartIndex - 1)
        setSliderEndIndex(sliderEndIndex - 1)
      } else if (page == 2) {
        setSliderStartIndex(startIndex - 1)
        setSliderEndIndex(endIndex - 1)
      }
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (page == 1) {
      if (endIndex < lastetProject.length) {
        setSliderStartIndex(startIndex + 1)
        setSliderEndIndex(endIndex + 1)
      }
    } else if (page == 2) {
      if (endIndex < lastetProject.length) {
        setSliderStartIndex(startIndex + 1)
        setSliderEndIndex(endIndex + 1)
      }
    }
  }

  return (
    <>
      <div className='col-12'>
        <h3 className='page-title' style={{ textTransform: 'capitalize' }}>
          Newest Projects {props.from !== 'Dashboard' && 'By The Community'}
        </h3>
      </div>
      <div className='row mx-auto mt-2'>
        <div className='card-group desktop-menu ps-0 ms-0 d-flex justify-content-around mx-auto'>
          <div className='my-auto'>
            <button
              className='videos-track'
              onClick={() => {
                handlePreviousVideo(1, sliderStartIndex, sliderEndIndex)
              }}
              style={{
                visibility: sliderStartIndex < 1 ? 'hidden' : 'visible'
              }}

              // style={{ width: '2%' }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon'
                // style={{ marginRight: '20px' }}
              />
            </button>
          </div>
          {lastetProject
            .slice(sliderStartIndex, sliderEndIndex)
            ?.map((data, index) => {
              return (
                <ProjectCard data={data} from={'Newest-Projects'} key={index} />
              )
            })}

          {lastetProject.length < sliderEndIndex &&
            [...Array(sliderEndIndex - lastetProject.length)].map(
              (item, index) => (
                <div
                  className='ProjectCard px-0 position-relative empty-connection-box'
                  key={index}
                ></div>
              )
            )}
          <div className='my-auto'>
            <button
              className='videos-track'
              onClick={() =>
                handleNextVideo(1, sliderStartIndex, sliderEndIndex)
              }
              style={{
                // width: '2%',
                visibility:
                  lastetProject.length <= sliderEndIndex ? 'hidden' : 'visible'
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
              onClick={() => {
                handlePreviousVideo(1, sliderStartIndex, sliderEndIndex)
              }}
              style={{
                visibility: sliderStartIndex < 1 ? 'hidden' : 'visible'
              }}
              // style={{ width: '2%' }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon'
                // style={{ marginRight: '20px' }}
              />
            </button>
          </div>
          <div className='mx-2 d-flex justify-content-center'>
            {lastetProject
              .slice(sliderStartIndex, sliderEndIndex)
              ?.map((data, index) => {
                return (
                  <ProjectCard
                    data={data}
                    from={'Newest-Projects'}
                    key={index}
                  />
                )
              })}
          </div>

          <div className='my-auto'>
            <button
              className='videos-track'
              // style={{ width: '2%' }}
              onClick={() =>
                handleNextVideo(1, sliderStartIndex, sliderEndIndex)
              }
              style={{
                visibility:
                  lastetProject.length <= sliderEndIndex ? 'hidden' : 'visible'
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
    </>
  )
}

export default NewestProjectsByTheCommunity
