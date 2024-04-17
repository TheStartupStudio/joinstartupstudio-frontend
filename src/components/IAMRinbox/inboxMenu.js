import { useSelector } from 'react-redux'
import useIamrInboxContext from './iamrInboxContext'
import { Accordion } from 'react-bootstrap'
import { Card } from 'react-bootstrap'

import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

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
      <Accordion defaultActiveKey="0">
        <Card className="bg-transparent mb-2">
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            className="cursor-pointer"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3%'
            }}
          >
            <span> CERTIFICATION</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="me-2 me-md-0"
              style={{
                fontSize: '16px',
                color: '#333D3D'
              }}
            />
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <div>
              <div
                className={`menu-option d-flex justify-content-between ${
                  questionsMenuSelected === 'student-questions'
                    ? 'selected'
                    : ''
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
                onClick={() =>
                  selectQuestionsMenu('certification-feedback-requests')
                }
              >
                <h5 className="my-auto"> CERTIFICATION /FEEDBACK REQUESTS</h5>
                <div className="unread-tickets-number my-auto">
                  {certificationFeedbackQuestions.unreadCount}
                </div>
              </div>
              {allowedUsers.includes(loggedUser.id) && (
                <div
                  className={`menu-option d-flex justify-content-between ${
                    questionsMenuSelected === 'approval-requests'
                      ? 'selected'
                      : ''
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
          </Accordion.Collapse>
        </Card>
        <Card className="bg-transparent">
          <Accordion.Toggle
            as={Card.Header}
            eventKey="1"
            className="cursor-pointer"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3%'
            }}
          >
            <span>IMMERSION</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="me-2 me-md-0"
              style={{
                fontSize: '16px',
                color: '#333D3D'
              }}
            />
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <div>
              <div
                className={`menu-option d-flex justify-content-between ${
                  questionsMenuSelected === 'industry-problem-submissions'
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  selectQuestionsMenu('industry-problem-submissions')
                }
              >
                <h5 className="my-auto">INDUSTRY PROBLEM SUBMISSIONS</h5>
                <div className="unread-tickets-number my-auto">
                  {studentQuestions.unreadCount}
                </div>
              </div>
              <div
                className={`menu-option d-flex justify-content-between ${
                  questionsMenuSelected === 'immersion-applications'
                    ? 'selected'
                    : ''
                }`}
                onClick={() => selectQuestionsMenu('immersion-applications')}
              >
                <h5 className="my-auto">IMMERSION APPLICATIONS</h5>
                <div className="unread-tickets-number my-auto">
                  {studentQuestions.unreadCount}
                </div>
              </div>
              <div
                className={`menu-option d-flex justify-content-between ${
                  questionsMenuSelected === 'spotlight-submission'
                    ? 'selected'
                    : ''
                }`}
                onClick={() => selectQuestionsMenu('spotlight-submission')}
              >
                <h5 className="my-auto">SPOTLIGHT SUBMISSIONS</h5>
                <div className="unread-tickets-number my-auto">
                  {studentQuestions.unreadCount}
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

export default InboxMenu
