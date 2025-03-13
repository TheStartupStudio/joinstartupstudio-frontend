import tickSign from '../../assets/images/academy-icons/tick-sign.png'

function ProgressDone({ title }) {
  return (
    <div className='d-flex align-items-center gap-2'>
      <img className='accordion-icons' src={tickSign} alt='tick' />
      <span className='accordion-content-modal text-black'>{title}</span>
    </div>
  )
}

export default ProgressDone
