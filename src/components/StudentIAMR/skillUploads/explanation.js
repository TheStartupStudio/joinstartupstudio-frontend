const Explanation = ({ tag }) => {
  return (
    <div className='col-12 explanation-container mb-2'>
      <p className='page-content-title mb-2'>EXPLANATION - {tag.name}</p>
      <textarea
        value={tag.explanation ?? ''}
        name={`explanation-${tag.id}`}
        placeholder='Write explanation for the selected tag'
        readOnly={true}
      />
    </div>
  )
}

export default Explanation
