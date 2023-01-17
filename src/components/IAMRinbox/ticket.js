import { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import searchIcon from '../../assets/images/search-icon.png'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useIamrInboxContext from './iamrInboxContext'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'

function Ticket({ ticket, setSelectedTicket }) {
  const { tickets } = useIamrInboxContext()

  const handleSearch = () => {}

  return (
    <div
      className='single-ticket d-flex'
      onClick={() => setSelectedTicket(ticket)}
    >
      <img
        src={ticket.User.profile_image ? ticket.User.profile_image : imgTest}
        alt='profile'
        className='rounded-circle'
      />
      <div className='ticket-information d-flex flex-column mx-2 min-w-0'>
        <h5 className='from'>{ticket.User.name}</h5>
        <p className='subject'>
          Subject: <span className='fw-bold'> {ticket.IamrSkill.title} </span>
        </p>
        <p className='last-message'>{ticket.TicketAnswers?.message}</p>
      </div>
      <div className='ticket-status d-flex align-items-center'>
        <p className='my-auto'>
          {beautifulDateFormat(ticket.TicketAnswers?.createdAt)}
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

export default Ticket
