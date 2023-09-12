import React from 'react'
import { Modal } from 'react-bootstrap'

const DownloadFormatModal = (props) => {
  const { show, onHide, downloadCertificateAsPdf, downloadCertificateAsPng } =
    props
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      style={{ width: '25%', marginLeft: '37.5%' }}
      centered
    >
      <Modal.Header
        className="contact-us-title my-auto p-0 mx-4"
        style={{ border: 0 }}
      >
        <button
          type="button"
          className="btn-close mt-2"
          aria-label="Close"
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="my-2 my-md-4 mx-2 mx-md-5">
          <h6 className="title">
            What is the format you want to download you'r certificate
          </h6>
          <div className="mt-4 text-center d-flex justify-content-evenly mb-4">
            <button
              className="button-format col-5"
              style={{ backgroundColor: '#01C5D1' }}
              onClick={() => {
                downloadCertificateAsPdf()
                onHide()
              }}
            >
              {/* {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : ( */}
              PDF
              {/* )} */}
            </button>
            <button
              className="button-format col-5"
              //   disabled={loading}
              style={{ backgroundColor: '#01C5D1' }}
              onClick={() => {
                downloadCertificateAsPng()
                onHide()
              }}
            >
              {/* {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : ( */}
              PNG
              {/* )} */}
            </button>
          </div>
          <div className="mt-2 text-center">
            <p onClick={onHide} className="cancel">
              CANCEL
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DownloadFormatModal
