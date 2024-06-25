import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiDocumentPlus } from 'react-icons/hi2'
import AddLessonModal from './addLessonModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLessons } from '../../../../redux/taskLessons/actions'
import LoadingAnimation from '../../../../ui/loadingAnimation'
import LtsCheckbox from '../../../../ui/LtsCheckbox'
import getLessonByType from './getLessonsByType'

const SidebarItems = ({ url, filteredJournals, type, category }) => {
  const dispatch = useDispatch()
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [addLessonModal, setAddLessonModal] = useState(false)
  const [addLesson, setAddLesson] = useState(false)
  const [journalId, setJournalId] = useState(null)
  const { user } = useSelector((state) => state.user.user)
  const { lessons, loading } = useSelector((state) => state.lessons)

  useEffect(() => {
    dispatch(fetchLessons(type, category))
  }, [dispatch, type, category])

  const handleOpenModal = (lesson, journalId) => {
    setSelectedLesson(lesson ? lesson : null)
    setJournalId(journalId)
    setAddLessonModal(true)
  }
  const handleCloseModal = () => {
    setSelectedLesson(null)
    setJournalId(null)
    setAddLessonModal(false)
  }

  if (loading) {
    return <LoadingAnimation show={true} />
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-end">
        <p className="m-0">View add lesson</p>
        <LtsCheckbox
          toggle={() => setAddLesson((state) => !state)}
          checked={addLesson}
        />
      </div>
      <div>
        {filteredJournals.map((journalItem) => {
          const { hasLesson, lesson } = getLessonByType(
            lessons,
            journalItem,
            type
          )
          return (
            <>
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
                    className={`accordion-menu__item cursor-pointer d-flex align-items-center text-uppercase add-lesson-container add-lesson-container-transition ${
                      addLesson ? 'visible' : 'hidden'
                    }`}
                  >
                    <HiDocumentPlus />
                    <p
                      className="m-0"
                      onClick={() => handleOpenModal(lesson, journalItem.id)}
                    >
                      {hasLesson ? lesson.title : 'Add Lesson'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )
        })}
      </div>
      {setAddLessonModal && (
        <AddLessonModal
          show={addLessonModal}
          data={selectedLesson}
          journalId={journalId}
          type={type}
          category={category}
          user={user}
          onHide={handleCloseModal}
          mode={selectedLesson ? 'edit' : 'add'}
        />
      )}
    </>
  )
}

export default SidebarItems
