import React from 'react'
import Select, { components } from 'react-select'
import createClass from 'create-react-class'
import { AddSchoolButton, SchoolFilter, SearchBar } from './TableItems'

const dropDownStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    border: '1px solid #BBBDBF',
    borderRadius: '0',
    height: 15,
    fontSize: '14px',
    cursor: 'pointer',
    color: '#707070',
    fontWeight: '500',
    padding: '2px 2px',
    ':hover': {
      border: '1px solid #BBBDBF'
    },
    zIndex: 100
  }),
  menu: (base) => ({
    ...base,
    border: 'none',
    fontSize: '10px',
    cursor: 'pointer',
    // width: '150%',
    margin: 0,
    paddingTop: 0,
    boxShadow: '0px 3px 6px #00000029',
    zIndex: 9999
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  valueContainer: (base) => ({
    ...base
  }),
  option: (styles, state) => ({
    ...styles,
    cursor: 'pointer',
    fontWeight: 600,
    color: '231F20',
    fontSize: '14px',
    paddingTop: '2px',
    paddingBottom: '2px',
    ':hover': {
      backgroundColor: 'white',
      background: 'white'
    },
    backgroundColor: 'white',
    textTransform: 'uppercase'
  })
}
const TableHead = (props) => {
  const updateSelectedOptions = (data) => {
    if (props.selectedOptions.includes(data.value)) {
      props.setSelectedOptions(
        props.selectedOptions.filter((option) => option !== data.value)
      )
    } else {
      props.setSelectedOptions([...props.selectedOptions, data.value])
    }
  }
  const MultiValue = (props) => {
    return (
      <components.MultiValue {...props}>
        <span>{props.data.label}</span>
      </components.MultiValue>
    )
  }
  const Option = createClass({
    render() {
      return (
        <div>
          <components.Option {...this.props}>
            <div
              className="d-flex align-items-center"
              onClick={() => updateSelectedOptions(this.props.data)}
            >
              <input
                style={{ cursor: 'pointer', borderRadius: '0' }}
                type="checkbox"
                checked={props.selectedOptions.includes(this.props.data.value)}
                onChange={(e) => e}
              />{' '}
              <label
                style={{ cursor: 'pointer', paddingTop: '2px' }}
                className="my-auto ms-2"
              >
                {this.props.value}
              </label>
            </div>
          </components.Option>
        </div>
      )
    }
  })

  const handleSearch = (keyword) => {
    if (keyword.length > 2) {
      props.setIsSearching(true)
      props.setSearchingKeyword(keyword)
    } else {
      props.setSearchingKeyword('')
      props.setIsSearching(false)
    }
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-6">
            <SchoolFilter
              showSchoolsOption={props.showSchoolsOption}
              setShowSchoolsOption={props.setShowSchoolsOption}
              isSearching={props.isSearching}
              schools={props.schools}
              filteringCondition={props.filteringCondition}
            />
          </div>
          <AddSchoolButton setAddSchoolModal={props.setAddSchoolModal} />
        </div>
      </div>
      <div className="col-12">
        <div className="row justify-content-between">
          <SearchBar handleSearch={handleSearch} />
          <div className="col-12 col-xxl-5 col-lg-5 col-md-7">
            <div className="row h-100 me-0 align-items-end justify-content-end">
              <div className="col-12 col-sm-5 col-xxl-5 col-lg-6 col-md-6 mt-2 me-0 pe-0">
                <Select
                  options={[
                    { label: 'level', value: 'level' },
                    { label: 'teachers', value: 'teachers' },
                    { label: 'code', value: 'code' },
                    { label: 'domain', value: 'domain' }
                  ]}
                  placeholder={'Show Columns'}
                  defaultValue={[
                    { label: 'level', value: 'level' },
                    { label: 'teachers', value: 'teachers' }
                  ]}
                  value={null}
                  className="mb-0 custom-dropdown"
                  styles={dropDownStyles}
                  autoFocus={false}
                  isSearchable={false}
                  isMulti={true}
                  closeMenuOnSelect={false}
                  components={{ Option, MultiValue }}
                  hideSelectedOptions={false}
                  isClearable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableHead
