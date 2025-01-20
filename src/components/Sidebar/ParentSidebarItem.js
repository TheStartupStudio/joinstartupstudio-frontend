import SidebarItem from './SidebarItem'

const ParentSidebarItem = ({
  href,
  ariaControls,
  srcImage,
  title,
  isDropdown,
  to = null
}) => (
  <ul
    className='dropdownMenuSidebarHover list-unstyled'
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
  </ul>
)

export default ParentSidebarItem
