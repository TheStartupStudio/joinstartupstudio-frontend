const UploadItem = ({ upload, setSelectedUpload, deleteUpload }) => {
  return (
    <>
      <div className='d-flex mt-2'>
        <div className='upload-item' onClick={() => setSelectedUpload(upload)}>
          <h3 className='title'>{upload.title}</h3>
          <div className='d-flex flex-row'>
            <p className='view'>View</p>
            <span
              className={`iamr-status-point ms-2 my-auto ${upload.status}`}
              title={`Status: ${upload.status ?? 'Saved'}`}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadItem
