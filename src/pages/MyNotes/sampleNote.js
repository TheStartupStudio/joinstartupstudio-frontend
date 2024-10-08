import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import IntlMessages from '../../utils/IntlMessages'
import searchIcon from '../../assets/images/search-icon.png'
import NotesModal from '../../components/Modals/Notes'
import { useDispatch } from 'react-redux'
import { getAllNotes } from '../../redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export default function SampleNote() {
  const [showNote, setShowNote] = useState(false)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [showAddNotesModal, setShowAddNotesModal] = useState(false)
  const dispatch = useDispatch()

  dispatch(getAllNotes())
  const showAddModal = () => {
    setShowAddNotesModal(true)
  }
  const closeAddModal = () => {
    setShowAddNotesModal(false)
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-11 px-0'>
            <div className='page-padding'>
              <div className='page-bottom-border'>
                <h3 className='page-title'>
                  <IntlMessages id='my_notes.page_title' />
                </h3>{' '}
                <p className='page-description'>
                  <IntlMessages id='my_notes.page_description' />
                  <button
                    className='float-end add-note-button'
                    onClick={showAddModal}
                  >
                    <IntlMessages id='my_notes.add_button' />

                    <FontAwesomeIcon
                      icon={faPlus}
                      className='plus-ico'
                      style={{
                        width: '22px',
                        height: '22px',
                        color: '#707070'
                      }}
                    />
                  </button>
                </p>
              </div>
              <div className='row my-notes mt-3 desktop-menu'>
                <div className='col-lg-4 my-notes-title-wraper'>
                  <div className='notes-search-box ml-2'>
                    <div className='input-group mt-2'>
                      <div className='input-group-prepend '>
                        <button
                          className='btn btn-outline-secondary my-1'
                          type='button'
                          id='button-addon1'
                        >
                          <img src={searchIcon} alt='#' />
                        </button>
                      </div>
                      <FormattedMessage
                        id='my_notes.search'
                        defaultMessage='my_notes.search'
                      >
                        {(placeholder) => (
                          <input
                            type='text'
                            className='form-control'
                            name='searchedNotes'
                            placeholder={placeholder}
                            aria-describedby='button-addon1'
                          />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>
                  <div className='my-notes-order mt-1 text-md-end'>
                    <select name='notesOrder'>
                      <FormattedMessage
                        id='my_notes.sort_by_date_created'
                        defaultMessage='my_notes.sort_by_date_created'
                      >
                        {(placeholder) => (
                          <option
                            className='option-color'
                            value='sortByCreatedDate'
                          >
                            {placeholder}
                          </option>
                        )}
                      </FormattedMessage>
                      <FormattedMessage
                        id='my_notes.sort_by_date_edited'
                        defaultMessage='my_notes.sort_by_date_edited'
                      >
                        {(placeholder) => (
                          <option
                            className='option-color'
                            value='sortByEditedDate'
                          >
                            {placeholder}
                          </option>
                        )}
                      </FormattedMessage>
                    </select>
                  </div>
                  <div className='my-notes-list'>
                    <Accordion>
                      <Card>
                        <Card.Body>
                          <ul className='content-list-of-month'>
                            <li>
                              <Link to='#' className='blue-text'>
                                <h5>
                                  <IntlMessages id='my_notes.sample_note' />
                                </h5>
                                <span>
                                  {currentLanguage === 'en'
                                    ? 'August'
                                    : 'Agosto'}{' '}
                                  5, 2020 | 10: 41{' '}
                                  {currentLanguage === 'en' ? 'am' : 'a. m.'}
                                </span>
                              </Link>
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Accordion>
                  </div>
                </div>
                <div className='col-sm-12 col-lg-8 my-notes-content'>
                  <h5 className='mt-3'>
                    <IntlMessages id='my_notes.sample_note' />
                  </h5>
                  <div className='my-notes-edited'>
                    <IntlMessages id='my_notes.edited' />
                    <span
                      style={{
                        paddingRight: '2px',
                        color: '#BBBDBF'
                      }}
                      className='ms-1'
                    >
                      {currentLanguage === 'en' ? 'Aug' : 'Agt'}, 21, 2020
                      20:56:22
                    </span>
                    <Link to='#' style={{ marginLeft: 'auto' }}>
                      <IntlMessages id='my_notes.edit_note' />
                    </Link>
                  </div>
                  <div className='my-notes-body mt-3 mb-4'>
                    <textarea
                      name='note'
                      value='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
                      readOnly={true}
                    />
                    <div
                      className='my-notes-edited'
                      style={{ position: 'absolute', bottom: '10px' }}
                    >
                      <IntlMessages id='my_notes.created_in' />
                      <span className='ms-1 blue-text'>
                        <IntlMessages id='my_notes.created_month' /> 1:{' '}
                        <Link to='#' className='ml-1'>
                          <IntlMessages id='navigation.course_month_1_lesson_2' />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row my-notes mt-3 mobile-menu'>
                {!showNote ? (
                  <div className='col-12 mt-2 my-notes-title-wraper'>
                    <div className='notes-search-box ml-2'>
                      <div className='input-group mt-2'>
                        <div className='input-group-prepend'>
                          <button
                            className='btn btn-outline-secondary'
                            type='button'
                            id='button-addon1'
                          >
                            <img src={searchIcon} alt='#' />
                          </button>
                        </div>
                        <FormattedMessage
                          id='my_notes.search'
                          defaultMessage='my_notes.search'
                        >
                          {(placeholder) => (
                            <input
                              type='text'
                              className='form-control'
                              name='searchedNote'
                              placeholder={placeholder}
                              aria-describedby='button-addon1'
                            />
                          )}
                        </FormattedMessage>
                      </div>
                    </div>
                    <div className='my-notes-order mt-1'>
                      <select name='notesOrder'>
                        <FormattedMessage
                          id='my_notes.sort_by_date_created'
                          defaultMessage='my_notes.sort_by_date_created'
                        >
                          {(placeholder) => (
                            <option
                              className='option-color'
                              value='sortByCreatedDate'
                            >
                              {placeholder}
                            </option>
                          )}
                        </FormattedMessage>
                        <FormattedMessage
                          id='my_notes.sort_by_date_edited'
                          defaultMessage='my_notes.sort_by_date_edited'
                        >
                          {(placeholder) => (
                            <option
                              className='option-color'
                              value='sortByEditedDate'
                            >
                              {placeholder}
                            </option>
                          )}
                        </FormattedMessage>
                      </select>
                    </div>
                    <div className='my-notes-list'>
                      <Accordion>
                        <Card>
                          <Card.Body>
                            <ul className='content-list-of-month'>
                              <li>
                                <Link to='#' onClick={() => setShowNote(true)}>
                                  <h5>
                                    <IntlMessages id='my_notes.sample_note' />
                                  </h5>
                                  <span>
                                    {currentLanguage === 'en'
                                      ? 'August'
                                      : 'Agosto'}{' '}
                                    5, 2020 | 10: 41{' '}
                                    {currentLanguage === 'en' ? 'am' : 'a. m.'}
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </Accordion>
                    </div>
                  </div>
                ) : (
                  <div className='col-12 my-notes-content'>
                    <Link to='#' onClick={() => setShowNote(false)}>
                      <IntlMessages id='my_notes.back' />
                    </Link>
                    <h5 className='mt-3'>
                      <IntlMessages id='my_notes.sample_note' />
                    </h5>
                    <div className='my-notes-edited'>
                      <IntlMessages id='my_notes.edited' />
                      <span
                        style={{
                          paddingRight: '2px',
                          color: '#BBBDBF'
                        }}
                        className='ms-1'
                      >
                        {currentLanguage === 'en' ? 'Aug' : 'Agt'}, 21, 2020
                        20:56:22
                      </span>
                      <Link to='#' style={{ marginLeft: 'auto' }}>
                        <IntlMessages id='my_notes.edit_note' />
                      </Link>
                    </div>
                    <div className='my-notes-body mt-3 mb-4'>
                      <textarea
                        name='note'
                        value='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
                        readOnly={true}
                      />
                      <div
                        className='my-notes-edited'
                        style={{ position: 'absolute', bottom: '10px' }}
                      >
                        <IntlMessages id='my_notes.created_in' />
                        <span className='ml-1 blue-text'>
                          <IntlMessages id='my_notes.created_month' /> 1:{' '}
                          <Link to='#' className='ml-1'>
                            <IntlMessages id='navigation.course_month_1_lesson_2' />
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <NotesModal
        show={showAddNotesModal}
        onHide={closeAddModal}
        close={closeAddModal}
        page='sample-note'
      />
    </div>
  )
}
