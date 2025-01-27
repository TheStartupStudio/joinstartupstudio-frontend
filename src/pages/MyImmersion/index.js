import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './style.css'
import ImmersionImage from '../../assets/images/Immersion/immersionMainImg (2).png'
import ImmersionImage2 from '../../assets/images/mainImmersionImage2.png'
import PrerequisiteModal from './Modals/PrerequisiteModal'
import { changeSidebarState } from '../../redux'

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
  border: '8px solid transparent',
  fontSize: '14px'
})

const MyButton = ({ href, top, left, width, height, className }) => {
  return (
    <a
      href={href}
      style={{ ...buttonStyle(top, left, width, height) }}
      className={className}
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
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '7%',
    background: 'white',
    padding: '50px ',
    boxShadow: ' 3px 3px 3px  3px #00000029'
  }
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  return (
    <div className='container-fluid iamr-page'>
      <div className='pt-4 '>
        <h2 className='immersion-page-title fw-bold'>LTS IMMERSION</h2>
        <p className='main-immersion-desc'>
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
          alt='Background'
          style={{ width: '90%', height: 'auto' }}
          className='main-immrs-image main-immrs-image-one'
        />
        <img
          src={ImmersionImage2}
          alt='Background'
          style={{ width: '90%', height: 'auto' }}
          className='main-immrs-image main-immrs-image-two'
        />

        <MyButton
          className='st1-immr-btn hover-effect'
          href='/my-immersion/step-1'
          top={30.7}
          left={18}
          width={7.2}
          height={12.8}
        />
        <MyButton
          className='st2-immr-btn hover-effect'
          // href='/my-immersion/step-2'
          href='/spotlight'
          top={30.7}
          left={36.2}
          width={7.2}
          height={12.8}
        />

        <p
          // href="/my-immersion/step-3"
          onClick={() =>
            setPrerequisitesModal({
              state: true,
              title: 'APPLY FOR INTERNSHIP',
              content:
                'You must first complete the prerequisites for this step before you can start'
            })
          }
          style={buttonStyle(30.7, 53.7, 7.2, 12.8)}
          className='st3-immr-btn hover-effect'
        >
          START
        </p>
        <p
          // href="/my-immersion/step-4"
          onClick={() =>
            setPrerequisitesModal({
              state: true,
              title: 'APPLY FOR ENTRY LEVEL EMPLOYEMENT',
              content:
                'You must first complete the prerequisites for this step before you can start'
            })
          }
          style={buttonStyle(30.7, 71.5, 7.2, 12.8)}
          className='st4-immr-btn hover-effect'
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
