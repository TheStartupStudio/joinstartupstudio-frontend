import { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import CircularProgress from '../../components/ProgressBar'
import CourseNotStarted from './CourseNotStarted'
import InProggresCourse from './InProggresCourse'
import ProgressDone from './ProgressDone'

function CourseProgress() {
  const [modal, setModal] = useState(false)

  const toggleModal = () => {
    setModal((prev) => !prev)
  }

  return (
    <>
      <div
        className='d-grid academy-dashboard-card'
        style={{ gridTemplateRows: '1fr 2fr' }}
      >
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={courseLogo} alt='course' />
            <h4 className='fs-9 my-details-header'>Course Progress</h4>
          </div>
          <div
            className='progress-details cursor-pointer'
            onClick={toggleModal}
          >
            <span>Progress Details</span>
            <img src={rightArrow} alt='right-arr' />
          </div>
        </div>
        <div className='d-flex gap-4 align-items-center justify-content-between'>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress percentage={20} level={1} />
            <p className='text-center'>
              Entrepreneurship <br /> & You
            </p>
          </div>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress percentage={0} level={2} />
            <p className='text-center'>
              Understanding <br /> Learn to Start
            </p>
          </div>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress percentage={0} level={3} />
            <p className='text-center'>
              The Journey of <br />
              Entrepreneurship
            </p>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggleModal} className='certificate-modal'>
        <span
          className=' cursor-pointer'
          onClick={toggleModal}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <ModalBody>
          <img src={progressLogo} alt='user' className='mb-3' />
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
              View Progress Details
            </h3>
          </div>

          <div className='accordion mt-5' id='progressAccordion'>
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingOne'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseOne'
                  aria-expanded='false'
                  aria-controls='collapseOne'
                >
                  LEVEL 1 | The Myths of Entrepreneurship
                </button>
              </h2>
              <div
                id='collapseOne'
                className='accordion-collapse collapse'
                aria-labelledby='headingOne'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress percentage={20} level={1} />
                  </div>
                  <div className='d-flex flex-column gap-3'>
                    <ProgressDone title={'Myths of Entrepreneurship'} />
                    <ProgressDone title={'Definition of Entrepreneurship'} />
                    <InProggresCourse title={'Myths of Entrepreneurship'} />
                    <CourseNotStarted
                      title={'Skills and Traits of Effective Entrepreneus'}
                    />
                    <CourseNotStarted title={'People Buy Into People'} />
                    <CourseNotStarted
                      title={'Creating Your Self Brand First'}
                    />
                    <CourseNotStarted
                      title={
                        'Task #1: Create your Individual Value Proposition'
                      }
                    />
                    <CourseNotStarted
                      title={'Task #2: Create your I Am Video'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header ' id='headingTwo'>
                <button
                  className='accordion-button collapsed  text-secondary fw-medium'
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseTwo'
                  aria-expanded='false'
                  aria-controls='collapseTwo'
                >
                  LEVEL 2 | Understanding Learn to Start
                </button>
              </h2>
              <div
                id='collapseTwo'
                className='accordion-collapse collapse'
                aria-labelledby='headingTwo'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress percentage={0} level={2} />
                  </div>
                  <div className='d-flex flex-column gap-3'>
                    <CourseNotStarted title='The Journey of Entrepreneurship' />
                    <CourseNotStarted title='An Introduction to the LTS Model and Four Environments' />
                    <CourseNotStarted title='The Core Skills and LEARN Stage of the LTS Model' />
                    <CourseNotStarted title='The DEVELOP Stage of the LTS Model' />
                    <CourseNotStarted title='Understanding START & the Test Metrics of LTS' />
                    <CourseNotStarted title='Task #3: Evaluate Your Mindset and Skill Set' />
                    <CourseNotStarted title='The Process of Entrepreneurship' />
                    <CourseNotStarted title='Task #4: Build Your Team and Find Your Mentor' />
                  </div>
                </div>
              </div>
            </div>

            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingThree'>
                <button
                  className='accordion-button collapsed  text-secondary fw-medium'
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseThree'
                  aria-expanded='false'
                  aria-controls='collapseThree'
                >
                  LEVEL 3 | The LEARN Stage
                </button>
              </h2>
              <div
                id='collapseThree'
                className='accordion-collapse collapse'
                aria-labelledby='headingThree'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress percentage={0} level={3} />
                  </div>
                  <div className='d-flex flex-column gap-3 text-black'>
                    <p className='mb-0'>
                      Level 3.1: The Journey of Entrepreneurship
                    </p>
                    <CourseNotStarted title='The Journey of Entrepreneurship' />
                    <CourseNotStarted title='The Process and Skill of Storytelling' />
                    <CourseNotStarted title='Relevancy in World 4.0' />
                    <CourseNotStarted title='The LEARN Stage' />
                    <CourseNotStarted title='Problems Worth Solving' />
                    <CourseNotStarted title='Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends' />
                    <CourseNotStarted title='Task #6: Conduct an Industry Analysis' />
                    <p className='mb-0'>Level 3.2: The Develop Stage</p>
                    <CourseNotStarted title='Finding the Solution' />
                    <CourseNotStarted title="Creating Your Startup's Value Proposition" />
                    <CourseNotStarted title="Task #7: Create Your Startup's Value Proposition" />
                    <CourseNotStarted title="Testing Your Startup's Value Proposition" />
                    <CourseNotStarted title="Task #8: Conduct Market Validation for Your Startup's Value Proposition" />
                    <CourseNotStarted title='Understanding Innovation and Its Enemies' />
                    <CourseNotStarted title='The Five Skills of Innovation' />
                    <CourseNotStarted title='The DEVELOP Stage' />
                    <CourseNotStarted title="Task #9: Develop Your Startup's Business Model" />
                    <CourseNotStarted title="Task #10: Write Your Startup's Concept Plan" />
                    <p className='mb-0'>Level 3.3: The Brand Stage</p>
                    <CourseNotStarted title='Definition of Brand' />
                    <CourseNotStarted title='Branding Strategies' />
                    <CourseNotStarted title='The Relationship Between Story and Brand' />
                    <CourseNotStarted title='The Brand Charter' />
                    <CourseNotStarted title="Task #11: Creating Your Startup's Brand Charter" />
                    <CourseNotStarted title='The Brand Vehicles' />
                    <CourseNotStarted title="Task #12: Create Your Startup's Brand Vehicles" />
                    <CourseNotStarted title='The Fundamental Elements of Story' />
                    <CourseNotStarted title='Stories Your Business Can Tell' />
                    <CourseNotStarted title='Embracing Your Inner Storyteller' />
                    <CourseNotStarted title='Task #13: Conduct Focus Groups' />
                    <CourseNotStarted title='The Marketing Plan' />
                    <CourseNotStarted title="Task #14: Creating Your Startup's Marketing Plan" />
                    <p className='mb-0'>Level 3.4: The Start Stage</p>
                    <CourseNotStarted title='Introduction to the Business Plan' />
                    <CourseNotStarted title='The Business Development Management Map' />
                    <CourseNotStarted title="Task #15: Create Your Startup's Business Development Management Map" />
                    <CourseNotStarted title='The Test Metric of Sustainability' />
                    <CourseNotStarted title='Task #16: Test the Sustainability of Your Startup' />
                    <CourseNotStarted title='The Process of Entrepreneurship Reintroduction' />
                    <CourseNotStarted title='Parts of a Business Plan' />
                    <CourseNotStarted title="Task #17: Write Your Startup's Business Plan" />
                    <CourseNotStarted title='The Test Metric of Efficiency' />
                    <CourseNotStarted title='Task #18: Test the Efficiency of Your Startup' />
                    <CourseNotStarted title='An Introduction to the Financial Plan' />
                    <CourseNotStarted title="Task #19: Create Your Startup's Financial Plan" />
                    <CourseNotStarted title='The Test Metric of Profitability' />
                    <CourseNotStarted title='Task #20: Test the Potential Profitability of Your Startup' />
                    <CourseNotStarted title='Brand Generation' />
                    <CourseNotStarted title='Business Plan Musts' />
                    <CourseNotStarted title="Task #21: Write the Executive Summary of Your Startup's Business Plan" />
                    <CourseNotStarted title="Task #22: Create Your Startup's Brand Introductory Video" />
                    <CourseNotStarted title='Selling You' />
                    <CourseNotStarted title='Pitching Yourself' />
                    <CourseNotStarted title='Reminders Going Forward' />
                    <CourseNotStarted title='Task #23: Create Your Final I Am Video' />
                    <CourseNotStarted title='Task #4: Build Your Team and Find Your Mentor' />
                    <CourseNotStarted title="Task #24: Build Your Startup's Final Pitch" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CourseProgress
