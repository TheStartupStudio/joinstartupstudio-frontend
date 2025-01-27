import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DownloadIcon from '../../../assets/images/downloadSpotDoc.svg'
const ParentButtonApply = ({ text }) => {
  return (
    <button className='parentGuardian-button'>
      {' '}
      <img src={DownloadIcon}></img>
      {/* <FontAwesomeIcon
        icon={faFileUpload}
        className='upload-apply-icon file-input-icon'
      /> */}
      {text}
    </button>
  )
}

export { ParentButtonApply }
