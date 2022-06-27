import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import IntlMessages from '../../../utils/IntlMessages'
import '../index.css'
const EditBlunk = (props) => {
  const [toggle, setToggle] = useState(0)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})

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

  const updateData = (e) => {
    const { name, value } = e
    setData((old) => ({ ...old, [name]: value }))
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
  }
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <Modal
      show={props.show}
      className={'Add-Student-Modal mb-5 pb-5'}
      onHide={() => {
        props.onHide()
      }}
      style={{ marginTop: '3.9%' }}
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
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
          <p className='w-100 bluk-edit-description'>
            Change settings below to update all selected users.
          </p>
          <div className='bulk-edit-options row'>
            <Select
              placeholder={'Level'}
              options={Level}
              className={`my-auto py-auto add-student-select col-12 col-md-6 col-lg-3 mt-2 px-0 px-md-2`}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  //   minHeight: '48px',
                  zIndex: 9999
                })
              }}
              name='level'
              onChange={(e) => {
                updateData(e)
              }}
            />
            <Select
              placeholder={'Year'}
              options={YEAR}
              name='year'
              styles={{
                ...customStyles,
                menu: (provided) => ({
                  ...provided,
                  //   height: '48px',
                  zIndex: 9999
                })
              }}
              className={`my-auto py-auto add-student-select col-12 col-md-6 col-lg-3 mt-2 px-0 px-md-auto`}
              // styles={}
              onChange={(e) => {
                updateData(e)
                // props.handleChange(e)
              }}
            />
            <div className=' col-12 col-md-6 col-lg-3 ms-auto my-auto blunk-activated-div d-flex mt-2'>
              <p className='my-auto'>Activated </p>
              <label className='px-0 ps-sm-1 ps-md-1 form-switch my-auto d-flex w-100'>
                <input
                  type='checkbox'
                  checked={toggle}
                  onChange={(e) => {
                    if (toggle) {
                      updateData({ name: 'active', value: !toggle })
                      setToggle(!toggle)
                    } else {
                      updateData({ name: 'active', value: !toggle })
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
              disabled={props.loading}
              onClick={() => props.onSave()}
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

export default EditBlunk
