const TagOption = ({ tag, checked }) => {
  return (
    <li>
      <div className='option-container'>
        <input
          type='checkbox'
          id={tag.name}
          className='checkbox-input'
          name={`checkbox`}
          checked={checked}
          readOnly={true}
          onChange={() => {}}
        />
        <label htmlFor={tag.name} className='checkbox-label'>
          {tag.name}
        </label>
      </div>
    </li>
  )
}

export default TagOption
