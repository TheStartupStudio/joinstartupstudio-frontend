import React, { useEffect, useState } from 'react'
import marketReadyGuideOne from '../../assets/images/market-ready-1-badge.png'
import marketReadyGuideTwo from '../../assets/images/market-ready-2-badge.png'
import Questions from '../../assets/images/questions.png'
import Feedbacks from '../../assets/images/feedbacks.png'
import axiosInstance from '../../utils/AxiosInstance'

const IamrBox = ({ userRole, user }) => {
  const [studentQuestions, setStudentQuestions] = useState({})
  const [feedbackRequests, setFeedbackRequests] = useState({})
  const [certificationStats, setCertificationStats] = useState([
    { allSkills: 0, completedSkills: 0 }, // Certification 1
    { allSkills: 0, completedSkills: 0 } // Certification 2
  ])

  useEffect(() => {
    if (userRole === 'student') {
      const getCertificatonStats = async (type) => {
        const response = await axiosInstance.get(
          `/iamr/certifications/stats/${user.id}/${type}`
        )

        setCertificationStats((prevState) => {
          const index = type === 'student-certification-1' ? 0 : 1
          const updatedCertification = {
            allSkills: response.data.result?.length,
            completedSkills: response.data.completedSkills?.length
          }

          return prevState.map((certification, i) => {
            if (i === index) {
              return updatedCertification
            } else {
              return certification
            }
          })
        })
      }
      getCertificatonStats('student-certification-1')
      getCertificatonStats('student-certification-2')
    }
  }, [user.id, userRole])

  useEffect(() => {
    const questionAndFeedbacksHandler = async () => {
      await axiosInstance.get('/instructor/iamr/tickets').then((res) => {
        setStudentQuestions(res.data.student_questions)
        setFeedbackRequests(res.data.certification_feedback_requests)
      })
    }
    if (user.role_id !== 1) {
      questionAndFeedbacksHandler()
    }
  }, [user.role_id])

  return (
    <div className='notification-box col-lg-6 col-sm-12 mt-4 row position-relative iamr-box'>
      <p
        className='text-center certification-progress mt-4'
        style={{ fontSize: '20px', height: 'auto' }}
      >
        {userRole === 'student' ? 'My IAMR Progress' : 'Inbox'}
      </p>
      {userRole === 'student' ? (
        <>
          <div className='col-6 text-center fw-bold'>
            <img src={marketReadyGuideOne} style={{ width: '120px' }} alt='' />
            <p className='mb-0 py-0 mt-2'>
              <span style={{ color: '#54C7DF' }}>
                {certificationStats[0].completedSkills}
              </span>{' '}
              / {certificationStats[0].allSkills} skills
            </p>
            <p className='mt-0 py-0'>Proficient </p>
          </div>
          <div className='col-6 text-center fw-bold'>
            <img
              src={marketReadyGuideTwo}
              style={{ width: '120px' }}
              alt='ss'
            />
            <p className='mb-0 py-0 mt-2'>
              <span style={{ color: '#CF2E81' }}>
                {certificationStats[1].completedSkills}
              </span>{' '}
              / {certificationStats[1].allSkills} skills
            </p>
            <p className='mt-0 py-0'>Proficient </p>
          </div>
        </>
      ) : (
        <>
          <div
            className='col-6 text-center fw-bold'
            style={{ marginTop: '-3rem' }}
          >
            <img src={Questions} style={{ width: '180px' }} alt='' />

            <a href={`/my-inbox`} className='iamr-inbox_link m-0'>
              {studentQuestions.unreadCount ? studentQuestions?.unreadCount : 0}
              <span className='ml-2'>Questions</span>
            </a>
          </div>
          <div
            className='col-6 text-center fw-bold'
            style={{ marginTop: '-3rem' }}
          >
            <img src={Feedbacks} style={{ width: '180px' }} alt='' />
            <a href='/my-inbox' className='iamr-inbox_link'>
              {feedbackRequests.unreadCount ? feedbackRequests.unreadCount : 0}
              <span className='ml-2'>Requests</span>
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default IamrBox
