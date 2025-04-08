import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AcademyBtn({ title, icon, onClick, disabled, buttonClass }) {
  return (
    <div
      className='d-flex'
      style={{
        display: 'inline-block',
        borderRadius: '8px',
        background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
        padding: '2px',
        height: '58px',
        boxShadow: '0px 4px 10px 0px #00000040'
      }}
    >
      <button
        className={`continue-course-btn fs-14 ${
          buttonClass ? buttonClass : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {title} <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  )
}

export default AcademyBtn
