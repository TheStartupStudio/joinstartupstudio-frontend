import React, { useEffect, useState } from 'react'
import { NavLink, Route, Switch, useHistory } from 'react-router-dom'
import TestJournalContent from './TestJournalContent'
import searchIcon from '../../assets/images/search-icon.png'
import { FormattedMessage } from 'react-intl'
import axiosInstance from '../../utils/AxiosInstance'
import LtsEduLogo from '../../assets/images/LTS-EDU-logo.png'
import SidebarItems from './CurriculumSidebars/SidebarItems'
import FinancialSidebar from './CurriculumSidebars/FinancialSidebar'

const TestJournalType = (props) => {
  const history = useHistory()
  const [journals, setJournals] = useState([])
  const [weeks, setWeeks] = useState([])

  const [filteredWeeks, setFilteredWeeks] = useState(weeks)
  const [filteredJournals, setFilteredJournals] = useState(journals)
  const [searchKeyword, setSearchKeyword] = useState('')

  async function getJournals2(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/tasks`, {
        params: {
          category: props.category,

          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      })
      setJournals([...data].sort((a, b) => a.order - b.order))
    } catch (err) {}
  }
  useEffect(() => {
    if (props.match.params.type === 'task' && journals.length) {
      const taskId = journals.length > 0 ? journals[0].id : ''
      history.push(`/${props.match?.url?.split('/')[1]}/task/${taskId}`)
    } else if (props.match.params.type === 'week' && weeks.length) {
      const weekId = weeks.length > 0 ? weeks[0].id : ''
      history.push(`/${props.match?.url?.split('/')[1]}/week/${weekId}`)
    }
  }, [props.match.params.type, journals, weeks])

  async function getJournals2Weeks(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/weeks`, {
        params: {
          category: props.category,
          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      })
      setWeeks([...data].sort((a, b) => a.id - b.id))
    } catch (err) {}
  }

  useEffect(() => {}, [])

  useEffect(() => {
    props.match.params.type === 'task' && getJournals2()
    props.match.params.type === 'week' && getJournals2Weeks()
  }, [props.match.params.type])

  const dataByClass = {}

  journals.forEach((journalItem) => {
    const { id, title, class: journalClass, order } = journalItem

    if (!dataByClass[journalClass]) {
      dataByClass[journalClass] = []
    }

    dataByClass[journalClass].push({ id, title, order })
  })

  const journalTitle = () => {
    let journalData

    if (props.category === 'hs1') {
      journalData = {
        title: 'LTS YEAR ONE CURRICULUM',
        description: `Welcome to Year One of the LTS Program.
       Here you will find support and guidance as you deliver the curriculum and mentor students.`
      }
    } else if (props.category === 'hs2') {
      journalData = {
        title: 'LTS YEAR TWO CURRICULUM',
        description: `Welcome to Year Two of the LTS Program.`
      }
    } else if (props.category === 'hs3&hs4') {
      journalData = {
        title: 'LTS YEAR THREE & FOUR CURRICULUM',
        description: `Welcome to Years Three & Four of the LTS Program.`
      }
    } else if (props.category === 'financial-literacy') {
      journalData = {
        title: 'FINANCIAL LITERACY CURRICULUM',
        description: `Welcome to the course in Financial Literacy. 
        Here you will find support and guidance as you deliver the curriculum and mentor students.`
      }
    }
    return journalData
  }

  useEffect(() => {
    setFilteredWeeks(weeks)
  }, [weeks])
  useEffect(() => {
    setFilteredJournals(journals)
  }, [journals])

  const handleJournalSearch = (e) => {
    e.preventDefault()
    const keyword = e.target.value.toLowerCase()
    setSearchKeyword(keyword)
    let filteredData = []

    if (props.match.params.type === 'week') {
      filteredData = weeks.filter((week) =>
        week.title.toLowerCase().includes(keyword)
      )
      setFilteredWeeks(filteredData) // Update the filtered weeks state variable.
    } else if (props.match.params.type === 'task') {
      filteredData = journals.filter((task) =>
        task.title.toLowerCase().includes(keyword)
      )
      setFilteredJournals(filteredData)
    }
  }

  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-11 px-0">
            <div className="page-padding">
              <div className="d-flex justify-content-between">
                <div>
                  <div
                    style={{
                      fontSize: 27,
                      font: 'normal normal 600 30px/30px Montserrat',
                      letterSpacing: 0,
                      color: '#231F20',
                      marginBottom: 4
                    }}
                  >
                    {journalTitle()?.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      font: 'normal normal 600 13px/16px Montserrat',
                      letterSpacing: 0,
                      color: '#333D3D83',
                      width: '80%'
                    }}
                  >
                    {journalTitle()?.description}
                  </div>
                </div>
                <div>
                  <img
                    src={LtsEduLogo}
                    style={{ width: 180, objectFit: 'contain' }}
                    alt={'learn-to-start-edu'}
                  />
                </div>
              </div>

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
                              type={props.match.params.type}
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
                              type={props.match.params.type}
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
                <div
                  className="page-card__sidebar col-lg-4 col-md-5"
                  style={{ overflow: 'auto' }}
                >
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
                              handleJournalSearch(e)
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
                      marginBottom: 10,
                      cursor: 'pointer'
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
                    props.category !== 'financial-literacy' && (
                      <SidebarItems
                        url={props.match.url}
                        filteredJournals={filteredJournals}
                        category={props.category}
                        type={props.match.params.type}
                      />
                    )}
                  {props.match.params.type === 'task' &&
                    props.category === 'financial-literacy' && (
                      <FinancialSidebar
                        url={props.match.url}
                        dataByClass={dataByClass}
                        searchKeyword={searchKeyword}
                        category={'financial-literacy'}
                        type={props.match.params.type}
                      />
                    )}

                  {props.match.params.type === 'week' && (
                    <SidebarItems
                      url={props.match.url}
                      filteredJournals={filteredWeeks}
                      category={props.category}
                      type={props.match.params.type}
                    />
                  )}
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
