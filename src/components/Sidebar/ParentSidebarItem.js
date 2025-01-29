import SidebarItem from './SidebarItem'

const ParentSidebarItem = ({
  href,
  ariaControls,
  srcImage,
  title,
  isDropdown,
  to = null
}) => {
    const handleClick = (e) => {
    document.querySelectorAll(".collapse.show").forEach((openDropdown) => {
      if (openDropdown.id !== ariaControls) {
        openDropdown.classList.remove("show");
      }
    });
  };
  return (
  <ul
    className='dropdownMenuSidebarHover list-unstyled'
    data-bs-toggle='collapse'
    href={href}
    role='button'
    aria-expanded='true'
    aria-controls={ariaControls}
    onClick={handleClick}
  >
    <SidebarItem
      srcImage={srcImage}
      title={title}
      to={to}
      isDropdown={isDropdown}
    />
  </ul>
)
}

export default ParentSidebarItem
