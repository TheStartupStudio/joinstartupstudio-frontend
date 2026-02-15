import React from 'react'
import './DeleteJournalContentModal.css'
import AcademyBtn from '../../../components/AcademyBtn'

const DeleteJournalContentModal = ({
  show,
  onClose,
  onArchive,
  onDelete,
  title = "Are you sure?",
  message = "",
  isArchived = false
}) => {
  if (!show) return null

  const handleArchive = () => {
    if (onArchive) {
      onArchive()
    }
    onClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    onClose()
  }

  return (
    <>
      <div className="delete-journal-content-modal-overlay" onClick={onClose}>
        <div className="delete-journal-content-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E6EC', borderRadius: '50%' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.1266 17.5007H3.87405C2.33601 17.5007 1.37357 15.837 2.14023 14.5037L8.26651 3.84931C9.03552 2.5119 10.9651 2.5119 11.7341 3.84931L17.8604 14.5037C18.6271 15.837 17.6646 17.5007 16.1266 17.5007Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 14.1743L10.0083 14.1651" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>

          <div className="modal-body">
            <p className="modal-message">
              {isArchived
                ? "Are you sure you want to permanently delete this archived content? This cannot be undone."
                : "Are you sure you want to delete this content? This cannot be undone. Alternatively, you can archive the content."
              }
            </p>
          </div>

          <div className="modal-actions">
            {!isArchived && (
              <div onClick={handleArchive} className="archive-btn-container">
                <p className="archive-btn">Archive Content</p>
              </div>
            )}

            <div className={`d-flex gap-2 ${isArchived ? 'w-100 justify-content-center' : 'w-100'}`}>
              <div onClick={onClose} >
                <p className="cancel-btn">No, Take Me Back</p>
              </div>
              <div onClick={handleDelete} >
                <p className="delete-btn">Delete Content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteJournalContentModal
