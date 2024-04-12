import React from 'react'
import searchIcon from '../../../assets/images/search-icon.png'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

const OccupationSidebar = React.memo(
  ({ searchQuery, handleSearchInputChange, filteredOccupationGroups }) => {
    return (
      <div className="page-card__sidebar col-lg-4 col-md-5">
        <div className="page-card__sidebar-header">
          <label className="search-input">
            <img className="search-input__icon" src={searchIcon} alt="#" />
            <FormattedMessage
              id="pathways.search_occupation"
              defaultMessage="pathways.search_occupation"
            >
              {(placeholder) => (
                <input
                  type="text"
                  className="search-input__input"
                  autoFocus="autoFocus"
                  name="searchedNote"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              )}
            </FormattedMessage>
          </label>
        </div>

        <div className="page-card__sidebar-content styled-scrollbar">
          <div className={`accordion-menu__item`}>
            {filteredOccupationGroups.map((occupation) => (
              <NavLink
                key={occupation.id}
                to={`/pathways/${occupation.id}`}
                className="accordion-menu__item-toggle cursor-pointer"
                activeClassName="active"
              >
                <span>{occupation.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export default OccupationSidebar
