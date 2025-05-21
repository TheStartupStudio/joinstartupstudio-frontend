import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import IntlMessages from '../../../utils/IntlMessages'
import { Resizable } from 're-resizable'
import 'react-quill/dist/quill.snow.css'
import ModalDialog from 'react-bootstrap/ModalDialog'
import '../style/index.css'
import './modal.css'
import Draggable from 'react-draggable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import moment from 'moment'
import { detectFoulWords, removeHtmlFromString } from '../../../utils/helpers'
import FoulWords from '../../../utils/FoulWords'
import { NOTES } from '../../../utils/constants'
import { useRef } from 'react'

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle='.newNote_title '>
        <ModalDialog {...this.props} />
      </Draggable>
    )
  }
}

const CreateNewNote = (props) => {
  const quillModules = {
    toolbar: [
      // [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [('bold', 'italic')], // toggled buttons
      ['blockquote'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ align: null }, { align: 'center' }, { align: 'right' }],
      // ['link', 'image', 'video']
      ['link', 'video']
    ]
  }

  const quillFormats = [
    'header',
    'font',
    'type',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    // 'image',
    'color',
    'code-block'
  ]

  // const handleQuillInput = (QuillInput) => {
  //   // setNotesText(QuillInput)
  // }

  const [page, setPage] = useState()
  const [note, setNote] = useState({
    notesTitle: '',
    value: '<p></p>',
    createdFrom: ''
  })
  const [loading, setLoading] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef(null)
  const [noteTitle, setNoteTitle] = useState('')

  const validate = () => {
    // Set default title if empty
    if (!note.notesTitle || note.notesTitle.trim() === '') {
      setNote(prev => ({
        ...prev,
        notesTitle: 'New Notes'
      }))
    }

    // Check only for content since title will now have a default
    if (
      note.value === '<p></p>' ||
      note.value === '<p><br></p>' ||
      note.value === ''
    ) {
      return toast.error('Note is required')  
    }
    handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Ensure the title is set before submitting
    const noteToSubmit = {
      ...note,
      notesTitle: note.notesTitle || 'New Notes'
    }

    if (foulWords) {
      await FoulWords.register(loggedUser.id, foulWords, NOTES)
      setFoulWords(null)
    }

    axiosInstance
      .post('/notes/new', noteToSubmit)
      .then((res) => {
        props.updateNotes((old) => [res.data.response, ...old])
        toast.success('Note saved successful')
        setNote(prev => ({
          ...prev,
          value: '<p></p>' // Only clear the content, keep the title
        }))
        setLoading(false)
        props.onHide('create_new_note')
      })
      .catch((err) => {
        toast.error('An error occurred, please try again')
        setLoading(false)
      })
  }

  const handleTitleChange = (e) => {
    setNote(prev => ({
      ...prev,
      notesTitle: e.target.value
    }))
  }

  const handlePencilClick = () => {
    setIsEditingTitle(true)
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
        // Set cursor to end of text
        const length = titleInputRef.current.value.length;
        titleInputRef.current.setSelectionRange(length, length);
      }
    }, 0)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsEditingTitle(false)
      titleInputRef.current.blur()
    }
  }

// In createNewNote.js
const handleChange = (name, value) => {
  setNote((prevValues) => ({
    ...prevValues,
    [name]: value,
    createdFrom: 
      props.from === 'video' ? 'videoModal-' + props.data.id :
      props.from === 'leadershipJournal' ? 'leadershipJournal-' + props.data.id :
      props.from === 'entrepreneurshipJournal' ? 'entrepreneurshipJournal-' + props.data.id :
      page
  }))

  if (name === 'value') {
    detectFoulWords(removeHtmlFromString(value), (data) => {
      setFoulWords(data)
    })
  }
}

  useEffect(() => {
    setPage(window.location.pathname.split('/')[1])
    props.from == 'video' &&
      setNote((old) => ({ ...old, notesTitle: props.data.title }))
  }, [window.href])

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditingTitle])

  useEffect(() => {
    setPage(window.location.pathname.split('/')[1])
    if (props.from === 'video' && props.data?.title) {
      const formattedTitle = props.data.title
        .replace('video.', '')
        .split('_')
        .map(word => word.toUpperCase())
        .join(' ')
      
      setNote(old => ({
        ...old,
        notesTitle: formattedTitle
      }))
    }
    else if (props.from === 'leadershipJournal' && props.data?.title) {
      const formattedTitle = props.data?.title
      setNote(old => ({
        ...old,
        notesTitle: formattedTitle
      }))
    }
    else if (props.from === 'entrepreneurshipJournal' && props.data?.title) {
      const formattedTitle = props.data?.title
      
      setNote(old => ({
        ...old,
        notesTitle: formattedTitle
      }))
    }
  }, [window.href, props.from, props.data?.title])

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      close={props.closeAddModalSaved}
      backdrop={true}
      keyboard={true}
      className='notes-modal'
      dialogAs={DraggableModalDialog}
    >
      <Resizable
        className='modal-resizable modalResizable_width_height'
        defaultSize={{
          width: 'auto',
          height: 'auto',
          minHeight: '400px'
        }}
      >
        <Modal.Header
          style={{ cursor: 'move' }}
          className='add-new-note-title general-modal-header my-auto p-0 mx-3 mx-md-5 mb-2'
        >
          <h3 className='mb-1 pt-4 mt-2 newNote_title flex-grow-1 d-flex align-items-center'>
            <div className="title-input-container" style={{ flex: 1, position: 'relative' }}>
              <input
                ref={titleInputRef}
                type="text"
                value={note.notesTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="note-title-input"
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none',
                  padding: '4px 8px',
                  fontSize: '16px',
                  touchAction: 'manipulation',
                  caretColor: isEditingTitle ? '#51c7df' : 'transparent',
                  boxShadow: isEditingTitle ? '0 0 0 2px #51c7df' : 'none',
                  borderRadius: '3px',
                  transition: 'box-shadow 0.2s ease'
                }}
                readOnly={!isEditingTitle}
              />
            </div>
            <div 
              className="edit-icon-container"
              onClick={handlePencilClick}
              onTouchStart={handlePencilClick}
              role="button"
              tabIndex={0}
              style={{
                padding: '8px',
                marginLeft: '8px',
                cursor: 'pointer',
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ 
                  color: isEditingTitle ? '#51c7df' : '#707070',
                  fontSize: '1.1rem',
                  transition: 'color 0.2s ease',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => props.onHide('create_new_note')}
          />
        </Modal.Header>
        <Modal.Body className='mx-md-4 px-md-0 pt-0'>
          <span className='newNote_date'>
            Created: {moment(Date.now()).format('L')}&nbsp;&nbsp; Edited:
            {moment(Date.now()).format('L')}
          </span>
          <div className='mt-2'>
            <ReactQuill
              theme='snow'
              name='textQuillStandart'
              className='mb-5 w-100 p-0 scroll-add-new-note-popup-modal react-quill'
              // style={{ height: '186px' }}
              onChange={(e) => handleChange('value', e)}
              modules={quillModules}
              placeholder={'Write here…'}
              value={note?.value ? note?.value : ''}
              formats={quillFormats}
            />
          </div>

          {foulWords && (
            <div className='p-2 foul-words-notice'>
              <IntlMessages id='foul_words.notice' />
            </div>
          )}
          <Modal.Footer
            style={{ border: '0px' }}
            className='mt-0 pt-0 border-0 border-none mx-md-4 pe-md-4'
          >
            <button
              className='float-end m-0 px-md-5 save-button add-new-note-button-text'
              onClick={validate}
            >
              {loading ? 'loading' : <IntlMessages id='general.save' />}
              {/* <IntlMessages id='general.save' /> */}
            </button>
          </Modal.Footer>
        </Modal.Body>{' '}
      </Resizable>
    </Modal>
  )
}
export default CreateNewNote