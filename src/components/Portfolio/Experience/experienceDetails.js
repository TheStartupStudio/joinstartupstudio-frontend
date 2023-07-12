import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import {
  faGlobe,
  faFile,
  faPencilAlt,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons'
import { format, parse } from 'date-fns'

export const ExperienceDetails = (props) => {
  const [experience, setExperience] = useState()

  useEffect(() => {
    setExperience(props.experience)
  }, [props.experience])

  return (
    <>
      {experience && (
        <>
          <div className='col-12 d-flex ms-0 experience-container'>
            <div className='image-container ps-md-1'>
              {experience.image_url ? (
                <img src={experience.image_url} alt='' />
              ) : (
                <FontAwesomeIcon
                  icon={faBriefcase}
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
              <h4>{experience.title}</h4>
              <h5>{experience.company}</h5>
              <p>{experience.location}</p>
              <p>
                {format((parse(experience.start_date, 'yyyy-MM-dd', new Date())), 'MMMM yyyy')}
                <span style={{ fontSize: '16px' }}> - </span>
                {experience.end_date
                  ? format((parse(experience.end_date, 'yyyy-MM-dd', new Date())), 'MMMM yyyy')
                  : 'Present'}
              </p>
              <div className='experience-description'>
                <ul style={{ paddingLeft: '20px' }} className='mt-1'>
                  {experience.description.split('\n').map((line, index) => (
                    <li key={index} style={{ lineHeight: 1 }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              {(experience.external_links?.link ||
                experience.external_links?.link) && (
                <div className='row justify-content-between external_links mt-2'>
                  {experience.external_links?.link && (
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
                          experience.external_links?.link?.startsWith('http')
                            ? experience.external_links?.link
                            : `https://${experience.external_links?.link}`
                        }
                        target={'_blank'}
                        className='my-auto ms-2'
                      >
                        {experience?.external_links?.link?.length > 40
                          ? experience?.external_links?.link
                              .toString()
                              .substring(0, 30) + '...'
                          : experience?.external_links?.link}
                      </a>
                    </div>
                  )}
                  {experience.external_links?.file && (
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
                          experience.external_links?.file?.startsWith('http')
                            ? experience.external_links?.file
                            : `https://${experience.external_links?.file}`
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
                      props.setCurrentExperience(experience)
                    }}
                    className='editICO'
                    style={{ height: '25px', width: '25px' }}
                  />
                </span>
              </div>
            )}
          </div>

          {props.length - 1 !== props.index ? (
            <hr className='d-md-none mx-auto mt-3 mb-4' />
          ) : (
            <div className='mb-4'></div>
          )}
        </>
      )}
    </>
  )
}
