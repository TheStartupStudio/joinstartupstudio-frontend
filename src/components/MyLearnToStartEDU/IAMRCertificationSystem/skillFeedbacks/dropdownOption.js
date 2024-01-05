const FeedbackOption = ({ ticket, selectedTicket, handleOnClick }) => {
  return (
    <li onClick={() => handleOnClick(ticket)}>
      <div className='option-container feedbacks-options'>
        <input
          type='radio'
          className='checkbox-input'
          checked={selectedTicket?.id === ticket.id}
          onChange={() => {}}
        />
        <label htmlFor={ticket.name} className='checkbox-label'>
          {ticket.UserSkillUpload.title}
        </label>
      </div>
    </li>
  )
}

export default FeedbackOption
