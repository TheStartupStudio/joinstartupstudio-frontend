import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiDocumentPlus } from 'react-icons/hi2'
import AddLessonModal from './addLessonModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLessons } from '../../../redux/taskLessons/actions'
import LoadingAnimation from '../../../ui/loadingAnimation'

const SidebarItems = ({ url, filteredJournals, addLesson }) => {
  const dispatch = useDispatch()
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [addLessonModal, setAddLessonModal] = useState(false)
  const [journalId, setJournalId] = useState(null)
  const { user } = useSelector((state) => state.user.user)
  const { lessons, loading } = useSelector((state) => state.lessons)

  useEffect(() => {
    dispatch(fetchLessons())
  }, [dispatch])

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
      <div>
        {filteredJournals.map((journalItem) => {
          const hasLesson = lessons.some(
            (lesson) => lesson.taskJournalId === journalItem.id
          )
          const lesson = lessons.find(
            (lesson) => lesson.taskJournalId === journalItem.id
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
          taskJournalId={journalId}
          user={user}
          onHide={handleCloseModal}
          mode={selectedLesson ? 'edit' : 'add'}
        />
      )}
    </>
  )
}

export default SidebarItems
