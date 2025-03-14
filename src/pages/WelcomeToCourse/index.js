import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import chart from '../../assets/images/academy-icons/chart.png'
import entrepreneur from '../../assets/images/academy-icons/entrepreneur.png'
import refresh from '../../assets/images/academy-icons/refresh.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import search from '../../assets/images/academy-icons/search.png'
import threePeople from '../../assets/images/academy-icons/three-people-icons.png'
import understandingE from '../../assets/videos/Understanding-Entrepreneurship.mov'
import powerOfStory from '../../assets/videos/The-Power-of-Story.mov'
import applyStory from '../../assets/videos/How-to-Apply-Story-to-Entrepreneurship.mov'
import innovation from '../../assets/videos/Innovation.mov'
import creatingValue from '../../assets/videos/Creating-a-Value-Proposition.mov'
import branding from '../../assets/videos/Branding.mov'
import sellingYourself from '../../assets/videos/Selling-Yourself.mov'
import businessPlan from '../../assets/videos/The-Art-of-Building-a-Business-Plan.mov'
import understandingEpic from '../../assets/images/academy-icons/understandingE.png'
import './infoPage.css'

function WelcomeToCourse() {
  return (
    <>
      <header className='py-4 px-5 welcome-course-header d-flex justify-content-between align-items-start'>
        <img src={courseLogo} alt='course logo' />

        <nav className='mt-4'>
          <ul className='list-unstyled d-flex gap-4'>
            <li>
              <Link
                className='text-white fs-13 fw-medium'
                to='/explore-the-platform'
              >
                EXPLORE THE PLATFORM
              </Link>
            </li>
            <li>
              <Link
                className='text-white fs-13 fw-medium'
                to='/explore-the-course'
              >
                EXPLORE THE COURSE
              </Link>
            </li>
            <li>
              <Link className='text-white fs-13 fw-medium' to='/faq'>
                FAQS
              </Link>
            </li>
            <li>
              <Link className='text-white fs-13 fw-medium' to='/contact'>
                CONTACT
              </Link>
            </li>
            <li>
              <Link className='text-white fs-13 fw-medium' to='/'>
                LOGIN
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className='p-inl-13 pt-5'>
        <section className='d-flex justify-content-center flex-column'>
          <h2 className='fs-5 text-black'>
            Welcome to
            <br />
            <span className='fs-3 fw-bold'>
              THE STARTUP STUDIOS'S COURSE IN ENTREPRENEURSHIP
            </span>
          </h2>
          <div className='d-flex gap-1'>
            <div className='fs-18'>
              <p>
                Embark on a transformative journey where you will discover
                yourself and your passions, practice the art of failing, and
                uncover the real world of entrepreneurship.
              </p>
              <p className='mb-0'>
                We believe everyone has the ability and capacity to innovate and
                become entrepreneurial.
              </p>
              <p>
                To that end, we guide our learners as they seek to accomplish
                their goals and be the best version of themselves.
              </p>

              <a
                className='text-decoration-underline blue-text fw-medium fs-15'
                href='https://learntostart.com/'
                target='blank'
              >
                Powered by Learn to Start - The world leader in human
                development
              </a>
            </div>
            <img
              className='entrepreneur'
              src={entrepreneur}
              alt='entrepreneur'
            />
          </div>
        </section>
        <section className='mt-5 px-5'>
          <h2 className='text-center fs-3 fw-bold text-black'>
            A COURSE FOR EVERYONE
          </h2>
          <p className='text-center fs-18'>
            The Course in Entrepreneurship is designed to take you from ideation
            to execution of a product or service through which you can create
            demand in the marketplace. As you journey through our three in-depth
            levels, you will build yourself as an entrepreneur capable of
            vision, innovation, and iteration.
          </p>
          <div className='d-flex gap-3 align-items-center justify-content-center fs-15 mt-4'>
            <p className='mb-0 text-uppercase blue-text fw-semibold'>
              Learn more about who should take this course
            </p>
            <img src={rightArrow} alt='right-arrow' />
          </div>
        </section>

        <section className='mt-5'>
          <h2 className='text-center fs-3 fw-bold text-black mb-4'>
            WHAT YOU'LL LEARN
          </h2>
          <div
            className='d-grid'
            style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}
          >
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={threePeople} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>
                Teamwork & Collaboration
              </h5>
              <p className='mb-0 mt-1 fs-18'>
                Practice team-building and collaboration, how to manage yourself
                and others, how to delegate and accept ownership of
                responsibilities based on the skills of the team members.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={chart} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Industry Analysis</h5>
              <p className='mb-0 mt-1 fs-18'>
                Analyze relevant performances of industry competitors,
                operational costs of the elements of a business plan, and both
                personal and professional financial literacy. Then compare your
                intentional design to relevant industry case studies.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={search} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Consumer Research</h5>
              <p className='mb-0 mt-1 fs-18'>
                Design and implement market analyses that uncover the relevant
                behaviors of consumers in the marketplace, what demand exists,
                what demand is being met, and what voids are evident among
                existing products, services, and their inefficiencies.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={refresh} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Modeling & Iterating</h5>
              <p className='mb-0 mt-1 fs-18'>
                Develop models based upon your authentic intentions, and see
                ideas through into iteration. Learn how to test your products,
                identify failures, and continuously pivot based upon observed
                data.
              </p>
            </div>
          </div>
          <div>
            <p className='fs-5 text-black fw-semibold mt-3'>
              Here are a few key points to learn now:
            </p>
            <div
              className='d-grid'
              style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}
            >
              <div>
                <ReactPlayer
                  url={understandingE}
                  controls={true}
                  width='100%'
                  height='auto'
                  light={understandingEpic}
                />
                <span>Understanding Entrepreneurship</span>
              </div>
              <div>
                <ReactPlayer
                  url={powerOfStory}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>The Power of Story</span>
              </div>
              <div>
                <ReactPlayer
                  url={applyStory}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>How to Apply Story to Entrepreneurship</span>
              </div>
              <div>
                <ReactPlayer
                  url={innovation}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>Innnovation</span>
              </div>
              <div>
                <ReactPlayer
                  url={creatingValue}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>Creating a Value Proposition</span>
              </div>
              <div>
                <ReactPlayer
                  url={branding}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>Branding</span>
              </div>
              <div>
                <ReactPlayer
                  url={sellingYourself}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>Selling Yourself</span>
              </div>
              <div>
                <ReactPlayer
                  url={businessPlan}
                  controls={true}
                  width='100%'
                  height='auto'
                />
                <span>The Art of Building a Business Plan</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default WelcomeToCourse
