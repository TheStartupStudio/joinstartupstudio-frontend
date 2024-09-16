import React, { useEffect, useState } from 'react'
import { Col, Modal } from 'react-bootstrap'
import '../../MyStudents/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { getPeriodsStart } from '../../../redux/dashboard/Actions'
import { CustomDropdown } from './ContentItems'
import IntlMessages from '../../../utils/IntlMessages'

const EditBulkModal = (props) => {
  const [toggle, setToggle] = useState(0)
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const [yearOptions, setYearOptions] = useState([])
  const [periodOptions, setPeriodOptions] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [data, setData] = useState()

  useEffect(() => {
    dispatch(getPeriodsStart())
  }, [dispatch])

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
      period_id: periods
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
      period_id: periods?.map((item) => item.name)
    },
    { name: 'level', value: 'HE', label: 'HE' }
  ]

  useEffect(() => {
    const getOptions = (value, prop) => {
      const item = defaultData.find((item) => item.value === value)
      const elements = item ? item[prop] : []

      if (prop === 'period_id') {
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
    const allYearOptions = data?.levels
      ?.flatMap((level) => getOptions(level, 'year'))
      .filter(Boolean)

    const allPeriodOptions = data?.levels
      ?.flatMap((level) => getOptions(level, 'period_id'))
      .filter(Boolean)

    setYearOptions(allYearOptions)
    setPeriodOptions(allPeriodOptions)
  }, [data?.levels])

  const handleChangeDropdown = (selectedOptions, name) => {
    setData((prevState) => ({
      ...prevState,
      [name]: selectedOptions.map((option) => option.name)
    }))
  }

  const updateData = (e) => {
    const { name, value } = e

    setData((old) => ({ ...old, [name]: value }))

    if (name === 'level') {
      setData((old) => ({
        ...old,
        year: '',
        period_id: null
      }))
      setSelectedYear(null)
      setSelectedPeriod(null)
    }
  }

  return (
    <Modal
      show={props.show}
      className={'Add-Student-Modal mb-5 pb-5'}
      onHide={() => {
        props.onHide()
      }}
      style={{ marginTop: '3.9%' }}
    >
      <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 pb-2'>BULK EDIT STUDENTS</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='row mx-0'>
          <p className='w-100 bulk-edit-description'>
            Change settings below to update all selected users.
          </p>
          <div className='bulk-edit-options row pe-0'>
            <Col md='4'>
              <CustomDropdown
                isSelectable
                multiple
                btnClassName={'gray-border'}
                options={props.levels}
                onClick={(selectedOptions) =>
                  handleChangeDropdown(selectedOptions, 'levels')
                }
              />
            </Col>
            <Col md='4'>
              <CustomDropdown
                btnClassName={'gray-border'}
                options={yearOptions?.map((item) => ({
                  name: item.value,
                  value: item.value
                }))}
                onClick={(selectedOptions) => updateData(selectedOptions)}
              />
            </Col>
            <Col md='4'>
              <CustomDropdown
                btnClassName={'gray-border'}
                options={periodOptions?.map((item) => ({
                  name: item.label,
                  value: item.label
                }))}
                onClick={(selectedOptions) => updateData(selectedOptions)}
              />
            </Col>
            <div className=' col-12 col-md-6 col-lg-3 ms-auto my-auto blunk-activated-div d-flex mt-2'>
              <p className='my-auto'>Activated </p>
              <label className='px-0 ps-sm-1 ps-md-1 form-switch my-auto d-flex w-100'>
                <input
                  type='checkbox'
                  checked={toggle}
                  onChange={() => {
                    if (toggle) {
                      const newData = { ...data }
                      delete newData.activated
                      setData(newData)
                      setToggle(!toggle)
                    } else {
                      updateData({ name: 'activated', value: !toggle })
                      setToggle(!toggle)
                    }
                  }}
                />
                <i className='ms-auto'></i>
              </label>
            </div>
          </div>
        </div>
      </Modal.Body>
      <div className='border-0 py-0 my-0 mb-2 position-relative'>
        <div className='me-md-4 p-0 mb-3'>
          <div className=''>
            <button
              className='float-end edit-account me-0'
              disabled={props.loading || !data}
              onClick={() => props.onSave(data)}
            >
              {props.loading ? (
                <IntlMessages id='general.loading' />
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EditBulkModal
