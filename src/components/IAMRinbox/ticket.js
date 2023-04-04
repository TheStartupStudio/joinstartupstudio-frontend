import { memo } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'
import { useHistory } from 'react-router'

function Ticket({ ticket, setSelectedTicket }) {
  const history = useHistory()
  const uploadUrl = `/student-iamr/${ticket.User?.id}/${ticket.IamrSkill?.id}/uploads/${ticket.UserSkillUpload?.id}`
  return (
    <div
      className='single-ticket d-flex'
      onClick={() => {
        ticket.type === 'certification_submit'
          ? history.push(uploadUrl)
          : setSelectedTicket(ticket)
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
        <p className='my-auto'>
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
          className={`status ${ticket.UserSkillStatus?.status}`}
        />
      </div>
    </div>
  )
}

export default memo(Ticket)
