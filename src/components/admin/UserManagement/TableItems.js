import React from 'react'
import './style.css'
import searchIcon from '../../../assets/images/search-icon.png'
import Select from 'react-select'

const customStyles = {
  table: {
    style: {
      margin: '10px 0px',
      borderRadius: '5px',
      border: '1px solid #e0e0e0'
    }
  },
  rows: {
    style: {
      minHeight: '100px'
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      color: '#231F20'
    }
  }
}

const AddSchoolButton = ({ setAddSchoolModal }) => (
  <div className="col-12 col-md-6 mt-2 mt-md-0 text-end setAddStudents d-flex justify-content-md-end justify-content-start align-items-end">
    <p
      className="p-0 m-0"
      role="button"
      onClick={() => setAddSchoolModal(true)}
    >
      Add School
    </p>
  </div>
)

const SchoolFilter = ({
  showSchoolsOption,
  setShowSchoolsOption,
  isSearching,
  schools,
  filteringCondition
}) => (
  <div className="d-flex flex-row switch_students_options align-items-end h-100">
    {['all', 'active', 'inactive'].map((option) => (
      <React.Fragment key={option}>
        <div
          className={showSchoolsOption !== option ? 'not_active' : ''}
          onClick={() => setShowSchoolsOption(option)}
        >
          <p>
            {option.toUpperCase()}
            <span style={{ color: '#333d3d83' }}>
              (
              {!isSearching
                ? schools.length
                : schools.filter((school) => filteringCondition(school)).length}
              )
            </span>
          </p>
        </div>
        {option !== 'inactive' && <div className="div mx-1">|</div>}
      </React.Fragment>
    ))}
  </div>
)

const SearchBar = ({ handleSearch }) => (
  <div className="col-12 col-md-5 mt-2">
    <div className="connections-search" style={{ height: '48px' }}>
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
          placeholder="SEARCH USERS"
          aria-describedby="button-addon1"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  </div>
)

const EditSchoolForm = ({
  currentEditingSchool,
  setCurrentEditingSchool,
  handleChange
}) => (
  <div className="d-flex flex-column justify-content-start">
    <input
      type="text"
      className="w-75 px-2 py-1"
      style={{ border: '1px solid #BBBDBF', height: '35px' }}
      name="name"
      value={currentEditingSchool?.name}
      onChange={handleChange}
    />
    <button
      className="edit-btn m-0 mt-1 p-0"
      onClick={() => setCurrentEditingSchool()}
    >
      Cancel
    </button>
  </div>
)

const noDataComponent = ({ isSearching }) => (
  <div className="no-data-component text-center">
    {isSearching
      ? 'You do not have any school with this information.'
      : "You don't have any schools yet."}
  </div>
)

export {
  AddSchoolButton,
  SchoolFilter,
  SearchBar,
  EditSchoolForm,
  noDataComponent,
  customStyles
}
