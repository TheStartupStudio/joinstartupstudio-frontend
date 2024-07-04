import React, { useState, useEffect, useCallback } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import image2 from '../../assets/images/SIM Podcast Cover-1200px.png'
import { Link } from 'react-router-dom'
import Waveform from './waveform'
import Amazon_Music from '../../assets/images/Amazon Music.png'
import Apple_Podcasts from '../../assets/images/Apple Podcasts.png'
import Google_Podcasts_2x from '../../assets/images/Google Podcasts.png'
import Overcast_2x from '../../assets/images/Overcast.png'
import Spotify_2x from '../../assets/images/Spotify.png'
import Stitcher_2x from '../../assets/images/Stitcher.png'
import PodCast from './podcast'
import { changeSidebarState } from '../../redux'
import axiosInstance from '../../utils/AxiosInstance'
import { LastSaved } from './lastSaved'

import './StoryInMotion.css'
import { useDispatch } from 'react-redux'
import { NotesButton } from '../../components/Notes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import Video from '../../components/Video'
const redirect = (input) => {
  window.open(input, '_blank')
}

let Style = {
  hr: {
    backgroundColor: '#333D3D6D',
    height: ' 0.8px'
  },
  loadMore: {
    textAlign: 'left',
    font: 'normal normal 600 13px Montserrat',
    color: '#333d3d83',
    letterSpacing: '0px',
    cursor: 'pointer'
  }
}

function StoryInMotionGuestQA() {
  const [startupLiveVideos, setStartupLiveVideos] = useState([])
  const [startVideoIndex, setStartVideoIndex] = useState(0)
  const [endVideoIndex, setEndVideoIndex] = useState(4)

  const getEncouragementVideos = async () => {
    await axiosInstance
      .get(`/contents/user-contents/startup-live`)
      .then((response) => {
        setStartupLiveVideos(response.data)
      })
      .catch((err) => err)
  }

  useEffect(() => {
    getEncouragementVideos()
  }, [])

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      if (page === 1) {
        setStartVideoIndex(startIndex - 1)
        setEndVideoIndex(endIndex - 1)
      }
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (page === 1) {
      if (endIndex < startupLiveVideos.length) {
        setStartVideoIndex(startIndex + 1)
        setEndVideoIndex(endIndex + 1)
      }
    }
  }

  return (
    <div className='page-padding'>
      <div className='guidance-videos-top mt-5 mb-3 guidance-encouragement-page-titles'>
        <h3>
          <IntlMessages id='storyInMotion.guest_q&a_videos' />
        </h3>
        <Link className='guidance-link' to={`/startup-live/videos`}>
          <IntlMessages id='general.view_all' />
        </Link>
      </div>

      <div className='beyond-videos-desktop'>
        <div className='arrow-icon-1'>
          <button
            className={`videos-track ${
              window.location.pathname.includes('/beyond-your-course') &&
              'slider-arrow-first'
            }`}
            onClick={() => {
              handlePreviousVideo(1, startVideoIndex, endVideoIndex)
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='videos-track-icon'
            />
          </button>
        </div>
        <div className='card-group desktop-menu card-group-beyond-your-course w-100'>
          {startupLiveVideos
            ?.slice(startVideoIndex, endVideoIndex)
            .map((video, index) => (
              <Video
                id={video.id}
                key={index}
                thumbnail={video.thumbnail}
                title={video.title}
                description={video.description}
                page={'encouragement'}
                isMainPage={false}
                videoData={video}
                type={'startup-live'}
              />
            ))}
        </div>
        <div className='arrow-icon-1 justify-content-start'>
          <button
            className={`videos-track ${
              window.location.pathname.includes('/beyond-your-course') &&
              'slider-arrow-second'
            }`}
            style={{ width: '2%' }}
            onClick={() => {
              handleNextVideo(1, startVideoIndex, endVideoIndex)
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
function FavoriteEpisodes(props) {
  return (
    <div className='col-12 pb-5 py-lg-0 col-lg-3 border-start'>
      <div className='my-lg-4 col-11 mx-auto text-center'>
        <img
          src={image2}
          className='border story-in-motion-logo'
          alt={'story in motion'}
        />
      </div>
      <div className='mb-4 mt-4 col-10 mx-auto'></div>
      {props.lastSaved.length > 0 && (
        <>
          <h4 className='text-center h4 mb-4 postcast-faworite-widget'>
            <IntlMessages id={'storyInMotion.favorite'} />
          </h4>
          {props.lastSaved.slice(-2).map((lastSaved) => (
            <LastSaved
              data={lastSaved}
              icon={
                (lastSaved?.url == props.selectedTrack?.url) & props.isPlaying
              }
              key={lastSaved?.id}
              id={lastSaved?.id}
              title={lastSaved?.title}
              date={lastSaved?.date}
              saved={lastSaved?.saved}
              description={lastSaved?.description || '1'}
              url={lastSaved?.url}
              remove={(data) => {
                props.removeSaved(data)
              }}
              onClick={(data) => {
                props.setSelectedTrack(lastSaved)
                props.setMusicPlaying((now) => !now)

                if (data === 'play') {
                  props.setIsPlaying(true)
                } else if (data === 'pause') {
                  props.setIsPlaying(false)
                }
              }}
            />
          ))}
        </>
      )}
      {props.lastSaved.length >= 2 && (
        <div className='view_all text-center'>
          <Link
            to={'/savedMedia#story-in-motion'}
            className='view_all text-center'
          >
            <span>View all</span>
          </Link>
        </div>
      )}
    </div>
  )
}

const MemoizedFavorites = React.memo(FavoriteEpisodes)
const MemoizedStoryInMotionGuestQA = React.memo(StoryInMotionGuestQA)

function StoryInMotion() {
  const [tracks, setracks] = useState()
  const [selectedTrack, setSelectedTrack] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [MusicPlaying, setMusicPlaying] = useState(false)
  const [lastSaved, setLastSaved] = useState([])
  const [page, setPage] = useState(0)
  // eslint-disable-next-line
  const [size, setSize] = useState(4)
  const [allPage, setAllPage] = useState()
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  const gettracks = async () => {
    setLoading(true)
    await axiosInstance
      .get(`/userSaved/podcast`)
      .then(async (response) => {
        await axiosInstance
          .get(`/podcast?page=${page}&size=${size}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods':
                'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Expose-Headers': '*'
            }
          })
          .then((res) => {
            for (let i = 0; i < res.data.data.length; i++) {
              for (let j = 0; j < response.data.length; j++) {
                if (response.data[j].podcast == res.data.data[i].id) {
                  res.data.data[i].saved = true
                  break
                } else {
                  res.data.data[i].saved = false
                }
              }
            }
            setAllPage(res.data.allPage)
            if (tracks?.length === undefined) {
              setracks(res.data.data)
            } else {
              setracks([...tracks, ...res.data.data])
            }
            if (selectedTrack == null) {
              setSelectedTrack(res.data.data[0])
            }
            setPage(page + 1)
            setLoading(false)
          })
      })
      .catch(() => {})
  }

  const getLastetSaved = () => {
    axiosInstance.get('/userSaved/lastet').then((response) => {
      if (Array.isArray(response.data)) {
        response.data?.map((data) => {
          axiosInstance.get(`/podcast/${data.podcast}`).then((res) => {
            setLastSaved((old) => [...old, res.data])
          })
        })
      }
    })
  }
  // eslint-disable-next-line
  useEffect(async () => {
    await gettracks()
    await getLastetSaved()
    // eslint-disable-next-line
  }, [])

  // const removeSaved = async (podcast) => {
  //   const FoundTrackIndex = tracks?.filter((item, index) => {
  //     if (podcast.url == item.url) {
  //       return item
  //     }
  //   })

  //   if (FoundTrackIndex) {
  //     setracks(
  //       tracks.map((track) => {
  //         if (FoundTrackIndex.length > 0 && track.id == FoundTrackIndex[0].id) {
  //           track.saved = false
  //         }
  //         return track
  //       })
  //     )
  //     setLastSaved(
  //       lastSaved.filter(
  //         (track) =>
  //           FoundTrackIndex.length > 0 && track.id != FoundTrackIndex[0].id
  //       )
  //     )
  //   }
  // }
  const removeSaved = useCallback(
    async (podcast) => {
      const FoundTrackIndex = tracks?.filter((item, index) => {
        if (podcast.url === item.url) {
          return item
        }
        return null
      })

      if (FoundTrackIndex) {
        setracks((prevTracks) =>
          prevTracks.map((track) => {
            if (
              FoundTrackIndex.length > 0 &&
              track.id === FoundTrackIndex[0].id
            ) {
              track.saved = false
            }
            return track
          })
        )

        setLastSaved((prevLastSaved) =>
          prevLastSaved.filter(
            (track) =>
              FoundTrackIndex.length > 0 && track.id !== FoundTrackIndex[0].id
          )
        )
      }
    },
    [tracks]
  )

  return (
    <div>
      <div id='main-body'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12 col-lg-9 px-0'>
              <div className='page-padding'>
                <h3 className='pageTitle'>
                  <IntlMessages id='sidebar.story_in_motion' />
                </h3>
                <p className='page-description-story-in-motion'>
                  <IntlMessages id='storyInMotion.page_description2' />
                </p>
                <h3 className='mt-5 pt-2 page-description-this-week-podcast'>
                  <IntlMessages id='storyInMotion.page_week_podcast' />
                </h3>
                <p className='story-in-motion-now-playing'>
                  <IntlMessages id='storyInMotion.page_week_now_playing' />
                  <span className='mx-2'>{selectedTrack?.title}</span>
                </p>
                <Waveform
                  url={selectedTrack?.url}
                  isPlayingParent={setIsPlaying}
                  isPlaying={isPlaying}
                  setMusicIsPlaying={MusicPlaying}
                />
                <p className='story-in-motion-also-avalible mb-2 pb-0 '>
                  <IntlMessages id='storyInMotion.page_also_avalible' />
                </p>
                <div className='d-md-flex justify-content-between text-center podcast-platforms-img'>
                  <img
                    src={Amazon_Music}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect(
                        'https://music.amazon.com/podcasts/ff04a067-2539-4c4e-9403-295a2aad3227/story-in-motion---conversations-on-empowerment-wellness-and-performance'
                      )
                    }}
                    alt='Amazon_Music'
                  />
                  <img
                    src={Apple_Podcasts}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect(
                        'https://podcasts.apple.com/us/podcast/story-in-motion-conversations-on-empowerment-wellness-and-performance/id1615119248'
                      )
                    }}
                    alt='Apple_Podcasts'
                  />
                  <img
                    src={Google_Podcasts_2x}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect(
                        'https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5idXp6c3Byb3V0LmNvbS8xOTQxNzcxLnJzcw=='
                      )
                    }}
                    alt='Google_Podcasts_2x'
                  />
                  <img
                    src={Overcast_2x}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect('https://overcast.fm/itunes1615119248')
                    }}
                    alt='Overcast_2x'
                  />
                  <img
                    src={Spotify_2x}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect(
                        'https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                      )
                    }}
                    alt='Spotify_2x'
                  />
                  <img
                    src={Stitcher_2x}
                    className='mt-2 mt-sm-0 me-2 me-sm-0 mx-1 my-1'
                    onClick={() => {
                      redirect(
                        'https://www.stitcher.com/show/story-in-motion-conversations-on-empowerment-wellness-and'
                      )
                    }}
                    alt='Stitcher_2x'
                  />
                </div>
                <p className='mt-4 story-in-motion-Previous-Podcast-Episodes'>
                  <IntlMessages id='storyInMotion.previous_podcast_episodes' />
                </p>
                {tracks?.map((e, index) => {
                  return (
                    <div className='row'>
                      <PodCast
                        icon={(e?.url == selectedTrack?.url) & isPlaying}
                        key={index}
                        id={e?.id}
                        title={e?.title}
                        date={e.date}
                        lastSaved={lastSaved}
                        remove={(data) => removeSaved(data)}
                        setLastSaved={(data) => {
                          setLastSaved(data)
                        }}
                        saved={e.saved}
                        description={e.description}
                        url={e.url}
                        onClick={(data) => {
                          if (data === 'play') {
                            setSelectedTrack(e)
                            setMusicPlaying(true)
                            setIsPlaying(true)
                          } else if (data === 'pause') {
                            setIsPlaying(false)
                          }
                        }}
                      />
                      <hr style={Style.hr} />
                    </div>
                  )
                })}
              </div>
              <div className='text-center w-100 mb-5'>
                {allPage > page && (
                  <span
                    style={Style.loadMore}
                    onClick={() => {
                      gettracks()
                    }}
                  >
                    {loading ? (
                      <IntlMessages id='general.loading' />
                    ) : (
                      <IntlMessages id={'storyInMotion.load_more'} />
                    )}
                  </span>
                )}
              </div>
              <MemoizedStoryInMotionGuestQA />
            </div>
            <MemoizedFavorites
              removeSaved={removeSaved}
              setLastSaved={setLastSaved}
              lastSaved={lastSaved}
              setSelectedTrack={setSelectedTrack}
              selectedTrack={selectedTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setMusicPlaying={setMusicPlaying}
            />
          </div>
          <NotesButton />
        </div>
      </div>
    </div>
  )
}

export default StoryInMotion
