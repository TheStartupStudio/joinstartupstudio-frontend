import React from 'react'
import './index.css'

const UserEntryInput = ({ userEntry }) => {
  return <div className='user-entry-input mb-1'>{userEntry.content}</div>
}

export default UserEntryInput
