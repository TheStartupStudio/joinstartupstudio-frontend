import { Accordion, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const MenuList = ({
  children,
  title,
  iconStyles,
  eventKey,
  handleClick,
  category,
  journalId
}) => {
  const journalData = {
    category,
    journalId
  }

  return (
    <div onClick={() => handleClick(journalData)}>
      <Card className='bg-transparent mb-2'>
        <Accordion.Toggle
          as={Card.Header}
          eventKey={eventKey}
          className='menu_accordion-toggle cursor-pointer'
        >
          <span
            className='eval-section-title'
            style={{ textTransform: 'uppercase', marginLeft: '7px' }}
          >
            {title}
          </span>
          {title !== 'PORTFOLIO' && title !== 'CERTIFICATE' && (
            <FontAwesomeIcon icon={faAngleDown} className={iconStyles} />
          )}
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={eventKey}>
          <div style={{ textTransform: 'uppercase' }}>{children}</div>
        </Accordion.Collapse>
      </Card>
    </div>
  )
}

export default MenuList
