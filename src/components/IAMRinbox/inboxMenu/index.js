import { useSelector } from 'react-redux'
import useIamrInboxContext from '../iamrInboxContext'
import { Accordion } from 'react-bootstrap'
import '../index.css'
import MenuList from './menuList'
import MenuOption from './menuOption'

function InboxMenu() {
  const { studentQuestions, certificationFeedbackQuestions, approvalRequests } =
    useIamrInboxContext()

  const loggedUser = useSelector((state) => state.user.user.user)

  const allowedUsers = [122, 933, 128]

  return (
    <div className="col-12 col-lg-3 inbox-menu">
      <h4>INBOX</h4>
      <Accordion defaultActiveKey="0">
        <MenuList
          title={'CERTIFICATION'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'0'}
        >
          <MenuOption
            allowedToShow={true}
            title={'STUDENT QUESTIONS'}
            categoryOption={studentQuestions.unreadCount}
            questionMenu={'student-questions'}
          />
          <MenuOption
            allowedToShow={true}
            title={'CERTIFICATION /FEEDBACK REQUESTS'}
            categoryOption={certificationFeedbackQuestions.unreadCount}
            questionMenu={'certification-feedback-questions'}
          />
          <MenuOption
            allowedToShow={allowedUsers.includes(loggedUser.id)}
            title={'APPROVAL REQUESTS'}
            categoryOption={approvalRequests.unreadCount}
            questionMenu={'approval-requests'}
          />
        </MenuList>
        <MenuList
          title={'IMMERSION'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'1'}
        >
          <MenuOption
            allowedToShow={true}
            title={'INDUSTRY PROBLEM SUBMISSIONS'}
            categoryOption={studentQuestions.unreadCount}
            questionMenu={'industry-problem-submissions'}
          />
          <MenuOption
            allowedToShow={true}
            title={'IMMERSION APPLICATIONS'}
            categoryOption={certificationFeedbackQuestions.unreadCount}
            questionMenu={'immersion-applications'}
          />
          <MenuOption
            allowedToShow={true}
            title={'SPOTLIGHT SUBMISSIONS'}
            categoryOption={approvalRequests.unreadCount}
            questionMenu={'spotlight-submission'}
          />
        </MenuList>
      </Accordion>
    </div>
  )
}

export default InboxMenu
