import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ParentButtonApply = ({ text }) => {
  return (
    <button className='parentGuardian-button'>
      {' '}
      <FontAwesomeIcon
        icon={faFileUpload}
        className='upload-apply-icon file-input-icon'
      />
      {text}
    </button>
  )
}

export { ParentButtonApply }
