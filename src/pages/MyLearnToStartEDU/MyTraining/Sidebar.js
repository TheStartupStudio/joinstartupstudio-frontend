import React from 'react'
import SidebarItem from './SidebarItem'

const Sidebar = ({ items, onItemClick }) => {
  return (
    <div className="sidebar">
      {items.map((item) => (
        <SidebarItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  )
}

export default Sidebar
