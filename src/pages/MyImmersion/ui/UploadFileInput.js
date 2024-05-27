import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import { fileNameExtracter } from '../../../utils/helpers'

const UploadFileInput = ({ filename, placeholder, name, onChange, mode }) => {
  const handleClick = () => {
    if (mode === 'ticket' && filename) {
      window.open(filename, '_blank')
    }
  }
  return (
    <label className="immersion-upload-file-input" onClick={handleClick}>
      <span className="file-input-placeholder">
        {mode === 'ticket'
          ? fileNameExtracter(filename)
          : filename
          ? filename
          : placeholder}
      </span>
      <FontAwesomeIcon icon={faFileUpload} className="file-input-icon" />
      {mode !== 'ticket' && (
        <input
          type="file"
          id="inputGroupFile"
          name={name}
          accept="application/pdf"
          className="file-input"
          onChange={onChange}
        />
      )}
    </label>
  )
}

export default UploadFileInput
