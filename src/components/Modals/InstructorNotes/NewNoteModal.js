import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import FoulWords from '../../../utils/FoulWords'
import IntlMessages from '../../../utils/IntlMessages'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { NOTES } from '../../../utils/constants'
import { detectFoulWords, removeHtmlFromString } from '../../../utils/helpers'
import axiosInstance from '../../../utils/AxiosInstance'
import { useParams } from 'react-router-dom'
import notificationSocket from '../../../utils/notificationSocket'

const NewNoteModal = (props) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const [subject, setSubject] = useState('')
  const [noteText, setNoteText] = useState('')
  const { user } = useSelector((state) => state.user.user)
  const { id } = useParams()
  const editorRef = useRef(null)
  const [note, setNote] = useState([])

  const initialState = {
    subject: '',
    text: ''
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContents(noteText)
    }
  }, [noteText])

  useEffect(() => {
    if (props.note) {
      setSubject(props.note.subject)
      setNoteText(props.note.note_text)
    }
  }, [props.note])

  const options = {
    toolbarContainer: '#toolbar_container',
    placeholder: 'Add your text here.(Max 100 words)',
    showPathLabel: false,
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '100px',
    maxHeight: '250px',
    buttonList: [
      [
        'bold',
        'italic',
        'outdent',
        'indent',
        'align',
        'horizontalRule',
        'list',
        'table',
        'link',
        'video',
        'fullScreen',
        'codeView'
      ]
    ],
    callBackSave: function (contents, isChanged) {
      console.log(contents)
    }
  }

  const handleUserInput = (event) => {
    setSubject(event.target.value)
  }

  const handleEditorChange = (content) => {
    setNoteText(content)

    detectFoulWords(removeHtmlFromString(content), (data) => {
      setFoulWords(data)
    })
  }

  const onSaveNote = async (event) => {
    event.preventDefault()
    if (subject.length === 0) {
      toast.error(<IntlMessages id="instructor_notes.notes_title_neddet" />)
    } else if (noteText.length === 0) {
      toast.error(<IntlMessages id="instructor_notes.notes_title_text" />)
    } else {
      const data = {
        instructor_id: user?.id,
        student_id: id,
        subject,
        note_text: noteText
      }
      setLoading(true)

      if (foulWords) {
        await FoulWords.register(user.id, foulWords, NOTES)
        setFoulWords(null)
      }
      props.onSave(data)
      setSubject('')
      setNoteText('')

      toast.success(<IntlMessages id="instructor_notes.success_added" />)
      setTimeout(() => {
        props.close()
      }, 1000)
      setLoading(false)
    }
  }

  const onEditNote = () => {
    let newNote = {
      id: props.note.id,
      subject: subject,
      noteText: noteText
    }
    console.log('newNote', newNote)
    props.handleUpdateNote(newNote)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      close={props.closeAddModalSaved}
      backdrop="static"
      keyboard={false}
      style={{ marginTop: '3.9%' }}
      className="edit-modal general-modal-header"
    >
      <Modal.Header className="add-new-note-title general-modal-header my-auto p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">
          {props.edit ? `EDIT NOTE` : `ADD A NOTE`}
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className="mt-4 mb-3 mx-4 add-new-note">
        <div className="row w-100"></div>
        <div className="row p-0 add-new-note">
          <div className="col-md-8 mx-auto"></div>
          <FormattedMessage id="instructor_notes.notes_title">
            {(placeholder) => (
              <input
                className="my-2 mb-4 p-2 w-100"
                type="text"
                value={subject ?? subject}
                name="noteTitle"
                style={{ borderRadius: '0' }}
                onChange={handleUserInput}
                placeholder={placeholder}
              />
            )}
          </FormattedMessage>
          <div className="px-0">
            <FormattedMessage id="my_notes.notes_modal_body">
              {(placeholder) => (
                <SunEditor
                  setOptions={options}
                  setContents={noteText} // Set the initial value manually
                  ref={editorRef}
                  onChange={handleEditorChange}
                />
              )}

              {/* <SunEditor defaultValue="<p>The editor's default value</p>" /> */}
            </FormattedMessage>
          </div>

          {foulWords && (
            <div className="p-2 foul-words-notice">
              {FoulWords.printMessage(foulWords)}
            </div>
          )}
        </div>
      </Modal.Body>
      <div
        style={{ border: '0px' }}
        className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
      >
        <button
          className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
          onClick={props.edit ? onEditNote : onSaveNote}
        >
          {loading ? 'loading' : <IntlMessages id="general.save" />}
        </button>
      </div>
    </Modal>
  )
}

export default NewNoteModal
