import { useSelector } from 'react-redux'
import useIamrInboxContext from './iamrInboxContext'

import './index.css'

function InboxMenu() {
  const {
    questionsMenuSelected,
    selectQuestionsMenu,
    studentQuestions,
    certificationFeedbackQuestions,
    approvalRequests
  } = useIamrInboxContext()

  const loggedUser = useSelector((state) => state.user.user.user)

  const allowedUsers = [122, 933, 128]

  return (
    <div className="col-12 col-lg-3 inbox-menu">
      <h4>INBOX</h4>
      <div
        className={`menu-option d-flex justify-content-between ${
          questionsMenuSelected === 'student-questions' ? 'selected' : ''
        }`}
        onClick={() => selectQuestionsMenu('student-questions')}
      >
        <h5 className="my-auto">STUDENT QUESTIONS</h5>
        <div className="unread-tickets-number my-auto">
          {studentQuestions.unreadCount}
        </div>
      </div>
      <div
        className={`menu-option d-flex justify-content-between ${
          questionsMenuSelected === 'certification-feedback-requests'
            ? 'selected'
            : ''
        }`}
        onClick={() => selectQuestionsMenu('certification-feedback-requests')}
      >
        <h5 className="my-auto"> CERTIFICATION /FEEDBACK REQUESTS</h5>
        <div className="unread-tickets-number my-auto">
          {certificationFeedbackQuestions.unreadCount}
        </div>
      </div>
      {allowedUsers.includes(loggedUser.id) && (
        <div
          className={`menu-option d-flex justify-content-between ${
            questionsMenuSelected === 'approval-requests' ? 'selected' : ''
          }`}
          onClick={() => selectQuestionsMenu('approval-requests')}
        >
          <h5 className="my-auto">APPROVAL REQUESTS</h5>
          <div className="unread-tickets-number my-auto">
            {approvalRequests.unreadCount}
          </div>
        </div>
      )}
    </div>
  )
}

export default InboxMenu
