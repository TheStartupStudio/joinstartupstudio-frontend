import { Modal, ModalBody } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'

function Faq({ isOpen, setIsOpen }) {
  function toggleModal() {
    setIsOpen((prev) => !prev)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '1100px' }}>
      <span
        className=' cursor-pointer'
        onClick={toggleModal}
        style={{ zIndex: '1' }}
      >
        <img className='left-arrow-modal' src={leftArrow} alt='left' />
      </span>
      <ModalBody>
        <h2 className='mt-4-4 fs-27 fw-bold text-center text-uppercase text-black'>
          Frequently Asked Questions
        </h2>
        <div>
          <div className='mt-2'>
            <h5 className='fs-15 fw-medium text-black mb-0'>
              How much does the course cost?
            </h5>
            <p className='fs-18 fw-light text-black'>
              $15 a month as a subscription fee.
            </p>
          </div>
          <div>
            <h5 className='fs-15 fw-medium text-black mb-0'>
              How do I cancel the course?
            </h5>
            <p className='fs-18 fw-light text-black'>
              In your account, there is a button to cancel your subscription.
              You can cancel anytime.
            </p>
          </div>
          <div>
            <h5 className='fs-15 fw-medium text-black mb-0'>
              How long is the course?
            </h5>
            <p className='fs-18 fw-light text-black'>
              The course is self-paced and it offers guidance throughout the
              entire course to motivate you and keep you on track to completing
              your project and the course.
            </p>
          </div>
          <div>
            <h5 className='fs-15 fw-medium text-black mb-0'>
              What do I get when I complete the course?
            </h5>
            <p className='fs-18 fw-light text-black'>
              You receive The Startup Studio’s Certificate of Completion once
              you have completed the entirety of the Course in
              Entrepreneurship’s journal. With this Certificate, you can:
              <ul>
                <li className='m-0'>Create your own startup.</li>
                <li className='m-0'>Apply to jobs requiring intrapreneurs.</li>
                <li className='m-0'>Attract investors to back you.</li>
                <li className='m-0'>Launch products.</li>
              </ul>
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default Faq
