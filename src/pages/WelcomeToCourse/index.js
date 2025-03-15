import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import applyStoryPic from '../../assets/images/academy-icons/apply-story.png'
import brandingPic from '../../assets/images/academy-icons/branding.png'
import businessPlanPic from '../../assets/images/academy-icons/business-plan.png'
import chart from '../../assets/images/academy-icons/chart.png'
import entrepreneur from '../../assets/images/academy-icons/entrepreneur.png'
import innovationPic from '../../assets/images/academy-icons/innovation.png'
import powerOfStoryPic from '../../assets/images/academy-icons/power-of-story.png'
import refresh from '../../assets/images/academy-icons/refresh.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import search from '../../assets/images/academy-icons/search.png'
import sellingYourselfPic from '../../assets/images/academy-icons/selling-yourself.png'
import threePeople from '../../assets/images/academy-icons/three-people-icons.png'
import understandingEpic from '../../assets/images/academy-icons/understandingE.png'
import valuePropPic from '../../assets/images/academy-icons/value-prop.png'
import branding from '../../assets/videos/Branding.mov'
import creatingValue from '../../assets/videos/Creating-a-Value-Proposition.mov'
import applyStory from '../../assets/videos/How-to-Apply-Story-to-Entrepreneurship.mov'
import innovation from '../../assets/videos/Innovation.mov'
import sellingYourself from '../../assets/videos/Selling-Yourself.mov'
import businessPlan from '../../assets/videos/The-Art-of-Building-a-Business-Plan.mov'
import powerOfStory from '../../assets/videos/The-Power-of-Story.mov'
import understandingE from '../../assets/videos/Understanding-Entrepreneurship.mov'
import AcademyBtn from '../../components/AcademyBtn'
import VideoThumbnail from '../../components/WelcomeToCourse/VideoThumbnail'
import anastasiaPic from '../../assets/images/academy-icons/thisisyourjourney.png'
import garyProfile from '../../assets/images/academy-icons/gary-profile.jpg'
import garyPic from '../../assets/images/academy-icons/garyc.png'
import bobProfile from '../../assets/images/academy-icons/bob-allen.png'
import bobPic from '../../assets/images/academy-icons/bob.png'
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
              <p className='mb-0 mt-1 fs-18 lh-sm fw-light text-black'>
                Practice team-building and collaboration, how to manage yourself
                and others, how to delegate and accept ownership of
                responsibilities based on the skills of the team members.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={chart} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Industry Analysis</h5>
              <p className='mb-0 mt-1 fs-18 lh-sm fw-light text-black'>
                Analyze relevant performances of industry competitors,
                operational costs of the elements of a business plan, and both
                personal and professional financial literacy. Then compare your
                intentional design to relevant industry case studies.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={search} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Consumer Research</h5>
              <p className='mb-0 mt-1 fs-18 lh-sm fw-light text-black'>
                Design and implement market analyses that uncover the relevant
                behaviors of consumers in the marketplace, what demand exists,
                what demand is being met, and what voids are evident among
                existing products, services, and their inefficiencies.
              </p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <img className='image-wyl' src={refresh} alt='three-people' />
              <h5 className='mt-4 fs-15 text-black'>Modeling & Iterating</h5>
              <p className='mb-0 mt-1 fs-18 lh-sm fw-light text-black'>
                Develop models based upon your authentic intentions, and see
                ideas through into iteration. Learn how to test your products,
                identify failures, and continuously pivot based upon observed
                data.
              </p>
            </div>
          </div>
          <div>
            <p className='fs-5 text-black fw-semibold mt-4'>
              Here are a few key points to learn now:
            </p>
            <div
              className='d-grid'
              style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}
            >
              <VideoThumbnail
                imageSource={understandingEpic}
                videoUrl={understandingE}
                content={'Understanding Entrepreneurship'}
              />
              <VideoThumbnail
                imageSource={powerOfStoryPic}
                videoUrl={powerOfStory}
                content={'The Power of Story'}
              />
              <VideoThumbnail
                imageSource={applyStoryPic}
                videoUrl={applyStory}
                content={'How to Apply Story to Entrepreneurship'}
              />
              <VideoThumbnail
                imageSource={innovationPic}
                videoUrl={innovation}
                content={'Innnovation'}
              />
              <VideoThumbnail
                imageSource={valuePropPic}
                videoUrl={creatingValue}
                content={'Creating a Value Proposition'}
              />
              <VideoThumbnail
                imageSource={brandingPic}
                videoUrl={branding}
                content={'Branding'}
              />
              <VideoThumbnail
                imageSource={sellingYourselfPic}
                videoUrl={sellingYourself}
                content={'Selling Yourself'}
              />
              <VideoThumbnail
                imageSource={businessPlanPic}
                videoUrl={businessPlan}
                content={'The Art of Building a Business Plan'}
              />
            </div>
          </div>
        </section>

        <section className='mt-5'>
          <h2 className='text-center fs-3 fw-bold text-black mb-4'>
            MOST STARTUPS FAIL IN THE FIRST FEW YEARS
          </h2>
          <p className='text-center fs-18'>
            Learn to Start’s Course in Entrepreneurship helps you avoid the most
            common pitfalls faced by startup founders by connecting you to
            market and industry experts who share the lessons they learned and
            help guide you along your journey
          </p>
          <div className='d-flex gap-3 align-items-center justify-content-center fs-15 mt-4'>
            <p className='mb-0 text-uppercase blue-text fw-semibold'>
              Read about the Top 12 reasons startups fail
            </p>
            <img src={rightArrow} alt='right-arrow' />
          </div>
        </section>
        <section className='mt-5 d-flex justify-content-between align-items-center px-5 py-4 ready-to-start'>
          <h2 className='fs-4 fw-bold text-black'>READY TO GET STARTED?</h2>
          <AcademyBtn title={"LET'S DO IT"} icon={faArrowRight} />
        </section>
        <section className='mt-5'>
          <h2 className='text-center fs-3 fw-bold text-black mb-4'>
            MEET YOUR GUIDES
          </h2>
          <div
            className='d-grid align-items-center gap-3'
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <img className='w-100' src={anastasiaPic} alt='Anastasia Hall' />
            <div>
              <h4 className='fs-15 fw-light lh-1'>
                YOUR LEAD INSTRUCTOR <br />
                <span className='fw-bold fs-27'>ANASTASIA HALL</span>
                <br />
                Learn to Start’s Director of Human Development
              </h4>
              <p className='fs-18 fw-light lh-sm mt-3'>
                Anastasia will guide and instruct you throughout the entire
                journey. Through your My Course area, she will introduce you to
                our real world entrepreneurs who will be your expert advisors
                throughout your course, bringing you the powerful advice and
                mentorship that you will need to begin building the best version
                of you and your startup.
              </p>
              <p className='fs-18 fw-light lh-sm mt-4'>
                With her, you’ll be introduced to all the concepts and content
                you will need to become someone capable of understanding the
                entire journey of entrepreneurship.
              </p>
            </div>
          </div>
        </section>
        <section className='mt-5'>
          <h2 className='text-center text-uppercase fs-4 fw-bold text-black mb-4'>
            Meet Your Expert Entrepreneurs
          </h2>
          <div
            className='mt-4 d-grid'
            style={{ gridTemplateColumns: '1fr 1fr', gap: '8rem' }}
          >
            <div>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <img src={garyProfile} alt='Gary' className='profile-pic-ent' />
                <div>
                  <h5 className='text-uppercase mb--5 fw-semibold text-black'>
                    Gary Conroy
                  </h5>
                  <span className='fw-light fs-13 text-black'>
                    Founder & CEO of Learn to Start
                  </span>
                </div>
              </div>
              <p className='mb-0 fs-18 lh-sm fw-light text-black'>
                Meet Gary as he introduces you to The Startup Studio’s Five
                Pillars of Entrepreneurship
              </p>
              <img className='w-100' src={garyPic} alt='Gary Video Pic' />
              <p className='fs-18 lh-sm fw-light text-black'>
                Gary is a serial entrepreneur, educator, and business
                consultant. He is a solutions specialist with a serious focus on
                merging his skill in creativity with his passion for
                relationship building and business model generation so as to
                ensure he brings about outcomes that change business cultures
                and ensure efficiency, sustainability and profitability are
                always achieved.
              </p>
              <p className='mb-0 fs-18 lh-sm fw-light text-black'>
                Gary has built several companies ranging from commercial real
                estate management, a restaurant investment group, as well as a
                business solutions consultancy group. Gary is the founder and
                CEO of The Startup Studio, a global solutions company in
                education.
              </p>
            </div>
            <div>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <img src={bobProfile} alt='Bob' className='profile-pic-ent' />
                <div>
                  <h5 className='text-uppercase mb--5 fw-semibold text-black'>
                    Bob Allen
                  </h5>
                  <span className='fw-light fs-13 text-black'>
                    Founder & Chief Story Telling officer at IDEAS
                  </span>
                </div>
              </div>
              <p className='mb-0 fs-18 lh-sm fw-light text-black'>
                Meet Bob as he introduces you to the course and shares the power
                of story and more.
              </p>
              <img className='w-100' src={bobPic} alt='Bob Video Pic' />
              <p className='fs-18 lh-sm fw-light text-black'>
                Bob Allen’s early career was as a writer and producer with Walt
                Disney Imagineering, where he worked on several attractions that
                would be part of EPCOT, before becoming the Vice President of
                Disney Production Services, Inc. where he was responsible for
                all facilities and services at the Disney-MGM Studios, as well
                as the operation of Disney IDEAS (Innovation, Design,
                Entertainment, Art and Storytelling).
              </p>
              <p className='mb-0 fs-18 lh-sm fw-light text-black'>
                He later left Disney to found his own company, IDEAS Orlando,
                where he is involved with all aspects of the company, with his
                primary role being the Chief Storytelling Officer, focusing on
                concept development, experience design, and branding.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default WelcomeToCourse
