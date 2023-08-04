import { memo } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'
import { useHistory } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'

function Ticket({ ticket, setSelectedTicket }) {
  const history = useHistory()

  let uploadUrl
  if (ticket?.type === 'approval') {
    uploadUrl = `/student-iamr/${ticket.User?.id}/1/uploads`
  } else {
    uploadUrl = `/student-iamr/${ticket.User?.id}/${ticket.IamrSkill?.id}/uploads/${ticket.UserSkillUpload?.id}`
  }

  const readByInstructorHandler = async () => {
    await axiosInstance.get(`/instructor/iamr/tickets/${ticket.id}`)
  }
  return (
    <div
      className={`single-ticket d-flex ${
        !ticket.read_by_instructor ? 'unread' : ''
      }`}
      onClick={() => {
        ticket.type === 'certification_submit' || ticket.type === 'approval'
          ? history.push(uploadUrl)
          : setSelectedTicket(ticket)
        readByInstructorHandler()
      }}
    >
      <img
        src={ticket.User.profile_image ? ticket.User.profile_image : imgTest}
        alt="profile"
        className="rounded-circle"
      />
      <div className="ticket-information d-flex flex-column mx-2 min-w-0">
        <h5 className="from">{ticket.User.name}</h5>
        <p className="subject">
          Subject: <span className="fw-bold"> {ticket.subject} </span>
        </p>
        <p className="last-message">{ticket.TicketAnswers?.message}</p>
      </div>
      <div className="ticket-status d-flex align-items-center">
        <p className="my-auto">
          {beautifulDateFormat(
            ticket.TicketAnswers?.createdAt ?? ticket.createdAt
          )}
        </p>
        <FontAwesomeIcon
          icon={faCircle}
          style={{
            fontSize: '13px',
            textAlign: 'right',
            marginLeft: '5px',
          }}
          className={`status ${ticket.UserSkillStatus?.status}`}
        />
      </div>
    </div>
  )
}

export default memo(Ticket)
