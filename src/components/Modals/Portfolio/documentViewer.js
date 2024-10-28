import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

export default function DocumentViewer(props) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    } else {
      setPageNumber(pageNumber)
    }
  }

  const handleNextPage = () => {
    if (pageNumber >= 1 && pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    } else {
      setPageNumber(pageNumber)
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'></Modal.Title>
      </Modal.Header>
      <Modal.Body className='document-modal'>
        {/*<Document*/}
        {/*  className='pdf-document-viewer'*/}
        {/*  file={`${props.articleLink}`}*/}
        {/*  onLoadSuccess={onDocumentLoadSuccess}*/}
        {/*>*/}
        {/*  <Page pageNumber={pageNumber} />*/}

        {/*  {numPages > 1 ? (*/}
        {/*    <div className='page-controls'>*/}
        {/*      <button type='button' onClick={handlePreviousPage}>*/}
        {/*        {'<'}{' '}*/}
        {/*      </button>*/}
        {/*      <span>*/}
        {/*        {pageNumber} of {numPages}*/}
        {/*      </span>*/}
        {/*      <button type='button' onClick={handleNextPage}>*/}
        {/*        {'>'}*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  ) : null}*/}
        {/*</Document>*/}
      </Modal.Body>
    </Modal>
  )
}
