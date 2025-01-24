import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link, useParams, useHistory } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import moment from 'moment'
import 'moment/locale/es'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { setAccordionToggled, changeSidebarState } from '../../redux'
import journalLevels from '../../utils/journalLevels'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import MyJournalItems from '../../components/MyJournal'
import NotSavedModal from '../../components/Modals/notSavedNoteModal'
import searchIcon from '../../assets/images/search-icon.png'
import Video from '../../assets/images/video-coming-soon.png'

function MyJournals(props) {
  const id = useParams().id
  const month = parseInt(useParams().month)
  const [searchedJournal, setSearchedJournal] = useState('')
  const [currentJournal, setCurrentJournal] = useState({})
  const [journals, setJournals] = useState([])
  const [titleItems, setTitleItems] = useState([])
  const [journalValues, setJournalValues] = useState([])
  const userId = useSelector((state) => state.user.user.user._id)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [showJournal, setShowJournal] = useState(false)
  const { intl } = props
  const dispatch = useDispatch()

  // Prompt Logic
  const [nextTarget, setNextTarget] = useState(null)
  const [textEdited, setTextEdited] = useState(false)
  const [showNotSavedModal, setShowNotSavedModal] = useState(false)
  const history = useHistory()
  const unblockHandle = useRef()
  const closeModal = () => setShowNotSavedModal(false)

  const showModal = (location) => {
    setNextTarget(location)
    setShowNotSavedModal(true)
  }

  useEffect(() => {
    unblockHandle.current = history.block((targetLocation) => {
      if (
        !showNotSavedModal &&
        textEdited &&
        props.history.location.pathname != targetLocation.pathname
      ) {
        showModal(targetLocation)

        return false
      }
      return true
    })
    return function () {
      unblockHandle.current.current && unblockHandle.current.current()
    }
  })

  useEffect(() => {
    dispatch(setAccordionToggled(false))
  }, [])
  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(
    function () {
      setTitleItems([])
      setJournalValues([])
      getJournal(id)
    },
    [id]
  )

  const getJournalsPerCategory = async (category) => {
    await axiosInstance
      .get(`/journals/category/${category}`)
      .then((response) => {
        response.data.map((journal) => {
          journal.formattedTitle = intl.formatMessage({
            id: journal.title,
            defaultMessage: journal.title
          })
        })
        setJournals(response.data)
      })
      .catch((err) => err)
  }

  const getJournal = async (id) => {
    await axiosInstance
      .get(`journals/${id}`)
      .then((res) => {
        setCurrentJournal(res.data)
      })
      .catch((err) => err)

    //check if user created a comment on journal
    const userJournal = await axiosInstance
      .get(`/userItems/${id}/userItems`)
      .catch((err) => err)
    if (userJournal.data.length > 0) {
      userJournal.data.map((userJrn) => {
        const elem = {
          order: userJrn.order ? userJrn.order : 1,
          value: userJrn.content,
          createdAt: userJrn.createdAt,
          dateEdited: userJrn.updatedAt,
          journalId: userJrn.id,
          id: userJrn.id
        }
        setJournalValues((prevValue) => [...prevValue, elem])
      })
    } else {
      const elem = {
        order: 1,
        value: '',
        createdAt: new Date(),
        dateEdited: new Date()
      }
      setJournalValues([elem])
    }
  }

  const addNewReflection = () => {
    let currentReflections = [...journalValues]

    let newReflection = {
      order: journalValues.length + 1,
      value: '',
      createdAt: new Date(),
      dateEdited: new Date()
    }
    currentReflections.push(newReflection)
    setJournalValues(currentReflections)
  }

  const handleSearch = (event) => {
    const { value } = event.target
    setSearchedJournal(value)
  }

  const continueWithoutSaving = (location) => {
    setTextEdited(false)
    setShowNotSavedModal(false)
    history.push(location.pathname)
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-11 px-0'>
            <div className='page-padding'>
              <div className='page-bottom-border'>
                <h3 className='page-title'>
                  <IntlMessages id='my_journal.page_title' />
                </h3>
                <p className='page-description mb-3'>
                  <IntlMessages id='my_journal.page_description' />
                </p>
              </div>
              <div className='row my-notes mt-1 desktop-menu'>
                <div className='col-lg-4 my-notes-title-wraper'>
                  <div className='notes-search-box ml-2'>
                    <div className='input-group mt-2'>
                      <div className='input-group-prepend'>
                        <button
                          className='btn btn-outline-secondary my-1'
                          type='button'
                          id='button-addon1'
                        >
                          <img src={searchIcon} alt='#' />
                        </button>
                      </div>
                      <FormattedMessage
                        id='my_journal.search_journals'
                        defaultMessage='my_journal.search_journals'
                      >
                        {(placeholder) => (
                          <input
                            type='text'
                            className='form-control'
                            name='searchedNote'
                            placeholder={placeholder}
                            aria-describedby='button-addon1'
                            onChange={handleSearch}
                          />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>
                  <div className='my-notes-list'>
                    <Accordion>
                      {journalLevels?.map((level, i) => (
                        <Card key={i}>
                          <Card.Header>
                            <h2>
                              <Accordion.Toggle
                                as={Button}
                                variant='link'
                                eventKey={`menu-${i}`}
                                onClick={() => {
                                  getJournalsPerCategory(i + 1)
                                }}
                                className='shadow-none'
                              >
                                <IntlMessages id={level.title} />
                                <FontAwesomeIcon
                                  className='ms-1'
                                  icon={faAngleRight}
                                />
                              </Accordion.Toggle>
                            </h2>
                          </Card.Header>
                          <Accordion.Collapse eventKey={`menu-${i}`}>
                            <Card.Body>
                              <ul className='content-list-of-month'>
                                {journals
                                  ?.filter((searchedJournals) =>
                                    searchedJournals.formattedTitle
                                      ?.toLowerCase()
                                      .includes(searchedJournal.toLowerCase())
                                  )
                                  .map((item, j) => (
                                    <li key={j}>
                                      <NavLink
                                        key={j}
                                        to={`/my-journal/${i + 1}/${item.id}`}
                                        className={
                                          item.id == id ? 'blue-text' : null
                                        }
                                      >
                                        <h5>
                                          <IntlMessages
                                            id={item ? item.title : null}
                                          />
                                        </h5>
                                        <div className='journal-edited'>
                                          <span
                                            className={
                                              item.id == id ? 'blue-text' : null
                                            }
                                          >
                                            {' '}
                                            {moment(item.createdAt)
                                              .locale(currentLanguage)
                                              .format('MMM DD, YYYY')}{' '}
                                            {moment(item.createdAt)
                                              .locale(currentLanguage)
                                              .format('HH:mm')}
                                          </span>
                                        </div>
                                      </NavLink>
                                    </li>
                                  ))}
                              </ul>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      ))}
                    </Accordion>
                  </div>
                </div>
                <div className='col-sm-12 col-lg-8 journal-purpose'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <h5 className='mt-3'>
                        <IntlMessages id={`journals.category_${month}`} />
                      </h5>
                      <p className='mt-3'>
                        <IntlMessages id='journals.purpose_text' />
                      </p>
                    </div>
                    <div className='col-lg-6 text-end'>
                      <img className='mt-3' src={Video} width='298px' />
                    </div>
                  </div>
                  <h3 className='mt-5'>
                    {currentJournal?.title && (
                      <IntlMessages id={currentJournal.title} />
                    )}
                  </h3>
                  {journalValues.length > 0
                    ? journalValues.map((journalValue, index) => (
                        <MyJournalItems
                          key={index}
                          journalValue={journalValue}
                          itemId={journalValue.journalId}
                          journalId={id}
                          itemOrder={index + 1}
                        />
                      ))
                    : null}
                  <div className='row mt-4 mb-3'>
                    <div
                      className='col-12'
                      style={{ textAlign: '-webkit-right' }}
                    >
                      <div
                        className='journal-add-new text-end'
                        style={{ width: 'fit-content', cursor: 'pointer' }}
                        onClick={addNewReflection}
                      >
                        <IntlMessages id='journals.add_new_journal' />
                        <FontAwesomeIcon
                          icon={faPlus}
                          className='add-journal-icon mx-2'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row my-notes mt-3 mobile-menu'>
                {!showJournal ? (
                  <div className='col-12 mt-2 my-notes-title-wraper'>
                    <div className='notes-search-box ml-2'>
                      <div className='input-group mt-2'>
                        <div className='input-group-prepend'>
                          <button
                            className='btn btn-outline-secondary my-1'
                            type='button'
                            id='button-addon1'
                          >
                            <img src={searchIcon} alt='#' />
                          </button>
                        </div>
                        <FormattedMessage
                          id='my_journal.search_journals'
                          defaultMessage='my_journal.search_journals'
                        >
                          {(placeholder) => (
                            <input
                              type='text'
                              className='form-control'
                              name='searchedNote'
                              placeholder={placeholder}
                              aria-describedby='button-addon1'
                              onChange={handleSearch}
                            />
                          )}
                        </FormattedMessage>
                      </div>
                    </div>
                    <div className='my-notes-list'>
                      <Accordion>
                        {journalLevels?.map((level, i) => (
                          <Card key={i}>
                            <Card.Header>
                              <h2>
                                <Accordion.Toggle
                                  as={Button}
                                  variant='link'
                                  eventKey={`menu-${i}`}
                                  onClick={() => {
                                    getJournalsPerCategory(i + 1)
                                  }}
                                  className='shadow-none'
                                >
                                  <IntlMessages id={level.title} />
                                  <FontAwesomeIcon
                                    className='ms-1'
                                    icon={faAngleRight}
                                  />
                                </Accordion.Toggle>
                              </h2>
                            </Card.Header>
                            <Accordion.Collapse eventKey={`menu-${i}`}>
                              <Card.Body>
                                <ul className='content-list-of-month'>
                                  {journals?.map((item, j) => (
                                    <li key={j}>
                                      <Link
                                        className={
                                          item.id == id ? 'blue-text' : null
                                        }
                                        onClick={() => setShowJournal(true)}
                                        to={`/my-journal/${i + 1}/${item.id}`}
                                      >
                                        <h5>
                                          <IntlMessages
                                            id={item ? item.title : null}
                                          />
                                        </h5>
                                        <div className='my-notes-edited'>
                                          <span
                                            className={
                                              item.id == id ? 'blue-text' : null
                                            }
                                          >
                                            {' '}
                                            {moment(item.createdAt)
                                              .locale(currentLanguage)
                                              .format('MMM DD, YYYY')}{' '}
                                            {moment(item.createdAt)
                                              .locale(currentLanguage)
                                              .format('HH:mm')}
                                          </span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                ) : (
                  <div
                    className='col-sm-12 col-lg-8 journal-purpose'
                    spellCheck={'false'}
                  >
                    <Link to='#' onClick={() => setShowJournal(false)}>
                      <IntlMessages id='my_notes.back' />
                    </Link>
                    <div className='col-12'>
                      <h5 className='mt-3'>
                        <IntlMessages id={`journals.category_${month}`} />
                      </h5>
                      <p className='mt-3'>
                        <IntlMessages id='journals.purpose_text' />
                      </p>
                    </div>
                    <div className='col-12 text-center'>
                      <img className='mt-3' src={Video} width='298px' />
                    </div>
                    <h3 className='mt-5'>
                      {currentJournal && currentJournal.title ? (
                        <IntlMessages id={currentJournal.title} />
                      ) : null}
                    </h3>
                    {journalValues
                      ? journalValues.map((journalValue, index) => (
                          <MyJournalItems
                            key={index}
                            journalValue={journalValue}
                            itemId={journalValue.journalId}
                            journalId={id}
                            itemOrder={index + 1}
                          />
                        ))
                      : null}
                    <div className='mt-4 mb-3'>
                      <div
                        className='text-end journal-add-new'
                        style={{ width: 'fit-content', cursor: 'pointer' }}
                        onClick={addNewReflection}
                      >
                        <IntlMessages id='journals.add_new_journal' />
                        <FontAwesomeIcon
                          icon={faPlus}
                          className='add-journal-icon mx-2'
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <NotSavedModal
            show={showNotSavedModal}
            onHide={closeModal}
            continue={() => continueWithoutSaving(nextTarget)}
          />
        </div>
      </div>
    </div>
  )
}

export default injectIntl(MyJournals, {
  withRef: false
})
