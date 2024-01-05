const TagOption = ({ tag, checked, handleChange }) => {
  return (
    <li
    // className={`${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
    // onClick={() => handleChange(tag)}
    >
      <div className='option-container'>
        <input
          type='checkbox'
          id={tag.name}
          className='checkbox-input'
          name={`checkbox`}
          checked={checked}
          onChange={(e) => handleChange(e, tag)}
        />
        <label htmlFor={tag.name} className='checkbox-label'>
          {tag.name}
        </label>
      </div>
    </li>
  )
}

export default TagOption
