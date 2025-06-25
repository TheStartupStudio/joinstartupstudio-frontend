import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AcademyBtn({ title, icon, onClick, disabled, loading, spin = false, buttonClass }) {
  return (
    <div
      className='d-flex saveContinue-btn'
      style={{
        display: 'inline-block',
        borderRadius: '8px',
        background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
        padding: '2px',
        height: '58px',
        boxShadow: '0px 4px 10px 0px #00000040',
        minWidth: loading ? '58px' : 'auto' // Keep consistent width when loading
      }}
    >
      <button
        className={`continue-course-btn fs-14 saveContinue-btn d-flex align-items-center justify-content-center ${
          buttonClass ? buttonClass : ''
        }`}
        onClick={onClick}
        disabled={disabled || loading}
        style={{
          width: '100%',
          padding: loading ? '0' : '0 1rem' // Remove side padding when loading
        }}
      >
        {loading ? (
          <FontAwesomeIcon 
            icon={icon} 
            spin={spin} 
            style={{ fontSize: '1.25rem' }} 
          />
        ) : (
          <>
            {title}
            <FontAwesomeIcon icon={icon} className="ms-2" />
          </>
        )}
      </button>
    </div>
  )
}

export default AcademyBtn