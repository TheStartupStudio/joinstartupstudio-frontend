import React, { useState, useEffect } from 'react'
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
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
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
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)
  const [noteTitle, setNoteTitle] = useState('')

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
          <h3 className='mb-1 pt-4 mt-2 newNote_title flex-grow-1'>
            <input
              type="text"
              value={noteTitle}
              onChange={handleTitleChange}
              className="note-title-input"
              style={{
                border: 'none',
                background: 'transparent',
                width: '80%'
              }}
            />
            <FontAwesomeIcon
              icon={faPencilAlt}
              style={{ color: '#707070' }}
              className='ms-4'
            />
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
          className='mt-0 pt-0 border-0 border-none pe-md-5'
        >
          <button
            className='float-end m-0 px-md-5 save-button add-new-note-button-text pe-5'
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
