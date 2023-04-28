import UploadItem from './uploadItem'

const UploadsList = ({ uploads, setSelectedUpload, deleteUpload }) => {
  return (
    <div className='d-flex flex-column mt-2'>
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
        <p className='page-content-text fw-normal my-5 text-center'>
          Student hasn't created any upload yet!
        </p>
      )}
    </div>
  )
}

export default UploadsList
