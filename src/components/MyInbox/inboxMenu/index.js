import { useSelector } from 'react-redux'
import useInboxContext from '../inboxContext'
import { Accordion } from 'react-bootstrap'
import '../index.css'
import MenuList from './menuList'
import MenuOption from './menuOption'

function InboxMenu() {
  const {
    studentQuestions,
    certificationFeedbackQuestions,
    approvalRequests,
    industryProblems,
    immersionExperiences
  } = useInboxContext()
  const { isSuperAdmin } = useSelector((state) => state.user.user)

  console.log('industryProblems', industryProblems)
  console.log('approvalRequests', approvalRequests)

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
            questionMenu={'student_questions'}
            title={'STUDENT QUESTIONS'}
            categoryOption={studentQuestions?.unreadCount}
          />
          <MenuOption
            allowedToShow={true}
            questionMenu={'certification_feedback_requests'}
            title={'CERTIFICATION /FEEDBACK REQUESTS'}
            categoryOption={certificationFeedbackQuestions?.unreadCount}
          />
          <MenuOption
            allowedToShow={isSuperAdmin}
            questionMenu={'approval_requests'}
            title={'APPROVAL REQUESTS'}
            categoryOption={approvalRequests?.unreadCount}
          />
        </MenuList>

        <MenuList
          title={'IMMERSION'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'1'}
        >
          <MenuOption
            allowedToShow={true}
            questionMenu={'industry_problem_submissions'}
            title={'INDUSTRY PROBLEM SUBMISSIONS'}
            categoryOption={industryProblems?.unreadCount}
          />
          <MenuOption
            allowedToShow={true}
            questionMenu={'immersion_experience_applications'}
            title={'IMMERSION APPLICATIONS'}
            categoryOption={immersionExperiences?.unreadCount}
          />
          {/* <MenuOption
            allowedToShow={true}
            questionMenu={'spotlight_submission'}
            title={'SPOTLIGHT SUBMISSIONS'}
            categoryOption={approvalRequests?.unreadCount}
          /> */}
        </MenuList>
      </Accordion>
    </div>
  )
}

export default InboxMenu
