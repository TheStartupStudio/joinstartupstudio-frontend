import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import { faGlobe, faFile } from '@fortawesome/free-solid-svg-icons'
import { format, parse } from 'date-fns'

export const AccomplishmentDetails = (props) => {
  const [accomp, setAccomp] = useState()

  useEffect(() => {
    setAccomp(props.accomp)
  }, [props.accomp])

  return (
    <>
      {accomp && (
        <>
          <div className='d-flex'>
            <div
              className={`education-details mb-md-3 ${
                props.editing ? 'ms-md-1' : ''
              }`}
            >
              <h4>
                {accomp.title} : {accomp.company}
              </h4>
              <h4 style={{ fontWeight: '500' }}>
                { 
                format((parse(props.accomp.date_issued, 'yyyy-MM-dd', new Date())), 'MMMM yyyy')}
              </h4>
              <p className='my-2'>{accomp.description}</p>
            </div>
            {props.editing && (
              <div className='pe-md-4 edit-icon'>
                <span className='text-end text-md-center'>
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
          {props.length - 1 !== props.index ? (
            <hr className='d-md-none mx-auto my-3' />
          ) : (
            <div className='mb-3'></div>
          )}
        </>
      )}
    </>
  )
}
