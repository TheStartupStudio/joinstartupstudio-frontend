import SidebarItem from './SidebarItem'

const ParentSidebarItem = ({
  href,
  ariaControls,
  srcImage,
  title,
  isDropdown
}) => (
  <li
    className="dropdownMenuSidebarHover"
    data-bs-toggle="collapse"
    href={href}
    role="button"
    aria-expanded="true"
    aria-controls={ariaControls}
  >
    <SidebarItem srcImage={srcImage} title={title} isDropdown={isDropdown} />
  </li>
)

export default ParentSidebarItem
