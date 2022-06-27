import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../index.css'

const AddIndividual = (props) => {
  const [dataValidation, setDataValidation] = useState({
    name: '',
    lastName: '',
    UserEmail: '',
    password: '',
    level: '',
    year: ''
  })
  const [isChanged, setIsChanged] = useState(false)

  const YEAR = [
    { name: 'year', value: 'LTS1', label: 'LTS YEAR 1' },
    { name: 'year', value: 'LTS2', label: 'LTS YEAR 2' },
    { name: 'year', value: 'LTS3', label: 'LTS YEAR 3' },
    { name: 'year', value: 'LTS4', label: 'LTS YEAR 4' }
  ]

  const Level = [
    { name: 'level', value: 'L1', label: 'L1 (ES)' },
    { name: 'level', value: 'L2', label: 'L2 (MS)' },
    { name: 'level', value: 'L3', label: 'L3 (HS)' },
    { name: 'level', value: 'L4', label: 'L4 (ADUL)' }
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
  }

  const handleValidation = (e) => {
    const { name, value } = e

    // console.log(
    //   dataValidation.name.length,
    //   dataValidation.lastName.length,
    //   dataValidation.UserEmail.length,
    //   dataValidation.password.length,
    //   dataValidation.level.length,
    //   dataValidation.year.length
    // )

    setDataValidation((old) => ({ ...old, [name]: value }))
    if (
      dataValidation.name.length === 0 &&
      dataValidation.name === '' &&
      dataValidation.lastName.length === 0 &&
      dataValidation.lastName === '' &&
      dataValidation.UserEmail.length === 0 &&
      dataValidation.UserEmail === '' &&
      dataValidation.password.length === 0 &&
      dataValidation.password === '' &&
      dataValidation.level.length === 0 &&
      dataValidation.level === '' &&
      dataValidation.year === '' &&
      dataValidation.year.length === 0
    ) {
      return setIsChanged(false)
    }
    setIsChanged(true)
  }

  return (
    <div className='row mx-0 px-0 mt-2 pb-4 pb-md-0 add-individual-first-div'>
      <div
        className={`col-6 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div`}
      >
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.name.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type='text'
          name='name'
          placeholder='First Name'
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className='col-6 mb-2 mb-md-auto col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.lastName.length === 0 &&
            isChanged &&
            'border border-danger'
          }`}
          type='text'
          name='lastName'
          placeholder='Last Name'
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className='col-12 col-md-2 mb-2 mb-md-auto mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.UserEmail.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type='email'
          name='UserEmail'
          autoComplete='false'
          placeholder='Email'
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className='col-12 col-md-2 mb-2 mb-md-auto mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className={`w-100 mx-0 py-2 px-2 ${
            dataValidation.password.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          autoComplete='off'
          type='password'
          name='password'
          placeholder='Password'
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className='col-6 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          placeholder={'Level'}
          options={Level}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.level.length === 0 && isChanged
              ? 'border border-danger rounded'
              : 'false'
          }`}
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 })
          }}
          name='level'
          onChange={(e) => {
            handleValidation(e)
            props.handleChange(e)
          }}
        />
      </div>
      <div className='col-6 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          placeholder={'Year'}
          options={YEAR}
          name='year'
          styles={{
            ...customStyles,
            menu: (provided) => ({ ...provided, zIndex: 9999 })
          }}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.year.length === 0 && isChanged
              ? 'border border-danger rounded'
              : 'false'
          }`}
          // styles={}
          onChange={(e) => {
            handleValidation(e)
            props.handleChange(e)
          }}
        />
      </div>
    </div>
  )
}

export default AddIndividual
