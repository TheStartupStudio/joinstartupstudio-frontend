import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import TextareaAutosize from 'react-textarea-autosize'
import { useState } from 'react'
import { useEffect } from 'react'
import linkifyHtml from 'linkify-html'

const Input = ({
  onSubmit,
  loading,
  defaultValue = '',
  className = '',
  rowData,
  clearOnSubmit = true,
  onNullError,
  readOnly = false
}) => {
  const [pageWidth, setPageWidth] = useState([window.innerWidth])
  const options = { defaultProtocol: 'https', target: '_blank' }
  const submitIconRef = useRef(null)
  const messageBoxRef = useRef(null)
  const [messageInput, setMessageInput] = useState(defaultValue)
  const [hasChanges, setHasChanges] = useState(false)

  const isMobile = pageWidth <= 768

  const handleWindowSizeChange = () => {
    setPageWidth(window.innerWidth)
  }

  const formatMessage = (message) => {
    return linkifyHtml(message.replace(/^\s+|\s+$/g, ''), options)
  }

  useEffect(() => {
    console.log('readOnly', readOnly)
    if (readOnly) return
    if (messageInput.trim() !== defaultValue) setHasChanges(true)
    else setHasChanges(false)

    if (!messageBoxRef.current) return

    if (messageBoxRef.current.value.split('\n').length > 5) {
      submitIconRef.current.style.right = '38px'
    } else {
      submitIconRef.current.style.right = '22px'
    }
  }, [messageInput, defaultValue, readOnly])

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const handleSubmit = ({ e, forceSubmit }) => {
    if (
      ((e?.keyCode === 13 && !e?.shiftKey && !isMobile) || forceSubmit) &&
      hasChanges
    ) {
      e?.preventDefault()
      if (messageInput) {
        onSubmit(formatMessage(messageInput), rowData)
        clearOnSubmit && setMessageInput('')
        return
      }

      if (onNullError) return onNullError()
    }
  }

  return (
    <div className={`custom-input ${className}`}>
      <TextareaAutosize
        className=''
        placeholder='Aa'
        maxRows={5}
        ref={messageBoxRef}
        onKeyDown={(e) => !readOnly && handleSubmit({ e })}
        onChange={(e) => !readOnly && setMessageInput(e.target.value)}
        value={messageInput}
        disabled={loading || readOnly}
      />
      {!readOnly && (
        <div
          className={`submit-icon ${!hasChanges ? `disabled` : ''}`}
          ref={submitIconRef}
          onClick={() => handleSubmit({ forceSubmit: true })}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </div>
      )}
    </div>
  )
}

export default Input
