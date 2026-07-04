import React from 'react'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import lockSign from '../../assets/images/academy-icons/lock.png'
import {
  buildNavItems,
  findLessonIndex,
  getGroupTitle,
  getLessonsForLevel
} from './lessonNavUtils'

function LessonNavPanel({
  lessonsByLevel,
  activeLevel,
  levels,
  journalId,
  getOptionStatus,
  onLessonSelect,
  setShowLockModal,
  setLockModalMessage,
  lessonsLoading
}) {
  const lessons = getLessonsForLevel(lessonsByLevel, activeLevel)
  const navItems = buildNavItems(lessons)
  const groupTitle = getGroupTitle(levels, activeLevel, lessons)
  const currentId = journalId ? parseInt(journalId) : null

  const getStatus = (lessonId) => {
    const status = getOptionStatus(lessonId, lessons)
    return status
  }

  const handleClick = (lesson) => {
    const { disabled } = getStatus(lesson.id)
    if (disabled) {
      setLockModalMessage(
        'This lesson is currently locked. You must complete the lesson before it to gain access to this lesson.'
      )
      setShowLockModal(true)
      return
    }
    onLessonSelect(lesson)
  }

  const renderStatusIcon = (lessonId) => {
    const { status } = getStatus(lessonId)
    if (status === 'done') {
      return (
        <img
          className='lts-nav-status-icon'
          src={tickSign}
          alt='completed'
        />
      )
    }
    if (status === 'inProgress') {
      return (
        <img
          className='lts-nav-status-icon'
          src={circleSign}
          alt='in progress'
        />
      )
    }
    return (
      <img className='lts-nav-status-icon' src={lockSign} alt='locked' />
    )
  }

  const currentLessonIndex = currentId != null ? findLessonIndex(lessons, currentId) : -1

  const isCurrent = (lesson) => {
    const lessonIndex = findLessonIndex(lessons, lesson.id)
    return lessonIndex !== -1 && lessonIndex === currentLessonIndex
  }

  const rowClass = (lesson, base) => {
    const { status } = getStatus(lesson.id)
    const classes = [base]
    if (isCurrent(lesson)) classes.push('current')
    if (status === 'done') classes.push('done')
    if (status === 'notStarted') classes.push('locked')
    return classes.join(' ')
  }

  if (lessonsLoading) {
    return (
      <div className='lts-nav-col'>
        <div className='lts-nav-group-title'>Loading…</div>
      </div>
    )
  }

  if (!lessons.length) return null

  if (!navItems.length) {
    return (
      <div className='lts-nav-col'>
        <div className='lts-nav-group-title'>{groupTitle}</div>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={rowClass(lesson, 'lts-nav-task-row')}
            onClick={() => handleClick(lesson)}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick(lesson)}
          >
            {renderStatusIcon(lesson.id)}
            <span>{lesson.title}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='lts-nav-col'>
      <div className='lts-nav-group-title'>{groupTitle}</div>

      {navItems.map((item, idx) => {
        if (item.type === 'divider') {
          return <div key={`divider-${idx}`} className='lts-nav-divider' />
        }

        if (item.type === 'buildingGroup') {
          const { buildsToward, lessons: groupLessons } = item
          return (
            <div key={`building-${idx}`} className='lts-nav-building-group'>
              {/* {buildsToward && (
                <div className='lts-nav-building-label'>
                  <span className='lts-nav-building-arrow'>↳</span>
                  Building toward: {buildsToward.title}
                </div>
              )} */}
              <div className='lts-nav-reflections'>
                {groupLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={rowClass(lesson, 'lts-nav-reflection-row')}
                    onClick={() => handleClick(lesson)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleClick(lesson)}
                  >
                    {renderStatusIcon(lesson.id)}
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (item.type === 'task') {
          const { lesson } = item
          return (
            <div
              key={`task-${lesson.id}`}
              className={rowClass(lesson, 'lts-nav-task-row')}
              onClick={() => handleClick(lesson)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(lesson)}
            >
              {renderStatusIcon(lesson.id)}
              <span>{lesson.title}</span>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default LessonNavPanel
