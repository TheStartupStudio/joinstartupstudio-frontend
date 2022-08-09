import React from 'react'
import searchIcon from '../../assets/images/search-icon.png'
import Select, { components } from 'react-select'

const Header = (props) => {
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: '#023950',
      // Overwrittes the different states of border
      borderColor: state.isFocused ? 'yellow' : 'green',
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      '&:hover': {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? 'red' : 'blue'
      }
    })
  }

  return (
    <div className='w-100 row'>
      <div className='col-12 col-md-6'>
        <h3 className='page-title-inner'>STUDENT JOURNAL VIEW</h3>
        <span className='title-description'>View your student journals.</span>
      </div>
      <div className='col-12 col-md-6 ps-4'>
        <div className='user-info'>
          <img
            className='rounded-circle user-image'
            src={props?.user?.profile_image}
            alt={props?.user?.profile_image}
          />
          <span className='user-name ps-2'>{props?.user?.name}</span>
        </div>

        <Select styles={customStyles} options={options} />
      </div>
    </div>
  )
}

export default Header
