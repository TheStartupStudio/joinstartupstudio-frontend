import { toast } from 'react-toastify'
import React, { useEffect } from 'react'
import Input from '../customComponents/input'
import './index.css'

const UserEntryInput = ({
  entry,
  userEntry,
  loading,
  submitEntry,
  removeEmptyReflection
}) => {
  return (
    <>
      <Input
        loading={loading}
        key={userEntry.createdAt}
        onSubmit={submitEntry}
        defaultValue={userEntry.content}
        className='m-0 mb-1'
        rowData={{ entryId: entry.id, userEntryId: userEntry.id }}
        clearOnSubmit={false}
        onNullError={() => toast.error('Journal entry cannot be empty.')}
      />
      {userEntry.notSaved && (
        <button
          className='button undo-reflection'
          onClick={() => removeEmptyReflection(entry.id)}
        >
          CANCEL
        </button>
      )}
    </>
  )
}

export default UserEntryInput
