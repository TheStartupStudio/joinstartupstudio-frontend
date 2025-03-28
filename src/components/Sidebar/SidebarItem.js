import { Link } from 'react-router-dom'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col } from 'react-bootstrap'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { collapseTrue } from '../../redux/sidebar/Actions'

const IconContainer = ({ srcImage }) => {
  return (
    <Col md='2' className='col-2 icon_container'>
      <img src={srcImage} alt='Icon' />
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
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()

  const handleItemClick = (e) => {
    dispatch(collapseTrue())
    if (isDropdown) {
      e.preventDefault()
      setDropdownOpen((prev) => !prev)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <li className='sub-li'>
      <Link onClick={handleItemClick} to={to || '#'} className={className}>
        <div className='d-flex w-100' style={{ alignItems: 'center' }}>
          <IconContainer srcImage={srcImage} />
          <div className='flex-grow-1 ms-1'>
            <span className={'text-uppercase'}>{title}</span>
          </div>
          {isDropdown && (
            <FontAwesomeIcon
              icon={faAngleDown}
              className='me-2 me-md-0'
              style={{
                fontSize: '16px',
                color: '#333D3D'
              }}
            />
          )}
        </div>
      </Link>
      {isDropdown && isDropdownOpen && (
        <div
          className='accordion accordion-flush'
          id='accordionFlushExample'
        ></div>
      )}
    </li>
  )
}

export default SidebarItem
