import { NavLink } from 'react-router-dom'

const DropdownItem = ({ title, to, disabled, allowed = true }) => {
  return (
    <>
      {allowed && (
        <li className={`${disabled ? 'disabledd' : ''}`}>
          <NavLink to={to} activeClassName='sidenav active '>
            <div className='d-flex' style={{ alignItems: 'center' }}>
              <div className='ms-4 ps-2 py-1 text-uppercase sidebar-subtitle'>
                {title}
              </div>
            </div>
          </NavLink>
        </li>
      )}
    </>
  )
}

export default DropdownItem
