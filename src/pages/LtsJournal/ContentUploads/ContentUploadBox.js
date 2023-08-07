import React from 'react'

const ContentUploadBox = ({ title, isEnabled }) => {
  const boxBackgroundColor = () => {
    if (isEnabled) {
      return 'lightblue'
    } else if (!isEnabled) {
      return 'rosybrown'
    }
  }

  return (
    <div
      style={{
        backgroundColor: boxBackgroundColor(),
        borderRadius: '6px',
        padding: '8px',
        marginBottom: '5px',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {title}
    </div>
  )
}

export default ContentUploadBox
