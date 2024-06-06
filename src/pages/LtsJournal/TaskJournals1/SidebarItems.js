import React from 'react'
import { NavLink } from 'react-router-dom'
import { HiDocumentPlus } from 'react-icons/hi2'

const SidebarItems = ({
  url,
  filteredJournals,
  addLessonData,
  addLesson,
  setAddLessonModal
}) => {
  return (
    <div>
      {filteredJournals.map((journalItem) => {
        const hasLesson = addLessonData.some(
          (lesson) => lesson.journalTaskId === journalItem.id
        )
        const lesson = addLessonData.find(
          (lesson) => lesson.journalTaskId === journalItem.id
        )
        return (
          <div
            key={journalItem.id}
            className={`accordion-menu__item text-uppercase accordion-menu__item-transition ${
              addLesson && journalItem.order !== 1 ? 'mb-4' : ''
            }`}
          >
            <NavLink to={`${url}/${journalItem.id}`}>
              <span
                style={{
                  font: 'normal normal 500 14px/16px Montserrat',
                  letterSpacing: 0.56
                }}
              >
                {journalItem.title}
              </span>
            </NavLink>
            {journalItem.order !== 1 && (
              <div
                key={journalItem.id}
                className={`accordion-menu__item cursor-pointer d-flex align-items-center text-uppercase add-lesson-container add-lesson-container-transition ${
                  addLesson ? 'visible' : 'hidden'
                }`}
              >
                <HiDocumentPlus />
                <p className="m-0" onClick={() => setAddLessonModal(true)}>
                  {hasLesson ? lesson.title : 'Add Lesson'}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SidebarItems
