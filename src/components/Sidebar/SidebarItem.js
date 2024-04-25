import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col } from 'react-bootstrap'

const IconContainer = ({ srcImage }) => {
  return (
    <Col md="2" className="col-2 icon_container">
      <img src={srcImage} alt="Icon" className="w-100 h-100" />
    </Col>
  )
}

const SidebarItem = ({
  onClick,
  to,
  className,
  srcImage,
  title,
  isDropdown
}) => {
  return (
    <a onClick={onClick ?? null} href={to} className={className}>
      <div className="d-flex w-100" style={{ alignItems: 'center' }}>
        <IconContainer srcImage={srcImage} />
        <div className="flex-grow-1 ms-1">
          <span className={'text-uppercase'}>{title}</span>
        </div>
        {isDropdown && (
          <FontAwesomeIcon
            icon={faAngleDown}
            className="me-2 me-md-0"
            style={{
              fontSize: '16px',
              color: '#333D3D'
            }}
          />
        )}
      </div>
    </a>
  )
}
export default SidebarItem
