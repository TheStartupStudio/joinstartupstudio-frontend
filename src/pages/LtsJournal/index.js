import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory, Switch, Route } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import Accordion from 'react-bootstrap/Accordion'
import { changeSidebarState } from '../../redux'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import searchIcon from '../../assets/images/search-icon.png'

import LtsJournalContent from './content'

function getEarliestUserCellDate(journal) {
  let earliestDate = null

  function traverse(node) {
    if (Array.isArray(node)) {
      node.forEach(traverse)
    } else if (node && typeof node === 'object') {
      if (node.userCells && node.userCells.createdAt) {
        const createdAt = new Date(node.userCells.createdAt)
        if (!earliestDate || createdAt < earliestDate) {
          earliestDate = createdAt
        }
      }
      Object.values(node).forEach(traverse)
    }
  }

  traverse(journal)

  return earliestDate ? earliestDate.toISOString() : null
}

function LtsJournal(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  let [journals, setJournals] = useState([])
  let [loaded, setLoaded] = useState(false)
  let [journalActive, setJournalActive] = useState(false)
  const [journalsData, setJournalsData] = useState()
  const currentLanguage = useSelector((state) => state.lang.locale)
  let contentContainer = useRef()

  async function getJournals(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/`, {
        params: {
          category: props.category,
          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      })

      setJournalsData(data)
      setJournals(data)
      setLoaded(true)

      if (data.length > 0 && redir) {
        if (data[0].children && data[0].children.length > 0) {
          history.push(`${props.match.url}/${data[0].children[0].id}`)
        } else {
          history.push(`${props.match.url}/${data[0].id}`)
        }
      }

      if (journalActive === 'no') activeteFirstJournal()
    } catch (err) {}
  }

  function activeteFirstJournal() {
    if (journals.length > 0) {
      if (journals[0].children && journals[0].children.length > 0) {
        history.push(`${props.match.url}/${journals[0].children[0].id}`)
      } else {
        history.push(`${props.match.url}/${journals[0].id}`)
      }
    }
  }

  function journalChanged(journal) {
    getJournals(false)
  }
  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  useEffect(() => {
    getJournals()
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  let titleMapping = {
    hs1: 'my_journal.hs1_title',
    hs2: 'my_journal.hs2_title',
    hs3: 'my_journal.hs3_title',
    hs4: 'my_journal.hs4_title',
    'market-ready': 'my_journal.market-ready_title',
    'my-training': 'my_journal.my-training_title',
    'student-lts': 'student_journals.student-lts_title',
    'student-wellnes': 'student_journals.student-wellnes_title',
    'student-personal-finance':
      'student_journals.student-personal-finance_title',
    'student-leadership': 'student_journals.student-leadership_title',
    'my-mentorship': 'my_journal.mentorship_title'
  }

  let descriptionMapping = {
    hs1: 'my_journal.hs1_description',
    hs2: 'my_journal.hs2_description',
    hs3: 'my_journal.hs3_description',
    hs4: 'my_journal.hs4_description',
    'market-ready': 'my_journal.market-ready_description',
    'my-training': 'my_journal.my-training_description',
    'student-lts': 'student_journals.student-lts_description',
    'student-wellnes': 'student_journals.student-wellnes_description',
    'student-personal-finance':
      'student_journals.student-personal-finance_description',
    'student-leadership': 'student_journals.student-leadership_description',
    'my-mentorship': 'my_journal.mentorship_description'
  }

  const handleJournalSearch = (e) => {
    e.preventDefault()
    const keyword = e.target.value.toLowerCase()

    if (keyword.length <= 0) {
      setJournals(journalsData)
      return
    }

    const filteredJournals = journalsData.filter((journal) => {
      const journalTitleMatch = journal.title.toLowerCase().includes(keyword)

      const childrenTitleMatch = journal.children.some((child) =>
        child.title.toLowerCase().includes(keyword)
      )

      return journalTitleMatch || childrenTitleMatch
    })

    setJournals(filteredJournals)
  }
  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-11 px-0'>
            <div className='page-padding'>
              <div className='page-header'>
                <h3 className='page-header__title'>
                  <IntlMessages id={titleMapping[props.category]} />
                </h3>
                <p className='page-header__description'>
                  <IntlMessages id={descriptionMapping[props.category]} />
                </p>
              </div>

              <div className='page-card page-card--reverse'>
                <div
                  className='page-card__content styled-scrollbar col-lg-8 col-md-7'
                  ref={contentContainer}
                >
                  <Switch>
                    <Route
                      path={`${props.match.url}/:journalId`}
                      render={(renderprops) => (
                        <>
                          <LtsJournalContent
                            {...renderprops}
                            contentContainer={contentContainer}
                            backRoute={props.match.url}
                            saved={journalChanged}
                          />
                        </>
                      )}
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

                      <FormattedMessage
                        id='my_journal.search_journals'
                        defaultMessage='my_journal.search_journals'
                      >
                        {(placeholder) => (
                          <input
                            type='text'
                            className='search-input__input'
                            name='searchedNote'
                            placeholder={placeholder}
                            onChange={(e) => {
                              handleJournalSearch(e)
                            }}
                          />
                        )}
                      </FormattedMessage>
                    </label>
                  </div>

                  <div className='page-card__sidebar-content styled-scrollbar'>
                    <Accordion
                      defaultActiveKey='0'
                      className='accordion-menu
                      lizas-accordion
                        '
                    >
                      {journals.map((journalItem, journalItemIdx) => (
                        <div
                          key={journalItem.id}
                          className={`accordion-menu__item cursor-pointer accordion-menu__item-transition
                          `}
                        >
                          {journalItem.children &&
                          journalItem.children.length ? (
                            <>
                              <Accordion.Toggle
                                as={'a'}
                                href='#'
                                className={'accordion-menu__item-toggle'}
                                eventKey={`${journalItemIdx}`}
                                onClick={() =>
                                  journalItem.content
                                    ? history.push(
                                        `${props.match.url}/${journalItem.id}`
                                      )
                                    : null
                                }
                              >
                                <span>{journalItem.title}</span>
                                <FontAwesomeIcon icon={faAngleDown} />
                              </Accordion.Toggle>

                              <Accordion.Collapse
                                eventKey={`${journalItemIdx}`}
                              >
                                <ul className='accordion-menu__submenu'>
                                  {journalItem.children.map(
                                    (journalChildren) => {
                                      const earliestUserCellDate =
                                        getEarliestUserCellDate(journalChildren)
                                      return (
                                        <li
                                          key={journalChildren.id}
                                          className='accordion-menu__submenu-item'
                                        >
                                          <NavLink
                                            to={`${props.match.url}/${journalChildren.id}`}
                                          >
                                            <div className='accordion-menu__submenu-item-icon'>
                                              <FontAwesomeIcon
                                                icon={faFileAlt}
                                              />
                                            </div>
                                            <div className='accordion-menu__submenu-item-details'>
                                              <h5 className='accordion-menu__submenu-item-title'>
                                                {journalChildren.title}
                                              </h5>

                                              {props.category ===
                                              'student-personal-finance' ? (
                                                earliestUserCellDate ? (
                                                  <div className='accordion-menu__submenu-item-subtitle'>
                                                    {moment(
                                                      earliestUserCellDate
                                                    )
                                                      .locale(currentLanguage)
                                                      .format(
                                                        'MMMM D, YYYY | hh:mma'
                                                      )}
                                                  </div>
                                                ) : (
                                                  <div className='accordion-menu__submenu-item-subtitle accordion-menu__submenu-item-subtitle--not-started'>
                                                    NOT STARTED
                                                  </div>
                                                )
                                              ) : journalChildren.userEntry &&
                                                !!journalChildren.userEntry
                                                  .length &&
                                                !!journalChildren.userEntry[0]
                                                  .createdAt ? (
                                                <div className='accordion-menu__submenu-item-subtitle'>
                                                  {moment(
                                                    journalChildren.userEntry[0]
                                                      .createdAt
                                                  )
                                                    .locale(currentLanguage)
                                                    .format(
                                                      'MMMM D, YYYY | hh:mma'
                                                    )}
                                                </div>
                                              ) : (
                                                <div className='accordion-menu__submenu-item-subtitle accordion-menu__submenu-item-subtitle--not-started'>
                                                  NOT STARTED
                                                </div>
                                              )}
                                            </div>
                                          </NavLink>
                                        </li>
                                      )
                                    }
                                  )}
                                </ul>
                              </Accordion.Collapse>
                            </>
                          ) : (
                            // <Accordion.Toggle
                            //   as={'a'}
                            //   className={'accordion-menu__item-toggle'}
                            //   eventKey={`${journalItemIdx}`}
                            //   onClick={() =>
                            //     journalItem.content
                            //       ? history.push(
                            //           `${props.match.url}/${journalItem.id}`
                            //         )
                            //       : null
                            //   }
                            // >
                            //   <span>{journalItem.title}</span>
                            // </Accordion.Toggle>
                            <NavLink
                              to={`${props.match.url}/${journalItem.id}`}
                              className={'accordion-menu__item-toggle'}
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
      </div>
    </div>
  )
}

export default injectIntl(LtsJournal, {
  withRef: false
})
