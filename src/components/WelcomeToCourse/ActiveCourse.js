import MasterClass from '../../assets/images/academy-icons/master-class.png'

function ActiveCourse() {
  return (
    <section className='mt-5'>
      <div className='course-experts d-flex justify-content-between'>
        <span className='fs-14 fw-medium w-25 text-center active-course p-2 cursor-pointer'>
          Master Classes
        </span>
        <span className='fs-14 fw-medium w-25 text-center p-2 cursor-pointer'>
          Encouragement and Guidance
        </span>
        <span className='fs-14 fw-medium w-25 text-center p-2 cursor-pointer'>
          Leadership Journal
        </span>
        <span className='fs-14 fw-medium w-25 text-center p-2 cursor-pointer'>
          Story in Motion
        </span>
      </div>
      <div className='mt-5 px-5 master-class-container mb-2'>
        <h3 className='text-center text-black text-uppercase fs-21 fw-bold '>
          Master Classes
        </h3>
        <p className='text-center fs-15 fw-light text-black lh-sm'>
          The Startup Studio’s Master Classes bring experts from every industry
          directly to you. These sessions are built on specific industry
          knowledge and experience, providing you with leadership from top
          professionals.
        </p>
        <p className='text-center fs-15 fw-medium text-black'>
          Meet Some of Our Market Experts
        </p>

        <img className='w-100' src={MasterClass} alt='master-class' />
      </div>
    </section>
  )
}

export default ActiveCourse
