import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Col, Modal } from 'react-bootstrap'
import { CustomCheckbox, LtsButton } from '../../../ui/ContentItems'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const ArchiveAppModal = ({
  show,
  onHide,
  application,
  payments,
  refreshData,
  selectedRows = []
}) => {
  const [loading, setLoading] = useState(false)
  const [refund, setRefund] = useState(false)

  const handleArchiveAndRefund = async () => {
    setLoading(true)

    try {
      await axiosInstance.patch(
        `/academy/applications/${application.id}/archived`
      )

      if (refund) {
        await axiosInstance.post('/webhook/refund', {
          paymentIntentId: payments[0].stripe_payment_id
        })
      }

      onHide()
      refreshData()
      toast.success(
        `Application is successfully archived ${
          refund ? 'and the user is refunded' : ''
        } `
      )
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        show={show}
        className={'archive-modal mb-5 pb-5 '}
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
            Archive Application
          </Modal.Title>

          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <p>Are you sure you want to archive this application?</p>
          <Col className='py-3 d-flex justify-content-center'>
            <CustomCheckbox
              name='semester'
              text={'Refund payment'}
              handleChange={() => setRefund((state) => !state)}
              checked={refund}
            />
          </Col>

          <Col md='12' className='d-flex justify-content-center'>
            <LtsButton
              onClick={handleArchiveAndRefund}
              text={
                loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'YES ARCHIVE APPLICATION'
                )
              }
              background={'#ee3c96'}
              color={'#fff'}
              border={'none'}
            />
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ArchiveAppModal
