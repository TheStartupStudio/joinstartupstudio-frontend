import React, { useState, useEffect } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import Podcast from './podcast'
// import Video from './video'
import Player from './player'
import Waveform from './waveform'
import { isEmpty } from '@aws-amplify/core'
import Video from '../../components/Video'
import { NotesButton } from '../../components/Notes'
import { ShowMessenger } from '../../utils/helpers'
import ReactPaginate from 'react-paginate'
import './index.css'
const SavedMedia = () => {
  const [selected, setSelected] = useState('video')
  const [playingUrl, setPlayingUrl] = useState('')
  const [video, setVideo] = useState([])

  const [saved, setSaved] = useState()
  const [loading, setLoading] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [getingDataLoading, setGetingDataLoading] = useState(true)
  const [connections, setConnections] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)

  //Podcasts
  const [podcast, setPodcast] = useState([])
  const [currentPodcasts, setCurrentPodcasts] = useState([])
  const [podcastsPageCount, setPodcastsPageCount] = useState(0)
  const [podcastsItemOffset, setPodcastsItemOffset] = useState(0)
  const podcastsPerPage = 9

  //Saved Videos
  const [savedVideos, setSavedVideos] = useState([])
  const [currentSavedVideos, setCurrentSavedVideos] = useState([])
  const [videosPageCount, setVideosPageCount] = useState(0)
  const [videosItemOffset, setVideosItemOffset] = useState(0)
  const videosPerPage = 9

  // const [hasPodcast, setHasPodcast] = useState(false)

  const style = {
    firstDiv: {
      // maxHeight: '188px',
      minHeight: '188px',
      overflow: 'hidden',
      paddingTop: '1rem'
    },
    loadMore: {
      textAlign: 'left',
      font: 'normal normal 600 13px Montserrat',
      color: '#333d3d83',
      letterSpacing: '0px',
      cursor: 'pointer'
    }
  }

  useEffect(() => {
    getData()
    getSavedVideos()
    getUserConnections()
  }, [])

  useEffect(() => {
    if (podcast.length === 0) {
      setCurrentPodcasts([])
      return
    }

    const endOffset = podcastsItemOffset + podcastsPerPage
    const slicedPodcasts = podcast.slice(podcastsItemOffset, endOffset)

    if (slicedPodcasts.length === 0) {
      if (podcast.length <= podcastsPerPage) {
        setCurrentPodcasts([...podcast])
      } else {
        const paginationPages = document.querySelectorAll(
          '.podcasts-pagination li a'
        )
        paginationPages[paginationPages.length - 3].click()
      }
    } else {
      setCurrentPodcasts(podcast.slice(podcastsItemOffset, endOffset))
      setPodcastsPageCount(Math.ceil(podcast.length / podcastsPerPage))
    }
  }, [podcast, podcastsItemOffset, podcastsPerPage])

  const handlePageClickPodcasts = (event) => {
    const newOffset = (event.selected * podcastsPerPage) % podcast.length
    setPodcastsItemOffset(newOffset)
  }

  useEffect(() => {
    if (savedVideos.length === 0) {
      setCurrentSavedVideos([])
      return
    }

    const endOffset = videosItemOffset + videosPerPage
    const slicedVideos = savedVideos.slice(videosItemOffset, endOffset)

    if (slicedVideos.length === 0) {
      if (savedVideos.length <= videosPerPage) {
        setCurrentSavedVideos([...savedVideos])
      } else {
        const paginationPages = document.querySelectorAll(
          '.videos-pagination li a'
        )
        paginationPages[paginationPages.length - 3].click()
      }
    } else {
      setCurrentSavedVideos(slicedVideos)
      setVideosPageCount(Math.ceil(savedVideos.length / videosPerPage))
    }
  }, [savedVideos, videosItemOffset, videosPerPage])

  const handlePageClickVideos = (event) => {
    const newOffset = (event.selected * videosPerPage) % savedVideos.length
    setVideosItemOffset(newOffset)
  }

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const removeSavedVideo = (id) => {
    setSavedVideos(savedVideos.filter((video) => video.id !== id))
  }

  const getData = async () => {
    setGetingDataLoading(true)
    await axiosInstance
      .get(`/userSaved/saved/podcast`)
      .then((response) => {
        setPodcast(response.data)
        setGetingDataLoading(false)
      })
      .catch((err) => {
        setGetingDataLoading(false)
      })

    setLoading(false)
  }

  const setUrl = (url) => {
    setPlayingUrl(url)
  }

  const updatePodcasts = async (id) => {
    const updatedPodcasts = podcast.filter((podcast) => podcast.SavedId !== id)
    setPodcast(updatedPodcasts)
  }

  const getSavedVideos = async () => {
    await axiosInstance
      .get(`/favorites`)
      .then((response) => {
        setLoadingVideos(false)
        setSavedVideos(response.data)
      })
      .catch((e) => e)
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-xl-9'>
          <div className='account-page-padding page-border'>
            <h3 className='page-title'>
              <IntlMessages id='my_saved.MEDIA' />
            </h3>
            <p className='page-description'>
              <IntlMessages id='my_saved.MEDIA_des' />
            </p>
            <div className='row px-sm-3 mb-md-3' style={{ cursor: 'pointer' }}>
              <div
                className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
                  selected != 'video' ? 'video_podcast_0' : 'video_podcast_1'
                }`}
                onClick={() => {
                  setSelected('video')
                }}
              >
                <IntlMessages id={'my_saved.MEDIA_VIDEOS'}></IntlMessages>
              </div>
              <div
                className={`col-6 text-center px-0 py-2 gx-0 mx-0  ${
                  selected != 'podcast' ? 'video_podcast_0' : 'video_podcast_1'
                }`}
                onClick={() => {
                  setSelected('podcast')
                }}
              >
                <IntlMessages id={'my_saved.MEDIA_PODCASTS'}></IntlMessages>
              </div>
            </div>
            {/* <Player url={playingUrl} isPlaying={audioPlaying} /> */}
            <Waveform
              url={playingUrl}
              isPlaying={audioPlaying}
              setMusicIsPlaying={(data) => setAudioPlaying(data)}
            />
            <div style={{ minHeight: '100vh' }} className='mt-4'>
              {selected === 'video' ? (
                // <Video data={video} loading={loading} />
                <div className='row mx-2'>
                  {currentSavedVideos?.map((video, index) => (
                    <Video
                      id={video.id}
                      key={index}
                      thumbnail={video.thumbnail}
                      title={video.title}
                      description={video.description}
                      page={'saved-videos'}
                      videoData={video}
                      connections={connections}
                      type={'view-all'}
                      removeSavedVideo={(id) => removeSavedVideo(id)}
                    />
                  ))}
                  {!savedVideos.length > 0 && !loadingVideos && (
                    <div className='h-100'>
                      <h4 className='text-center mt-5 pt-5 gt-5'>
                        <span>No saved videos!</span>
                      </h4>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className='row mx-2'>
                    <Podcast
                      setAudioPlaying={(data) => setAudioPlaying(data)}
                      playingUrl={playingUrl}
                      audioPlaying={audioPlaying}
                      data={currentPodcasts}
                      loading={loading}
                      // setAudioPlaying={(data) => setAudioPlaying(data)}
                      url={(url) => setPlayingUrl(url)}
                      updatePodcast={(id) => updatePodcasts(id)}
                    />
                    {getingDataLoading ? (
                      <div className='text-center w-100 py-5'>
                        <span style={style.loadMore} className='disabled'>
                          Loading
                        </span>
                      </div>
                    ) : (
                      podcast.length === 0 &&
                      !getingDataLoading && (
                        <div className='h-100'>
                          <h4 className='text-center mt-5 pt-5 gt-5'>
                            No saved podcasts!
                          </h4>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
              <div className='d-flex justify-content-center mt-4'>
                <div className={`${selected !== 'video' ? 'd-none' : ''}`}>
                  {savedVideos.length > videosPerPage && (
                    <ReactPaginate
                      nextLabel='next'
                      onPageChange={handlePageClickVideos}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={videosPageCount}
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
                      containerClassName='pagination custom-pagination videos-pagination mb-0'
                      activeClassName='active'
                      renderOnZeroPageCount={null}
                    />
                  )}
                </div>
                <div className={`${selected === 'video' ? 'd-none' : ''}`}>
                  {podcast.length > podcastsPerPage && (
                    <ReactPaginate
                      nextLabel='next'
                      onPageChange={handlePageClickPodcasts}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={podcastsPageCount}
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
                      containerClassName='pagination custom-pagination podcasts-pagination mb-0'
                      activeClassName='active'
                      renderOnZeroPageCount={null}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-2 mt-3'>
          <ShowMessenger />
          <NotesButton />
        </div>
      </div>
    </div>
  )
}

export default SavedMedia
