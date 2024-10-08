import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../index.css'
import { label } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'
import { getPeriodsStart } from '../../../redux/dashboard/Actions'

const AddIndividual = (props) => {
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const [yearOptions, setYearOptions] = useState([])
  const [periodOptions, setPeriodOptions] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [dataValidation, setDataValidation] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    levels: [],
    year: '',
    period: null
  })
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    dispatch(getPeriodsStart())
  }, [])

  const defaultData = [
    {
      name: 'level',
      value: 'LS',
      label: 'LS',
      year: ['K', '1st', '2nd', '3rd', '4th', '5th']
    },
    {
      name: 'level',
      value: 'MS',
      label: 'MS',
      year: ['ES1', 'ES2', 'ES3'],
      period: periods
        ?.filter(
          (item) =>
            item.name === 'Period 1' ||
            item.name === 'Period 2' ||
            item.name === 'Period 3' ||
            item.name === 'Period 4' ||
            item.name === 'Period 5' ||
            item.name === 'Period 6' ||
            item.name === 'Period 7'
        )
        .map((item) => item.name)
    },
    {
      name: 'level',
      value: 'HS',
      label: 'HS',
      year: ['LTS1', 'LTS2', 'LTS3', 'LTS4'],
      period: periods?.map((item) => item.name)
    },
    { name: 'level', value: 'HE', label: 'HE' }
  ]

  useEffect(() => {
    const getOptions = (value, prop) => {
      const item = defaultData.find((item) => item.value === value)
      const elements = item ? item[prop] : []

      if (prop === 'period') {
        const periodIds = elements?.map(
          (el) => periods.find((period) => period.name === el)?.id
        )

        return elements?.map((el, index) => ({
          name: prop,
          value: periodIds[index],
          label: el
        }))
      }
      return elements?.map((el) => ({
        name: prop,
        value: el,
        label: el
      }))
    }
    const yearOptions = getOptions(dataValidation.levels[0], 'year')
    const periodOptions = getOptions(dataValidation.levels[0], 'period')
    setYearOptions(yearOptions)
    setPeriodOptions(periodOptions)
  }, [dataValidation.levels])

  const handleValidation = (e) => {
    const { name, value } = e

    setDataValidation((old) => ({ ...old, [name]: value }))

    if (
      dataValidation.firstname.length === 0 &&
      dataValidation.lastname.length === 0 &&
      dataValidation.email.length === 0 &&
      dataValidation.password.length === 0 &&
      dataValidation.levels.length === 0 &&
      dataValidation.year.length === 0 &&
      dataValidation.period === null
    ) {
      return setIsChanged(false)
    }

    if (name === 'levels') {
      setDataValidation((old) => ({
        ...old,
        year: '',
        period: null
      }))
      setSelectedYear(null)
      setSelectedPeriod(null)
    }

    setIsChanged(true)
  }

  const customStyles = {
    // control: styles => ({ ...styles,fontSize:'13px' }),
    option: (provided, state) => ({
      ...provided
    })
  }

  return (
    <div className='row mx-0 px-0 mt-2 pb-4 pb-md-0 add-individual-first-div'>
      <div
        className={`col-6 col-md-2 mx-0 ps-0 pe-1 add-individual-inputs-div`}
      >
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.firstname.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type='text'
          name='firstname'
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
            dataValidation.lastname.length === 0 &&
            isChanged &&
            'border border-danger'
          }`}
          type='text'
          name='lastname'
          placeholder='Last Name'
          onChange={(e) => {
            handleValidation({ name: e.target.name, value: e.target.value })
            props.handleChange({ name: e.target.name, value: e.target.value })
          }}
        />
      </div>
      <div className='col-12 col-md-3 mb-2 mb-md-auto mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <input
          className={`w-100 py-2 px-2 ${
            dataValidation.email.length === 0 && isChanged
              ? 'border border-danger'
              : 'false'
          }`}
          type='email'
          name='email'
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
      <div className='col-6 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          placeholder={'Level'}
          options={defaultData}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.levels.length === 0 && isChanged
              ? 'border border-danger rounded'
              : 'false'
          }`}
          styles={{
            ...customStyles,
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px'
            })
          }}
          name='levels'
          // onChange={(e) => {
          //   handleValidation(e)
          //   props.handleChange(e)
          // }}
          onChange={(selectedOption) => {
            handleValidation({ name: 'levels', value: [selectedOption.value] })
            props.handleChange({
              name: 'levels',
              value: [selectedOption.value]
            })
          }}
        />
      </div>
      <div className='col-6 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          options={yearOptions}
          name='year'
          placeholder={selectedYear ? selectedYear : 'Year'}
          value={selectedYear ? selectedYear : 'None'}
          isDisabled={dataValidation.levels.includes('HE')}
          styles={{
            ...customStyles,
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px'
            })
          }}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.year.length === 0 &&
            isChanged &&
            !dataValidation.levels.includes('HE')
              ? 'border border-danger rounded'
              : 'false'
          }`}
          onChange={(e) => {
            handleValidation(e)
            setSelectedYear(e.value)
            props.handleChange(e)
          }}
        />
      </div>
      <div className='col-7 col-md-1 mx-0 ps-0 pe-1 add-individual-inputs-div'>
        <Select
          options={periodOptions}
          placeholder={
            periods?.find((period) => period.id === selectedPeriod)?.name
          }
          value={periods?.find((period) => period.id === selectedPeriod)?.name}
          isDisabled={
            dataValidation.levels.includes('LS') ||
            dataValidation.levels.includes('HE')
          }
          name='period'
          styles={{
            ...customStyles,
            control: (styles) => ({
              ...styles,
              padding: '1px 2px',
              fontSize: '13px'
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              fontSize: '13px'
            })
          }}
          className={`my-auto py-auto h-100 add-student-select ${
            dataValidation.period === null &&
            isChanged &&
            !dataValidation.levels.includes('LS') &&
            !dataValidation.levels.includes('HE')
              ? 'border border-danger rounded'
              : 'false'
          }`}
          onChange={(e) => {
            handleValidation(e)
            setSelectedPeriod(e.value)
            props.handleChange(e)
          }}
        />
      </div>
    </div>
  )
}

export default AddIndividual
