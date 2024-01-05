import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import UploadItem from './uploadItem'

const UploadsList = ({
  uploads,
  setSelectedUpload,
  setShowUpload,
  skillStatus,
  deleteUpload,
}) => {
  return (
    <div className="d-flex flex-column mt-2">
      {uploads.length > 0 ? (
        uploads.map((upload) => (
          <UploadItem
            upload={upload}
            key={upload.id}
            setSelectedUpload={setSelectedUpload}
            deleteUpload={deleteUpload}
          />
        ))
      ) : (
        <p className="page-content-text fw-normal my-5 text-center">
          No uploads yet, start by creating one below!
        </p>
      )}
      {uploads.length >= 3 ? (
        <p className="page-content-text fw-normal my-3 text-center">
          You have reached maximum uploads(3) per skill.
        </p>
      ) : (
        skillStatus !== 'proficient' &&
        skillStatus !== 'approved' && (
          <button
            className="ms-auto float-end mt-2 new-ticket-btn rounded fw-bold"
            onClick={() => {
              setSelectedUpload()
              setShowUpload(true)
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2 align-middle" />
            <span className="align-middle">Add upload</span>
          </button>
        )
      )}
    </div>
  )
}

export default UploadsList
