import { NavLink } from 'react-router-dom'

const DropdownItem = ({ title, to }) => {
  return (
    <li>
      <NavLink to={to} activeClassName="sidenav active">
        <div className="d-flex" style={{ alignItems: 'center' }}>
          <div className="ms-4 ps-2 py-1 text-uppercase">{title}</div>
        </div>
      </NavLink>
    </li>
  )
}

export default DropdownItem
