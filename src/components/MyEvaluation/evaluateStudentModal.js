import axiosInstance from '../../utils/AxiosInstance'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaPencilAlt, FaCheck, FaArrowLeft } from 'react-icons/fa'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import {
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

import ContentUploads from '../../pages/LtsJournal/ContentUploads/ContentUploads'
import CertificationSkills from '../../pages/LtsJournal/CertificationSkills/CertificationSkills'

import PublicPortfolio from '../../pages/Portfolio2024/publicPortfolio'

const Dropdown = ({ myStudents, setStudentSelected, studentSelected }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item) => {
    setStudentSelected(item)
    setIsOpen(false)
  }

  return (
    <div className='dropdown'>
      <button className='dropdown-button' onClick={toggleDropdown}>
        <div>{studentSelected.name}</div>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>

      {isOpen && (
        <div className='evaluate-dropdown-menu'>
          {myStudents &&
            myStudents.length > 0 &&
            myStudents.map((student) => (
              <div
                key={student.id}
                className='dropdown-item-student'
                onClick={() => handleItemClick(student)}
              >
                {student.name}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

const EvaluateStudentModal = (props) => {
  const { user } = useSelector((state) => state.user)
  const [journalEntries, setJournalEntries] = useState([])
  const [userJournalEntries, setUserJournalEntries] = useState([])
  const [studentSelected, setStudentSelected] = useState({
    id: props.userId,
    name: props.userName
  })
  const [studentIndex, setStudentIndex] = useState(0)
  const [instructorEditing, setInstructorEditing] = useState(false)
  const [valueProposition, setValueProposition] = useState('')
  const [instructorFeedback, setInstructorFeedback] = useState({})
  const [feedbackContent, setFeedbackContent] = useState('')

  console.log(props, 'propsEvaluate')

  const getJournalEntries = async (studentId) => {
    try {
      const { data } = await axiosInstance.get(
        `/ltsJournals/${props.selectedJournalId}/student/${studentId}`
      )

      console.log(data, 'dataaaaa')
      setJournalEntries(data)
    } catch (e) {
      console.error(e)
    }
  }

  const getUserEntries = async (studentId) => {
    try {
      const { data } = await axiosInstance.get(
        `/ltsJournals/instructor/${props.selectedJournalId}/userEntries/${studentId}`
      )
      setUserJournalEntries(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (studentSelected && studentSelected.id) {
      getJournalEntries(studentSelected.id)
      getUserEntries(studentSelected.id)
    }
  }, [studentSelected])

  const stripHtmlTags = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  const handlePrevious = () => {
    if (studentIndex > 0) {
      const newIndex = studentIndex - 1
      setStudentIndex(newIndex)
      setStudentSelected(props.myStudents[newIndex])
    }
  }

  const handleNext = () => {
    if (studentIndex < props.myStudents.length - 1) {
      const newIndex = studentIndex + 1
      setStudentIndex(newIndex)
      setStudentSelected(props.myStudents[newIndex])
    }
  }

  const toggleEditing = () => {
    if (instructorEditing && valueProposition) {
      handleSave({
        content: valueProposition,
        id: instructorFeedback.userInstructorFeedback?.id
      })
    }
    setInstructorEditing(!instructorEditing)
  }

  const handleSave = (updatedData) => {
    const isEdit = !!updatedData.id
    const { selectedJournalId: journalId } = props

    let newData = {
      ...updatedData,
      userId: studentSelected.id,
      journalId,
      submitted: new Date(),
      instructorFeedbackId: journalEntries.instructorFeedback.id,
      instructorId: user.user.id
    }

    delete newData.id

    if (!isEdit) {
      axiosInstance
        .post('/ltsJournals/instructor-feedback', newData)
        .then((res) => {
          setInstructorFeedback({
            ...instructorFeedback,
            userInstructorFeedback: res.data
          })
          setFeedbackContent(res.data.content) // Update feedback content state
          toast.success('Instructor feedback updated successfully!')
        })
        .catch((e) => {
          toast.error('Error occurred during updating instructor feedback!')
        })
    } else {
      axiosInstance
        .put(`/ltsJournals/instructor-feedback/${updatedData.id}`, newData)
        .then((res) => {
          setInstructorFeedback({
            ...instructorFeedback,
            userInstructorFeedback: res.data
          })
          setFeedbackContent(res.data.content) // Update feedback content state
          toast.success('Instructor feedback updated successfully!')
        })
        .catch((e) => {
          toast.error('Error occurred during updating instructor feedback!')
        })
    }
  }

  useEffect(() => {
    if (journalEntries.instructorFeedback?.userInstructorFeedback?.content) {
      setValueProposition(
        journalEntries.instructorFeedback.userInstructorFeedback.content
      )
      setInstructorFeedback(journalEntries.instructorFeedback)
      setFeedbackContent(
        journalEntries.instructorFeedback.userInstructorFeedback.content
      )
    } else {
      setValueProposition('')
      setInstructorFeedback({})
      setFeedbackContent('')
    }
  }, [journalEntries])

  const portfolioContanier = {
    padding: 0,
    borderRadius: 0
  }

  const evaluateContainer = {
    padding: '20px 40px',
    borderRadius: '15px'
  }

  const lizaGirlie = {
    height: '60%',
    marginBottom: '40px',
    width: '100%'
  }

  const portfolioLizaGirlie = {
    height: '60%',
    marginBottom: 0
  }

  return (
    <div className='evaluate-modal-background' style={{ height: '100%' }}>
      <div
        style={{
          ...(props.journalSelected == 'PORTFOLIO'
            ? portfolioContanier
            : evaluateContainer)
        }}
        className='evaluate-container scroll-container'
      >
        <div
          style={{
            ...(props.journalSelected == 'PORTFOLIO'
              ? portfolioLizaGirlie
              : lizaGirlie)
          }}
          className='liza-girlie'
        >
          <div
            onClick={() => props.setSelectedUser('')}
            className='evaluate-close-button'
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>

          {props.journalSelected == 'PORTFOLIO' && (
            <div
              onClick={() => props.setSelectedUser('')}
              style={{ zIndex: 9999, cursor: 'pointer' }}
              className='action-box portfolio-actions'
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          )}

          {props.journalSelected == 'PORTFOLIO' && (
            <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
              {' '}
              <PublicPortfolio userName={props.userUserName} />
            </div>
          )}
          <div className='title-filter-container'>
            <h5>{journalEntries.title}</h5>
            <div>
              {/* {journalEntries.entries && journalEntries.entries.length > 0 && (
                <Dropdown
                  studentSelected={studentSelected}
                  setStudentSelected={setStudentSelected}
                  myStudents={props.myStudents}
                />
              )} */}
              {/* {journalEntries.entries && journalEntries.entries.length > 0 && ( */}
              {props.journalSelected != 'PORTFOLIO' && (
                <Dropdown
                  studentSelected={studentSelected}
                  setStudentSelected={setStudentSelected}
                  myStudents={props.myStudents}
                />
              )}

              {/* )} */}
            </div>
          </div>

          <div className='journal-entries-container'>
            {journalEntries.entries &&
              journalEntries.entries.length > 0 &&
              journalEntries.entries.map((entry, index) => (
                <div key={index} style={{ margin: '30px 0' }}>
                  <div className='journal-entries-title'>{entry.title}</div>
                  <div className='user-entries'>
                    {userJournalEntries[index]?.content
                      ? stripHtmlTags(userJournalEntries[index].content)
                      : 'No Data'}
                  </div>
                </div>
              ))}
          </div>

          {journalEntries?.contentUploads ? (
            <ContentUploads
              journal={journalEntries}
              isEditable={false}
              evaluationModal={true}
            />
          ) : null}

          {journalEntries?.certificationSkills ? (
            <CertificationSkills
              journal={journalEntries}
              isEditable={false}
              evaluationModal={true}
            />
          ) : null}

          {/* {journalEntries.entries && journalEntries.entries.length > 0 && (
            <div className='portfolio-data-container'> 
              <div className='portfolio-data-container-title py-2'>
                INSTRUCTOR FEEDBACK
              </div>
              <div className='feedback-action'>
                <div className='feedback-action-box' onClick={toggleEditing}>
                  {instructorEditing ? (
                    <FaCheck className={'action-icon public-icon'} />
                  ) : (
                    <FaPencilAlt className={'action-icon pencil-icon'} />
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'grey' }}>
                {!instructorEditing ? (
                  feedbackContent ? (
                    stripHtmlTags(feedbackContent)
                  ) : (
                    <div style={{ fontSize: '12px', color: 'grey' }}>
                      No Feedback given yet. Click the pencil icon to add new
                      feedback.
                    </div>
                  )
                ) : (
                  <ReactQuill
                    className={'portfolio-quill'}
                    value={valueProposition || ''}
                    onChange={(value) => setValueProposition(value)}
                  />
                )}
              </div>
            </div>
          )} */}

          {props.journalSelected != 'PORTFOLIO' && (
            <div className='portfolio-data-container'>
              <div className='portfolio-data-container-title py-2'>
                INSTRUCTOR FEEDBACK
              </div>
              <div className='feedback-action'>
                <div className='feedback-action-box' onClick={toggleEditing}>
                  {instructorEditing ? (
                    <FaCheck className={'action-icon public-icon'} />
                  ) : (
                    <FaPencilAlt className={'action-icon pencil-icon'} />
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'grey' }}>
                {!instructorEditing ? (
                  feedbackContent ? (
                    stripHtmlTags(feedbackContent)
                  ) : (
                    <div style={{ fontSize: '12px', color: 'grey' }}>
                      No Feedback given yet. Click the pencil icon to add new
                      feedback.
                    </div>
                  )
                ) : (
                  <ReactQuill
                    className={'portfolio-quill'}
                    value={valueProposition || ''}
                    onChange={(value) => setValueProposition(value)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {/* <div
          className='evaluation-footer-wrapper'
          style={{ position: 'relative', bottom: '-50px' }}
        > */}

        {props.journalSelected != 'PORTFOLIO' && (
          <div className='modal-footer-evaluation'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '13px',
                cursor: studentIndex > 0 ? 'pointer' : 'default',
                color: studentIndex > 0 ? 'black' : 'grey'
              }}
              onClick={handlePrevious}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <div style={{ margin: '0 5px', color: 'black' }}>Previous</div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '13px',
                cursor:
                  studentIndex < props.myStudents.length - 1
                    ? 'pointer'
                    : 'default',
                color:
                  studentIndex < props.myStudents.length - 1 ? 'black' : 'grey'
              }}
              onClick={handleNext}
            >
              <div style={{ margin: '0 5px', marginLeft: '90%' }}>Next</div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        )}

        {/* </div> */}
      </div>
    </div>
  )
}

export default EvaluateStudentModal
