import React from 'react'

const SidebarItem = ({ item, onItemClick }) => {
  return (
    <div className="sidebar-item" onClick={() => onItemClick(item.id)}>
      {item.name}
    </div>
  )
}

export default SidebarItem
