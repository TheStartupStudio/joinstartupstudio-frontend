import React, { useState, useEffect } from 'react'
import ProjectCard from './components/projectCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import AddNew from './components/AddNew'
import { toast } from 'react-toastify'

const MyProjects = (props) => {
  const [sliderStartIndex, setSliderStartIndex] = useState(0)
  const [sliderEndIndex, setSliderEndIndex] = useState(4)
  const [MyProjects, setMyProjects] = useState(props.MyProjects)
  const [projectLength, setProjectLength] = useState(0)

  useEffect(() => {
    if (props.MyProjects.length == 0) {
      setProjectLength(3)
    } else if (props.MyProjects.length == 1) {
      setProjectLength(2)
    } else if (props.MyProjects.length == 2) {
      setProjectLength(1)
    } else if (props.MyProjects.length >= 3) {
      setProjectLength(0)
    }
  }, [])

  const deleteProject = async (id) => {
    await axiosInstance
      .delete('/business/delete/business/delete', { data: { id } })
      .then((response) => {
        toast.success('The project was deleted successfully')
        props.removeProject(id)
      })
  }

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

  // const getLastetProjcet = async () => {
  //   await axiosInstance
  //     .get('/business/ById')
  //     .then((res) => {
  //       setMyProjects(res.data)
  //     })
  //     .catch((err) => console.log(err))
  // }

  // useEffect(() => {
  //   getLastetProjcet()
  // }, [])
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
      if (endIndex < props.MyProjects.length) {
        setSliderStartIndex(startIndex + 1)
        setSliderEndIndex(endIndex + 1)
      }
    } else if (page == 2) {
      if (endIndex < props.MyProjects.length) {
        setSliderStartIndex(startIndex + 1)
        setSliderEndIndex(endIndex + 1)
      }
    }
  }

  return (
    <>
      {/* <p className='NewestProjectsByTheCommunity_title'>My Projects</p> */}
      <div className='col-12'>
        <h3 className='page-title' style={{ textTransform: 'capitalize' }}>
          {props.from == 'UserProject'
            ? props.user?.name + ' Projects'
            : 'My Projects'}
        </h3>
      </div>
      <div className='row mx-auto mt-2'>
        <div className='card-group desktop-menu ps-0 ms-0 d-flex justify-content-around mx-auto'>
          <div className='my-auto'>
            <button
              className='videos-track'
              onClick={() =>
                handlePreviousVideo(2, sliderStartIndex, sliderEndIndex)
              }
              style={{
                visibility: sliderStartIndex < 1 ? 'hidden' : 'visible'
              }}
              // style={{ width: '2%' }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon my-auto'
                // style={{ marginRight: '20px' }}
              />
            </button>
          </div>
          {props.MyProjects.slice(sliderStartIndex, sliderEndIndex)?.map(
            (data, index) => {
              return (
                <ProjectCard
                  data={data}
                  key={index}
                  from={'myProject'}
                  deleteProject={(id) => deleteProject(id)}
                  editAble={props.editAble}
                  width={window.innerWidth}
                />
              )
            }
          )}

          {props.MyProjects.length < sliderEndIndex && (
            <>
              {[...Array(sliderEndIndex - props.MyProjects.length)].map(
                (x, i) => (
                  <AddNew key={i} onClick={() => props.onClick()} />
                )
              )}
            </>
          )}

          {/* <div className='arrow-icon-1 ms-auto ms-md-auto arrow my-auto'> */}
          <div className='my-auto'>
            <button
              className='videos-track my-auto'
              style={{
                // width: '2%',
                visibility:
                  props.MyProjects.length <= sliderEndIndex
                    ? 'hidden'
                    : 'visible'
              }}
              onClick={() =>
                handleNextVideo(2, sliderStartIndex, sliderEndIndex)
              }
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
              onClick={() =>
                handlePreviousVideo(2, sliderStartIndex, sliderEndIndex)
              }
              style={{
                visibility: sliderStartIndex < 1 ? 'hidden' : 'visible'
              }}
              // style={{ width: '2%' }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className='videos-track-icon my-auto'
                // style={{ marginRight: '20px' }}
              />
            </button>
          </div>
          <div className='mx-2 d-flex justify-content-center'>
            {props.MyProjects.slice(sliderStartIndex, sliderEndIndex)?.map(
              (data, index) => {
                return (
                  <ProjectCard
                    data={data}
                    key={index}
                    from={'myProject'}
                    deleteProject={(id) => deleteProject(id)}
                    editAble={props.editAble}
                    width={window.innerWidth}
                  />
                )
              }
            )}

            {props.MyProjects.length < sliderEndIndex && (
              <>
                {[...Array(sliderEndIndex - props.MyProjects.length)].map(
                  (x, i) => (
                    <AddNew key={i} onClick={() => props.onClick()} />
                  )
                )}
              </>
            )}
          </div>

          {/* <div className='arrow-icon-1 ms-auto ms-md-auto arrow my-auto'> */}
          <div className='my-auto'>
            <button
              className='videos-track my-auto'
              style={{
                // width: '2%',
                visibility:
                  props.MyProjects.length <= sliderEndIndex
                    ? 'hidden'
                    : 'visible'
              }}
              onClick={() =>
                handleNextVideo(2, sliderStartIndex, sliderEndIndex)
              }
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

export default MyProjects
