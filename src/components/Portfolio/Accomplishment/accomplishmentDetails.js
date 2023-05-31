import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import { faGlobe, faFile } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

export const AccomplishmentDetails = (props) => {
  const [accomp, setAccomp] = useState()

  useEffect(() => {
    setAccomp(props.accomp)
  }, [props.accomp])

  const history = useHistory()
  const isPreview = history.location.pathname.includes('preview')

  const windowWidth = useWindowWidth()

  return (
    <>
      {accomp && (
        <>
          <div
            style={{
              display: 'flex',
              padding: '20px 10px',
              flexDirection: windowWidth < 500 ? 'column' : 'row',
            }}
          >
            <div
              style={{
                width: windowWidth < 500 ? '100%' : '30%',
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
              style={{ width: windowWidth < 500 ? '100%' : '70%' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  font: 'normal normal 300 15px/17px Montserrat',
                  letterSpacing: 0.6,
                  color: '#231F20',
                  marginTop: windowWidth < 500 ? 6 : 0,
                  paddingLeft: windowWidth < 500 ? 0 : 20,
                }}
              >
                {accomp?.description}
              </div>
              {!isPreview && props.editing && (
                <div
                  className=" edit-icon"
                  style={{
                    paddingRight: windowWidth < 500 ? 0 : 10,
                  }}
                >
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

          {/*{props.length - 1 !== props.index ? (*/}
          {/*  <hr className="d-md-none mx-auto my-3" />*/}
          {/*) : (*/}
          {/*  <div className="mb-3"></div>*/}
          {/*)}*/}
        </>
      )}
    </>
  )
}
