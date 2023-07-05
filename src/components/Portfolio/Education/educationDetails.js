import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './style.css'
import {
  faGlobe,
  faFile,
  faPencilAlt,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

export const EducationDetails = (props) => {
  const [education, setEducation] = useState()

  useEffect(() => {
    setEducation(props.education)
  }, [props.education])

  const history = useHistory()
  const isPreview = history.location.pathname.includes('preview')

  const windowWidth = useWindowWidth()
  return (
    <>
      {education && (
        <>
          <div
            style={{
              width: '100%',
              display: 'flex',
              padding: '20px 10px',
              height: '100%',
              flexDirection: windowWidth < 730 ? 'column' : 'row',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: windowWidth < 730 ? '100%' : '30%',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                borderRight: windowWidth < 730 ? '0px' : '1px solid #e5e5e5',
                borderBottom: windowWidth < 730 ? '1px solid #e5e5e5' : '0px',
                paddingBottom: windowWidth < 730 ? '4px' : '0px',
                paddingRight: windowWidth < 730 ? 0 : 40
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: windowWidth < 730 ? 'center' : 'start',
                  paddingBottom: windowWidth < 730 ? 5 : 0
                }}
              >
                {education?.image_url ? (
                  <img
                    src={education?.image_url}
                    alt=""
                    style={{ width: 90, height: 70, objectFit: 'cover' }}
                  />
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

              <div>
                <div
                  style={{
                    font: 'normal normal 600 15px Montserrat',
                    letterSpacing: 0.6,
                    color: '#231F20',
                    marginBottom: 6
                  }}
                >
                  {education.college}
                </div>
                <div
                  style={{
                    font: 'normal normal 300 15px Montserrat',
                    letterSpacing: 0.6,
                    color: '#231F20'
                  }}
                >
                  {}
                  {format(new Date(education.start_date), 'yyyy')}
                  <span style={{ fontSize: '16px' }}> - </span>

                  {education.end_date
                    ? format(new Date(education.end_date), 'yyyy')
                    : 'Present'}
                </div>
              </div>
            </div>
            {/*<div className='break-experience'></div>*/}
            <div
              style={{
                width: windowWidth < 730 ? '100%' : '70%',
                paddingLeft: windowWidth < 730 ? 0 : 20,
                marginTop: windowWidth < 730 ? 6 : 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="experience-details "
            >
              <div style={{ marginBottom: 'auto' }}>
                <div className={'d-flex justify-content-between'}>
                  {/*<h4>{education.college}</h4>*/}
                  <div
                    style={{
                      font: 'normal normal 600 17px/17px Montserrat',
                      letterSpacing: '0.6px',
                      color: '#231F20',
                      paddingBottom: 10
                    }}
                  >
                    {education?.degree} in {education?.field}
                  </div>
                  {!isPreview && props.editing && windowWidth > 730 && (
                    <div className=" edit-icon">
                      <span className="text-end text-md-center">
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
                {/*<p>*/}
                {/*  {}*/}
                {/*  {format(new Date(education.start_date), 'yyyy')}*/}
                {/*  <span style={{ fontSize: '16px' }}> - </span>*/}

                {/*  {education.end_date*/}
                {/*    ? format(new Date(education.end_date), 'yyyy')*/}
                {/*    : 'Present'}*/}
                {/*</p>*/}
                {education.description && (
                  <div className="experience-description mt-2">
                    <ul style={{ paddingLeft: '0px' }} className="m-0">
                      {education.description.split('\n').map((line, index) =>
                        line.trim() ? (
                          <li
                            key={index}
                            style={{
                              font: 'normal normal 300 15px/17px Montserrat',
                              letterSpacing: '0.6px',
                              color: '#231F20',
                              listStyleType: 'none' // Remove default disc bullet
                            }}
                          >
                            * {line} {/* Add asterisk before each line */}
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 'auto' }}>
                {(education.external_links?.link ||
                  education.external_links?.link) && (
                  <div className="row justify-content-between external_links mt-2">
                    {education.external_links?.link && (
                      <div className="col-6 d-flex">
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
                          className="my-auto ms-2"
                        >
                          {education.external_links?.link}
                        </a>
                      </div>
                    )}
                    {education.external_links?.file && (
                      <div className="col-6 d-flex">
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
                          className="my-auto ms-2"
                        >
                          FILE
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {windowWidth < 730 && !isPreview && (
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => {
                  props.setCurrentEducation(education)
                }}
                color={'#707070'}
                className="editICO"
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 12,
                  right: 0,
                  height: '25px',
                  width: '25px'
                }}
              />
            )}
          </div>
          {/*{props.length - 1 !== props.index ? (*/}
          {/*  <hr className="d-md-none mx-auto my-3" />*/}
          {/*) : (*/}
          {/*  <div className="mb-4"></div>*/}
          {/*)}*/}
        </>
      )}
    </>
  )
}
