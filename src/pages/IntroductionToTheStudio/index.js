import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import NotificationBell from '../../components/NotificationBell'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import WalkthroughPoster from './WalkthroughPoster'
import {
  WALKTHROUGH_STEPS,
  WALKTHROUGH_STORAGE_PREFIX
} from './steps'
import './index.css'

function HexBadge({ n, isActive, isWatched }) {
  const stroke = isActive || isWatched ? '#52C7D3' : '#E6E6E6'
  const fill = isWatched ? '#52C7D3' : 'none'
  const numColor = isActive ? '#000000' : '#78787D'

  return (
    <div className='its-hex' aria-hidden='true'>
      <svg width='36' height='33' viewBox='0 0 44 40' fill='none'>
        <path
          d='M11.5 2 L32.5 2 L43 20 L32.5 38 L11.5 38 L1 20 Z'
          stroke={stroke}
          fill={fill}
          strokeWidth='1.5'
        />
        {isWatched ? (
          <path
            d='M15 20.5 L20 25.5 L29.5 15.5'
            stroke='#FFFFFF'
            strokeWidth='1'
            fill='none'
            strokeLinecap='square'
          />
        ) : null}
      </svg>
      {!isWatched ? (
        <span className='its-hex__num' style={{ color: numColor }}>
          {n}
        </span>
      ) : null}
    </div>
  )
}

function readWatched(userKey) {
  try {
    const raw = localStorage.getItem(`${WALKTHROUGH_STORAGE_PREFIX}${userKey}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(Number)
      .filter((n) => n >= 1 && n <= WALKTHROUGH_STEPS.length)
  } catch (error) {
    return []
  }
}

function writeWatched(userKey, watched) {
  try {
    localStorage.setItem(
      `${WALKTHROUGH_STORAGE_PREFIX}${userKey}`,
      JSON.stringify(watched)
    )
  } catch (error) {
    // ignore storage failures
  }
}

function IntroductionToTheStudio() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')
  const userKey = String(user?.id || user?.user_id || 'guest')

  const [activeId, setActiveId] = useState(1)
  const [watched, setWatched] = useState([])
  const [playing, setPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [posterFailed, setPosterFailed] = useState({})

  useEffect(() => {
    setWatched(readWatched(userKey))
  }, [userKey])

  useEffect(() => {
    setPlaying(false)
    setShowPlayer(false)
  }, [activeId])

  const activeStep = useMemo(
    () => WALKTHROUGH_STEPS.find((s) => s.id === activeId) || WALKTHROUGH_STEPS[0],
    [activeId]
  )

  const progressPct = (watched.length / WALKTHROUGH_STEPS.length) * 100
  const useCdnPoster = activeStep && !posterFailed[activeStep.id]

  const markWatched = (stepId) => {
    setWatched((prev) => {
      if (prev.includes(stepId)) return prev
      const next = [...prev, stepId].sort((a, b) => a - b)
      writeWatched(userKey, next)
      return next
    })
  }

  const handleSelectStep = (stepId) => {
    if (stepId === activeId) return
    setPlaying(false)
    setShowPlayer(false)
    setActiveId(stepId)
  }

  const handleStartCourse = () => {
    history.push('/my-course-in-entrepreneurship/journal')
  }

  const handlePosterClick = () => {
    setShowPlayer(true)
    setPlaying(true)
  }

  return (
    <div className='its-page'>
      <header className='its-header'>
        <div className='its-header__text'>
          <h1 className='its-header__title'>Introduction to The Studio</h1>
          <p className='its-header__subhead'>
            This is a great place to start. Watch these short videos to help
            guide you through your Studio experience.
          </p>
        </div>
        <div className='its-header__actions'>
          {Number(userRole) === 2 ? <NotificationBell /> : null}
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
      </header>

      <div className='its-body'>
        <div className='its-shell'>
          <div className='its-cols'>
            <section className='its-card its-card--player'>
              <div className='its-step-label'>
                STEP {activeStep.id} OF {WALKTHROUGH_STEPS.length}
              </div>
              <h2 className='its-video-title'>{activeStep.title}</h2>
              <p className='its-video-purpose'>{activeStep.purpose}</p>

              <div className='its-player'>
                {!showPlayer ? (
                  <button
                    type='button'
                    className='its-player__poster-btn'
                    onClick={handlePosterClick}
                    aria-label={`Play ${activeStep.title}`}
                  >
                    {useCdnPoster ? (
                      <img
                        className='its-player__poster-img'
                        src={activeStep.posterUrl}
                        alt=''
                        onError={() =>
                          setPosterFailed((prev) => ({
                            ...prev,
                            [activeStep.id]: true
                          }))
                        }
                      />
                    ) : (
                      <WalkthroughPoster step={activeStep} />
                    )}
                    <span className='its-player__play-badge' aria-hidden='true'>
                      <svg width='66' height='60' viewBox='0 0 44 40' fill='none'>
                        <path
                          d='M11.5 2 L32.5 2 L43 20 L32.5 38 L11.5 38 L1 20 Z'
                          stroke='#52C7D3'
                          strokeWidth='1.5'
                        />
                        <path d='M18 13 L30 20 L18 27 Z' fill='#52C7D3' />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <ReactPlayer
                    key={activeStep.id}
                    className='its-player__react'
                    url={activeStep.videoUrl}
                    width='100%'
                    height='100%'
                    controls
                    playing={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => {
                      setPlaying(false)
                      markWatched(activeStep.id)
                    }}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                          poster: useCdnPoster ? activeStep.posterUrl : undefined
                        }
                      }
                    }}
                  />
                )}
              </div>
            </section>

            <aside className='its-card its-card--track'>
              <div className='its-track-label'>Your Walkthrough</div>
              <div className='its-progress' aria-hidden='true'>
                <div
                  className='its-progress__fill'
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className='its-track-list' role='list'>
                {WALKTHROUGH_STEPS.map((step) => {
                  const isActive = step.id === activeId
                  const isWatched = watched.includes(step.id)

                  return (
                    <button
                      key={step.id}
                      type='button'
                      role='listitem'
                      className={`its-row${isActive ? ' is-active' : ''}`}
                      onClick={() => handleSelectStep(step.id)}
                    >
                      <HexBadge
                        n={step.id}
                        isActive={isActive}
                        isWatched={isWatched}
                      />
                      <div className='its-row__text'>
                        <div className='its-row__title'>{step.title}</div>
                        <div className='its-row__purpose'>{step.purpose}</div>
                      </div>
                      <div className='its-row__duration'>{step.duration}</div>
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>

          <p className='its-guidance'>
            Looking for encouragement mid-build?{' '}
            <Link to='/beyond-your-course' className='its-guidance__link'>
              Studio Guidance
            </Link>{' '}
            is always there.
          </p>

          <div className='its-close'>
            <h2 className='its-close__headline'>
              Let&apos;s begin with the first question: Who are you?
            </h2>
            <button
              type='button'
              className='its-cta'
              onClick={handleStartCourse}
            >
              Start Your Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroductionToTheStudio
