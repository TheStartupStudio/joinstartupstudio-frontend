import { useState } from 'react'
import MasterClass from '../../assets/images/academy-icons/master-class.png'
import VideoCourse from './VideoCourse'
import SIM from '../../assets/images/academy-icons/2. Story in Motion - Jeremy.jpg'
import GaryPicture from '../../assets/images/academy-icons/1. Course in Entrepreneurship - Gary.jpg'
import LJ from '../../assets/images/academy-icons/3. Leadereship Journal - Leslie.jpg'

function ActiveCourse() {
  const [activeTab, setActiveTab] = useState('Master Classes')

  const tabs = [
    'Master Classes',
    'Encouragement and Guidance',
    'Leadership Journal',
    'Story in Motion'
  ]

  const content = {
    'Master Classes': {
      title: 'Master Classes',
      subtitle: 'Meet Some of Our Market Experts',
      text: 'The Startup Studio’s Master Classes bring experts from every industry directly to you. These sessions are built on specific industry knowledge and experience, providing you with leadership from top professionals.',
      video:
        'https://d5tx03iw7t69i.cloudfront.net/Master-Classes/Cindy-Schooler-Becoming-a-Fear-Less-Leader.mov',
      image: MasterClass
    },
    'Encouragement and Guidance': {
      title: 'ENCOURAGEMENT & GUIDANCE SERIES',
      subtitle:
        'Listen in as Gary discusses what it means to take an idea from nothing to becoming a product or service demanded by a targeted market.',
      text: `The Startup Studio’s CEO and Founder, Gary Conroy, is a serial entrepreneur who has experienced everything you will experience and is here to encourage and guide you through each stage of the entrepreneurial process so you remain dedicated to your goals.

      `,
      video:
        'https://d5tx03iw7t69i.cloudfront.net/LTS-Course-Intro/Introducing the Entrepreneurs - Gary Conroy.mov',
      image: GaryPicture
    },
    'Leadership Journal': {
      title: 'LEADERSHIP JOURNAL',
      subtitle: 'Meet Our Leadership Expert Dr Leslie Williams',
      text: `Our Leadership Journal gives you the opportunity to develop all aspects of leadership including values, expertise, experience, style, teamwork, initiative, methodology, self-assessment, outcomes, feedback, iteration, and vision.`,

      video: 'https://www.example.com/leadership-video.mp4',
      image: LJ
    },
    'Story in Motion': {
      title: 'STORY IN MOTION',
      subtitle: 'Meet our Story in Motion Host, Jeremy Hall',
      text: `Find inspiration and guidance from top industry professionals who share their story, allowing you to follow their trajectory from start to present. Find out what character traits, skills, and experiences they developed to start their businesses.`,
      video: 'https://www.example.com/story-in-motion-video.mp4',
      image: SIM
    }
  }
  return (
    <section className='mt-5'>
      <div className='course-experts d-flex justify-content-between'>
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`fs-14 fw-medium w-25 text-center p-2 cursor-pointer ${
              activeTab === tab ? 'active-course' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className='mt-5 px-5 master-class-container mb-2 '>
        <h3 className='text-center text-black text-uppercase fs-21 fw-bold '>
          {content[activeTab].title}
        </h3>
        <p className='text-center fs-15 fw-light text-black lh-sm'>
          {content[activeTab].text}
        </p>
        <p className='text-center fs-15 fw-medium text-black'>
          {content[activeTab].subtitle}
        </p>

        <VideoCourse
          videoSrc={content[activeTab].video}
          imgSrc={content[activeTab].image}
        />
      </div>
    </section>
  )
}

export default ActiveCourse
