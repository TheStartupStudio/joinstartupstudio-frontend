import React, { useState } from 'react'
import './style.css'
import ImmersionImage from '../../assets/images/Immersion/Immersion Graphic.png'
import PrerequisiteModal from './Modals/PrerequisiteModal'

const buttonStyle = (top, left, width, height) => ({
  position: 'absolute',
  top: `${top}%`,
  left: `${left}%`,
  width: `${width}%`,
  height: `${height}%`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  outline: 'none',
  color: '#364040',
  fontWeight: '600',
  borderRadius: '50%',
  background:
    'linear-gradient(white, white) padding-box,linear-gradient(to right, rgba(219, 54, 148, 1), rgba(128, 197, 220, 1)) border-box',
  border: '8px solid transparent'
})

const MyButton = ({ href, top, left, width, height }) => {
  return (
    <a
      href={href}
      style={{ ...buttonStyle(top, left, width, height) }}
      className="hover-effect"
    >
      START
    </a>
  )
}

const MyImmersion = () => {
  const [prerequisitesModal, setPrerequisitesModal] = useState({
    state: false,
    title: '',
    content: ''
  })
  const containerStyle = {
    position: 'relative',
    maxWidth: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '7%'
  }

  return (
    <div className="container-fluid iamr-page">
      <div className="pt-4 ">
        <h2 className="fw-bold">LTS IMMERSION</h2>
        <p>
          Our Industry Partner organizations share their challenges with the LTS
          students so they can experience the reality of market-based problem
          solving while leveraging their personal development in the areas of
          Mentorship, Relationship, Story, and Failure.
        </p>
      </div>
      <hr />

      <div style={containerStyle}>
        <img
          src={ImmersionImage}
          alt="Background"
          style={{ width: '100%', height: 'auto' }}
        />
        <MyButton
          href="/my-immersion/step-1"
          top={19}
          left={8}
          width={11}
          height={22}
        />
        <MyButton
          href="/my-immersion/step-2"
          top={19}
          left={32}
          width={11}
          height={22}
        />
        ;
        <p
          // href="/my-immersion/step-3"
          onClick={() =>
            setPrerequisitesModal({
              state: true,
              title: 'Apply for internship',
              content:
                'You must first complete the prerequisites for this step before you can start'
            })
          }
          style={buttonStyle(19, 55, 11, 22)}
          className="hover-effect"
        >
          START
        </p>
        <p
          // href="/my-immersion/step-4"
          onClick={() =>
            setPrerequisitesModal({
              state: true,
              title: 'Apply for entry level employement',
              content:
                'You must first complete the prerequisites for this step before you can start'
            })
          }
          style={buttonStyle(19, 79, 11, 22)}
          className="hover-effect"
        >
          START
        </p>
      </div>

      {/* <div style={{ marginTop: '-9%', padding: '2%' }}>
      </div> */}
      {prerequisitesModal.state && (
        <PrerequisiteModal
          show={prerequisitesModal}
          onHide={() => setPrerequisitesModal({ state: false })}
          title={prerequisitesModal.title}
          content={prerequisitesModal.content}
        />
      )}
    </div>
  )
}

export default MyImmersion
