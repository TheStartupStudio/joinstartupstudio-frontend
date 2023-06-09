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
              flexDirection: windowWidth < 730 ? 'column' : 'row',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: windowWidth < 730 ? '100%' : '30%',
                display: 'flex',
                justifyContent: windowWidth < 730 ? 'start' : 'center',
                alignItems: 'center',
                borderRight:
                  windowWidth < 730 ? '0px solid #e5e5e5' : '1px solid #e5e5e5',
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
              style={{ width: windowWidth < 730 ? '100%' : '70%' }}
            >
              <div
                style={{
                  textAlign: 'left',
                  font: 'normal normal 300 15px/17px Montserrat',
                  letterSpacing: 0.6,
                  color: '#231F20',
                  marginTop: windowWidth < 730 ? 6 : 0,
                  paddingLeft: windowWidth < 730 ? 0 : 20,
                }}
              >
                {accomp?.description}
              </div>
              {!isPreview && props.editing && windowWidth > 730 && (
                <div
                  className=" edit-icon"
                  style={{
                    paddingRight: windowWidth < 730 ? 0 : 10,
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
            {windowWidth < 730 && !isPreview && (
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => {
                  props.setCurrentAccomp(accomp)
                }}
                color={'#707070'}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 12,
                  right: 0,
                  height: '25px',
                  width: '25px',
                }}
              />
            )}
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
