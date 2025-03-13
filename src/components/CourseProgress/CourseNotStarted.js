import lockSign from '../../assets/images/academy-icons/lock.png'

function CourseNotStarted({ title }) {
  return (
    <div className='d-flex align-items-center gap-2'>
      <img className='accordion-icons' src={lockSign} alt='tick' />
      <span className='accordion-content-modal text-muted'>{title}</span>
    </div>
  )
}

export default CourseNotStarted
