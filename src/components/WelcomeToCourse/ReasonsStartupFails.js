import { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import startupFails from '../../assets/images/academy-icons/startup-fails.png'

function ReasonsStartupFails() {
  const [modal, setModal] = useState(false)

  function toggleModal() {
    setModal((prev) => !prev)
  }
  return (
    <>
      <section className='mt-4-4'>
        <h2 className='text-center fs-3 fw-bold text-black mb-4'>
          MOST STARTUPS FAIL IN THE FIRST FEW YEARS
        </h2>
        <p className='text-center fs-18'>
          Learn to Start’s Course in Entrepreneurship helps you avoid the most
          common pitfalls faced by startup founders by connecting you to market
          and industry experts who share the lessons they learned and help guide
          you along your journey
        </p>
        <div className='d-flex gap-3 align-items-center justify-content-center fs-15 mt-4'>
          <p
            className='mb-0 text-uppercase blue-text fw-semibold cursor-pointer'
            onClick={toggleModal}
          >
            Read about the Top 12 reasons startups fail
          </p>
          <img src={rightArrow} alt='right-arrow' />
        </div>
      </section>
      <Modal isOpen={modal} toggle={toggleModal} className='course-modal'>
        <span
          className=' cursor-pointer'
          onClick={toggleModal}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <ModalBody>
          <h3 className='text-uppercase text-center fs-3 fw-bold text-black mt-4-4'>
            The Top 12 Reasons Startups Fail
          </h3>
          <p className='text-center fs-13 fw-medium text-black'>
            CB Insights, 2021 (
            <a
              className='fw-normal'
              href='https://www.cbinsights.com/research/report/startup-failure-reasons-top/'
              target='blank'
              style={{ color: '#01c5d1' }}
            >
              Read full article here
            </a>
            )
          </p>
          <div className='d-flex justify-content-center'>
            <img src={startupFails} alt='Startup Fails' />
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ReasonsStartupFails
