import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './index.css'

const TermAndCondition = (props) => {
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put('/users/TnCAgreed')
      .then((response) => {
        if (response.data.success) {
          toast.success('Terms and condition successfully accepted.')
          props.onHide()
          setTimeout(() => {
            setLoading(false)
          }, [2000])
        }
      })
      .catch(() => {
        setLoading(false)
        return toast.success('Something went wrong, please try again!')
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='TnC-modal'
      className='TnC_modal_dialog'
    >
      <Modal.Body className='py-xs-2 py-sm-5 tnc_modal-body'>
        <>
          <div className='mt-4 mb-4 px-lg-5 text-start'></div>
          <div className='text-center px-lg-5 d-flex flex-column align-items-center'>
            <div className='mb-3 d-flex justify-content-center'>
              <input
                className='me-2'
                type='checkbox'
                value={clicked}
                onChange={() => setClicked(!clicked)}
                id='flexCheckDefault'
              />
              <label className='my-auto' for='flexCheckDefault'>
                By accepting, you agree to the platform
                <a
                  onClick={() => window.open('/terms', '_blank')}
                  className='public-page-terms-link-modal ms-1 cursor-pointer'
                  rel='noreferrer'
                >
                  Terms and Conditions
                </a>
                .
              </label>
            </div>
            <button
              disabled={!clicked || loading}
              className='edit-account'
              onClick={() => {
                handleSubmit()
              }}
            >
              {!loading ? 'Accept' : 'Saving...'}
            </button>
          </div>
        </>
        {/* )} */}
      </Modal.Body>
    </Modal>
  )
}

export default TermAndCondition
