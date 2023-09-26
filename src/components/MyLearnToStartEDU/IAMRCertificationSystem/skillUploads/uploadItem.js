import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import DialogModal from '../customComponents/dialogModal'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

const UploadItem = ({ upload, setSelectedUpload, deleteUpload }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { id } = useParams()

  const handleDelete = () => {
    setDeleteLoading(true)
    deleteUpload(upload.id,id, () => setDeleteLoading(false))
  }

  const isDeletable =
    upload.status !== 'submitted' &&
    upload.status !== 'proficient' &&
    upload.status !== 'approved'
  return (
    <>
      <div className="d-flex mt-2">
        <div className="upload-item" onClick={() => setSelectedUpload(upload)}>
          <h3 className="title">{upload.title}</h3>
          <div className="d-flex flex-row">
            <p className="view">View</p>
            <span
              className={`iamr-status-point ms-2 my-auto ${
                upload.status ?? 'saved'
              }`}
              title={`Status: ${upload.status ?? 'Saved'}`}
            />
          </div>
        </div>
        <FontAwesomeIcon
          icon={faTrash}
          className={`my-auto ms-2 delete-upload-icon ${
            !isDeletable ? 'disabled' : ''
          }`}
          title={
            isDeletable
              ? 'Delete'
              : 'You cannot delete a proficient or submitted upload.'
          }
          cursor={'pointer'}
          color="#fe43a1"
          onClick={() => isDeletable && setShowDeleteModal(true)}
        />
      </div>
      {showDeleteModal && (
        <DialogModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          onSubmit={handleDelete}
          title={'Are you sure you want to delete your upload?'}
          submitBtnText={'YES, DELETE IT'}
        />
      )}
    </>
  )
}

export default UploadItem
