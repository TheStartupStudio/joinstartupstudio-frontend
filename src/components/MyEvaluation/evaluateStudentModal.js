import axiosInstance from '../../utils/AxiosInstance'
import React, { useState, useEffect, useRef } from 'react'
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
  faChevronUp,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import closeIcon from '../../assets/images/close-icon-eval.svg'

import ContentUploads from '../../pages/LtsJournal/ContentUploads/ContentUploads'
import CertificationSkills from '../../pages/LtsJournal/CertificationSkills/CertificationSkills'

import PublicPortfolio from '../../pages/Portfolio2024/publicPortfolio'

const ShotCard = ({ shot }) => {
  return (
    <div className='shot-card'>
      <div className='shot-image'>
        {shot.image ? (
          <img src={shot.image} alt='Shot' />
        ) : (
          <div className='placeholder-image'>No Image</div>
        )}
      </div>
      <div className='shot-info'>
        <div
          className='shot-type'
          dangerouslySetInnerHTML={{
            __html: `<strong>TYPE OF SHOT:</strong> ${shot.type}`
          }}
        />
        <div className='shot-action'>
          <span>
            <strong>ACTION:</strong> {shot.action}
          </span>
        </div>
        <div className='shot-narration'>
          <span>
            <strong>NARRATION:</strong> {shot.narration}
          </span>
        </div>
        <div className='shot-music'>
          <span>
            <strong>MUSIC:</strong> {shot.music}
          </span>
        </div>
      </div>
    </div>
  )
}

const ShotList = (props) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  return (
    <>
      <div className='shot-list'>
        {props.data.brandsJournal.map((shot, index) => (
          <ShotCard key={index} shot={shot} />
        ))}
      </div>
      <div className='video-card' style={{ paddingBottom: '10px' }}>
        <video
          ref={videoRef}
          poster={props.data?.video?.thumbnail}
          controls={isPlaying}
        >
          <source src={props.data?.video?.url} />
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <div className='play-button-overlay' onClick={handlePlayPause}></div>
        )}
      </div>
    </>
  )
}

const MeetingAgenda = ({ meeting }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div
        className={`meeting-date-bar ${isOpen ? 'open' : ''}`}
        onClick={toggleOpen}
      >
        <span>
          Meeting Date:{' '}
          {meeting.meetingDate
            ? new Date(meeting.date).toLocaleDateString('en-CA')
            : ''}
        </span>
        <FontAwesomeIcon icon={!isOpen ? faChevronDown : faChevronUp} />
      </div>

      {/* Expanded Meeting Details */}
      {isOpen && (
        <div className='meeting-details'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                marginBottom: '20px',
                background: '#d0cccc',
                textAlign: 'left',
                width: '49%',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '5px'
              }}
            >
              <span style={{ fontWeight: 'normal' }}>Purpose:</span>

              <span className='meeting-details-label'> {meeting.purpose}</span>
            </div>
            <div
              style={{
                marginBottom: '20px',
                background: '#d0cccc',
                textAlign: 'left',
                width: '49%',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '5px'
              }}
            >
              <span
                style={{ fontWeight: 'normal' }}
                className='meeting-details-label'
              >
                Attendance:
              </span>
              <span className='meeting-details-label'>
                {' '}
                {meeting.attendance}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span className='meeting-details-label'>Meeting Agenda:</span>
            <span style={{ fontWeight: 'normal' }}>
              {' '}
              {meeting.meetingAgenda}
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span className='meeting-details-label'>Notes:</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span className='meeting-details-label'>Results of Meeting:</span>
            <span style={{ fontWeight: 'normal' }}>{meeting.results}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}
          >
            <div className='meeting-new-indicator'>
              {meeting.isNew && 'NEW'}
            </div>
            <div className='meeting-time-indicator'>{meeting.time}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// const TeamMeetingAgendas = () => {
//   const meetings = [
//     {
//       date: '2023-05-01',
//       purpose: 'Lorem Ipsum',
//       attendance: 'Lorem Ipsum',
//       notes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
//       results: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr...',
//       isNew: true,
//       time: '08:45 PM'
//     },
//     {
//       date: '2023-05-03',
//       purpose: 'Lorem Ipsum',
//       attendance: 'Lorem Ipsum',
//       notes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
//       results: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr...',
//       isNew: false,
//       time: '10:15 AM'
//     }
//     // Add more meetings as needed
//   ]

//   return (
//     <div>
//       <h2>TEAM MEETING AGENDAS</h2>
//       {meetings.map((meeting, index) => (
//         <MeetingAgenda key={index} meeting={meeting} />
//       ))}
//     </div>
//   )
// }

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

const Accordion = ({
  data,
  userEntries,
  activeIndex,
  handleClick,
  setProjectSprintTitle
}) => {
  const [activeIndexAccordian, setActiveIndexAccordian] = useState(null)

  const currentDate = new Date()
  const nextDay = new Date(currentDate)
  nextDay.setDate(currentDate.getDate() + 1)

  const [tableReflection] = useState({
    startDate: currentDate,
    endDate: nextDay,
    reflectionTableId: 1
  })

  return (
    <div className='accordion'>
      {data.map((item, index) => (
        <div key={item.id} className={`accordion-item`}>
          {activeIndex === null && (
            <div
              className={`accordion-title`}
              onClick={() => {
                handleClick(index)
                setProjectSprintTitle(item.title)
              }}
            >
              {item.title}
            </div>
          )}
          {activeIndex === index && (
            <div className='accordion-content'>
              <ReflectionTable
                entries={[item]}
                getTitle={(entry) => entry.title}
                getStartDate={(entry) =>
                  entry.startDate
                    ? new Date(entry.startDate).toLocaleDateString('en-CA')
                    : new Date(tableReflection.startDate).toLocaleDateString(
                        'en-CA'
                      )
                }
                getEndDate={(entry) =>
                  entry.endDate
                    ? new Date(entry.endDate).toLocaleDateString('en-CA')
                    : new Date(tableReflection.endDate).toLocaleDateString(
                        'en-CA'
                      )
                }
                getEntries={(entry) => entry.ltsJournalAccordionEntries}
                getUserEntry={(entry, index) =>
                  entry.userEntries && entry.userEntries[index]
                    ? entry.userEntries[index].title
                    : null
                }
                userEntries={userEntries}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const ReflectionTable = ({
  entries,
  getTitle,
  getStartDate,
  getEndDate,
  getEntries,
  getUserEntry,
  userEntries
}) => {
  if (!entries || entries.length === 0) return null

  const stripHtmlTags = (str) => {
    if (!str) return '' // Handle empty or undefined strings
    return str.replace(/<\/?[^>]+(>|$)/g, '')
  }

  return (
    <>
      {entries.map((entry, tableIndex) => {
        const reflectionsTableEntries = getEntries(entry)

        if (!reflectionsTableEntries || reflectionsTableEntries.length === 0)
          return null

        return (
          <div key={tableIndex} style={{ margin: '30px 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ width: '49%' }} className='journal-entries-title'>
                Start Date: {getStartDate(entry) ?? 'N/A'}
              </div>
              <div style={{ width: '49%' }} className='journal-entries-title'>
                End Date: {getEndDate(entry) ?? 'N/A'}
              </div>
            </div>

            {reflectionsTableEntries.map((rt, index) => {
              const userEntry =
                userEntries && userEntries.length > 0
                  ? userEntries.find(
                      (userEnt) => userEnt.journalEntryId === rt.id
                    )
                  : getUserEntry
                  ? getUserEntry(entry, index)
                  : null

              const content =
                userEntry && userEntry.content
                  ? stripHtmlTags(userEntry.content)
                  : 'No Data' // Default content if userEntry is empty or undefined

              return (
                <div key={index} style={{ margin: '30px 0' }}>
                  <div className='journal-entries-title'>{getTitle(rt)}</div>
                  <div className='user-entries'>{content}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
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
  const [activeIndexAccordian, setActiveIndexAccordian] = useState(null)
  const [projectSprintTitle, setProjectSprintTitle] = useState('')

  const currentDate = new Date()
  const nextDay = new Date(currentDate)
  nextDay.setDate(currentDate.getDate() + 1)
  const [tableReflection, setTableReflections] = useState({
    startDate: currentDate,
    endDate: nextDay,
    reflectionTableId: 1
  })

  const handleClick = (index) => {
    setActiveIndexAccordian(index === activeIndexAccordian ? null : index)
  }

  const getJournalEntries = async (studentId) => {
    try {
      const { data } = await axiosInstance.get(
        `/ltsJournals/${props.selectedJournalId}/student/${studentId}`
      )

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
    // height: '60%',
    // marginBottom: '40px',
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
            onClick={() => {
              if (activeIndexAccordian != null) {
                handleClick(null)
              } else {
                props.setSelectedUser('')
              }
            }}
            className='evaluate-close-button'
          >
            {/* <FontAwesomeIcon icon={faTimes} /> */}
            <img src={closeIcon} alt='#' width='100%' />
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
            <div>
              <h5>
                {props.journalSelected != 'PORTFOLIO'
                  ? journalEntries.title
                  : ''}
              </h5>
              {activeIndexAccordian != null ? (
                <h5>{projectSprintTitle}</h5>
              ) : (
                ''
              )}
            </div>

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
            {props.journalSelected != 'PORTFOLIO' &&
              journalEntries.entries &&
              journalEntries.entries.length > 0 &&
              journalEntries.entries.map((entry, index) => (
                <div key={index} style={{ margin: '30px 0', height: '100%' }}>
                  <div className='journal-entries-title'>{entry.title}</div>
                  <div className='user-entries'>
                    {userJournalEntries[index]?.content
                      ? stripHtmlTags(userJournalEntries[index].content)
                      : 'No Data'}
                  </div>
                </div>
              ))}
          </div>

          {props.journalSelected != 'PORTFOLIO' &&
            journalEntries.teamMeetings && (
              <MeetingAgenda meeting={journalEntries.teamMeetings} />
            )}

          {props.journalSelected != 'PORTFOLIO' &&
            journalEntries &&
            journalEntries.reflectionsTable &&
            journalEntries.reflectionsTable.length > 0 &&
            journalEntries.reflectionsTable.map(
              (reflectionTable, tableIndex) =>
                reflectionTable.reflectionsTableEntries &&
                reflectionTable.reflectionsTableEntries.length > 0 && (
                  <ReflectionTable
                    entries={journalEntries.reflectionsTable}
                    getTitle={(rt) => rt.title}
                    getStartDate={(entry) =>
                      entry.startDate
                        ? new Date(entry.startDate).toLocaleDateString('en-CA')
                        : new Date(
                            tableReflection.startDate
                          ).toLocaleDateString('en-CA')
                    }
                    getEndDate={(entry) =>
                      entry.endDate
                        ? new Date(entry.endDate).toLocaleDateString('en-CA')
                        : new Date(tableReflection.endDate).toLocaleDateString(
                            'en-CA'
                          )
                    }
                    getEntries={(entry) => entry.reflectionsTableEntries}
                    getUserEntry={(entry, index) =>
                      entry.userReflectionsTableEntries[index]?.title || null
                    }
                  />
                )
            )}

          {props.journalSelected != 'PORTFOLIO' &&
          journalEntries?.contentUploads ? (
            <ContentUploads
              journal={journalEntries}
              isEditable={false}
              evaluationModal={true}
            />
          ) : null}

          {props.journalSelected != 'PORTFOLIO' &&
          journalEntries?.certificationSkills ? (
            <CertificationSkills
              journal={journalEntries}
              isEditable={false}
              evaluationModal={true}
            />
          ) : null}

          {props.journalSelected != 'PORTFOLIO' &&
            journalEntries.brandsJournal &&
            !journalEntries.accordions &&
            journalEntries.brandsJournal.length > 0 && (
              <ShotList data={journalEntries} />
            )}

          {props.journalSelected != 'PORTFOLIO' &&
            journalEntries.accordions &&
            journalEntries.accordions.length > 0 && (
              <Accordion
                data={journalEntries.accordions}
                userEntries={userJournalEntries}
                activeIndex={activeIndexAccordian}
                handleClick={(index) => handleClick(index)}
                setProjectSprintTitle={(title) => setProjectSprintTitle(title)}
              />
            )}
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
            <div
              className={`portfolio-data-container eval-feedback  ${
                instructorEditing ? 'edit-eval-feedback' : null
              } `}
              style={{
                background: '#fff',

                boxShadow: '0px 3px 10px #00000029',
                borderRadius: '28px'
              }}
            >
              <div className='eval-feedback-title py-2'>
                {instructorEditing ? (
                  <h5> EDIT INSTRUCTOR FEEDBACK</h5>
                ) : (
                  <h5> INSTRUCTOR FEEDBACK</h5>
                )}
              </div>
              <div className='feedback-action'>
                <div className='feedback-action-box' onClick={toggleEditing}>
                  {instructorEditing ? (
                    <>
                      <FaCheck className={'action-icon public-icon'} />
                    </>
                  ) : (
                    <FaPencilAlt className={'action-icon pencil-icon'} />
                  )}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                {!instructorEditing ? (
                  feedbackContent ? (
                    stripHtmlTags(feedbackContent)
                  ) : (
                    <div style={{ fontSize: '13px', color: 'grey' }}>
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
