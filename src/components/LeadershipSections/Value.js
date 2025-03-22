import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'
import Light from '../../assets/images/academy-icons/light.png'
import SectionsWrapper from './SectionsWrapper'
import LeadershipTextEditor from './LeadershipTextEditor'

const array = [
  'Transparency',
  'Independence',
  'Positivity',
  'Flexibility',
  'Accountability',
  'Adaptability',
  'Integrity',
  'Sustainability',
  'Efficiency',
  'Empathy'
]

function Value() {
  const [reflections, setReflections] = useState([{ id: 1, content: '' }])

  const handleAddReflection = () => {
    const newReflection = { id: Date.now(), content: '' }
    setReflections([...reflections, newReflection])
  }

  const handleRemoveReflection = (id) => {
    setReflections(reflections.filter((reflection) => reflection.id !== id))
  }

  const handleContentChange = (id, value) => {
    setReflections(
      reflections.map((reflection) =>
        reflection.id === id ? { ...reflection, content: value } : reflection
      )
    )
  }

  return (
    <div className='d-grid grid-col-2 gap-4'>
      <SectionsWrapper title={'Values'}>
        <p className='lh-sm'>
          The personal values that inform all of your decisions and must align
          with the organization or company you work with professionally. So,
          what are some potential values that you are willing to commit to and
          allow to inform who you work with and how you work? These values can
          include: transparency, independence, positivity, flexibility,
          accountability, adaptability, integrity, sustainability, efficiency,
          and empathy. (There are more). Do any of these values already fit with
          your identity? Do you want to aspire to holding true to any of these
          values?
        </p>
        <p className='lh-sm'>
          Start your research process examining different values. Research what
          these values mean and what they look like in the workplace. Ask your
          network of mentors which of these values define them and why.
        </p>

        <p className='mb-0 fs-15 fw-medium'>Values</p>
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
          are and how you view yourself in a leadership role.{' '}
        </p>
      </SectionsWrapper>

      <SectionsWrapper img={Light} title={'Reflection'}>
        <LeadershipTextEditor
          title={
            'What did you learn and take away from your research and conversations with mentors concerning values?'
          }
        />
        <LeadershipTextEditor
          title={
            'Identify the values (at least three) that currently inform your decision-making. Why are you committed to these values? How do you demonstrate your commitment to these values?'
          }
        />
        <LeadershipTextEditor
          title={
            'Identify and explain how you can apply your reflection on values to be evident in your portfolio. How can this help you achieve market-ready certification?'
          }
        />
      </SectionsWrapper>
    </div>
  )
}

export default Value
