import React from 'react'
import { useHistory } from 'react-router-dom'

const MyLtsGridItem = (props) => {
  const history = useHistory()
  return (
    <>
      <div
        onClick={() => history.push(props.to)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          class="row py-4 px-3 w-100"
          style={{
            background: '#F8F7F7 0% 0% no-repeat padding-box',
            minHeight: 150
          }}
        >
          <div
            className={
              'col-md-3 col-sm-12 d-flex justify-content-center align-items-top py-2'
            }
          >
            {props.itemNumberImage}
          </div>
          <div
            className={
              'col-md-9 col-sm-12 px-0 py-2 d-flex align-items-center flex-column justify-content-center'
            }
          >
            {props.title?.toLowerCase()?.includes('certification') && (
              <div
                style={{
                  font: 'normal normal 500 16px/22px Montserrat',
                  letterSpacing: 0.64,
                  color: '#231F20',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  textAlign: 'start',
                  width: '100%'
                }}
              >
                {props.title}
              </div>
            )}
            <div
              style={{
                font: 'normal normal normal 13px/17px Montserrat',
                letterSpacing: 0.52,
                color: '#333D3D'
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
