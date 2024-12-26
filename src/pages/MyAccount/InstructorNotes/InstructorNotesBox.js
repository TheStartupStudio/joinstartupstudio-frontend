import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import DeleteNoteModal from '../../../components/Modals/DeleteNoteModal'
import InstructorNoteItem from './InstructorNoteItem'
import notificationSocket from '../../../utils/notificationSocket'
import NewNoteModal from '../../../components/Modals/InstructorNotes/NewNoteModal'

const InstructorNotesBox = ({
  receivedNotes,
  setReceivedNotes,
  sliceIndex,
  userRole
}) => {
  const [studentNote, setStudentNote] = useState([])
  const [deleteNoteModal, setDeleteNoteModal] = useState(false)
  const [editNoteModal, setEditNoteModal] = useState(false)

  useEffect(() => {
    notificationSocket.on('newNote', ({ note }) => {
      setReceivedNotes((prevNotes) => [...prevNotes, note])
    })

    return () => {
      // notificationSocket.disconnect()
    }
  }, [setReceivedNotes])

  useEffect(() => {
    if (receivedNotes.length) {
      notificationSocket?.on('updatedNote', (data) => {
        let newReceivedNote = [...receivedNotes]
        const foundedNoteIndex = newReceivedNote?.findIndex(
          (n) => n.id === data.note.id
        )
        newReceivedNote[foundedNoteIndex] = data.note

        setReceivedNotes(newReceivedNote)
      })
      handleCloseNoteModal()
    }
  }, [receivedNotes, setReceivedNotes])

  useEffect(() => {
    if (receivedNotes.length) {
      notificationSocket?.on('deletedNote', (data) => {
        let newReceivedNote = receivedNotes.filter((n) => n.id !== data.noteId)
        setReceivedNotes(newReceivedNote)
      })
      handleCloseDeleteNoteModal()
    }
  }, [receivedNotes, setReceivedNotes])

  const handleOpenNoteModal = (index) => {
    const notificationFounded = [...receivedNotes].find((n, i) => i === index)
    setStudentNote(notificationFounded)
    setEditNoteModal(true)
  }
  const handleCloseNoteModal = () => {
    setEditNoteModal(false)
  }

  const handleOpenDeleteNotificationModal = (index) => {
    const notificationFounded = [...receivedNotes].find((n, i) => i === index)
    setStudentNote(notificationFounded)
    setDeleteNoteModal(true)
  }
  const handleCloseDeleteNoteModal = () => {
    setDeleteNoteModal(false)
  }

  const handleUpdateNote = (updatedNote) => {
    try {
      notificationSocket?.emit('editNote', {
        updatedNote,
        noteId: updatedNote.id
      })
      toast.success('Note updated successfully!')
    } catch (e) {
      toast.error('Note updating error!')
    }
  }

  const onDeleteNote = () => {
    try {
      notificationSocket?.emit('deleteNote', {
        noteId: studentNote.id
      })
      handleCloseDeleteNoteModal()
      toast.success('Note deleted successfully!')
    } catch (e) {
      toast.error('Note deleting error!')
    }
  }

  return (
    <>
      <div>
        <div className={'notification-list'}>
          {receivedNotes && receivedNotes.length ? (
            receivedNotes
              .slice(0, sliceIndex !== undefined ? sliceIndex : undefined)
              ?.map((note, index) => {
                return (
                  <InstructorNoteItem
                    key={index}
                    subject={note?.subject}
                    noteText={note?.note_text}
                    createdAt={note?.createdAt}
                    onEdit={() => handleOpenNoteModal(index)}
                    onDelete={() => handleOpenDeleteNotificationModal(index)}
                    userRole={userRole}
                  />
                )
              })
          ) : (
            <p className='no-notes-message'>No notes found</p>
          )}
        </div>
      </div>

      <NewNoteModal
        show={editNoteModal}
        onHide={handleCloseNoteModal}
        edit={true}
        note={studentNote}
        handleUpdateNote={handleUpdateNote}
      />
      <DeleteNoteModal
        show={deleteNoteModal}
        onHide={handleCloseDeleteNoteModal}
        onDelete={onDeleteNote}
      />
    </>
  )
}

export default InstructorNotesBox
