import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './style.css'
import {
  faGlobe,
  faFile,
  faPencilAlt,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons'
import { format, parse } from 'date-fns'

export const EducationDetails = (props) => {
  const [education, setEducation] = useState()

  useEffect(() => {
    setEducation(props.education)
  }, [props.education])

  return (
    <>
      {education && (
        <>
          <div className='col-12 d-flex experience-container'>
            <div className='image-container ps-md-1'>
              {education.image_url ? (
                <img src={education.image_url} alt='' />
              ) : (
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  style={{
                    width: '100px',
                    height: '80px',
                    color: '#BBBDBF'
                  }}
                />
              )}
            </div>
            <div className='break-experience'></div>
            <div className='experience-details pt-2 pt-md-0 px-md-4'>
              <h4>{education.college}</h4>
              <h4 style={{ fontWeight: '500' }}>
                {education.degree} in {education.field}
              </h4>
              <p>
                {}
                {format((parse(education.start_date, 'yyyy-MM-dd', new Date())), 'yyyy')}
                <span style={{ fontSize: '16px' }}> - </span>

                {education.end_date
                  ? format((parse(education.end_date, 'yyyy-MM-dd', new Date())), 'yyyy')
                  : 'Present'}
              </p>
              {education.description && (
                <div className='experience-description mt-2'>
                  <ul style={{ paddingLeft: '20px' }} className='m-0'>
                    {education.description.split('\n').map((line, index) => (
                      <li key={index} style={{ lineHeight: 1 }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(education.external_links?.link ||
                education.external_links?.link) && (
                <div className='row justify-content-between external_links mt-2'>
                  {education.external_links?.link && (
                    <div className='col-6 d-flex'>
                      <FontAwesomeIcon
                        icon={faGlobe}
                        style={{
                          width: '20px',
                          height: '20px',
                          color: '#707070'
                        }}
                      />
                      <a
                        href={
                          education.external_links?.link?.startsWith('http')
                            ? education.external_links?.link
                            : `https://${education.external_links?.link}`
                        }
                        target={'_blank'}
                        className='my-auto ms-2'
                      >
                        {education.external_links?.link}
                      </a>
                    </div>
                  )}
                  {education.external_links?.file && (
                    <div className='col-6 d-flex'>
                      <FontAwesomeIcon
                        icon={faFile}
                        style={{
                          width: '20px',
                          height: '20px',
                          color: '#707070'
                        }}
                      />
                      <a
                        href={
                          education.external_links?.file?.startsWith('http')
                            ? education.external_links?.file
                            : `https://${education.external_links?.file}`
                        }
                        target={'_blank'}
                        className='my-auto ms-2'
                      >
                        FILE
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            {props.editing && (
              <div className='pe-md-4 edit-icon'>
                <span className='text-end text-md-center'>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    onClick={() => {
                      props.setCurrentEducation(education)
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
            <div className='mb-4'></div>
          )}
        </>
      )}
    </>
  )
}
