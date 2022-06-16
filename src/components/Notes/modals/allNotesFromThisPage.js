import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
// import { useDispatch, useSelector } from 'react-redux'
// import IntlMessages from '../../../utils/IntlMessages'
import { Resizable } from 're-resizable'
import 'react-quill/dist/quill.snow.css'
import ModalDialog from 'react-bootstrap/ModalDialog'
import '../style/index.css'
import './modal.css'
import Draggable from 'react-draggable'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import axiosInstance from '../../../utils/AxiosInstance'
// import { toast } from 'react-toastify'
import { SingleNote } from './singleNote'

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle='.modal-header'>
        <ModalDialog {...this.props} />
      </Draggable>
    )
  }
}

export const AllNotesFromThisPage = (props) => {
  // const [loading, setLoading] = useState(false)

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      close={props.closeAddModalSaved}
      backdrop={false}
      keyboard={'false'}
      style={{ marginTop: '3.9%' }}
      className='notes-modal'
      dialogAs={DraggableModalDialog}
    >
      <Resizable
        className='modal-resizable modalResizable_width_height'
        defaultSize={{ width: 'auto', height: 'auto', minHeight: '400px' }}
      >
        <Modal.Header
          style={{ cursor: 'move' }}
          className='add-new-note-title my-auto p-0 mx-3 mx-md-5 mb-2'
        >
          <h3 className='mb-1 pt-4 mt-2 newNote_title'>
            ALL NOTES CREATED ON THIS PAGE
          </h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => {
              props.onHide('all_note_on_this_page')
            }}
          />
        </Modal.Header>
        <Modal.Body
          className='mx-md-4 px-md-3 pt-0 pt-2'
          style={{ maxHeight: '100%' }}
        >
          <div className='single_note_primary_div'>
            {props?.allNotes
              ? props?.allNotes.map((data) => {
                  return (
                    <SingleNote
                      fromPage={props.from}
                      dataToEdit={(data) => props.sendDataToEdit(data)}
                      changeState={(data, type) =>
                        props.changeState(data, type)
                      }
                      data={data}
                      key={data.id}
                    />
                  )
                })
              : null}
          </div>
        </Modal.Body>{' '}
        {/* <Modal.Footer
          style={{ border: '0px' }}
          className='mt-0 pt-0 border-0 border-none pe-5'
        >
          <button
            className='float-end m-0 px-md-5 save-button add-new-note-button-text pe-5'
            // onClick={handleSubmit}
          >
            {loading ? 'loading' : <IntlMessages id='general.save' />}
            {/* <IntlMessages id='general.save' /> 
          </button>
        </Modal.Footer> */}
      </Resizable>
    </Modal>
  )
}
