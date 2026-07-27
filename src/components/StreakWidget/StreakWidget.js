import React from 'react'
import { useSelector } from 'react-redux'
import './StreakWidget.css'

function FlameIcon() {
  return (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='#ec1f6b' aria-hidden='true'>
      <path d='M12 2c1 3-2 4-2 7a3 3 0 1 0 6 0c0-1-.5-2-.5-2 2 1 3.5 3.5 3.5 6a7 7 0 1 1-14 0c0-5 4-7 4-9 0-1-.5-2-.5-2 1 0 3-1 3.5 0z' />
    </svg>
  )
}

function StreakSkeleton() {
  return (
    <div className='streak-widget streak-widget--skeleton' aria-hidden='true'>
      <div className='streak-widget__row'>
        <div className='streak-widget__skeleton-flame' />
        <div className='streak-widget__skeleton-count' />
        <div className='streak-widget__skeleton-week'>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className='streak-widget__skeleton-day'>
              <div className='streak-widget__skeleton-label' />
              <div className='streak-widget__skeleton-dot' />
            </div>
          ))}
        </div>
        <div className='streak-widget__skeleton-best' />
      </div>
    </div>
  )
}

function weekdayLetterForDateKey(dateKey) {
  // `dateKey` comes from the API in `YYYY-MM-DD` format.
  // Use midnight UTC to avoid shifting the day due to local timezone.
  const d = new Date(`${dateKey}T00:00:00Z`)
  const day = d.getUTCDay() // 0=Sun, 6=Sat
  const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  return letters[day] || ''
}

function StreakWidget() {
  const { summary, loading, loaded, shouldShow } = useSelector((state) => state.streak)
  const { isTrialActive } = useSelector((state) => state.trialTimer)
  const challengeVisible = useSelector((state) => state.studioChallenge.shouldShow)

  if (isTrialActive || challengeVisible) {
    return null
  }

  if (!loaded && loading) {
    return <StreakSkeleton />
  }

  if (!loaded || !shouldShow || !summary?.active) {
    return null
  }

  const { currentStreak, bestStreak, weekDays = [] } = summary
  const streakLabel = currentStreak === 1 ? 'day streak' : 'day streak'

  return (
    <div className='streak-widget'>
      <div className='streak-widget__row'>
        <div className='streak-widget__flame' aria-hidden='true'>
          <FlameIcon />
        </div>

        <div className='streak-widget__count-wrap'>
          <div className='streak-widget__count'>{currentStreak}</div>
          <div className='streak-widget__label'>{streakLabel}</div>
        </div>

        <div className='streak-widget__week' aria-label='Activity this week'>
          {weekDays.map((day) => {
            const classes = [
              'streak-widget__day',
              day.active ? 'streak-widget__day--active' : '',
              day.isToday ? 'streak-widget__day--today' : ''
            ]
              .filter(Boolean)
              .join(' ')

            let content = ''
            if (day.isToday && day.active && currentStreak > 0) {
              content = String(currentStreak)
            } else if (day.active) {
              content = '✓'
            }
            const letter = weekdayLetterForDateKey(day.date)

            return (
              <div key={day.date} className={classes}>
                <div className='streak-widget__day-label'>{letter}</div>
                <div className='streak-widget__day-circle'>{content}</div>
              </div>
            )
          })}
        </div>

        <div className='streak-widget__best'>
          Best: <strong>{bestStreak} {bestStreak === 1 ? 'day' : 'days'}</strong>
        </div>
      </div>
    </div>
  )
}

export default StreakWidget
