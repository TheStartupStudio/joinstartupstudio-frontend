import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../index.css'

const AddIndividual = (props) => {
  const [dataValidation, setDataValidation] = useState({
    FirstName: '',
    LastName: '',
    UserEmail: '',
    password: '',
    level: '',
    year: ''
  })
  const [isChanged, setIsChanged] = useState(false)

  const YEAR = [
    { name: 'year', value: 'LTS1', label: 'LTS1' },
    { name: 'year', value: 'LTS2', label: 'LTS2' },
    { name: 'year', value: 'LTS3', label: 'LTS3' },
    { name: 'year', value: 'LTS4', label: 'LTS4' }
  ]

  const Level = [
    { name: 'level', value: 'LS', label: 'LS' },
    { name: 'level', value: 'MS', label: 'MS' },
    { name: 'level', value: 'HS', label: 'HS' },
    { name: 'level', value: 'HE', label: 'HE' }
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
  }

  const handleValidation = (e) => {
    const { name, value } = e

    setDataValidation((old) => ({ ...old, [name]: value }))
    if (
      dataValidation.FirstName.length === 0 &&
      dataValidation.FirstName === '' &&
      dataValidation.LastName.length === 0 &&
      dataValidation.LastName === '' &&
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
            dataValidation.FirstName.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type='text'
          name='FirstName'
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
            dataValidation.LastName.length === 0 &&
            isChanged &&
            'border border-danger'
          }`}
          type='text'
          name='LastName'
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
