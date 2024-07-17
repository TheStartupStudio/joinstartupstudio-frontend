import SidebarItem from './SidebarItem'

const ParentSidebarItem = ({
  href,
  ariaControls,
  srcImage,
  title,
  isDropdown,
  to = null
}) => (
  <li
    className='dropdownMenuSidebarHover'
    data-bs-toggle='collapse'
    href={href}
    role='button'
    aria-expanded='true'
    aria-controls={ariaControls}
  >
    <SidebarItem
      srcImage={srcImage}
      title={title}
      to={to}
      isDropdown={isDropdown}
    />
  </li>
)

export default ParentSidebarItem
