const Explanation = ({
  tag,
  handleChange,
  allowUpdate,
  showErrors,
  errors
}) => {
  return (
    <>
      <div key={tag.id} className='col-12 explanation-container mb-2'>
        <p className='page-content-title mb-2'>EXPLANATION - {tag.name}</p>
        <textarea
          value={tag.explanation ?? ''}
          name={`explanation-${tag.id}`}
          placeholder='Write explanation for the selected tag'
          onChange={(e) => allowUpdate && handleChange(e, tag)}
          readOnly={!allowUpdate}
        />
        <p className='field-error'>
          {showErrors && errors?.[showErrors]?.[`explanation-${tag.id}`]}
        </p>
      </div>
    </>
  )
}

export default Explanation
