import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import CoursE from '../../assets/images/academy-icons/course-entrepreneur.png'
import Leadership from '../../assets/images/academy-icons/leadershipJournalPic.png'
import Portfolio from '../../assets/images/academy-icons/portfolioPic.png'
import Certificate from '../../assets/images/academy-icons/certificatePic.png'
import ActiveCourse from '../../components/WelcomeToCourse/ActiveCourse'

function ExplorePlatform() {
  return (
    <>
      <InfoPageHeader linkColor={'#000000'} platformClass={'d-none'} />
      <main className='p-inl-13 background-platform'>
        <h1 className='fw-light fs-42 text-center text-black text-uppercase mt-5'>
          Explore the Platform
        </h1>
        <section className='mt-4-4'>
          <div className='px-5'>
            <h3 className='text-center text-black text-uppercase fs-27 fw-bold'>
              Three Powerful Points of Connection
            </h3>
            <p className='text-center fs-18 fw-light text-black lh-sm'>
              The Course in Entrepreneurship gives you a complete guide and
              support system to achieve your entrepreneurial goals. The
              combination of course, journal, and portfolio takes the difficult
              journey of entrepreneurship and creates the step-by-step process
              for you to succeed where others fail.
            </p>
          </div>

          <div
            className='d-grid gap-5'
            style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
          >
            <div>
              <img className='w-100' src={CoursE} alt='course-entrepreneur' />
              <h4 className='fs-24 fw-bold text-center text-black'>
                Your course
              </h4>
              <p className='text-black fw-light lh-sm'>
                The course content provides you with two expert entrepreneurs
                who give you direct advice through every step of the
                entrepreneurial process. This provides you with the expert
                mentorship that minimizes the risk of failure and optimizes on
                your abilities.
              </p>
            </div>
            <div>
              <img className='w-100' src={Leadership} alt='leadership' />
              <h4 className='fs-24 fw-bold text-center text-black'>
                Your Journal
              </h4>
              <p className='text-black fw-light lh-sm'>
                The journal tasks you with every step you need to take to
                execute on your entrepreneurial project from ideation to
                execution to brand communication. Whether you focus on a product
                or service, for-profit or non-profit model, the journal empowers
                you to bring to market your unique value propositions.
              </p>
            </div>
            <div>
              <img className='w-100' src={Portfolio} alt='portfolio' />
              <h4 className='fs-24 fw-bold text-center text-black'>
                Your Portfolio
              </h4>
              <p className='text-black fw-light lh-sm'>
                The portfolio allows you to create the full story of your
                experience, skills, and outcomes so you can communicate your
                value to all potential investors, employers, partners, and
                employees. Your portfolio is evidence of who you are, what you
                can do, and how you prove it to the marketplace.
              </p>
            </div>
          </div>
        </section>
        <section className='mt-5 d-flex gap-5'>
          <div className='align-self-center'>
            <h4 className='text-uppercase fw-light fw-light fs-15 text-black'>
              Certificate Of
              <br />
              <span className='fs-24 fw-bold'>Completion</span>
            </h4>
            <p className='fs-18 text-black fw-light'>
              You receive your Certificate of Completion once you have completed
              the entirety of your Course in Entrepreneurship’s journal. Your
              certificate is issued by Learn to Start and with this Certificate,
              you can:
            </p>
            <ul className='text-black fw-light fs-18 mb-0'>
              <li className='m-0'>Create your own startup.</li>
              <li className='m-0'>Apply to jobs requiring intrapreneurs.</li>
              <li className='m-0'>Attract investors to back you.</li>
              <li className='m-0'>Launch products.</li>
            </ul>
          </div>
          <img src={Certificate} alt='certificate' className='w-100' />
        </section>
        <section className='mt-5'>
          <h3 className='text-center text-black text-uppercase fs-27 fw-bold'>
            Expert Guidance Beyond the Course
          </h3>
          <p className='text-center fs-18 fw-light text-black lh-sm'>
            Learn from a powerful team of US-based, expert entrepreneurs and
            professionals  - Unlike anything offered in the market today.
          </p>
        </section>
        <ActiveCourse />
      </main>
    </>
  )
}

export default ExplorePlatform
