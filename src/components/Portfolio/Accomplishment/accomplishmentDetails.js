import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import { faGlobe, faFile } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'

export const AccomplishmentDetails = (props) => {
  const [accomp, setAccomp] = useState()

  useEffect(() => {
    setAccomp(props.accomp)
  }, [props.accomp])

  return (
    <>
      {accomp && (
        <>
          <div
            style={{
              display: 'flex',
              padding: '20px 10px',
            }}
          >
            <div
              style={{
                width: '30%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: '1px solid #e5e5e5',
                paddingRight: 20,
              }}
            >
              <div>
                <div
                  style={{
                    textAlign: 'left',
                    font: 'normal normal bold 17px/22px Montserrat',
                    letterSpacing: 0.68,
                    color: '#231F20',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {accomp.title + ':'} {accomp.company}
                </div>
                <div
                  style={{
                    textAlign: 'left',
                    font: 'normal normal 500 15px/16px Montserrat',
                    letterSpacing: 0.6,
                    color: '#231F20',
                  }}
                >
                  {format(new Date(accomp.date_issued), 'MMMM yyyy')}
                </div>
              </div>
            </div>
            <div
              className={'d-flex justify-content-between '}
              style={{ width: '70%' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  font: 'normal normal 300 15px/17px Montserrat',
                  letterSpacing: 0.6,
                  color: '#231F20',
                  paddingLeft: 20,
                }}
              >
                {accomp?.description}
              </div>
              {props.editing && (
                <div className=" edit-icon">
                  <span className="text-end text-md-center">
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      onClick={() => {
                        props.setCurrentAccomp(accomp)
                      }}
                      style={{ height: '25px', width: '25px' }}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>

          {props.length - 1 !== props.index ? (
            <hr className="d-md-none mx-auto my-3" />
          ) : (
            <div className="mb-3"></div>
          )}
        </>
      )}
    </>
  )
}
