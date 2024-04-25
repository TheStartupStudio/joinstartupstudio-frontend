import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'

const UploadFileInput = ({ placeholder, name, onChange }) => {
  return (
    <label className="immersion-upload-file-input">
      <span className="file-input-placeholder">{placeholder}</span>
      <FontAwesomeIcon icon={faFileUpload} className="file-input-icon" />
      <input
        type="file"
        className="file-input"
        name={name}
        onChange={onChange}
      />
    </label>
  )
}

export default UploadFileInput
