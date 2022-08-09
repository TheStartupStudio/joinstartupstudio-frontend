import React, { useState, useRef } from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import searchIcon from '../../assets/images/search-icon.png'

import LtsJournalContent from './content'

const JournalsBody = (props) => {
  let contentContainer = useRef()
  console.log(props)
  return (
    <div id='main-body'>
      <div className='container-fluid mt-5'>
        <div className='row'>
          <div className='page-card page-card--reverse'>
            <div
              className='page-card__content styled-scrollbar col-lg-8 col-md-7'
              ref={contentContainer}
            >
              <Switch>
                <Route
                  path={`student-journals/684/:id`}
                  render={(renderprops) => (
                    <>
                      {console.log(renderprops, 'renderprops')}
                      <LtsJournalContent
                        {...renderprops}
                        contentContainer={contentContainer}
                      />
                    </>
                  )}
                />
                <Route
                  component={(renderprops) => {
                    // noJournalSelected()
                    return <div></div>
                  }}
                />
              </Switch>
            </div>{' '}
            {/* page-card__content */}
            <div className='page-card__sidebar col-lg-4 col-md-5'>
              <div className='page-card__sidebar-header'>
                <label className='search-input'>
                  <img
                    className='search-input__icon'
                    src={searchIcon}
                    alt='#'
                  />
                </label>
              </div>

              <div className='page-card__sidebar-content styled-scrollbar'>
                <Accordion defaultActiveKey='0' className='accordion-menu'>
                  {props.data.map((journalItem, journalItemIdx) => (
                    <div
                      //   key={journalItem.id}
                      className={`accordion-menu__item`}
                    >
                      {journalItem.children && journalItem.children.length ? (
                        <>
                          {console.log(journalItem)}
                          <Accordion.Toggle
                            as={'a'}
                            href='#'
                            className='accordion-menu__item-toggle'
                            eventKey={`${journalItemIdx}`}
                          >
                            <span>{journalItem.title}</span>
                            <FontAwesomeIcon icon={faAngleDown} />
                          </Accordion.Toggle>

                          <Accordion.Collapse eventKey={`${journalItemIdx}`}>
                            <ul className='accordion-menu__submenu'>
                              {journalItem.children.map((journalChildren) => (
                                <li
                                  // key={journalChildren.id}
                                  className='accordion-menu__submenu-item'
                                >
                                  <NavLink
                                    to={`/student-journals/684/${journalChildren.id}`}
                                    // to={`${props.match.url}/${journalChildren.id}`}
                                    // to={`test`}
                                  >
                                    <div className='accordion-menu__submenu-item-icon'>
                                      <FontAwesomeIcon icon={faFileAlt} />
                                    </div>
                                    <div className='accordion-menu__submenu-item-details'>
                                      <h5 className='accordion-menu__submenu-item-title'>
                                        {journalChildren.title}
                                      </h5>
                                      {journalChildren.userEntry &&
                                      !!journalChildren.userEntry.length &&
                                      !!journalChildren.userEntry[0]
                                        .createdAt ? (
                                        <div className='accordion-menu__submenu-item-subtitle'>
                                          {/* {moment(
                                                  journalChildren.userEntry[0]
                                                    .createdAt
                                                )
                                                  .locale(currentLanguage)
                                                  .format(
                                                    'MMMM D, YYYY | hh:mma'
                                                  )} */}
                                        </div>
                                      ) : (
                                        <div className='accordion-menu__submenu-item-subtitle accordion-menu__submenu-item-subtitle--not-started'>
                                          NOT STARTED
                                        </div>
                                      )}
                                    </div>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </Accordion.Collapse>
                        </>
                      ) : (
                        <NavLink
                          className={
                            window.location.pathname.includes('lts-journal') ||
                            window.location.pathname.includes(
                              'personal-finance-journal'
                            )
                              ? 'accordion-menu__item-toggle'
                              : ''
                          }
                          //   to={`${props.match.url}/${journalItem.id}`}
                          to={`test`}
                        >
                          <span>{journalItem.title}</span>
                        </NavLink>
                      )}
                    </div>
                  ))}
                  {/* journals.map */}
                </Accordion>
              </div>
            </div>
            {/* page-card__sidebar */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalsBody
