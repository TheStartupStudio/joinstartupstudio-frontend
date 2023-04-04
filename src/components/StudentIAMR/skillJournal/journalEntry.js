import React from 'react'
import './index.css'

const JournalEntry = ({ entry, children }) => {
  return (
    <div className='journal-question'>
      <p className='page-content-text'>{entry?.title}</p>
      {children}
    </div>
  )
}

export default JournalEntry
