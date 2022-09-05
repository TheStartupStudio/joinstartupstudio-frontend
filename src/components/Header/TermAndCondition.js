import React, { useState } from 'react'
import { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import './index.css'
const TermAndCondition = (props) => {
  const [cliclked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put('/users/TnCAgreed')
      .then((response) => {
        if (response.data.success) {
          setLoading(false)
          toast.success('Term and condition successfully accepted')
          props.onHide()
        }
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    console.log(cliclked)
  }, [cliclked])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='TnC-modal'
      className='edit-profile-modal'
    >
      {' '}
      <Modal.Body className='py-xs-2 py-sm-5'>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center flex-column '>
            <div className='lds-facebook'>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p style={{ color: '#01c5d1' }}>Saving choise, plase wait!</p>
          </div>
        ) : (
          <>
            <div className='mt-4 mb-4 px-lg-5 text-start'></div>
            <div className='text-center px-lg-5 d-flex flex-column align-items-center'>
              <div className='mb-3 d-flex justify-content-center'>
                <input
                  className='me-2'
                  type='checkbox'
                  value={cliclked}
                  onChange={() => setClicked(!cliclked)}
                  id='flexCheckDefault'
                />
                <label className='my-auto' for='flexCheckDefault'>
                  I understand that by logging i agree to the platform i accept
                  <a
                    href={'/terms'}
                    target='_blank'
                    className='public-page-terms-link-modal ms-2'
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <button
                disabled={!cliclked}
                className='edit-account'
                onClick={() => {
                  handleSubmit()
                }}
              >
                GOT IN!
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default TermAndCondition
