import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import moment from 'moment'
import 'moment/locale/es'
import { getAllNotes, saveOrEditNote, setAccordionToggled } from '../../redux'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import searchIcon from '../../assets/images/search-icon.png'
import NotSavedModal from '../../components/Modals/notSavedNoteModal'
import NotesModal from '../../components/Modals/Notes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { detectFoulWords, removeHtmlFromString } from '../../utils/helpers'
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import FoulWords from '../../utils/FoulWords'
import { NOTES } from '../../utils/constants'

function MyNotes(props) {
  const id = useParams().id
  const [noteTitle, setNoteTitle] = useState('')
  const [textQuillStandart, setTextQuillStandart] = useState('')
  const [createdIn, setCreatedIn] = useState('')
  const [editedDate, setEditedDate] = useState('')
  const [contentId, setContentId] = useState('')
  const [searchedNotes, setSearchedNote] = useState('')
  const [notesOrder, setNotesOrder] = useState('')
  const [editNote, setEditNote] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const notes = useSelector((state) => state.course.notes)
  const [showAddNotesModal, setShowAddNotesModal] = useState(false)
  // Prompt Logic
  const [nextTarget, setNextTarget] = useState(null)
  const [textEdited, setTextEdited] = useState(false)
  const [showNotSavedModal, setShowNotSavedModal] = useState(false)
  const [foulWords, setFoulWords] = useState(null)

  const { user } = useSelector((state) => state.user.user)
  const history = useHistory()
  const unblockHandle = useRef()
  const closeModal = () => setShowNotSavedModal(false)

  const showModal = (location) => {
    setNextTarget(location)
    setShowNotSavedModal(true)
  }

  const showAddModal = () => {
    setShowAddNotesModal(true)
  }

  const closeAddModal = () => {
    setShowAddNotesModal(false)
  }

  const closeAddModalSaved = () => {
    setShowAddNotesModal(false)
    dispatch(getAllNotes())
  }

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link'
  ]

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllNotes())
    dispatch(setAccordionToggled(false))
  }, [])

  useEffect(() => {
    if (notes && notes.length > 0) {
      notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      getNoteById(notes[0].id)
    }
  }, [notes])

  useEffect(
    function () {
      if (notesOrder === 'sortByCreatedDate') {
        notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      } else if (notesOrder === 'sortByEditedDate') {
        notes.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1))
      }
    },
    [notesOrder]
  )

  useEffect(() => {
    unblockHandle.current = history.block((targetLocation) => {
      if (
        !showNotSavedModal &&
        textEdited &&
        props.history.location.pathname !== targetLocation.pathname
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

  const getNoteById = async (id) => {
    axiosInstance.get(`/notes/by-id/${id}`).then(async (res) => {
      if (res.data) {
        setTextQuillStandart(res.data.value)
        setEditedDate(res.data.updatedAt)
        setCreatedIn(res.data.createdFrom)
        setNoteTitle(res.data.title)
        setContentId(res.data.contentId ? res.data.contentId : null)
      }
    })
  }

  const handleSearch = (event) => {
    const { value } = event.target
    setSearchedNote(value)
  }

  const handleSort = (event) => {
    const { value } = event.target
    setNotesOrder(value)
  }

  const handleSubmit = async () => {
    if (textQuillStandart.length) {
      if (foulWords) {
        await FoulWords.register(user.id, foulWords, NOTES)
        setFoulWords(null)
      }

      dispatch(
        saveOrEditNote({
          note: textQuillStandart,
          course_id: contentId,
          contentId: contentId,
          createdFrom: createdIn,
          notesTitle: noteTitle
        })
      )

      setEditNote(false)
      setTextEdited(false)
    }
  }

  const handleChangeQuillStandart = (textQuillStandart) => {
    setTextQuillStandart(textQuillStandart)
    setTextEdited(true)

    detectFoulWords(removeHtmlFromString(textQuillStandart), (data) => {
      setFoulWords(data)
    })
  }

  const continueWithoutSaving = (location) => {
    setTextEdited(false)
    setShowNotSavedModal(false)
    setEditNote(false)
    history.push(location.pathname)
    getNoteById(location.pathname.replace('/my-notes/', ''))
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
                </h3>
                <p className='page-description'>
                  <IntlMessages id='my_notes.page_description' />
                  <button
                    className='float-end add-note-button py-2 ps-4'
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
                            onChange={handleSearch}
                          />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>
                  <div className='my-notes-order mt-1 text-md-end'>
                    <select name='notesOrder' onChange={handleSort}>
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
                      {notes &&
                        notes
                          ?.filter((searchedNote) =>
                            searchedNote.value
                              .toLowerCase()
                              .includes(searchedNotes.toLowerCase())
                          )
                          .map((note, index) => {
                            return (
                              <Card key={index}>
                                <Card.Body>
                                  <ul className='content-list-of-month'>
                                    <li
                                      key={index}
                                      onClick={() => {
                                        if (!textEdited) getNoteById(note.id)
                                      }}
                                    >
                                      <Link
                                        className={
                                          note.id == id ? 'blue-text ' : null
                                        }
                                        to={`/my-notes/${note.id}`}
                                      >
                                        {note.title && (
                                          <h5>
                                            {note.createdFrom ===
                                            ' my-notes' ? (
                                              note.title
                                            ) : (
                                              <IntlMessages id={note.title} />
                                            )}
                                          </h5>
                                        )}
                                        <span>
                                          {moment(note.createdAt)
                                            .locale(currentLanguage)
                                            .format('MMM. DD, YYYY')}{' '}
                                          | <span className='ms-2'></span>
                                          {moment(note.createdAt)
                                            .locale(currentLanguage)
                                            .format('hh:mma')}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                </Card.Body>
                              </Card>
                            )
                          })}
                    </Accordion>
                  </div>
                </div>
                <div className='col-sm-12 col-lg-8 my-notes-content'>
                  <h5 className='mt-3'>
                    {noteTitle && <IntlMessages id={`${noteTitle}`} />}
                  </h5>
                  <div className='my-notes-edited'>
                    <IntlMessages id='my_notes.edited' />
                    <span
                      style={{
                        paddingRight: '2px',
                        color: '#BBBDBF'
                      }}
                      className='ml-2'
                    >
                      {editedDate
                        ? moment(editedDate)
                            .locale(currentLanguage)
                            .format('MMM. DD, YYYY')
                        : null}
                      <span className='mx-1' />
                      {editedDate
                        ? moment(editedDate)
                            .locale(currentLanguage)
                            .format('hh:mm:ss')
                        : null}
                    </span>
                    {editNote ? (
                      <Link
                        to='#'
                        className='save-button col-white'
                        style={{
                          marginLeft: 'auto',
                          marginTop: '-1px'
                        }}
                        onClick={handleSubmit}
                      >
                        <IntlMessages id='my_notes.save_note' />{' '}
                      </Link>
                    ) : notes.length > 0 ? (
                      <Link
                        to='#'
                        style={{ marginLeft: 'auto', marginTop: '-1px' }}
                        onClick={() => setEditNote(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          className='plus-ico'
                          style={{
                            width: '22px',
                            height: '22px',
                            color: '#707070'
                          }}
                        />
                      </Link>
                    ) : null}
                  </div>
                  {textQuillStandart && (
                    <div className='my-notes-body mt-3 mb-4'>
                      {editNote ? (
                        <div className='edit-note'>
                          <ReactQuill
                            theme='snow'
                            name='textQuillStandart'
                            value={textQuillStandart}
                            onChange={handleChangeQuillStandart}
                            modules={quillModules}
                            formats={quillFormats}
                          />

                          {foulWords && (
                            <div className='p-2 foul-words-notice'>
                              {FoulWords.printMessage(foulWords)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='view-note'>
                          <ReactQuill
                            theme='snow'
                            name='textQuillStandart'
                            value={textQuillStandart}
                            modules={quillModules}
                            formats={quillFormats}
                          />
                        </div>
                      )}
                      <div
                        className='my-notes-edited created-in ms-1 d-flex justify-content-start'
                        style={{ marginTop: '20px' }}
                      >
                        <IntlMessages id='my_notes.created_in' />
                        {/* <span className='ml-1 blue-text ms-2 text-uppercase'>
                          {createdIn === 'master-classes' ||
                          createdIn === 'guidance-encouragement' ? (
                            <IntlMessages id='navigation.beyond_your_course' />
                          ) : createdIn === 'my-note' ? (
                            <IntlMessages id='content.my_notes' />
                          ) : null}{' '}
                        </span> */}
                        <Link
                          className='blue-text created-in'
                          to={
                            createdIn == 'startup-live'
                              ? '/Startup-Live'
                              : createdIn == 'encouragement'
                              ? '/encouragement/videos'
                              : createdIn == 'master-classes'
                              ? '/master-classes/videos'
                              : createdIn == 'story-in-motion'
                              ? '/story-in-motion'
                              : createdIn == 'My-Market-Ready-Guide'
                              ? '/My-Market-Ready-Guide'
                              : createdIn == 'savedMedia' && '/savedMedia'
                          }
                        >
                          <p className='blue-text ms-2'>
                            {createdIn == 'startup-live'
                              ? 'Startup Live'
                              : createdIn == 'encouragement'
                              ? 'Encouragement'
                              : createdIn == 'master-classes'
                              ? 'Master Classes'
                              : createdIn == 'story-in-motion'
                              ? 'Podcast'
                              : createdIn == 'My-Market-Ready-Guide'
                              ? 'My Market Ready Guide'
                              : createdIn == 'savedMedia'
                              ? 'Saved Media'
                              : 'My Notes'}
                          </p>
                        </Link>
                        {/* <Link
                            to={
                              createdIn === 'startup-live'
                                ? '/startup-live'
                                : createdIn === 'startup-live-videos'
                                ? `/startup-live/video/${contentId}`
                                : createdIn === 'guidance-encouragement'
                                ? `/encouragement/video/${contentId}`
                                : createdIn === 'master-classes'
                                ? `/master-classes/video/${contentId}`
                                : null
                            }
                          > */}
                        {/* {createdIn === 'startup-live' ? '' : ': '} */}
                        {/* {noteTitle && (
                            <FormattedMessage id={`${noteTitle}`}>
                              {(noteTitle) => (
                                <p
                                  className='d-inline-block'
                                  style={{ fontSize: '14px !important' }}
                                >
                                  {noteTitle}
                                </p>
                              )}
                            </FormattedMessage> */}
                        {/* )} */}
                        {/* </Link> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row my-notes mt-3 mobile-menu'>
                {!showNote ? (
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
                              onChange={handleSearch}
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
                        {notes &&
                          notes
                            ?.filter((searchedNote) =>
                              searchedNote.value
                                .toLowerCase()
                                .includes(searchedNotes.toLowerCase())
                            )
                            .map((note, index) => {
                              return (
                                <Card key={index}>
                                  <Card.Body>
                                    <ul className='content-list-of-month'>
                                      <li
                                        key={index}
                                        onClick={() => {
                                          getNoteById(note.id)
                                        }}
                                      >
                                        <Link
                                          onClick={() => setShowNote(true)}
                                          className={
                                            note.id == id ? 'blue-text' : null
                                          }
                                          to={`/my-notes/${note.id}`}
                                        >
                                          {note.title && (
                                            <h5>
                                              {note.createdFrom ===
                                              ' my-notes' ? (
                                                note.title
                                              ) : (
                                                <IntlMessages id={note.title} />
                                              )}
                                            </h5>
                                          )}
                                          <span>
                                            {moment(note.createdAt)
                                              .locale(currentLanguage)
                                              .format('MMM DD, YYYY')}{' '}
                                            |{' '}
                                            {moment(note.createdAt)
                                              .locale(currentLanguage)
                                              .format('hh:mma')}
                                          </span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </Card.Body>
                                </Card>
                              )
                            })}
                      </Accordion>
                    </div>
                  </div>
                ) : (
                  <div className='col-sm-12 col-lg-8 my-notes-content'>
                    <Link to='#' onClick={() => setShowNote(false)}>
                      <IntlMessages id='my_notes.back' />
                    </Link>
                    <h5 className='mt-3'>
                      {noteTitle && <IntlMessages id={`${noteTitle}`} />}
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
                        {editedDate
                          ? moment(editedDate)
                              .locale(currentLanguage)
                              .format('MMM, DD, YYYY')
                          : null}{' '}
                        {editedDate
                          ? moment(editedDate)
                              .locale(currentLanguage)
                              .format('hh:mm:ss')
                          : null}
                      </span>
                      {editNote ? (
                        <Link
                          to='#'
                          className='save-button col-white'
                          style={{ marginLeft: 'auto' }}
                          onClick={handleSubmit}
                        >
                          <IntlMessages id='my_notes.save_note' />{' '}
                        </Link>
                      ) : notes.length > 0 ? (
                        <Link
                          to='#'
                          style={{ marginLeft: 'auto' }}
                          onClick={() => setEditNote(true)}
                        >
                          <FontAwesomeIcon
                            icon={faPencilAlt}
                            className='plus-ico'
                            style={{
                              width: '22px',
                              height: '22px',
                              color: '#707070'
                            }}
                          />
                        </Link>
                      ) : null}
                    </div>
                    {textQuillStandart && (
                      <div className='my-notes-body mt-3 mb-4'>
                        {editNote ? (
                          <div className='edit-note'>
                            <ReactQuill
                              theme='snow'
                              name='textQuillStandart'
                              value={textQuillStandart}
                              onChange={handleChangeQuillStandart}
                              modules={quillModules}
                              formats={quillFormats}
                            />

                            {foulWords && (
                              <div className='p-2 foul-words-notice'>
                                {FoulWords.printMessage(foulWords)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className='view-note'>
                            <ReactQuill
                              theme='snow'
                              name='textQuillStandart'
                              value={textQuillStandart}
                              modules={quillModules}
                              formats={quillFormats}
                            />
                          </div>
                        )}
                        <div
                          className='my-notes-edited'
                          style={{ position: 'absolute', bottom: '10px' }}
                        >
                          <IntlMessages id='my_notes.created_in' />
                          <span className='ms-1 blue-text'>
                            <Link
                              className='blue-text created-in'
                              to={
                                createdIn == 'startup-live'
                                  ? '/Startup-Live'
                                  : createdIn == 'encouragement'
                                  ? '/encouragement/videos'
                                  : createdIn == 'master-classes'
                                  ? '/master-classes/videos'
                                  : createdIn == 'story-in-motion'
                                  ? '/story-in-motion'
                                  : createdIn == 'My-Market-Ready-Guide'
                                  ? '/My-Market-Ready-Guide'
                                  : createdIn == 'savedMedia' && '/savedMedia'
                              }
                            >
                              <p className='blue-text ms-2'>
                                {createdIn == 'startup-live'
                                  ? 'Startup Live'
                                  : createdIn == 'encouragement'
                                  ? 'Encouragement'
                                  : createdIn == 'master-classes'
                                  ? 'Master Classes'
                                  : createdIn == 'story-in-motion'
                                  ? 'Podcast'
                                  : createdIn == 'My-Market-Ready-Guide'
                                  ? 'My Market Ready Guide'
                                  : createdIn == 'savedMedia'
                                  ? 'Saved Media'
                                  : 'My Notes'}
                              </p>
                            </Link>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <NotesModal
            show={showAddNotesModal}
            onHide={closeAddModal}
            close={closeAddModalSaved}
            className='mt-5 '
          />
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
export default injectIntl(MyNotes, {
  withRef: false
})
