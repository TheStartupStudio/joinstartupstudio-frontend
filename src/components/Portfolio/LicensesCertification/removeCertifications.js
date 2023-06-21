import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import './index.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import Individual_certificate from './Individual_certificate'

export default function RemoveCertification(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      dialogClassName="my-modal"
      className="edit_modal mt-md-5"
    >
      <Modal.Header className="edit-modal p-0 mx-4 general-modal-header">
        <h3 className="mt-4 mb-0 edit-modal-box-title">
          <IntlMessages id="portfolio.EDIT_LICENSES_CERTIFICATIONS" />
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <ModalBody className="px-4">
        <div className="row">
          <h4 className="mb-4">
            <IntlMessages id="portfolio.remove_license" />
          </h4>
          <div className="row">
            {props?.data &&
              props.data?.map((data, index) => (
                <div className="col-md-3 d-flex justify-content-center align-items-center">
                  <Individual_certificate
                    key={index}
                    data={data}
                    editRevmoveCertification={(id) =>
                      props.editRevmoveCertification(id)
                    }
                    setCertificatedToRemove={(data) =>
                      props.setCertificatedToRemove(data)
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      </ModalBody>
      <Modal.Footer className="border-0 py-0 my-0 mb-2 position-relative">
        <div className="row p-0 mb-3">
          <div className="col-md-11">
            <button
              className="float-end edit-account"
              disabled={props.loading}
              onClick={() => props.onSave()}
            >
              {props.loading ? (
                <IntlMessages id="general.loading" />
              ) : (
                <IntlMessages id="general.save" />
              )}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
