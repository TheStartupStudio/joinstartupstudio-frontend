import { useState } from 'react'
import Pyramid from '../../assets/images/academy-icons/svg/model-in-e.svg'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
import StoryLogo from '../../assets/images/academy-icons/story1.png'
import RealtionshipLogo from '../../assets/images/academy-icons/relationship.png'
import MentorshipLogo from '../../assets/images/academy-icons/mentorship.png'
import FailureLogo from '../../assets/images/academy-icons/failure.png'
import CoreSkills from '../../assets/images/academy-icons/core-skills.png'
import LearnLogo from '../../assets/images/academy-icons/learn.png'
import DevelopLogo from '../../assets/images/academy-icons/develop.png'
import BrandLogo from '../../assets/images/academy-icons/brand.png'
import ThreeTestLogo from '../../assets/images/academy-icons/three-test.png'

function ExploreCourseImg() {
  const [tooltip, setTooltip] = useState({
    show: false,
    text: '',
    x: 0,
    y: 0,
    title: '',
    image: ''
  })

  const hotspots = [
    {
      id: 1,
      xMin: 300,
      xMax: 400,
      yMin: 0,
      yMax: 100,
      image: AcademyLogo,
      title: 'Start',
      text: 'Your representation of your best self at any particular moment in time in your development. It is your outward-facing, complete proof of Alignment, Productivity and Competitiveness.'
    },
    {
      id: 2,
      xMin: 220,
      xMax: 480,
      yMin: 120,
      yMax: 230,
      title: 'Three Test Metrics of Execution',
      image: ThreeTestLogo
    },
    {
      id: 3,
      xMin: 180,
      xMax: 520,
      yMin: 240,
      yMax: 300,
      image: BrandLogo,
      title: 'Brand',
      text: 'Your ability to communicate and market your value.'
    },
    {
      id: 4,
      xMin: 150,
      xMax: 550,
      yMin: 320,
      yMax: 385,
      image: DevelopLogo,
      title: 'Develop',
      text: 'Your ability to execute through the development of employability and industry skills.'
    },
    {
      id: 5,
      xMin: 100,
      xMax: 600,
      yMin: 405,
      yMax: 470,
      image: LearnLogo,
      title: 'Learn',
      text: 'Your commitment to conscious consumption, research, and analysis.'
    },
    {
      id: 6,
      xMin: 30,
      xMax: 670,
      yMin: 490,
      yMax: 555,
      image: CoreSkills,
      title: 'Core Skills',
      text: 'Your abilities that fall into two categories: industry-specific and industry-transcendent.'
    },
    {
      id: 7,
      xMin: 0,
      xMax: 230,
      yMin: 570,
      yMax: 700,
      image: RealtionshipLogo,
      title: 'Relationship',
      text: 'Your ability to collaborate and communicate with others.'
    },
    {
      id: 8,
      xMin: 250,
      xMax: 340,
      yMin: 570,
      yMax: 700,
      image: StoryLogo,
      title: 'Story',
      text: 'Your ability to identify and connect others to your story and the empathy to identify and connect to the stories of others.'
    },
    {
      id: 9,
      xMin: 360,
      xMax: 520,
      yMin: 570,
      yMax: 700,
      image: MentorshipLogo,
      title: 'Mentorship',
      text: 'Your ability to reach out for feedback and guidance.'
    },
    {
      id: 9,
      xMin: 550,
      xMax: 700,
      yMin: 570,
      yMax: 700,
      image: FailureLogo,
      title: 'Failure',
      text: 'Your ability to embrace and leverage the failure that comes from taking risks.'
    }
  ]

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left // Relative to the image
    const y = e.clientY - rect.top // Relative to the image

    const foundSpot = hotspots.find(
      (spot) => x > spot.xMin && x < spot.xMax && y > spot.yMin && y < spot.yMax
    )

    if (foundSpot && !tooltip.show) {
      // Set tooltip position relative to the image container
      setTooltip({
        show: true,
        text: foundSpot.text,
        image: foundSpot.image,
        title: foundSpot.title,
        x: x + 15, // Slight offset to the right
        y: y + 15 // Slight offset below
      })
    } else if (!foundSpot) {
      setTooltip({ show: false, text: '', x: 0, y: 0 })
    }
  }

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={Pyramid}
          alt='pyramid'
          style={{ width: '700px', height: '670px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
        />

        {tooltip.show && (
          <div
            className='position-absolute d-flex flex-column gap-2 p-4'
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 150,
              background: ' rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(25px)',
              color: 'black',
              borderRadius: '5px',
              width: '260px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
            }}
          >
            <img
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              src={tooltip.image}
              alt={tooltip.title}
            />
            <h5 className='text-black fs-21 fw-medium text-uppercase'>
              {tooltip.title}
            </h5>
            <p className='fs-18 fw-light'>{tooltip.text}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ExploreCourseImg
