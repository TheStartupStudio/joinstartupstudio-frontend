import CorePillars from '../../components/WelcomeToCourse/CorePillars'
import ExploreCourseImg from '../../components/WelcomeToCourse/ExploreCourseImg'
import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import SyllabusBreakdown from '../../components/WelcomeToCourse/SyllabusBreakdown'

function ExploreCourse() {
  return (
    <>
      <InfoPageHeader courseClass={'d-none'} linkColor={'#000000'} />
      <main className='p-inl-13 background-course'>
        <h1 className='fw-light fs-42 text-center text-black text-uppercase mt-5'>
          Explore the Course
        </h1>

        <section className='mt-4-4'>
          <div className='px-5 d-flex flex-column align-items-center'>
            <h3 className='text-center text-black text-uppercase fs-20 fw-light'>
              Introducing the Learn to Start
              <br />
              <span className='fs-27 fw-bold'>Model of Entrepreneurship</span>
            </h3>
            <p className='text-center fs-18 fw-light text-black lh-sm'>
              Learn to Start has spent over a decade engineering new models of
              human development capable of empowering our learners to be
              aligned, productive and competitive inside of 21st century
              markets.
            </p>
            <ExploreCourseImg />
          </div>
        </section>
        <CorePillars />
        <SyllabusBreakdown />
      </main>
    </>
  )
}

export default ExploreCourse
