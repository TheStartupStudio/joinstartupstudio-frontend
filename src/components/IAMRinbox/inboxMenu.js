import useIamrInboxContext from './iamrInboxContext'

import './index.css'

function InboxMenu() {
  const {
    questionsMenuSelected,
    selectQuestionsMenu,
    studentQuestions,
    certificationFeedbackQuestions
  } = useIamrInboxContext()
  return (
    <div className='col-12 col-lg-3 inbox-menu'>
      <h4>INBOX</h4>
      <div
        //prettier-ignore
        className={`menu-option d-flex justify-content-between ${questionsMenuSelected ? 'selected' : ''}`}
        onClick={() => selectQuestionsMenu(true)}
      >
        <h5 className='my-auto'>STUDENT QUESTIONS</h5>
        <div className='unread-tickets-number my-auto'>
          {studentQuestions.unreadCount}
        </div>
      </div>
      <div
        //prettier-ignore
        className={`menu-option d-flex justify-content-between ${!questionsMenuSelected ? 'selected' : ''}`}
        onClick={() => selectQuestionsMenu(false)}
      >
        <h5 className='my-auto'> CERTIFICATION /FEEDBACK REQUESTS</h5>
        <div className='unread-tickets-number my-auto'>
          {certificationFeedbackQuestions.unreadCount}
        </div>
      </div>
    </div>
  )
}

export default InboxMenu
