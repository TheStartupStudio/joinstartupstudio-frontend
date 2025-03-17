import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import WillyProfile from '../../assets/images/academy-icons/Willy-C.jpg'
import RyanProfile from '../../assets/images/academy-icons/Ryan-K.jpg'
import SabrinaProfile from '../../assets/images/academy-icons/Sabrina-R.jpg'
import BlankProfile from '../../assets/images/academy-icons/blank-profile.jpg'

const testimonials = [
  {
    text: '“As an entrepreneur, I know firsthand that success isn’t just about having a great idea—it’s about having the right mindset, skills, and resilience to bring that idea to life. That’s exactly what The Startup Studio helped me develop. Their approach isn’t about memorizing business concepts; it’s about learning how to think, adapt, and take action in the real world.”',
    name: 'Willy Colon',
    title: 'CEO and Co-Founder of Opus',
    image: WillyProfile
  },
  {
    text: '“The Startup Studio fundamentally changed how I approach entrepreneurship...and taught me to see every outcome as a valuable learning opportunity. This shift in mindset has made me more resilient and innovative as an entrepreneur.  This program does not just teach you about business - it rewrites the definition of success itself.”',
    name: 'Ryan King',
    title: 'Founder of StorySprout and AI Engineer at Deloitte Consulting',
    image: RyanProfile
  },
  {
    text: '“The Startup Studio has changed my life more than words can describe. However, I would say The Startup Studio fueled my passion for creating. Creating ventures, creating opportunities, and creating change. In my personal life, The Startup Studio sent me down a personal growth journey that has changed my life completely.”',
    name: 'Sabrina Riback',
    title: 'Founder of Awear LLC and Honors Student at Ohio State University',
    image: SabrinaProfile
  },
  {
    text: '“Through The Startup Studio, I realized that if I want to move forward, sometimes I have to take risks. Building a healthy relationship with failure and learning from failure is a critical skill to have. In the program, my partner and I failed so many times. But the reason why we failed was mostly because we wanted to make progress.”',
    name: 'Amy Ni',
    title:
      'Masters Student and Research Assistant at the Grady College of Journalism and Mass Communication at the University of Georgia',
    image: BlankProfile
  },
  {
    text: '“The Startup Studio has been transformative in my professional journey. The program has helped me build confidence, gain clarity about who I am, and develop critical skills through hands-on real-world project development. I have been able to approach challenges in my career with purpose and adaptability.”',
    name: 'Sean Byrne',
    title: 'Senior Manager, Global Regulatory Affairs at CMC',
    image: BlankProfile
  },
  {
    text: '“Failure, often a taboo in society, took on a new meaning throughout this program. From day one, The Startup Studio introduced the concept of failing forward and embracing failure. This shift in mindset fueled my success throughout the program and encouraged me to venture into uncharted territory and explore new directions.”',
    name: 'Dylan Fetterman',
    title: 'Consultant at 50:50 Startup',
    image: BlankProfile
  }
]

function SwiperSection() {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  return (
    <div className='testimonial-container'>
      <button ref={prevRef} className='swiper-button-prev'>
        <FontAwesomeIcon icon={faChevronLeft} size='lg' />
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={3}
        slidesPerGroup={3}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
          })
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div>
              <p className='fs-15 fw-light text-black testimonial'>
                {testimonial.text}
              </p>
              <div className='author'>
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4 className='fs-15 text-black fw-medium'>
                    {testimonial.name}
                  </h4>
                  <p className='fs-15 fw-light text-black'>
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button ref={nextRef} className='swiper-button-next'>
        <FontAwesomeIcon icon={faChevronRight} size='lg' />
      </button>
    </div>
  )
}

export default SwiperSection
