import {
  faCheck,
  faUserLock,
  faUserMinus,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { SubmitButton } from '../MySchool/ContentItems'

const RemoveItemModal = ({ show, onHide, mode }) => {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Modal
        show={show}
        className={'courseVcredential-modal mb-5 pb-5 myCustomModal'}
        onHide={() => {
          onHide()
        }}
        centered
        dialogClassName='custom-modal-lg'
      >
        <Modal.Header className='position-relative p-3'>
          <Modal.Title
            className='px-3 py-3 d-flex fw-normal flex-column'
            style={{ fontSize: '16px' }}
          >
            <div
              className='d-flex align-items-center justify-content-center mb-3'
              style={{
                width: '36px',
                height: '36px',
                background: '#C8CDD880',
                fontSize: '15px',
                borderRadius: '50%'
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            Delete Course or Credential
          </Modal.Title>

          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <Col md='12' className='d-flex justify-content-end'>
            <Row className='m-0 col-5 justify-content-evenly'>
              <SubmitButton
                text={'CANCEL'}
                width={'100px'}
                background={'transparent'}
                color={'#000'}
                border={'1px solid #ccc'}
                onClick={() => onHide()}
              />
              <SubmitButton
                // onClick={submitHandler}
                text={
                  loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'ADD INSTRUCTOR'
                  )
                }
                background={'#52C7DE'}
                color={'#fff'}
                border={'none'}
              />
            </Row>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default RemoveItemModal
