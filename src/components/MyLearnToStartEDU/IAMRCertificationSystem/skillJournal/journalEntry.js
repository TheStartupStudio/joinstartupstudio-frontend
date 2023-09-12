import React from 'react'
import './index.css'

const JournalEntry = ({ index, entry, children, skillTags }) => {
  return (
    <div className='journal-question'>
      <div className='page-content-text mb-2'>
        {entry?.title}
        {index === 0 && (
          <ul className='mb-0'>
            {skillTags.map((tag) => (
              <li>{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  )
}

export default JournalEntry
