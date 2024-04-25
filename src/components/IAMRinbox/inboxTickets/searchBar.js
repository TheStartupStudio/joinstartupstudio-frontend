import React from 'react'
import searchIcon from '../../../assets/images/search-icon.png'

const SearchBar = ({ handleChange }) => {
  return (
    <div
      className="connections-search col-12 col-sm-8 col-lg-6 mt-2 mt-sm-0"
      style={{ height: '48px' }}
    >
      <div className="input-group h-100">
        <div className="input-group-prepend my-auto">
          <button
            className="btn btn-outline-secondary my-2 ms-2"
            type="button"
            id="button-addon1"
          >
            <img src={searchIcon} alt="#" width="90%" />
          </button>
        </div>

        <input
          type="text"
          className="form-control"
          name="searchedNote"
          placeholder={'SEARCH USERS'}
          aria-describedby="button-addon1"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default SearchBar
