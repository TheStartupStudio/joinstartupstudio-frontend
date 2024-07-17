import React from 'react'

const MyLearnToStartEDU = (props) => {
  return (
    <div className={'m-2'}>
      <div className="container">
        <div
          style={{
            font: 'normal normal bold 24px Montserrat',
            letterSpacing: 0.96,
            color: '#231F20',
            textTransform: 'uppercase',
            marginBottom: 20
          }}
        >
          {props.title}
        </div>

        <div
          style={{
            background: '#F8F7F7 0% 0% no-repeat padding-box',
            padding: 20
          }}
        >
          <div
            style={{
              background: '#FFF ',

              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 5
            }}
          >
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyLearnToStartEDU
