import React from 'react'

const MyLtsGridItem = (props) => {
  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          class="row py-4 px-4 w-100"
          style={{
            background: '#F8F7F7 0% 0% no-repeat padding-box',
          }}
        >
          <div className={'col-md-3 col-sm-12'}>{props.icon}</div>
          <div className={'col-md-9 col-sm-12'}>
            <div
              style={{
                font: 'normal normal 500 16px/22px Montserrat',
                letterSpacing: 0.64,
                color: '#231F20',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              {props.title}
            </div>
            <div
              style={{
                font: 'normal normal normal 13px/17px Montserrat',
                letterSpacing: 0.52,
                color: '#333D3D',
              }}
            >
              {props.description}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyLtsGridItem
