import React from 'react'
import Step from './Step'
import { useLocation } from 'react-router-dom'
import useWindowWidth from '../../../hooks/useWindowWidth'

const Steps = (props) => {
  const location = useLocation()
  const isTraining = location.pathname.includes('my-training')
  const windowWidth = useWindowWidth()

  const gridTemplateColumns = () => {
    if (windowWidth > 500) {
      return 'repeat(4, 1fr)'
    } else if (windowWidth < 500) {
      return 'repeat(2, 1fr)'
    }
  }
  return (
    <div
      style={{
        font: 'normal normal 500 10.2px/17px Montserrat',
        letterSpacing: 0.18,
        color: '#333D3D',
        gridTemplateColumns: gridTemplateColumns(),
        rowGap: 10,
        display: 'grid',
        // display: windowWidth < 750 ? 'grid' : 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 0 30px 0',
        marginBottom: '30px',
        borderBottom:
          isTraining && props.selectedStepIndex !== null
            ? '1px solid #e3e3e3'
            : '0px solid #e3e3e3'
      }}
    >
      {/*{!loading && journal?.hasInstructorDebrief && (*/}
      <>
        {props.steps?.map((step, index) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{ height: '70px' }}>
              <Step
                key={index}
                index={index}
                selectedStepIndex={props.selectedStepIndex}
                step={step}
                selectedStep={(step) => props.selectStep(step, index)}
              />
            </div>

            {step?.title && (
              <div
                style={{
                  textAlign: 'center',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  height: '10px'
                }}
              >
                {step?.title}
              </div>
            )}
          </div>
        ))}
      </>
      {/*)}*/}
    </div>
  )
}

export default Steps
