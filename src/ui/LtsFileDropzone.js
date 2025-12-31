import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const focusedStyle = {
  borderColor: '#51C7DF'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

const LtsFileDropzone = ({ id, onDrop }) => {
  // const [files, setFiles] = useState([])
  // console.log('files', files)
  // const onDrop = useCallback((files) => setFiles(files), [setFiles])
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      '.csv': []
    },
    maxFiles: 1
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ))
  return (
    <section className='container p-0 py-3'>
      <div {...getRootProps({ className: 'dropzone', style })}>
        <input {...getInputProps()} id={id} />
        <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: '30px' }} />
        <p>Click to upload or drag and drop</p>
        <em>Only CSV file format supported (max 2Mb)</em>
        {acceptedFileItems.length ||
          (fileRejectionItems.length ? (
            <aside
              className='d-flex flex-column py-3'
              style={{ fontSize: '12px' }}
            >
              <p className='fw-bold'>Accepted Files</p>
              <ul>{acceptedFileItems}</ul>
              <p className='fw-bold'>Unaccepted Files</p>
              <ul>{fileRejectionItems}</ul>
            </aside>
          ) : null)}
      </div>
    </section>
  )
}

export default LtsFileDropzone
