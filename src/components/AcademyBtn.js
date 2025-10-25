import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AcademyBtn({ 
  title, 
  icon, 
  onClick, 
  disabled, 
  loading, 
  spin = false, 
  buttonClass,
  imageSide = false // false = right (default), true = left
}) {
  // Check if icon is a FontAwesome icon object or a string (image path)
  const isImageIcon = typeof icon === 'string'
  const isFontAwesomeIcon = icon && typeof icon === 'object' && icon.iconName

  const renderIcon = () => {
    if (isFontAwesomeIcon) {
      return (
        <FontAwesomeIcon 
          icon={icon} 
          className={imageSide ? "me-2" : "ms-2"}
          spin={spin && loading}
        />
      )
    }
    
    if (isImageIcon) {
      return (
        <img 
          src={icon} 
          alt="icon" 
          style={{ 
            width: '20px', 
            height: '20px',
            marginLeft: imageSide ? '0' : '8px',
            marginRight: imageSide ? '8px' : '0',
            animation: (spin && loading) ? 'spin 1s linear infinite' : 'none'
          }} 
        />
      )
    }
    
    return null
  }

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
        minWidth: loading ? '58px' : 'auto'
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
          padding: loading ? '0' : '0 1rem'
        }}
      >
        {loading ? (
          // Show icon while loading if it exists
          icon && renderIcon()
        ) : (
          <>
            {/* Show icon on left if imageSide is true */}
            {imageSide && icon && renderIcon()}
            
            {title}
            
            {/* Show icon on right if imageSide is false (default) */}
            {!imageSide && icon && renderIcon()}
          </>
        )}
      </button>
    </div>
  )
}

export default AcademyBtn