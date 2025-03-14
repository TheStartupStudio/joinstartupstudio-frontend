import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import { changeSidebarState } from '../../redux'
import Video from '../../components/Video'
import ReactPaginate from 'react-paginate'
import '../Saved/index.css'
import { setBackButton } from '../../redux/backButtonReducer'
import './index.css'

export default function GuidanceEncouragement() {
  const [pageTitle, setPageTitle] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [pageVideos, setPageVideos] = useState([])
  const [currentPageVideos, setCurrentPageVideos] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [connections, setConnections] = useState([])
  const videosPerPage = 9
  const [activeLevel, setActiveLevel] = useState(0);
  const levels = [
    { id: 1, title: "Encouragement Videos" },
    { id: 2, title: "Career Guidance Videos" },
    { id: 3, title: "Story in Motion Podcast Episodes" }
  ];

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBackButton(true, 'story-in-motion'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    const endOffset = itemOffset + videosPerPage
    setCurrentPageVideos(pageVideos.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(pageVideos.length / videosPerPage))
  }, [pageVideos, itemOffset, videosPerPage])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * videosPerPage) % pageVideos.length
    setItemOffset(newOffset)
  }

  useEffect(() => {
    if (window.location.href.includes('encouragement/videos')) {
      setPageTitle('MASTER CLASSES | ENCOURAGEMENT VIDEOS')
      setPageDescription('beyond_your_course.encouragement_description')
      getEncouragementVideos()
    } else if (window.location.href.includes('master-classes/videos')) {
      setPageTitle('MASTER CLASSES | CAREER GUIDANCE')
      setPageDescription('beyond_your_course.master_classes_description')
      getMasterClassVideos()
    } else if (window.location.href.includes('startup-live/videos')) {
      setPageTitle('MASTER CLASSES | STORY IN MOTION GUEST Q&AS')
      setPageDescription('startup_live.startup_archive_description')
      getStartupLiveVideos()
    }
    getUserConnections()
  }, [])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const getEncouragementVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/guidance`)
      .then((response) => {
        setPageVideos(response.data)
      })
      .catch((err) => err)
  }

  const getMasterClassVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/master`)
      .then((response) => {
        setPageVideos(response.data)
      })
      .catch((err) => err)
  }

  const getStartupLiveVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/startup-live`)
      .then((response) => {
        setPageVideos(response.data)
      })
      .catch((err) => err)
  }

  return (
    <div id='main-body'>
      <div className='container-fluid gradient-background'>
        <div className='row'>
          <div className='col-12 col-xl-12'>
            <div className='account-page-padding page-border'>
              <div
                style={
                  pageVideos && pageVideos.length < 1
                    ? { height: '1000px' }
                    : null
                }
              >
                <div>
                  <h3 className='page-title'>
                    {pageTitle && <span> {pageTitle} </span>}
                  </h3>
                  <p className='page-description'>
                    {pageDescription && (
                      <IntlMessages id={`${pageDescription}`} />
                    )}
                  </p>
                </div>
                <div className="level-navigation">
                  {levels.map((level, index) => (
                    <div
                      key={level.id}
                      className={`course-level ${activeLevel === index ? 'active-level' : ''}`}
                      onClick={() => setActiveLevel(index)}
                    >
                      {level.title}
                    </div>
                  ))}
                </div>
                <div className='row videos-container'>
                  {currentPageVideos?.map((video, index) => (
                    <Video
                      id={video.id}
                      key={index}
                      thumbnail={video.thumbnail}
                      title={video.title}
                      description={video.description}
                      page={
                        window.location.href.includes('startup-live/videos')
                          ? 'startup-live'
                          : pageTitle === 'CAREER GUIDANCE'
                          ? 'master-classes'
                          : 'encouragement'
                      }
                      videoData={video}
                      connections={connections}
                      type={'view-all'}
                    />
                  ))}
                </div>
              </div>
              {pageVideos.length > videosPerPage && (
                <div className='d-flex justify-content-center mt-4'>
                  <ReactPaginate
                    nextLabel='next'
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel='prev'
                    pageClassName='page-item'
                    pageLinkClassName='page-link px-3'
                    previousClassName='page-item me-2'
                    previousLinkClassName='page-link'
                    nextClassName='page-item ms-2'
                    nextLinkClassName='page-link'
                    breakLabel='...'
                    breakClassName='page-item'
                    breakLinkClassName='page-link px-3'
                    containerClassName='pagination custom-pagination mb-0'
                    activeClassName='active'
                    renderOnZeroPageCount={null}
                  />
                </div>
              )}
            </div>
          </div>
          {/* <div className='col-12 col-xl-3 px-2 mt-3'> */}
          {/* <ShowMessenger /> */}
          {/* <NotesButton /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}
