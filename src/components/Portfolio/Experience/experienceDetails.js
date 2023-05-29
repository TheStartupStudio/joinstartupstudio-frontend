import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import {
  faGlobe,
  faFile,
  faPencilAlt,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { VerifyButton } from '../../../pages/PortfolioNew/editPortfolio'

export const ExperienceDetails = (props) => {
  const [experience, setExperience] = useState()

  useEffect(() => {
    setExperience(props.experience)
  }, [props.experience])

  return (
    <>
      {experience && (
        <>
          <div
            style={{
              width: '100%',
              display: 'flex',
              height: 230,
              padding: '20px 10px',
            }}
            // className="col-12 d-flex ms-0 experience-container"
          >
            <div
              // className='image-container ps-md-1'
              style={{
                width: '30%',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                borderRight: '1px solid #e5e5e5',
                paddingRight: 40,
              }}
            >
              {experience?.image_url ? (
                <img
                  src={experience?.image_url}
                  alt=""
                  style={{ width: 90, height: 70, objectFit: 'cover' }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBriefcase}
                  style={{
                    width: '100px',
                    height: '80px',
                    color: '#BBBDBF',
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    marginBottom: 0,
                    font: 'normal normal 500 15px/16px Montserrat',
                    letterSpacing: '0.6px',
                    color: '#231F20',
                  }}
                >
                  {experience?.company}
                </div>
                <div
                  style={{
                    marginBottom: 0,
                    font: 'normal normal light 15px/16px Montserrat',
                    letterSpacing: '0.6px',
                    color: '#231F20',
                  }}
                >
                  {experience?.location}
                </div>
                <div
                  style={{
                    marginBottom: 0,
                    font: 'normal normal light 15px/16px Montserrat',
                    letterSpacing: '0.6px',
                    color: '#231F20',
                  }}
                >
                  {format(new Date(experience?.start_date), 'MMM yyyy')}
                  <span style={{ fontSize: '16px' }}> - </span>
                  {experience?.end_date
                    ? format(new Date(experience?.end_date), 'MMM yyyy')
                    : 'Present'}
                </div>
              </div>
            </div>
            {/*<div className='break-experience'></div>*/}
            <div
              style={{
                width: '70%',
                paddingLeft: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              // className='experience-details pt-2 pt-md-0 px-md-4'
            >
              <div style={{ marginBottom: 'auto' }}>
                <div className={'d-flex justify-content-between'}>
                  <div
                    style={{
                      font: 'normal normal 600 17px/17px Montserrat',
                      letterSpacing: '0.6px',
                      color: '#231F20',
                      paddingBottom: 10,
                    }}
                  >
                    {experience?.title}
                  </div>

                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    onClick={() => {
                      props.setCurrentExperience(experience)
                    }}
                    color={'#707070'}
                    className="editICO"
                    style={{
                      height: '25px',
                      width: '25px',
                    }}
                  />
                </div>

                <div className="experience-description">
                  {/*<ul style={{ paddingLeft: '20px' }} className="mt-1">*/}
                  {/*  {experience?.description.split('\n').map((line, index) => (*/}
                  {/*    <li*/}
                  {/*      key={index}*/}
                  {/*      style={{*/}
                  {/*        font: 'normal normal 300 15px/17px Montserrat',*/}
                  {/*        letterSpacing: '0.6px',*/}
                  {/*        color: '#231F20',*/}
                  {/*      }}*/}
                  {/*    >*/}
                  {/*      {line}*/}
                  {/*    </li>*/}
                  {/*  ))}*/}
                  {/*</ul>*/}
                  <ul style={{ paddingLeft: '0px' }} className="mt-1">
                    {experience?.description.split('\n').map((line, index) => (
                      <li
                        key={index}
                        style={{
                          font: 'normal normal 300 15px/17px Montserrat',
                          letterSpacing: '0.6px',
                          color: '#231F20',
                          listStyleType: 'none', // Remove default disc bullet
                        }}
                      >
                        * {line} {/* Add asterisk before each line */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className={`d-flex ${
                  experience?.external_links?.link
                    ? ' justify-content-between'
                    : 'justify-content-end'
                }`}
              >
                {(experience?.external_links?.link ||
                  experience?.external_links?.link) && (
                  <div
                    className="d-flex justify-content-between external_links gap-3"
                    style={{ marginTop: 'auto' }}
                  >
                    {experience?.external_links?.link && (
                      <div className="d-flex">
                        <FontAwesomeIcon
                          icon={faGlobe}
                          style={{
                            width: '20px',
                            height: '20px',
                            color: '#51C7DF',
                          }}
                        />
                        <a
                          href={
                            experience.external_links?.link?.startsWith('http')
                              ? experience.external_links?.link
                              : `https://${experience.external_links?.link}`
                          }
                          style={{
                            font: 'normal normal 600 15px/16px Montserrat',
                            letterSpacing: '0.6px',
                            color: '#51C7DF',
                          }}
                          target={'_blank'}
                          className="my-auto ms-2"
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
                      <div className=" d-flex">
                        <FontAwesomeIcon
                          icon={faFile}
                          style={{
                            width: '20px',
                            height: '20px',
                            color: '#51C7DF',
                          }}
                        />
                        <a
                          href={
                            experience.external_links?.file?.startsWith('http')
                              ? experience.external_links?.file
                              : `https://${experience.external_links?.file}`
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
                <VerifyButton width={'110px'} />
              </div>
            </div>
            {/*{props.editing && (*/}
            {/*  <div className=" edit-icon">*/}
            {/*    <span className="text-end text-md-center">*/}
            {/*      <FontAwesomeIcon*/}
            {/*        icon={faPencilAlt}*/}
            {/*        onClick={() => {*/}
            {/*          props.setCurrentExperience(experience)*/}
            {/*        }}*/}
            {/*        color={'#707070'}*/}
            {/*        className="editICO"*/}
            {/*        style={{*/}
            {/*          height: '25px',*/}
            {/*          width: '25px',*/}
            {/*        }}*/}
            {/*      />*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>

          {props.length - 1 !== props.index ? (
            <hr className="d-md-none mx-auto mt-3 mb-4" />
          ) : (
            <div className="mb-4"></div>
          )}
        </>
      )}
    </>
  )
}
