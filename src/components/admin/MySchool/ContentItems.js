import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const InfoBox = ({ children, isEditable }) => {
  return (
    <div className='info-box'>
      {isEditable && (
        <div
          className={`check-button  `}
          // className={`check-button  ${isDisabled ? 'disabled' : ''}`}
          // onClick={!isDisabled ? submitHandler : null}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
      {children}
    </div>
  )
}

const DetailsInfoBox = ({ children }) => {
  return <div className='details-info-box my-3 p-2'>{children}</div>
}

export { InfoBox, DetailsInfoBox }
