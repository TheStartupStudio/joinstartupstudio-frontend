import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import IntlMessages from '../../../utils/IntlMessages'
import { Resizable } from 're-resizable'
import 'react-quill/dist/quill.snow.css'
import ModalDialog from 'react-bootstrap/ModalDialog'
import '../style/index.css'
import './modal.css'
import Draggable from 'react-draggable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import moment from 'moment'
import { detectFoulWords, removeHtmlFromString } from '../../../utils/helpers'
import FoulWords from '../../../utils/FoulWords'
import { NOTES } from '../../../utils/constants'

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle='.newNote_title'>
        <ModalDialog {...this.props} />
      </Draggable>
    )
  }
}

const quillModules = {
  toolbar: [
    // [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6] }],
    [('bold', 'italic')], // toggled buttons
    ['blockquote'],
    [{ list: 'bullet' }, { list: 'ordered' }],
    [{ align: null }, { align: 'center' }, { align: 'right' }],
    ['link', 'image', 'video']
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
  'image',
  'color',
  'code-block'
]

const EditNote = (props) => {
  const dispatch = useDispatch(); // Add this at the top with other hooks
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)
  const [noteTitle, setNoteTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef(null)

  const handleQuillInput = (QuillInput) => {
    setNote(QuillInput)

    if (QuillInput) {
      detectFoulWords(removeHtmlFromString(QuillInput), (data) => {
        setFoulWords(data)
      })
    }
  }

  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value)
  }

  const handlePencilClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        // Set cursor to end of text
        const length = titleInputRef.current.value.length;
        titleInputRef.current.setSelectionRange(length, length);
      }
    }, 0);
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

  useEffect(() => {
    if (props.data) {
      handleQuillInput(props.data.value)
      setNoteTitle(props.data.title)
    }
  }, [props.data])

  const validate = () => {
    handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)

    if (foulWords) {
      await FoulWords.register(loggedUser.id, foulWords, NOTES)
      setFoulWords(null)
    }

    axiosInstance
      .put('/notes/new', {
        id: props.data.id,
        title: noteTitle || props.data.title,
        value: note,
        createdFrom: props.data.createdFrom
      })
      .then((res) => {
        toast.success('Note saved successful')
        props.changeState('edit_single_note_modal')
        props.updateState(res)

        setLoading(false)
      })
      .catch((err) => {
        toast.error('An error occurred, please try again')
        setLoading(false)
      })
  }

  const deleteNote = async () => {
    setLoading(true);
    try {
      // Delete the note
      await axiosInstance.delete(`/notes/${props.data.id}`);
      
      // Show success message
      toast.success('Note deleted successfully');
      
      // Close the modal
      props.changeState('edit_single_note_modal');
      
      // Refresh notes list
      const response = await axiosInstance.get('/notes');
      if (props.updateNotes) {
        props.updateNotes(response.data);
      }
      
      // If parent component provided onDelete callback
      if (props.onDelete) {
        props.onDelete(props.data.id);
      }
    } catch (err) {
      console.error('Delete note error:', err);
      toast.error('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

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
        defaultSize={{ width: 'auto', height: 'auto', minHeight: '400px' }}
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
                value={noteTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="note-title-input"
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none', // Remove default outline
                  padding: '4px 8px',
                  fontSize: '16px',
                  touchAction: 'manipulation',
                  caretColor: isEditingTitle ? '#51c7df' : 'transparent', // Show/hide cursor
                  boxShadow: isEditingTitle ? '0 0 0 2px #51c7df' : 'none', // Blue border when editing
                  borderRadius: '3px',
                  transition: 'box-shadow 0.2s ease'
                }}
                readOnly={!isEditingTitle}
              />
            </div>
            <div 
              className="edit-icon-container"
              onClick={handlePencilClick}
              onTouchStart={handlePencilClick} // Add touch handler
              role="button" // Add for accessibility
              tabIndex={0} // Add for accessibility
              style={{
                padding: '8px',
                marginLeft: '8px',
                cursor: 'pointer',
                touchAction: 'none', // Change from manipulation to none
                WebkitTapHighlightColor: 'transparent', // Prevent tap highlight on iOS
                userSelect: 'none' // Prevent text selection
              }}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ 
                  color: isEditingTitle ? '#51c7df' : '#707070',
                  fontSize: '1.1rem',
                  transition: 'color 0.2s ease',
                  pointerEvents: 'none' // Prevent icon from interfering with touch
                }}
              />
            </div>
          </h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => {
              props.changeState('edit_single_note_modal')
            }}
          />
        </Modal.Header>
        <Modal.Body className='mx-md-4 px-md-4 pt-0'>
          <span className='newNote_date'>
            Created: {moment(props.data?.createdAt).format('L')}&nbsp;&nbsp;
            Edited:
            {moment(props.data?.updatedAt).format('L')}
          </span>
          <div className='mt-2'>
            <ReactQuill
              theme='snow'
              name='value'
              className='mb-5 w-100 p-0 scroll-add-new-note-modal'
              // style={{ height: '186px' }}
              value={note}
              onChange={(e) => handleQuillInput(e)}
              modules={quillModules}
              placeholder={'Write here…'}
              formats={quillFormats}
            />
          </div>

          {foulWords && (
            <div className='p-2 foul-words-notice'>
              {FoulWords.printMessage(foulWords)}
            </div>
          )}
        </Modal.Body>{' '}
        <Modal.Footer
          style={{ border: '0px' }}
          className='mt-0 pt-0 border-0 border-none pe-md-5 d-flex justify-content-between align-items-center'
        >
          {/* Delete icon on the left */}
          <button
            className='btn btn-link p-0 ms-md-5'
            onClick={deleteNote}
            disabled={loading}
            style={{ 
              color: 'black', 
              textDecoration: 'none'
            }}
          >
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="me-2" 
              style={{ fontSize: '1.1rem' }}
            />
            {loading ? 'loading' : 'Delete Note'}
          </button>

          {/* Save button remains on right */}
          <button
            className='float-end m-0 px-md-5 save-button add-new-note-button-text '
            onClick={() => validate()}
          >
            {loading ? 'loading' : 'SAVE & CLOSE'}
          </button>
        </Modal.Footer>
      </Resizable>
    </Modal>
  )
}
export default EditNote