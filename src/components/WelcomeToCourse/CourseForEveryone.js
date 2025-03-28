import { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import briefcaseLogo from '../../assets/images/academy-icons/svg/briefcase.svg'
import employeesLogo from '../../assets/images/academy-icons/svg/employees-building.svg'
import foundersLogo from '../../assets/images/academy-icons//svg/rocket.svg'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import retireesLogo from '../../assets/images/academy-icons/svg/umbrella.svg'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import studentsLogo from '../../assets/images/academy-icons/svg/students.svg'

function CourseForEveryone() {
  const [modal, setModal] = useState(false)

  function toggleModal() {
    setModal((prev) => !prev)
  }

  return (
    <>
      <section className='mt-4-4 px-5'>
        <h2 className='text-center fs-3 fw-bold text-black'>
          A COURSE FOR EVERYONE
        </h2>
        <p className='text-center fs-18'>
          The Course in Entrepreneurship is designed to take you from ideation
          to execution of a product or service through which you can create
          demand in the marketplace. As you journey through our three in-depth
          levels, you will build yourself as an entrepreneur capable of vision,
          innovation, and iteration.
        </p>
        <div className='d-flex gap-3 align-items-center justify-content-center fs-15 mt-4'>
          <p
            className='mb-0 text-uppercase blue-text fw-semibold cursor-pointer'
            onClick={toggleModal}
          >
            Learn more about who should take this course
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
            Who Should take this course
          </h3>
          <div className='mt-5'>
            <div
              className='d-grid gap-5'
              style={{ gridTemplateColumns: 'repeat(12,1fr)' }}
            >
              <div
                className='d-flex flex-column align-items-center gap-4'
                style={{ gridColumn: 'span 4' }}
              >
                <img
                  className='course-image'
                  src={studentsLogo}
                  alt='students'
                />
                <p className='mb-0 fs-18 fw-light text-black lh-sm'>
                  <span className='fw-bold'>Students</span> in high school, or
                  in college, or continuing your education at a later time - you
                  need to have a clear understanding of how to leverage your
                  education, focus your efforts towards future outcomes, and
                  make the most of your opportunities for learning, mentoring,
                  and networking.
                </p>
              </div>
              <div
                className='d-flex flex-column align-items-center gap-4'
                style={{ gridColumn: 'span 4' }}
              >
                <img
                  className='course-image'
                  src={briefcaseLogo}
                  alt='briefcase'
                />
                <p className='mb-0 fs-18 fw-light text-black lh-sm'>
                  <span className='fw-bold'>Professionals</span> seeking a new
                  career in the same industry or striking off into new territory
                  - you need to assess your experiences, your skill sets, and
                  your preferred styles of work and collaboration while
                  surveying the marketplace and your place in it.
                </p>
              </div>
              <div
                className='d-flex flex-column align-items-center gap-4'
                style={{ gridColumn: 'span 4' }}
              >
                <img
                  className='course-image'
                  src={employeesLogo}
                  alt='briefcase'
                />
                <p className='mb-0 fs-18 fw-light text-black lh-sm'>
                  <span className='fw-bold'>Employees</span> looking to advance
                  and grow your effectiveness and opportunities - you need to
                  evaluate how your personal drives and the expertise that you
                  bring to the workplace can help you to find or create the best
                  opportunities for you and your goals.
                </p>
              </div>
              <div
                className='d-flex flex-column align-items-center gap-4'
                style={{ gridColumn: '3 / 7' }}
              >
                <img
                  className='course-image'
                  src={foundersLogo}
                  alt='briefcase'
                />
                <p className='mb-0 fs-18 fw-light text-black lh-sm'>
                  <span className='fw-bold'>Founders</span> working on your own
                  start-up concept, either alone or on a team - you took a bold
                  first step and now you need to compete, build successful
                  relationships, pivot from the failures that you will
                  encounter, and execute on your authentic vision.
                </p>
              </div>
              <div
                className='d-flex flex-column align-items-center gap-4'
                style={{ gridColumn: '7 / 11' }}
              >
                <img
                  className='course-image'
                  src={retireesLogo}
                  alt='briefcase'
                />
                <p className='mb-0 fs-18 fw-light text-black lh-sm'>
                  <span className='fw-bold'>Retirees</span> or people developing
                  a new project because you are either out of the career world
                  or not entirely fulfilled by it - you deserve a space in which
                  you can ideate on your passions and interests and can connect
                  with others who are ready to grow alongside you or could
                  benefit from the talents that you have to offer.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CourseForEveryone
