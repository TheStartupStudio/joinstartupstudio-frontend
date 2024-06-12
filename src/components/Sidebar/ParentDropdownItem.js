const ParentDropdownItem = ({ children, id }) => {
  return (
    <div className="collapse" id={id} data-parent="#side-menu-main">
      {children}
    </div>
  )
}

export default ParentDropdownItem
