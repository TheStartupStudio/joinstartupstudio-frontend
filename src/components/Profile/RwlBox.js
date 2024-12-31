import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import { isValidHttpUrl } from '../../utils/helpers'
import BriefingModal from '../Modals/BriefingModal'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedBriefingStart } from '../../redux/header/Actions'

const RwlBox = ({ dashboardWidget, userRole }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (userRole !== 'student') {
      dispatch(getSelectedBriefingStart())
    }
  }, [dispatch, userRole])

  const [briefingModal, setBriefingModal] = useState(false)
  const briefing = useSelector((state) => state?.header?.selectedBriefing)

  const redirect = (input) => {
    if (!isValidHttpUrl(input)) input = `http://${input}`
    window.open(input, '_blank')
  }

  const handleOpenBriefingModal = () => {
    setBriefingModal(true)
  }

  const handleCloseBriefingModal = () => {
    setBriefingModal(false)
  }
  return (
    <>
      <div
        style={{
          minHeight: '166px',
          cursor: 'pointer'
        }}
        onClick={() => redirect(dashboardWidget?.link)}
        className='mx-0 px-0 col-12 col-lg-6 row mt-4 mt-md-0 widget-interesting text-center '
      >
        <div className='col-4 col-md-4 mx-auto my-auto fw-bold py-4 '>
          <div className='h-auto w-auto user-select-none'>
            <p className='my-0 mx-auto' style={{ color: '#FE43A1' }}>
              READ
            </p>
            <p className='my-0 mx-auto' style={{ color: '#99CC33' }}>
              WATCH
            </p>
            <p className='my-0 mx-auto' style={{ color: '#51C7DF' }}>
              LISTEN
            </p>
          </div>
          {userRole !== 'student' && (
            <button
              className='py-2 border-0 color transform text-uppercase text-center  w-100 my-1'
              style={{
                backgroundColor: 'rgb(81, 199, 223)',
                color: 'rgb(255, 255, 255)',
                fontSize: 14
              }}
              onClick={(event) => {
                event.stopPropagation()
                handleOpenBriefingModal()
                axiosInstance
                  .post('/briefings/increaseBriefings')
                  .then((res) => {})
              }}
            >
              Briefing
            </button>
          )}
        </div>
        <div
          className='col-8 col-md-8 text-start my-auto info-text-dashboard'
          style={{ fontSize: '14px', wordBreak: 'break-word' }}
        >
          {dashboardWidget?.description}
        </div>
      </div>
      <BriefingModal
        briefing={briefing}
        show={briefingModal}
        onHide={handleCloseBriefingModal}
      />
    </>
  )
}

export default RwlBox
