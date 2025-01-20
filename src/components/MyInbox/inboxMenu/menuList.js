import { Accordion } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const MenuList = ({ children, title, iconStyles, eventKey }) => {
  return (
    <Card className='bg-transparent mb-2'>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={eventKey}
        className='menu_accordion-toggle cursor-pointer'
      >
        <span>{title}</span>
        <FontAwesomeIcon icon={faAngleDown} className={iconStyles} />
      </Accordion.Toggle>

      <Accordion.Collapse eventKey={eventKey}>
        <div>{children}</div>
      </Accordion.Collapse>
    </Card>
  )
}

export default MenuList
