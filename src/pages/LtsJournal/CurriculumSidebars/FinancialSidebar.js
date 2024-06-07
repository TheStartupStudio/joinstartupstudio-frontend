import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { fetchLessons } from '../../../redux/taskLessons/actions'
import LoadingAnimation from '../../../ui/loadingAnimation'
import LtsCheckbox from '../../../ui/LtsCheckbox'
import AddLessonModal from './addLessonModal'
import { HiDocumentPlus } from 'react-icons/hi2'
import getLessonByType from './getLessonsByType'

const FinancialSidebar = ({
  dataByClass,
  searchKeyword,
  url,
  category,
  type
}) => {
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
        {Object.entries(dataByClass).map(([journalClass, items], index) => {
          const filteredItems = items.filter((item) =>
            item.title.toLowerCase().includes(searchKeyword.toLowerCase())
          )

          if (filteredItems.length === 0) {
            return null
          }

          return (
            <div key={journalClass}>
              {journalClass !== 'null' && (
                <div
                  className={`accordion-menu__item text-uppercase`}
                  style={{
                    font: 'normal normal 500 14px/14px Montserrat',
                    letterSpacing: 0.56,
                    color: '#231F20',
                    padding: '10px 0 15px 0'
                  }}
                >
                  {journalClass}
                </div>
              )}
              {filteredItems.map((item) => {
                const { hasLesson, lesson } = getLessonByType(
                  lessons,
                  item,
                  type
                )
                return (
                  <div
                    key={item.id}
                    className={`accordion-menu__item  accordion-menu__item-transition ${
                      addLesson && item.order !== 1 ? 'mb-4' : ''
                    }`}
                  >
                    <NavLink to={`${url}/${item.id}`}>
                      {!item.title.toLowerCase().includes('task') ? (
                        <span className="text-uppercase ml-1">
                          {item.title}
                        </span>
                      ) : (
                        <span
                          className={'ml-1'}
                          style={{
                            marginLeft: 14,
                            display: 'flex',
                            flexWrap: 'wrap'
                          }}
                        >
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                    {item.order !== 1 && (
                      <div
                        className={`accordion-menu__item cursor-pointer ms-3 d-flex align-items-center text-uppercase add-lesson-container add-lesson-container-transition ${
                          addLesson ? 'visible' : 'hidden'
                        }`}
                      >
                        <HiDocumentPlus />
                        <p
                          className="m-0"
                          onClick={() => handleOpenModal(lesson, item.id)}
                        >
                          {hasLesson ? lesson.title : 'Add Lesson'}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {setAddLessonModal && (
        <AddLessonModal
          show={addLessonModal}
          data={selectedLesson}
          journalId={journalId}
          user={user}
          type={type}
          category={category}
          onHide={handleCloseModal}
          mode={selectedLesson ? 'edit' : 'add'}
        />
      )}
    </>
  )
}

export default FinancialSidebar
