import tickSign from '../../assets/images/academy-icons/tick-sign.png'

function AccordionSyllabus({ content }) {
  return (
    <div className='d-flex align-items-center gap-3'>
      <img className='tick-icon-black' src={tickSign} alt='tick-sign' />
      <p className='mb-0 fs-15'>{content}</p>
    </div>
  )
}

export default AccordionSyllabus
