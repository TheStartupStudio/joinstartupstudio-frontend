import { beautifulDateFormat } from '../../../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-solid-svg-icons'

const DropdownOption = ({ selectedTicket, handleOnClick, ticket }) => {
  return (
    <li
      className={`${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
      onClick={() => handleOnClick(ticket)}
    >
      <FontAwesomeIcon
        icon={faSquare}
        style={{
          fontSize: '10px',
          color: ticket.resolved ? 'green' : '#EF4E4E',
          marginTop: '3px'
        }}
        title={`Status: ${!ticket.resolved ? 'not resolved' : 'resolved'}`}
      />
      <div className="d-flex flex-column w-100 ms-2">
        <div className="top">
          <p>
            <span className="fw-bold"> Subject: </span>
            {ticket.subject}
          </p>
          <p>
            {beautifulDateFormat(ticket?.TicketAnswers?.[0]?.createdAt, {
              format: 'hh:mm a',
              type: 'hours'
            })}
          </p>
        </div>
        <p className="mt-2 mb-0">
          {ticket?.TicketAnswers?.[ticket?.TicketAnswers?.length - 1]?.message}
        </p>
      </div>
    </li>
  )
}

export default DropdownOption
