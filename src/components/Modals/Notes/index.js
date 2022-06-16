import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { saveOrEditNote } from '../../../redux'
import { useDispatch, useSelector } from 'react-redux'
import IntlMessages from '../../../utils/IntlMessages'
import ReactQuill from 'react-quill'
import { toast } from 'react-toastify'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { detectFoulWords, removeHtmlFromString } from '../../../utils/helpers'
import FoulWords from '../../../utils/FoulWords'
import { NOTES } from '../../../utils/constants'

const NotesModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [notesTitle, setNotesTitle] = useState('')
  const [notesText, setNotesText] = useState('')
  const [foulWords, setFoulWords] = useState(null)
  const { user } = useSelector((state) => state.user.user)
  const notes = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const quillModules = {
    toolbar: [
      ['bold', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  }

  const quillFormats = ['bold', 'list', 'bullet', 'size']

  const handleQuillInput = (QuillInput) => {
    setNotesText(QuillInput)

    detectFoulWords(removeHtmlFromString(QuillInput), (data) => {
      setFoulWords(data)
    })
  }

  const handleUserInput = (event) => {
    setNotesTitle(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (notesTitle.length === 0) {
      toast.error(<IntlMessages id='my_notes.notes_title_neddet' />)
    } else if (notesText.length === 0) {
      toast.error(<IntlMessages id='my_notes.notes_title_text' />)
    } else {
      const data = { notesTitle, notesText }
      setLoading(true)

      if (foulWords) {
        await FoulWords.register(user.id, foulWords, NOTES)
        setFoulWords(null)
      }

      dispatch(
        saveOrEditNote({
          note: data,
          course_id: null,
          userId: user.id,
          journalId: null,
          createdFrom: props.createdFrom ? props.createdFrom : 'my-note'
        })
      )
      toast.success(<IntlMessages id='my_notes.success_added' />)
      setTimeout(() => {
        props.close()
      }, 1000)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (notes.notes?.length && props.page === 'sample-note') {
      notes.notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      window.location = `/my-notes/${notes.notes[0].id}`
    }
  }, [notes])

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      close={props.closeAddModalSaved}
      backdrop='static'
      keyboard={false}
      style={{ marginTop: '3.9%' }}
      className='edit-modal'
    >
      <Modal.Header className='add-new-note-title my-auto p-0 mx-5'>
        <h3 className='mb-0 pt-4 mt-2 '>
          <IntlMessages id='my_notes.add_a_new_note' />
        </h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='mt-4 mb-3 mx-5 add-new-note'>
        <div className='row w-100'></div>
        <div className='row p-0 add-new-note'>
          <div className='col-md-8 mx-auto'></div>
          <FormattedMessage id='my_notes.notes_title'>
            {(placeholder) => (
              <input
                className='my-2 mb-4 p-2 w-100'
                type='text'
                name='noteTitle'
                onChange={handleUserInput}
                placeholder={placeholder}
              />
            )}
          </FormattedMessage>
          <div className='px-0'>
            <FormattedMessage id='my_notes.notes_modal_body'>
              {(placeholder) => (
                <ReactQuill
                  theme='snow'
                  name='textQuillStandart'
                  className='mb-5 w-100 p-0 scroll-add-new-note-modal'
                  style={{ height: '186px' }}
                  onChange={handleQuillInput}
                  modules={quillModules}
                  placeholder={placeholder}
                  formats={quillFormats}
                />
              )}
            </FormattedMessage>
          </div>

          {foulWords && (
            <div className='p-2 foul-words-notice'>
              <IntlMessages id='foul_words.notice' />
            </div>
          )}
        </div>
      </Modal.Body>
      <div
        style={{ border: '0px' }}
        className='mt-0 pt-0 border-0 border-none mx-5 mb-4'
      >
        <button
          className='float-end m-0 px-md-5 save-button add-new-note-button-text ms-1'
          onClick={handleSubmit}
        >
          {loading ? 'loading' : <IntlMessages id='general.save' />}
          {/* <IntlMessages id='general.save' /> */}
        </button>
      </div>
    </Modal>
  )
}
export default NotesModal
