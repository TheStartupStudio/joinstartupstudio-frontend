import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../index.css'
import { label } from 'aws-amplify'

const AddIndividual = (props) => {
  const [dataValidation, setDataValidation] = useState({
    FirstName: '',
    LastName: '',
    UserEmail: '',
    password: '',
    level: '',
    year: '',
    class: '',
  })
  const [isChanged, setIsChanged] = useState(false)

  const Level = [
    {
      name: 'level',
      value: 'LS',
      label: 'LS',
      year: ['K', '1st', '2nd', '3rd', '4th', '5th'],
    },
    {
      name: 'level',
      value: 'MS',
      label: 'MS',
      year: ['ES1', 'ES2', 'ES3'],
      class: [
        'ADVISORY',
        'PERIOD 1',
        'PERIOD 2',
        'PERIOD 3',
        'PERIOD 4',
        'PERIOD 5',
        'PERIOD 6',
        'PERIOD 7',
      ],
    },
    {
      name: 'level',
      value: 'HS',
      label: 'HS',
      year: ['LTS1', 'LTS2', 'LTS3', 'LTS4'],
      class: [
        'PERIOD 0',
        'PERIOD 1',
        'PERIOD 2',
        'PERIOD 3',
        'PERIOD 4',
        'PERIOD 4A',
        'PERIOD 4B',
        'PERIOD 4C',
        'PERIOD 5',
        'PERIOD 5A',
        'PERIOD 5B',
        'PERIOD 5C',
        'PERIOD 6',
        'PERIOD 7',
        'PERIOD 8',
      ],
    },
    { name: 'level', value: 'HE', label: 'HE' },
  ]

  const getOptions = (value, prop) => {
    const item = Level.find((item) => item.value === value)
    const elements = item ? item[prop] : []
    return elements?.map((el) => ({
      name: prop,
      value: el,
      label: el,
    }))
  }

  const yearOptions = getOptions(dataValidation.level, 'year')
  const classOptions = getOptions(dataValidation.level, 'class')

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
    }),
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
      dataValidation.year.length === 0 &&
      dataValidation.class === '' &&
      dataValidation.class.length === 0
    ) {
      return setIsChanged(false)
    }
    setIsChanged(true)

    if (name === 'level' && (value === 'LS' || value === 'HE')) {
      setDataValidation((old) => ({ ...old, year: '', class: '' }))
    }
  }

  return (
    <div className="row mx-0 px-0 mt-2 pb-4 pb-md-0 add-individual-first-div">
      <div
        className={`col-6 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div`}
      >
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.FirstName.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type="text"
          name="FirstName"
          placeholder="First Name"
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className="col-6 mb-2 mb-md-auto col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div">
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.LastName.length === 0 &&
            isChanged &&
            'border border-danger'
          }`}
          type="text"
          name="LastName"
          placeholder="Last Name"
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className="col-12 col-md-3 mb-2 mb-md-auto mx-0 ps-0 pe-1 add-individual-inputs-div">
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.UserEmail.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type="email"
          name="UserEmail"
          autoComplete="false"
          placeholder="Email"
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className="col-12 col-md-2 mb-2 mb-md-auto mx-0 ps-0 pe-1 add-individual-inputs-div">
        <input
          className={`w-100 mx-0 py-2 px-2 ${
            dataValidation.password.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          autoComplete="off"
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className="col-6 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div">
        <Select
          placeholder={'Level'}
          options={Level}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.level.length === 0 && isChanged
              ? 'border border-danger rounded'
              : 'false'
          }`}
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px',
            }),
          }}
          name="level"
          onChange={(e) => {
            handleValidation(e)
            props.handleChange(e)
          }}
        />
      </div>
      <div className="col-6 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div">
        <Select
          placeholder={'Year'}
          options={yearOptions}
          name="year"
          isDisabled={dataValidation.level === 'HE'}
          styles={{
            ...customStyles,
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px',
            }),
          }}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.year.length === 0 && isChanged
              ? 'border border-danger rounded'
              : 'false'
          }`}
          onChange={(e) => {
            handleValidation(e)
            props.handleChange(e)
          }}
        />
      </div>
      <div className="col-6 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div">
        <Select
          placeholder={'Class'}
          options={classOptions}
          isDisabled={
            dataValidation.level === 'LS' || dataValidation.level === 'HE'
          }
          name="class"
          styles={{
            ...customStyles,
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px',
            }),
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
