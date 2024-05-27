import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const FilterDropdown = ({
  currentFilter,
  filterExpanded,
  setFilterExpanded,
  setFilter,
  dropdownRef
}) => {
  const filters = ['all', 'read', 'unread']

  return (
    <div
      className="tickets-filter col-12 col-sm-3 me-sm-2 justify-content-center d-flex align-items-center"
      onClick={setFilterExpanded}
      ref={dropdownRef}
    >
      <FontAwesomeIcon
        icon={faFilter}
        style={{
          color: '#707070',
          fontSize: '22px',
          marginRight: '5px'
        }}
      />
      <p className="m-0">{currentFilter ?? 'FILTER'}</p>
      {filterExpanded && (
        <div className="tickets-filter-expanded">
          {filters.map((filter) => (
            <p
              className={`my-2 ms-2 ${
                filter === currentFilter ? 'active' : ''
              }`}
              key={filter}
              onClick={() => setFilter(filter)}
            >
              {filter.toUpperCase()}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
