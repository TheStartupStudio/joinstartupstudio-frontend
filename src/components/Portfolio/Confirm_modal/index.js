import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import icon from '../../../assets/images/Icon awesome-exclamation-triangle.svg'

export const DeleteConfirmation = (props) => {
  const style = {
    confirmButton: {
      backgroundColor: '#01c5d1',
      color: '#FFFFFF',
      border: '0px'
    },
    font: {
      font: ' normal normal 300 15px/19px Montserrat',
      letterSpacing: ' 0.6px',
      color: '#333D3D'
    }
  }

  return (
    <Modal
      show={props.showModal}
      onHide={props.onHide}
      className='mt-5 p-md-5 mx-auto'
    >
      <Modal.Body className='p-md-5 row py-5'>
        <div className='row pt-5 px-md-5'>
          <div className='col-12 col-md-1 pe-0 me-0 ge-0 mx-auto text-center'>
            <img className='py-1' src={icon} />
          </div>
          <div
            className='col-12 col-md-11 ps-md-5 text-center text-md-start'
            style={style.font}
          >
            <h6 className='pb-md-4'>{props.title}</h6>
            {props.body}
          </div>
        </div>
        <div className='row px-md-5 mx-0 py-5'>
          <Button
            className={`py-2 ${props.loading && 'disabled'}`}
            style={style.confirmButton}
            onClick={() => props.checkIfAggre()}
          >
            {!props.loading ? 'GOT IT! PUBLISH!' : 'Loading plase wait ....'}
          </Button>
          <Button
            variant='default'
            className='py-2 my-1'
            onClick={props.onHide}
          >
            Go back, I’m not ready to publish yet.
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
