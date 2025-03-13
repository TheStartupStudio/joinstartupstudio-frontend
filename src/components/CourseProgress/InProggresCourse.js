import circleSign from '../../assets/images/academy-icons/circle-fill.png'

function InProggresCourse({ title }) {
  return (
    <div className='d-flex align-items-center gap-2'>
      <img className='accordion-icons' src={circleSign} alt='tick' />
      <span className='accordion-content-modal text-black'>{title}</span>
    </div>
  )
}

export default InProggresCourse
