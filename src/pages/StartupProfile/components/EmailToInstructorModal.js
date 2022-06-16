import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'

export const EmailToInstructorModal = (props) => {
  const [loading, setLoading] = useState(false)
  const sendEmail = async () => {
    setLoading(true)
    await axiosInstance
      .post('/users/shareWithInstructor', {
        id: props.project.id,
        name: props.project.company_name
      })
      .then((res) => {
        setLoading(false)
        props.onHide()
        toast.success("Email was sended successfully to you'r instructor")
      })
      .catch((err) => {
        props.onHide()
        toast.error('Something went wrong, please try again!')
        setLoading(false)
      })
  }
  return (
    <div className='mt-5 send-email-to-instructor '>
      {props.hasInstrutor ? (
        <>
          <p className='title ps-2 mb-1'>Send this email to you'r instructor</p>
          <p className='description ps-2 mt-0 pt-0'>
            Click in button to send email to you'r instructor
          </p>
          <div className='mx-auto my-auto row mt-md-5'>
            <button
              className={`lts-button mx-auto ${loading && 'loading'}`}
              onClick={() => {
                sendEmail()
              }}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Send email'
              )}
            </button>
          </div>
        </>
      ) : (
        <div className='row mx-auto'>
          <p className='mx-auto  text-center'>
            Sorry. You don`t have any instructor
          </p>
        </div>
      )}
    </div>
  )
}
