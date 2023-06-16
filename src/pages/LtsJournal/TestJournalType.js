import React, { useEffect, useState } from 'react'
import {
  NavLink,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
import TestJournalContent from './TestJournalContent'
import searchIcon from '../../assets/images/search-icon.png'
import { FormattedMessage } from 'react-intl'
import axiosInstance from '../../utils/AxiosInstance'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment/moment'

const TestJournalType = (props) => {
  const [journals, setJournals] = useState([])
  const [weeks, setWeeks] = useState([])
  const match = useRouteMatch()
  const history = useHistory()
  const isWeek = match.path.includes('week')
  const isTask = match.path.includes('task')
  let [journalActive, setJournalActive] = useState(false)
  const [view, setView] = useState('task')
  async function getJournals2(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/`, {
        params: {
          category: props.category,
          platform:
            props.category === 'market-ready' ? 'student' : 'instructor',
        },
      })
      setJournals(data)

      // if (data.length > 0 && redir) {
      //   if (data[0].children && data[0].children.length > 0) {
      //     history.push(
      //       `${view === 'task' ? 'task' : 'week'}/${data[0].children[0].id}`
      //     )
      //   } else {
      //     history.push(`${view === 'task' ? 'task' : 'week'}/${data[0].id}`)
      //   }
      // }

      // if (journalActive == 'no') activeteFirstJournal()
    } catch (err) {}
  }

  async function getJournals2Weeks(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/weeks`, {
        params: {
          category: props.category,
          platform:
            props.category === 'market-ready' ? 'student' : 'instructor',
        },
      })
      setWeeks(data)

      // if (data.length > 0 && redir) {
      //   if (data[0].children && data[0].children.length > 0) {
      //     history.push(
      //       `${view === 'task' ? 'task' : 'week'}/${data[0].children[0].id}`
      //     )
      //   } else {
      //     history.push(`${view === 'task' ? 'task' : 'week'}/${data[0].id}`)
      //   }
      // }

      // if (journalActive == 'no') activeteFirstJournal()
    } catch (err) {}
  }

  // useEffect(() => {
  //   function activateFirstJournal() {
  //     if (journals.length > 0) {
  //       // if (journals[0].children && journals[0].children.length > 0) {
  //       //   history.push(`${props.match.url}/${journals[0].children[0].id}`)
  //       // } else {
  //       history.push(`${props.match.url}/${journals[0].id}`)
  //       // }
  //     }
  //   }
  //   activateFirstJournal()
  // }, [view])

  useEffect(() => {}, [])

  useEffect(() => {
    props.match.params.type === 'task' && getJournals2()
    props.match.params.type === 'week' && getJournals2Weeks()
  }, [props.match.params.type])

  const onChangeView = (view) => {
    setView(view)
  }
  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-11 px-0">
            <div className="page-padding">
              <div className="page-header">
                <h3 className="page-header__title">
                  {/*<IntlMessages id={titleMapping[props.category]} />*/}
                </h3>
                <p className="page-header__description">
                  {/*<IntlMessages id={descriptionMapping[props.category]} />*/}
                </p>
              </div>

              <div className="page-card page-card--reverse">
                <div
                  className="page-card__content styled-scrollbar col-lg-8 col-md-7"
                  // ref={contentContainer}
                >
                  {props.match.params.type === 'task' && (
                    <Switch>
                      <Route
                        path={`${props.match.url}/:id`}
                        render={(renderprops) => (
                          <>
                            <TestJournalContent
                              {...renderprops}
                              journals={journals}
                              // contentContainer={contentContainer}
                              backRoute={props.match.url}
                              // saved={journalChanged}
                              view={'task'}
                            />
                          </>
                        )}
                      />
                    </Switch>
                  )}
                  {props.match.params.type === 'week' && (
                    <Switch>
                      <Route
                        path={`${props.match.url}/:weekId`}
                        render={(renderprops) => (
                          <>
                            <TestJournalContent
                              {...renderprops}
                              journals={weeks}
                              // contentContainer={contentContainer}
                              backRoute={props.match.url}
                              // saved={journalChanged}
                              view={'week'}
                            />
                          </>
                        )}
                      />
                    </Switch>
                  )}
                </div>{' '}
                {/* page-card__content */}
                <div className="page-card__sidebar col-lg-4 col-md-5">
                  <div className="page-card__sidebar-header">
                    <label className="search-input">
                      <img
                        className="search-input__icon"
                        src={searchIcon}
                        alt="#"
                      />

                      <FormattedMessage
                        id="my_journal.search_journals"
                        defaultMessage="my_journal.search_journals"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            className="search-input__input"
                            name="searchedNote"
                            placeholder={placeholder}
                            onChange={(e) => {
                              // handleJournalSearch(e)
                            }}
                          />
                        )}
                      </FormattedMessage>
                    </label>
                  </div>
                  <div
                    style={{
                      background: '#51C7DF 0% 0% no-repeat padding-box',
                      border: '1px solid #51C7DF',
                      color: '#fff',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontSize: 12,
                      padding: '4px 10px',
                    }}
                    onClick={() => {
                      if (props.match.params.type === 'task') {
                        history.push(`${props.backRoute}/week`)
                        // setView('week')
                      } else if (props.match.params.type === 'week') {
                        history.push(`${props.backRoute}/task`)
                        // setView('task')
                      }
                    }}
                  >
                    Change view
                  </div>
                  {props.match.params.type === 'task' &&
                    journals.map((journalItem, journalItemIdx) => (
                      <div
                        key={journalItem.id}
                        className={`accordion-menu__item`}
                      >
                        <NavLink to={`${props.match.url}/${journalItem.id}`}>
                          <span>{journalItem.title}</span>
                        </NavLink>
                      </div>
                    ))}
                  {props.match.params.type === 'week' &&
                    weeks?.map((journalItem, journalItemIdx) => (
                      <div
                        key={journalItem.id}
                        className={`accordion-menu__item`}
                      >
                        <NavLink to={`${props.match.url}/${journalItem.id}`}>
                          <span>{journalItem.title}</span>
                        </NavLink>
                      </div>
                    ))}
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

export default TestJournalType
