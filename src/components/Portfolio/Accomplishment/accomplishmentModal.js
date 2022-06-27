import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import defaultImage from '../../../assets/images/profile-image.png'
import { toast } from 'react-toastify'
import DeleteDialogModal from '../BackgroundModals/deleteDialogModal'
import DeleteConfirmedModal from '../BackgroundModals/deleteConfirmedModal'
import { monthYearOnly } from '../../../utils/helpers'

export const AccomplishmentModal = (props) => {
  const defaultAccompData = {
    type: 'accomplishments',
    title: '',
    company: '',
    date_issued: '',
    description: ''
  }

  const [accompData, setAccompData] = useState(defaultAccompData)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteDialogModal, setShowDeleteDialogModal] = useState(false)
  const [showDeleteConfirmedModal, setShowDeleteConfirmedModal] =
    useState(false)

  useEffect(() => {
    if (props.currentAccomp.length === 0) return
    setAccompData(props.currentAccomp)
    setIsUpdating(true)
  }, [props.currentAccomp])

  const handleChange = (event) => {
    const { name, value } = event.target

    setAccompData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const addAccomplishment = async () => {
    setLoading(true)
    const newAccomp = accompData
    for (var key in accompData) {
      if (accompData[key] === null || accompData[key] == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }
    }

    if (!newAccomp.end_date) newAccomp.end_date = null

    await axiosInstance
      .post(`/userBackground`, newAccomp)
      .then((res) => {
        setLoading(false)
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        props.addAccomp(res.data)
        props.onHide()
        setAccompData(defaultAccompData)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const updateAccomplishment = async () => {
    setLoading(true)
    const newAccomp = accompData

    for (var key in defaultAccompData) {
      if (accompData[key] === null || accompData[key] == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }
    }

    await axiosInstance
      .put(`/userBackground/${newAccomp.id}`, newAccomp)
      .then((res) => {
        setLoading(false)
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        props.updateAccomp(newAccomp)
        props.onHide()
        setAccompData(defaultAccompData)
        setIsUpdating(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const deleteBackground = async () => {
    setDeleteLoading(true)
    await axiosInstance
      .delete(`/userBackground/${accompData.id}`)
      .then((res) => {
        setDeleteLoading(false)
        // toast.success(<IntlMessages id='alert.my_account.success_change' />)
        // props.updateExperience(newExperience)
        props.onHide()
        props.deleteBackground(accompData.id)
        setShowDeleteDialogModal(false)
        setShowDeleteConfirmedModal(true)
        setAccompData(defaultAccompData)
        setIsUpdating(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
        props.onHide()
        setShowDeleteDialogModal(false)
        setShowDeleteConfirmedModal(false)
        setAccompData(defaultAccompData)
        setIsUpdating(false)
      })
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        className='edit-modal edit-profile-modal edit-experience-modal'
      >
        <Modal.Header className='pb-0 mx-4 general-modal-header'>
          <h3 className='mt-4 mb-0 contact-bio'>
            {!isUpdating ? 'ADD NEW ACCOMPLISHMENT' : 'EDIT ACCOMPLISHMENT '}
          </h3>
          <button
            type='button'
            className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setAccompData(defaultAccompData)
              setIsUpdating(false)
            }}
          />
        </Modal.Header>
        <Modal.Body className='px-4'>
          <div className='row'>
            <div className='col-12'>
              <h4>ACCOMPLISHMENT DETAILS</h4>
            </div>

            <div className='col-12'>
              <input
                className='my-2'
                type='text'
                name='title'
                value={accompData?.title}
                onChange={handleChange}
                placeholder='Title (Example: Social Media Marketing Achievement Award)'
              />
              <input
                className='my-2'
                type='text'
                name='company'
                value={accompData?.company}
                onChange={handleChange}
                placeholder='Issuer (Example: ASSMD)'
              />
              <div className='row mt-2'>
                <div className='col-12 col-lg-4'>
                  <label htmlFor='start_date'>Date Issued</label>
                  <input
                    className='my-2'
                    type='month'
                    name='date_issued'
                    id='start_date'
                    value={monthYearOnly(accompData?.date_issued)}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className='col-12'>
              <textarea
                className='mt-2'
                type='text'
                name='description'
                placeholder='Description'
                value={accompData?.description}
                onChange={handleChange}
              />
            </div>

            <div className='row mx-0'>
              <div className='col-6 p-0'>
                {isUpdating && (
                  <button
                    className='float-start edit-account mt-4'
                    style={{ background: '#BBBDBF' }}
                    disabled={loading}
                    onClick={() => {
                      props.onHide()
                      setShowDeleteDialogModal(true)
                    }}
                  >
                    DELETE
                  </button>
                )}
              </div>
              <div className='col-6 p-0'>
                <button
                  className='float-end edit-account mt-4'
                  disabled={loading}
                  onClick={() =>
                    !isUpdating ? addAccomplishment() : updateAccomplishment()
                  }
                >
                  {loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'SAVE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DeleteDialogModal
        show={showDeleteDialogModal}
        onHide={() => {
          setShowDeleteDialogModal(false)
        }}
        deleteBackground={() => deleteBackground()}
        type={'accomplishment'}
        deleteLoading={deleteLoading}
      />
      <DeleteConfirmedModal
        show={showDeleteConfirmedModal}
        onHide={() => {
          setShowDeleteConfirmedModal(false)
        }}
        type={'accomplishment'}
      />
    </>
  )
}
