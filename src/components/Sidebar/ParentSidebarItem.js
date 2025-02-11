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
        openDropdown.style.transition = "height 0.6s ease-in-out, opacity 0.5s ease-in-out";
        openDropdown.style.height = openDropdown.scrollHeight + "px";
        setTimeout(() => {
          openDropdown.style.height = "0px";
          openDropdown.style.opacity = "0";
        }, 10);

        setTimeout(() => {
          openDropdown.classList.remove("show");
          openDropdown.style.height = "";
          openDropdown.style.opacity = "";
        }, 600);
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
      style={{
        transition: "height 0.6s ease-in-out, opacity 0.5s ease-in-out", 
        overflow: "hidden" 
      }}
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
