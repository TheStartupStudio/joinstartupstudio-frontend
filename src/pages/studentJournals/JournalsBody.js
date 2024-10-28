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
import defaultImage from '../../assets/images/profile-image.png'
import LtsJournalContent from './content'
import Select from 'react-select'
import NotAllowed from './NotAllowed'
import { getStudentInfoById } from '../../redux/users/Actions'

function JournalsBody(props) {
  const studentId = parseInt(useParams().studentId)
  const history = useHistory()
  let [journals, setJournals] = useState([])
  let [loaded, setLoaded] = useState(false)
  let [journalActive, setJournalActive] = useState(false)
  const [journalsData, setJournalsData] = useState()
  const [fetchingUserData, setFetchingUserData] = useState(true)
  const [notAllowed, setNotAllowed] = useState(false)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [user, setUser] = useState({})
  const [globalCategory, setGlobalCategory] = useState('lts')
  const userBasicInfo = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo
  )

  let contentContainer = useRef()
  const studentInfo = useSelector(
    (state) => state.users.studentInfo
  )

  async function getJournals(category = 'student-lts', redir = true) {
    setGlobalCategory(category)
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/fromInstructor/`, {
        params: {
          category,
          platform:
            category === 'market-ready' ||
            category === 'personal-finance' ||
            category === 'entrepreneurship'
              ? 'student'
              : 'instructor',
          studentId,
          from: true
        }
      })

      setUser(data.user)
      setJournalsData(data.journals)
      setJournals(data.journals)
      setLoaded(true)
      setFetchingUserData(false)

      if (data.journals.length > 0 && redir) {
        if (data.journals[0].children && data.journals[0].children.length > 0) {
          history.push(`${props.match.url}/${data.journals[0].children[0].id}`)
        } else {
          history.push(`${props.match.url}/${data.journals[0].id}`)
        }
      }

      if (journalActive == 'no') activeteFirstJournal()

      //   .then((data) => {
      //     return data
      //   })
      //   .catch((err) => {
      //     if (err.response.status == 403) {
      //       setFetchingUserData(false)
      //       setNotAllowed(true)
      //     }
      //   })

      // setUser(data.user)
      // setJournalsData(data)
      // setJournals(data)
      // setLoaded(true)
      // setFetchingUserData(false)
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
    getJournals(false)
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  useEffect(()=>{
    if(user.id) dispatch(getStudentInfoById(user.id))
  },[user.id])
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

  const options = [
    { value: 'student-lts', label: 'LTS Journal' },
    { value: 'student-wellnes', label: 'Wellness Journal' },
    { value: 'personal-finance', label: 'Personal Finance Journal' },
    { value: 'student-leadership', label: 'Leadership Journal' },
    { value: 'my-mentorship', label: 'Mentorship Journal' }
    // { value: 'market-ready', label: 'MY MARKET-READY JOURNAL' },
    // { value: 'entrepreneurship', label: 'MY COURSE IN ENTREPRENEURSHIP' }
  ]

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
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: '#f8f7f7',
      // Overwrittes the different states of border
      border: 0,
      borderColor: state.isFocused ? 'none' : 'none',
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      '&:hover': {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? 'none' : 'none'
      }
    })
  }
  return (
    <div id='main-body'>
      {fetchingUserData ? (
        <div className='d-flex justify-content-center align-items-center flex-column mt-5 pt-5'>
          <div className='lds-facebook'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p style={{ color: '#01c5d1' }}>
            Loading user journals, please wait!
          </p>
        </div>
      ) : notAllowed ? (
        <NotAllowed />
      ) : (
        <div id='main-body'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12 col-md-11 px-0'>
                <div className='page-padding'>
                  <div className='row pb-2'>
                    <div className='col-12'>
                      <h3 className='page-title-inner'>STUDENT JOURNAL VIEW</h3>
                      <span className='title-description'>
                        View your student journals.
                      </span>
                    </div>
                    <div className='mt-2 col-12 justify-content-lg-end row m-0 p-0'>
                      <div className='user-image-and-name col-12 col-md-6 col-lg-3 col-xl-3 d-flex justify-content-md-end'>
                        <img
                          className='rounded-circle user-image'
                          src={
                            studentInfo?.data?.userImageUrl
                              ?  studentInfo?.data?.userImageUrl
                              : defaultImage
                          }
                          alt={
                            studentInfo?.data?.userImageUrl
                              ?  studentInfo?.data?.userImageUrl
                              : 'no image'
                          }
                        />
                        <span className='user-name ps-2 my-auto'>
                          {user?.name}
                        </span>
                      </div>
                      <div className='col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0'>
                        <Select
                          defaultValue={options[0]}
                          tabSelectsValue={(data) => alert(data)}
                          options={options}
                          styles={customStyles}
                          onChange={async (data) => {
                            getJournals(data.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='page-bottom-border'></div>
                  <div className='row my-notes mt-2'>
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
                                  studentId={studentId}
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
                      </div>
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
                            className='accordion-menu'
                          >
                            {journals.map((journalItem, journalItemIdx) => (
                              <div
                                key={journalItem.id}
                                className={`accordion-menu__item${
                                  journalItem.title == 'SECTION FOUR: FEEDBACK '
                                    ? '-toggle'
                                    : ''
                                }`}
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
                                          (journalChildren) => (
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
                                                  {journalChildren.userEntry &&
                                                  !!journalChildren.userEntry
                                                    .length &&
                                                  !!journalChildren.userEntry[0]
                                                    .createdAt ? (
                                                    <div className='accordion-menu__submenu-item-subtitle'>
                                                      {moment(
                                                        journalChildren
                                                          .userEntry[0]
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
                                  <Accordion.Toggle
                                    as={'a'}
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
                                  </Accordion.Toggle>
                                  // <NavLink
                                  //   className={
                                  //     globalCategory == 'lts' ||
                                  //     globalCategory ==
                                  //       'personal-finance-journal'
                                  //       ? 'accordion-menu__item-toggle'
                                  //       : ''
                                  //   }
                                  //   to={`${props.match.url}/${journalItem.id}`}
                                  // >
                                  //   <span>{journalItem.title}</span>
                                  // </NavLink>
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
        </div>
      )}
    </div>
  )
}

export default injectIntl(JournalsBody, {
  withRef: false
})
