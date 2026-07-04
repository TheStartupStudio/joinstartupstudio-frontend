import React from 'react'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import lockSign from '../../assets/images/academy-icons/lock.png'
import {
  buildNavItems,
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

  const isCurrent = (lesson) =>
    currentId === lesson.id || currentId === lesson.redirectId

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

        if (item.type === 'parent') {
          const { lesson } = item
          return (
            <React.Fragment key={`parent-${lesson.id}`}>
              <div
                className={rowClass(lesson, 'lts-nav-task-row')}
                onClick={() => handleClick(lesson)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick(lesson)}
              >
                {renderStatusIcon(lesson.id)}
                <span>{lesson.title}</span>
              </div>
            </React.Fragment>
          )
        }

        if (item.type === 'reflectionGroup') {
          return (
            <div key={`reflections-${idx}`} className='lts-nav-reflections'>
              {item.reflections.map(({ lesson }) => (
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
