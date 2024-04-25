import React from 'react'

const FilterDropdown = ({ currentFilter, setFilter }) => {
  const filters = ['all', 'read', 'unread']

  return (
    <div className="tickets-filter-expanded">
      {filters.map((filter) => (
        <p
          className={`my-2 ms-2 ${filter === currentFilter ? 'active' : ''}`}
          key={filter}
          onClick={() => setFilter(filter)}
        >
          {filter.toUpperCase()}
        </p>
      ))}
    </div>
  )
}

export default FilterDropdown
