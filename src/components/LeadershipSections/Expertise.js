import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'
import Light from '../../assets/images/academy-icons/light.png'
import SectionsWrapper from './SectionsWrapper'
import LeadershipTextEditor from './LeadershipTextEditor'

const array = [
  'Music',
  'Fine arts',
  'Performing arts',
  'Content creation',
  'Sports',
  'Wellness',
  'Finance',
  'Technology',
  'FinTech',
  'Medicine',
  'Community service',
  'Stock market',
  'Real estate',
  'Gaming',
  'Architecture',
  'Writing',
  'Design',
  'Event planning',
  'Beauty',
  'Law'
]

function Expertise({ setIsReflection }) {
  setIsReflection(true)
  return (
    <div className='d-grid grid-col-2 gap-4'>
      <SectionsWrapper title={'Expertise'}>
        <p className='lh-sm'>
          The knowledge you have acquired and can apply to solve problems in a
          way that creates demand for your solutions. So, what is your field of
          expertise, or what do you want to be your field of expertise? You will
          probably start this reflection process thinking in overarching terms,
          like “my field of expertise is music” or “my field of expertise is
          sports.” You need to push your thinking to be more specific within
          these overarching fields. For example, if you chose “my field of
          expertise is music” you could specify it as “my field of interest is
          music production” or “my field of expertise is writing melodies.”
        </p>
        <p className='lh-sm'>
          Start your research process examining your potential fields of
          expertise - start with your interests - and see where you already have
          knowledge and what you would like to be knowledgeable about in the
          future. Ask your network of mentors about their fields of expertise
          and how they discovered them.
        </p>

        <p className='mb-0 fs-15 fw-medium'>
          Overarching fields of expertise -{' '}
          <span className='fs-13 fw-light'>
            make anyone of these or others more specific:
          </span>
        </p>
        {array.map((item) => (
          <div className='d-flex gap-3 ml-2'>
            <FontAwesomeIcon
              icon={faCircle}
              style={{ fontSize: '3px', marginTop: '0.65rem' }}
            />
            {item}
          </div>
        ))}

        <p className='lh-sm mt-3'>
          With that research and those conversations in mind, reflect on the
          questions below. Allow these reflections to be fluid, meaning come
          back to them as you go through more experiences that inform who you
          are and how you view yourself in a leadership role.
        </p>
      </SectionsWrapper>

      <SectionsWrapper img={Light} title={'Reflection'}>
        <LeadershipTextEditor
          title={
            'What did you learn and take away from your research and conversations with mentors concerning expertise?'
          }
        />
        <LeadershipTextEditor
          title={
            'Identify the fields of expertise that interest you or that you are already a part of (make sure you identify at least one specific field). Why are you interested in these forms of expertise? How do you demonstrate your knowledge in these areas?'
          }
        />
        <LeadershipTextEditor
          title={
            'Identify and explain how you can apply your reflection on expertise to be evident in your portfolio. How can this help you achieve market-ready certification?'
          }
        />
      </SectionsWrapper>
    </div>
  )
}

export default Expertise
