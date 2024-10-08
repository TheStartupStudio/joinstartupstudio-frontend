import React from 'react'

const ContentUploadBox = ({
  title,
  isAdded,
  onSelectContent,
  isSelected,
  isEditable,
  evaluationModal
}) => {
  const boxBackgroundColor = () => {
    if (isAdded) {
      // if value is true
      // set backgroundColor to sky blue color
      return '#51C7DF'
    } else {
      // if value is false
      if (isSelected) {
        // if value is false and if is selected set to rose
        return '#FF3399'
      } else {
        // if value is false and if is not selected set to light gray
        return '#333D3D29'
      }
    }
  }
  const boxTextColor = () => {
    if (isAdded) {
      // if value is true
      // set color to white
      return 'white'
    } else {
      // if value is false
      if (isSelected) {
        // if value is false and if is selected set to white
        return 'white'
      } else {
        // if value is false and if is not selected set to light black
        return '#231F20'
      }
    }
  }

  const commonStyles = {
    background: boxBackgroundColor(),
    color: boxTextColor(),
    padding: '8px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 100,
    font: 'normal normal medium 12px/12px Montserrat',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: 600,
    width: '100%'
  }

  const evaluationModalStyle = {
    background: boxBackgroundColor(),
    color: boxTextColor(),
    padding: '8px',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 75,
    font: '12px Montserrat',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: 600,
    width: '100%',
    borderRadius: 20
  }

  const editableStyles = {
    cursor: 'pointer'
  }

  const nonEditableStyles = {
    opacity: 1
  }

  return (
    <div
      style={{
        ...(evaluationModal ? evaluationModalStyle : commonStyles),
        ...(isEditable ? editableStyles : nonEditableStyles)
      }}
      onClick={isEditable ? onSelectContent : undefined}
    >
      {title}
    </div>
  )
}

export default ContentUploadBox
