import { memo, useState } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'
import { useHistory } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'
import SubmitIndustryProblemModal from '../../pages/MyImmersion/Modals/SubmitIndustryProblemModal'
import SpotlightModal from '../../pages/MyImmersion/Modals/SpotlightModal'

function Ticket({
  ticket,
  setSelectedTicket,
  updateTicketStatus,
  updateUserSolutionStatus
}) {
  console.log('ticket', ticket)
  const history = useHistory()
  const [industryProblemModal, setIndustryProblemModal] = useState(false)
  const [submitSpotlightModal, setSubmitSpotlightModal] = useState(false)

  let uploadUrl
  if (ticket?.type === 'approval') {
    uploadUrl = `/student-iamr/${ticket.User?.id}/1/uploads`
  } else {
    uploadUrl = `/student-iamr/${ticket.User?.id}/${ticket.IamrSkill?.id}/uploads/${ticket.UserSkillUpload?.id}`
  }

  const readByInstructorHandler = async () => {
    await axiosInstance.get(`/instructor/iamr/tickets/${ticket.id}`)
    updateTicketStatus(ticket.id)
  }
  return (
    <>
      <div
        className={`single-ticket d-flex ${
          !ticket.read_by_instructor ? 'unread' : ''
        }`}
        onClick={() => {
          ticket.type === 'certification_submit' || ticket.type === 'approval'
            ? history.push(uploadUrl)
            : ticket.type === 'instruction' || ticket.type === 'feedback'
            ? setSelectedTicket(ticket)
            : ticket.type === 'industry_problem'
            ? setIndustryProblemModal(true)
            : setSubmitSpotlightModal(true)
          readByInstructorHandler()
        }}
      >
        <img
          src={ticket.User.profile_image ? ticket.User.profile_image : imgTest}
          alt='profile'
          className='rounded-circle'
        />
        <div className='ticket-information d-flex flex-column mx-2 min-w-0'>
          <h5 className='from'>{ticket.User.name}</h5>
          <p className='subject'>
            Subject: <span className='fw-bold'> {ticket.subject} </span>
          </p>
          <p className='last-message'>{ticket.TicketAnswers?.message}</p>
        </div>
        <div className='ticket-status d-flex align-items-center'>
          <p className='my-auto pe-2' style={{ color: '#ccc' }}>
            {ticket.type === 'industry_problem'
              ? ticket.user_industry_solution.status === 'approved'
                ? 'Application Approved'
                : ticket.user_industry_solution.status === 'pending'
                ? 'Application Submitted'
                : 'Application Returned'
              : ticket.type === 'spotlight'
              ? ticket.spotlight.status === 'approved'
                ? 'Application Approved'
                : ticket.spotlight.status === 'pending'
                ? 'Application Submitted'
                : 'Application Returned'
              : null}
          </p>
          <p className='my-auto pl-2'>
            {beautifulDateFormat(
              ticket.TicketAnswers?.createdAt ?? ticket.createdAt
            )}
          </p>
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              fontSize: '13px',
              textAlign: 'right',
              marginLeft: '5px'
            }}
            className={`status ${
              ticket.type === 'industry_problem'
                ? ticket.user_industry_solution?.status
                : ticket.type === 'immersion_experience'
                ? ticket.user_immersion_experience?.status
                : ticket.UserSkillStatus?.status
            }`}
          />
        </div>
      </div>
      {industryProblemModal && (
        <SubmitIndustryProblemModal
          {...ticket}
          show={industryProblemModal}
          onHide={() => setIndustryProblemModal(false)}
          User={ticket.User}
          mode='edit'
          updateUserSolutionStatus={updateUserSolutionStatus}
        />
      )}
      {submitSpotlightModal && (
        <SpotlightModal
          {...ticket}
          show={submitSpotlightModal}
          onHide={() => setSubmitSpotlightModal(false)}
          User={ticket.User}
          mode='edit'
          updateUserSolutionStatus={updateUserSolutionStatus}
          title={'Spotlight Application'}
        />
      )}
    </>
  )
}

export default memo(Ticket)
