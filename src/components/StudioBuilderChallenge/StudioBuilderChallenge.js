import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import {
  WIDGET_COPY,
  DAY_MODAL_COPY,
  COMPLETE_MODAL_COPY,
  BRAND
} from '../../utils/challengeTasks'
import './StudioBuilderChallenge.css'

const B = {
  blue: BRAND.blue,
  pink: BRAND.pink,
  gradient: BRAND.gradient,
  gradientBg:
    'linear-gradient(45deg, rgba(81,199,223,0.08), rgba(255,51,153,0.08))',
  border: 'rgba(81,199,223,0.2)',
  text: '#1a1a2e',
  muted: '#6b8090',
  faint: '#a0b8c4',
  cardBorder: '#e2f0f9',
  track: '#e8f4fb',
  white: '#fff'
}

function CheckIcon({ day }) {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' aria-hidden='true'>
      <defs>
        <linearGradient id={`cg${day}`} x1='0%' y1='100%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor={B.blue} />
          <stop offset='100%' stopColor={B.pink} />
        </linearGradient>
      </defs>
      <circle cx='9' cy='9' r='9' fill={`url(#cg${day})`} />
      <path
        d='M5 9l3 3 5-5'
        stroke='#fff'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
      <rect x='2' y='7' width='12' height='8' rx='2' stroke='#c8dce8' strokeWidth='1.5' />
      <path
        d='M5 7V5.5a4 4 0 018 0V7'
        stroke='#c8dce8'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}

function ProgressRing({ completed, total }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const progress = (completed / total) * circ

  return (
    <div className='studio-challenge__ring'>
      <svg width='80' height='80' viewBox='0 0 80 80' className='studio-challenge__ring-svg'>
        <circle cx='40' cy='40' r={r} fill='none' stroke={B.track} strokeWidth='6' />
        <defs>
          <linearGradient id='ringGrad' x1='0%' y1='100%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor={B.blue} />
            <stop offset='100%' stopColor={B.pink} />
          </linearGradient>
        </defs>
        <circle
          cx='40'
          cy='40'
          r={r}
          fill='none'
          stroke='url(#ringGrad)'
          strokeWidth='6'
          strokeLinecap='round'
          strokeDasharray={`${progress} ${circ}`}
        />
      </svg>
      <div className='studio-challenge__ring-label'>
        <span className='studio-challenge__ring-count'>{completed}</span>
        <span className='studio-challenge__ring-total'>of {total}</span>
      </div>
    </div>
  )
}

function TaskRow({ task }) {
  return (
    <div
      className={`studio-challenge__task${task.completed ? ' studio-challenge__task--done' : ''}`}
    >
      <div className='studio-challenge__task-icon'>
        {task.completed ? <CheckIcon day={task.day} /> : <LockIcon />}
      </div>
      <div className='studio-challenge__task-body'>
        <div className='studio-challenge__task-title'>{task.title}</div>
        <div className='studio-challenge__task-desc'>{task.description}</div>
      </div>
      <div className='studio-challenge__task-day'>+Day {task.day}</div>
      {!task.completed && (
        <Link to={task.href} className='studio-challenge__task-cta'>
          {task.cta}
        </Link>
      )}
    </div>
  )
}


function StudioBuilderChallenge() {
  const [progress, setProgress] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = () => {
      axiosInstance
        .get('/challenge/progress')
        .then((response) => {
          setProgress(response.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    loadProgress()

    const handleFocus = () => loadProgress()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  if (loading || !progress?.challengeAvailable || !progress?.isTrialing) {
    return null
  }

  const { tasks, daysEarned, challengeComplete, windowExpired } = progress

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
      <div className='studio-challenge'>
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
          {wc.link && (
            <Link to='/my-portfolio' className='studio-challenge__details-link'>
              {wc.link} →
            </Link>
          )}
        </div>

        <div className='studio-challenge__band'>
          <ProgressRing completed={daysEarned} total={5} />
          <div>
            <div className='studio-challenge__headline'>{headline}</div>
            <div className='studio-challenge__subline'>{wc.subline}</div>
            <div className='studio-challenge__pill'>{WIDGET_COPY.pillText(daysEarned)}</div>
          </div>
        </div>

        <div>
          {tasks.map((task) => (
            <TaskRow key={task.key} task={task} />
          ))}
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
    </>
  )
}

export default StudioBuilderChallenge
