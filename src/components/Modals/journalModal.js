import React from 'react'
import { Modal } from 'react-bootstrap'

const JournalFileModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <img src={props.file} width='100%' />
      </Modal.Body>
    </Modal>
  )
}
export default JournalFileModal
