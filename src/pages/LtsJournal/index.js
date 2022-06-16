import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  NavLink,
  Link,
  useParams,
  useHistory,
  Switch,
  Route,
  useLocation
} from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import Accordion from 'react-bootstrap/Accordion'
import { setAccordionToggled, changeSidebarState } from '../../redux'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import searchIcon from '../../assets/images/search-icon.png'

import LtsJournalContent from './content'

function LtsJournal(props) {
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
        params: { category: props.category }
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

      if (journalActive == 'no') activeteFirstJournal()
    } catch (err) {}
  }

  function noJournalSelected() {
    setJournalActive('no')
    if (loaded) {
      activeteFirstJournal()
    }
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
    // let updatedJournals = updateJournalEntry(journals, journal);
    // setJournals(updatedJournals);
    getJournals(false)
  }
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  function updateJournalEntry(journals, journal) {
    return journals.map((item) => {
      return {
        ...item,
        ...(item.id == journal.journalId ? { userEntry: [journal] } : {}),
        ...(item.children
          ? { children: updateJournalEntry(item.children, journal) }
          : {})
      }
    })
  }

  useEffect(function () {
    getJournals()
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  let titleMapping = {
    lts: 'my_journal.lts_title',
    wellness: 'my_journal.wellness_title',
    'personal-finance': 'my_journal.personal-finance_title',
    'market-ready': 'my_journal.market-ready_title',
    entrepreneurship: 'my_journal.entrepreneurship_title'
  }
  let descriptionMapping = {
    lts: 'my_journal.lts_description',
    wellness: 'my_journal.wellness_description',
    'personal-finance': 'my_journal.personal-finance_description',
    'market-ready': 'my_journal.market-ready_description',
    entrepreneurship: 'my_journal.entrepreneurship_description'
  }
  const handleJournalSearch = (e) => {
    e.preventDefault()
    const keyword = e.target.value.toLowerCase()

    if (keyword.length <= 0) {
      setJournals(journalsData)
      return
    }

    if (!journalsData.every((item) => item.children.length <= 0)) {
      setJournals([
        ...journalsData.filter((journal) =>
          journal.children.some((child) =>
            child.title.toLowerCase().includes(keyword)
          )
        )
      ])
    }
    // else {
    // setJournals([
    //   ...journalsData.filter((journal) =>
    //     journal.title.toLowerCase().includes(keyword)
    //   )
    // ])
    // }
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
                    {/* <Route
                      component={(renderprops) => {
                        noJournalSelected()
                        return <div></div>
                      }}
                    /> */}
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
                    <Accordion defaultActiveKey='0' className='accordion-menu'>
                      {journals.map((journalItem, journalItemIdx) => (
                        <div
                          key={journalItem.id}
                          className={`accordion-menu__item`}
                        >
                          {journalItem.children &&
                          journalItem.children.length ? (
                            <>
                              <Accordion.Toggle
                                as={'a'}
                                href='#'
                                className={'accordion-menu__item-toggle'}
                                eventKey={`${journalItemIdx}`}
                              >
                                <span>{journalItem.title}</span>
                                <FontAwesomeIcon icon={faAngleDown} />
                              </Accordion.Toggle>

                              <Accordion.Collapse
                                eventKey={`${journalItemIdx}`}
                              >
                                <ul className='accordion-menu__submenu'>
                                  {journalItem.children.map(
                                    (journalChildren) => (
                                      <li
                                        key={journalChildren.id}
                                        className='accordion-menu__submenu-item'
                                      >
                                        <NavLink
                                          to={`${props.match.url}/${journalChildren.id}`}
                                        >
                                          <div className='accordion-menu__submenu-item-icon'>
                                            <FontAwesomeIcon icon={faFileAlt} />
                                          </div>
                                          <div className='accordion-menu__submenu-item-details'>
                                            <h5 className='accordion-menu__submenu-item-title'>
                                              {journalChildren.title}
                                            </h5>
                                            {journalChildren.userEntry &&
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
                                  )}
                                </ul>
                              </Accordion.Collapse>
                            </>
                          ) : (
                            <NavLink
                              className={
                                window.location.pathname.includes(
                                  'lts-journal'
                                ) ||
                                window.location.pathname.includes(
                                  'personal-finance-journal'
                                )
                                  ? 'accordion-menu__item-toggle'
                                  : ''
                              }
                              to={`${props.match.url}/${journalItem.id}`}
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
