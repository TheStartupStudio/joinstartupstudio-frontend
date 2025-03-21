import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AccordionLead({ children }) {
  return (
    <div className='d-flex gap-3'>
      <FontAwesomeIcon
        icon={faCircle}
        style={{ fontSize: '3px', marginTop: '0.35rem' }}
      />
      {children}
    </div>
  )
}

export default AccordionLead
