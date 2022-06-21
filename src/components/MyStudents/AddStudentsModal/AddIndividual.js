import React from 'react'
import Select from 'react-select'
import '../index.css'

const AddIndividual = () => {
  const level = ['E1', 'E2', 'E3']

  const options = [
    { value: 'LT1', label: 'LTS YEAR 1' },
    { value: 'LT2', label: 'LTS YEAR 2' },
    { value: 'vanilla', label: 'LTS YEAR 3' },
    { value: 'vanilla', label: 'LTS YEAR 4' }
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      minHeight: '150%'
    })
  }

  return (
    <div className='row mx-0 px-0 mt-2'>
      <div className='col-5 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className='w-100 py-2 px-2'
          type='text'
          name='name'
          placeholder='First Name'
          // value={}
          // onChange={handleChange}
        />
      </div>
      <div className='col-5 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className='w-100 py-2 px-2'
          type='text'
          name='name'
          placeholder='First Name'
          // value={}
          // onChange={handleChange}
        />
      </div>
      <div className='col-12 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className='w-100 py-2 px-2'
          type='text'
          name='name'
          placeholder='First Name'
          // value={}
          // onChange={handleChange}
        />
      </div>
      <div className='col-12 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className='w-100 mx-0 py-2 px-2'
          type='text'
          name='name'
          placeholder='First Name'
          // value={}
          // onChange={handleChange}
        />
      </div>
      <div className='col-5 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          options={options}
          className='my-auto py-auto h-100 add-student-select'
        />
      </div>
      <div className='col-5 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          options={options}
          className='my-auto py-auto h-100 add-student-select'
          styles={customStyles}
        />
      </div>
    </div>
  )
}

export default AddIndividual
