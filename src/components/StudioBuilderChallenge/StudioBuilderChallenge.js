import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  WIDGET_COPY,
  DAY_MODAL_COPY,
  COMPLETE_MODAL_COPY,
  BRAND,
  TASK_ICON_KEYS
} from '../../utils/challengeTasks'
import ChallengeInviteModal from './ChallengeInviteModal'
import './StudioBuilderChallenge.css'

const CARD_ICONS = {
  folder: (
    <path
      d='M2 5a1.3 1.3 0 011.3-1.3h4L9 5.3h6.7A1.3 1.3 0 0117 6.6v8a1.3 1.3 0 01-1.3 1.3H3.3A1.3 1.3 0 012 14.6z'
      stroke={BRAND.blue}
      strokeWidth='1.4'
      fill='none'
    />
  ),
  chat: (
    <>
      <rect x='2' y='3.3' width='16' height='10.6' rx='2.5' stroke={BRAND.blue} strokeWidth='1.4' fill='none' />
      <path d='M6.6 13.9v2.6l3.3-2.6' stroke={BRAND.blue} strokeWidth='1.4' fill='none' strokeLinejoin='round' />
    </>
  ),
  wave: (
    <>
      <circle cx='10' cy='6.6' r='3.3' stroke={BRAND.pink} strokeWidth='1.4' fill='none' />
      <path d='M4 16.6c0-3.3 2.6-5.3 6-5.3s6 2 6 5.3' stroke={BRAND.pink} strokeWidth='1.4' fill='none' />
    </>
  ),
  video: (
    <>
      <rect x='2' y='4.6' width='10.6' height='10.6' rx='2' stroke={BRAND.pink} strokeWidth='1.4' fill='none' />
      <path d='M12.6 8.6l5.3-2.6v8l-5.3-2.6z' stroke={BRAND.pink} strokeWidth='1.4' fill='none' strokeLinejoin='round' />
    </>
  ),
  invite: (
    <>
      <circle cx='8' cy='6.6' r='3.3' stroke={BRAND.blue} strokeWidth='1.4' fill='none' />
      <path d='M2.6 16.6c0-2.6 2.4-4.6 5.3-4.6' stroke={BRAND.blue} strokeWidth='1.4' fill='none' />
      <path d='M14.6 9.3v5.3M12 12h5.3' stroke={BRAND.pink} strokeWidth='1.4' strokeLinecap='round' />
    </>
  ),
  default: <circle cx='10' cy='10' r='7' stroke={BRAND.blue} strokeWidth='1.4' fill='none' />
}

function ProgressRing({ completed, total }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const progress = total > 0 ? (completed / total) * circ : 0

  return (
    <div className='studio-challenge__ring studio-challenge__ring--compact'>
      <svg width='56' height='56' viewBox='0 0 56 56' className='studio-challenge__ring-svg'>
        <circle cx='28' cy='28' r={r} fill='none' stroke='#e8f4fb' strokeWidth='4.5' />
        <defs>
          <linearGradient id='ringGrad' x1='0%' y1='100%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor={BRAND.blue} />
            <stop offset='100%' stopColor={BRAND.pink} />
          </linearGradient>
        </defs>
        <circle
          cx='28'
          cy='28'
          r={r}
          fill='none'
          stroke='url(#ringGrad)'
          strokeWidth='4.5'
          strokeLinecap='round'
          strokeDasharray={`${progress} ${circ}`}
        />
      </svg>
      <div className='studio-challenge__ring-label studio-challenge__ring-label--compact'>
        <span className='studio-challenge__ring-count studio-challenge__ring-count--compact'>{completed}</span>
        <span className='studio-challenge__ring-total'>of {total}</span>
      </div>
    </div>
  )
}

function TaskCard({ task, onInviteClick }) {
  const iconKey = TASK_ICON_KEYS[task.key] || 'default'
  const opensInviteModal = task.opensModal || task.key === 'invite_sent'

  const handleInviteClick = (event) => {
    event.preventDefault()
    onInviteClick?.()
  }

  const renderFrontFace = () => (
    <>
      <div className='studio-challenge__card-top'>
        <div className='studio-challenge__card-icon-wrap'>
          <svg width='15' height='15' viewBox='0 0 20 20' aria-hidden='true'>
            {CARD_ICONS[iconKey] || CARD_ICONS.default}
          </svg>
        </div>
        <span className='studio-challenge__card-reward-label'>Day {task.day}</span>
      </div>
      <div>
        <div className='studio-challenge__card-title'>{task.title}</div>
        <div className='studio-challenge__card-desc'>{task.description}</div>
        {!task.completed && (
          <div className='studio-challenge__card-cta'>{task.cta} →</div>
        )}
      </div>
    </>
  )

  return (
    <div className='studio-challenge__card'>
      <div
        className={`studio-challenge__card-inner${
          task.completed ? ' studio-challenge__card-inner--flipped' : ''
        }`}
      >
        {task.completed ? (
          <div className='studio-challenge__card-face studio-challenge__card-face--front'>
            {renderFrontFace()}
          </div>
        ) : opensInviteModal ? (
          <button
            type='button'
            className='studio-challenge__card-face studio-challenge__card-face--front studio-challenge__card-button'
            onClick={handleInviteClick}
          >
            {renderFrontFace()}
          </button>
        ) : (
          <Link
            to={task.href}
            className='studio-challenge__card-face studio-challenge__card-face--front'
          >
            {renderFrontFace()}
          </Link>
        )}

        <div className='studio-challenge__card-face studio-challenge__card-face--back'>
          <svg width='34' height='34' viewBox='0 0 40 40' fill='none' aria-hidden='true'>
            <circle cx='20' cy='16' r='10' fill='rgba(255,255,255,0.25)' stroke='#fff' strokeWidth='2' />
            <path d='M14 24l-2 10 8-4 8 4-2-10' stroke='#fff' strokeWidth='2' strokeLinejoin='round' fill='none' />
            <path d='M16 16l3 3 5-5' stroke='#fff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' fill='none' />
          </svg>
          <div className='studio-challenge__card-earned-label'>Earned</div>
          <div className='studio-challenge__card-reward'>Day {task.day}</div>
        </div>
      </div>
    </div>
  )
}

function ChallengeSkeleton() {
  return (
    <div className='studio-challenge studio-challenge--skeleton' aria-hidden='true'>
      <div className='studio-challenge__header'>
        <div className='studio-challenge__skeleton-line studio-challenge__skeleton-line--title' />
        <div className='studio-challenge__skeleton-line studio-challenge__skeleton-line--link' />
      </div>
      <div className='studio-challenge__band'>
        <div className='studio-challenge__skeleton-ring studio-challenge__skeleton-ring--compact' />
        <div className='studio-challenge__skeleton-copy'>
          <div className='studio-challenge__skeleton-line studio-challenge__skeleton-line--headline' />
          <div className='studio-challenge__skeleton-line studio-challenge__skeleton-line--subline' />
          <div className='studio-challenge__skeleton-pill' />
        </div>
      </div>
      <div className='studio-challenge__cards studio-challenge__cards--skeleton'>
        {[1, 2, 3, 4, 5].map((card) => (
          <div key={card} className='studio-challenge__skeleton-card' />
        ))}
      </div>
    </div>
  )
}

function StudioBuilderChallenge() {
  const { progress, loading, loaded, shouldShow } = useSelector(
    (state) => state.studioChallenge
  )
  const { isTrialActive } = useSelector((state) => state.trialTimer)
  const [modal, setModal] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const prevDaysEarnedRef = useRef(null)
  const prevChallengeCompleteRef = useRef(false)

  const showSkeleton = !loaded && (loading || isTrialActive)

  useEffect(() => {
    if (!loaded || !progress) return

    const { daysEarned, challengeComplete, trialEnd } = progress
    const prevDays = prevDaysEarnedRef.current
    const prevComplete = prevChallengeCompleteRef.current

    if (prevDays !== null && daysEarned > prevDays) {
      const newTrialEnd = trialEnd || new Date().toISOString()

      if (challengeComplete && !prevComplete) {
        setModal({ type: 'complete', newTrialEnd })
      } else {
        setModal({
          type: 'day',
          day: daysEarned,
          newTrialEnd,
          remaining: Math.max(0, (progress.tasks?.length || 5) - daysEarned)
        })
      }
    }

    prevDaysEarnedRef.current = daysEarned
    prevChallengeCompleteRef.current = challengeComplete
  }, [loaded, progress])

  if (showSkeleton) {
    return <ChallengeSkeleton />
  }

  if (!loaded || !shouldShow || !progress) {
    return null
  }

  const { tasks, daysEarned, challengeComplete, windowExpired } = progress
  const safeTasks = Array.isArray(tasks) ? tasks : []
  const totalTasks = safeTasks.length || 5

  const wc = challengeComplete
    ? WIDGET_COPY.complete
    : windowExpired
      ? WIDGET_COPY.expired
      : WIDGET_COPY.inProgress

  const headline = windowExpired
    ? WIDGET_COPY.expired.headlineTemplate(daysEarned)
    : wc.headline

  return (
    <>
      <div className='studio-challenge studio-challenge--loaded studio-challenge--engine'>
        <div className='studio-challenge__header'>
          <div className='studio-challenge__brand'>
            <div className='studio-challenge__brand-icon'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
                <path
                  d='M8 1L10 5.5H15L11 8.5L12.5 13L8 10.2L3.5 13L5 8.5L1 5.5H6L8 1Z'
                  fill='white'
                />
              </svg>
            </div>
            <span className='studio-challenge__eyebrow'>{wc.eyebrow}</span>
          </div>
          {/* {wc.link && (
            <Link to='/my-portfolio' className='studio-challenge__details-link'>
              {wc.link} →
            </Link>
          )} */}
        </div>

        <div className='studio-challenge__band'>
          <ProgressRing completed={daysEarned} total={totalTasks} />
          <div>
            <div className='studio-challenge__headline'>{headline}</div>
            <div className='studio-challenge__subline'>{wc.subline}</div>
            <div className='studio-challenge__pill'>{WIDGET_COPY.pillText(daysEarned)}</div>
          </div>
        </div>

        <div className='studio-challenge__cards-row'>
          <div className='studio-challenge__cards-title'>Your Challenge Tasks</div>
          <div
            className='studio-challenge__cards'
            style={{ gridTemplateColumns: `repeat(${totalTasks}, minmax(0, 1fr))` }}
          >
            {safeTasks.map((task) => (
              <TaskCard
                key={task.key}
                task={task}
                onInviteClick={() => setShowInviteModal(true)}
              />
            ))}
          </div>
        </div>

        {wc.footer && <div className='studio-challenge__footer'>{wc.footer}</div>}
      </div>

      {modal?.type === 'day' && (
        <div className='studio-challenge__overlay'>
          <div className='studio-challenge__modal'>
            <div className='studio-challenge__modal-accent' />
            <div className='studio-challenge__modal-icon studio-challenge__modal-icon--star'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                <path d='M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z' fill='white' />
              </svg>
            </div>
            <div className='studio-challenge__modal-title'>
              {DAY_MODAL_COPY.headline(modal.day)}
            </div>
            <div className='studio-challenge__modal-subtitle'>
              {DAY_MODAL_COPY.subheading(
                new Date(modal.newTrialEnd).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </div>
            {DAY_MODAL_COPY.body(modal.remaining) && (
              <div className='studio-challenge__modal-body'>
                {DAY_MODAL_COPY.body(modal.remaining)}
              </div>
            )}
            <button
              type='button'
              className='studio-challenge__modal-btn'
              onClick={() => setModal(null)}
            >
              {DAY_MODAL_COPY.cta}
            </button>
          </div>
        </div>
      )}

      {modal?.type === 'complete' && (
        <div className='studio-challenge__overlay'>
          <div className='studio-challenge__modal'>
            <div className='studio-challenge__modal-accent' />
            <div className='studio-challenge__modal-icon'>
              <svg width='26' height='26' viewBox='0 0 26 26' fill='none' aria-hidden='true'>
                <path
                  d='M4 13l7 7L22 6'
                  stroke='white'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='studio-challenge__modal-title'>{COMPLETE_MODAL_COPY.headline}</div>
            <div className='studio-challenge__modal-subtitle'>
              {COMPLETE_MODAL_COPY.subheading(
                new Date(modal.newTrialEnd).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </div>
            <div className='studio-challenge__modal-body'>{COMPLETE_MODAL_COPY.body}</div>
            <button
              type='button'
              className='studio-challenge__modal-btn'
              onClick={() => setModal(null)}
            >
              {COMPLETE_MODAL_COPY.cta}
            </button>
          </div>
        </div>
      )}

      <ChallengeInviteModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
      />
    </>
  )
}

export default StudioBuilderChallenge
