import React, { useEffect, useState } from 'react'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SmallPageForNote } from './modals/index'
import CreateNewNote from './modals/createNewNote.js'
import { AllNotesFromThisPage } from './modals/allNotesFromThisPage'
import axiosInstance from '../../utils/AxiosInstance'
import EditNote from './modals/editNote'
import moment from 'moment'
import './style/index.css'
import {
  faFontAwesomeLogoFull,
  faSquare
} from '@fortawesome/free-regular-svg-icons'

export const NotesButton = (props) => {
  const [notes, setNotes] = useState([])
  const [notesDiv, setNotesDiv] = useState(false)
  const [dataForEdit, setDataForEdit] = useState()
  const page = window.location.pathname.split('/')[1]
  
  const [createNewNotesModal, setCreateNewNotesModal] = useState(false)
  const [showAllNoteFromThisPage, setShowAllNoteFromThisPage] = useState(false)
  const [editNoteModal, setEditNoteModal] = useState(false)

  // Update notes state with new or edited note
  const updateState = (updatedNote) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id 
          ? {
              ...note,
              title: updatedNote.title || note.title, // Keep existing title if not changed
              value: updatedNote.value,
              updatedAt: moment().format('YYYY-MM-DD')
            }
          : note
      )
    )
    // Refresh notes after update
    getNotes()
  }

  const handleEditNote = (noteData) => {
    // Ensure title is preserved for video notes
    if (props.from === 'video') {
      setDataForEdit({
        ...noteData,
        title: noteData.title || props.data?.title // Use video title as fallback
      })
    } else {
      setDataForEdit(noteData)
    }
    setEditNoteModal(true)
  }

  // Get notes for current context
  const getNotes = async () => {
    try {
      const noteId = props.from === 'video' 
        ? `videoModal-${props.data.id}`
        : props.from === 'leadershipJournal'
        ? `leadershipJournal-${props.journalId}`
        : props.from === 'entrepreneurshipJournal'
        ? `entrepreneurshipJournal-${props.data.id}`
        : page;

      const response = await axiosInstance.get(`/notes/new/${noteId}`)
      setNotes(response.data)
    } catch (err) {
      console.error('Error fetching notes:', err)
    }
  }

  // Initial load
  useEffect(() => {
    getNotes()
  }, [])

  // Refresh when journalId/data changes
  useEffect(() => {
    getNotes()
  }, [props.journalId, props.data?.id])

  function changeState(name, type) {
    if (name === 'create_new_note') {
      setCreateNewNotesModal(type === 'show')
    } else if (name === 'all_note_on_this_page') {
      setShowAllNoteFromThisPage(type === 'show') 
    } else if (name === 'edit_single_note_modal') {
      setEditNoteModal(type === 'show')
    }
  }

  const handleNoteDeleted = async (deletedNoteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== deletedNoteId));
    await getNotes();
  };

  return (
    <div className='notes-wrapper'>
      <div className='text-end'>
        <button
          className='rounded-circle text-center ps-1 text-center'
          onClick={() => setNotesDiv(!notesDiv)}
          id='notesButton'
        >
          <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px', color: 'white' }} />
        </button>
      </div>

      <CreateNewNote
        from={props.from}
        data={props.data}
        show={createNewNotesModal}
        updateNotes={(newNotes) => {
          setNotes(newNotes)
          getNotes() // Refresh after creating
        }}
        sendDataToEdit={setDataForEdit}
        onHide={changeState}
        changeState={changeState}
      />

      <AllNotesFromThisPage
        show={showAllNoteFromThisPage}
        from={props.from}
        allNotes={notes}
        sendDataToEdit={handleEditNote} // Use new handler
        onHide={changeState}
        changeState={changeState}
        refreshNotes={getNotes} // Add refresh function
      />

      <SmallPageForNote
        data={notes}
        fromPage={props.from}
        sendDataToEdit={handleEditNote} // Use new handler
        setNotesDiv={setNotesDiv}
        display={notesDiv}
        changeState={changeState}
        refreshNotes={getNotes}
      />

      <EditNote
        show={editNoteModal}
        from={props.from}
        data={dataForEdit}
        updateState={updateState}
        changeState={changeState}
        updateNotes={setNotes}
        onDelete={handleNoteDeleted} // Now properly defined
      />
    </div>
  )
}
