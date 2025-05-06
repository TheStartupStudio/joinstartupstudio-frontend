import React, { useEffect, useState } from 'react'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SmallPageForNote } from './modals/index'
import CreateNewNote from './modals/createNewNote.js'
import { AllNotesFromThisPage } from './modals/allNotesFromThisPage'
import axiosInstance from '../../utils/AxiosInstance'
import EditNotes from './modals/editNote'
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

  const updateState = (data) => {
    let allNotes = []
    // const updateState = (data) => {
    setNotes(
      notes.map((el) =>
        el.id == data.data.id
          ? {
              ...el,
              title: data.data.title,
              value: data.data.value,
              updatedAt: moment(new Date(Date.now())).format('YYYY-MM-D')
            }
          : el
      )
    )
  }

  const getUser = async () => {
    await axiosInstance
      .get(
        `/notes/new/${
          props.from === 'video' ? 'videoModal-' + props.data.id :
      props.from === 'leadershipJournal' ? 'leadershipJournal-' + props.journalId :
      props.from === 'courseGroup' ? 'courseGroup-' + props.data.id :
      page
        }`
      )
      .then((res) => {
        setNotes(res.data)
      })
      .catch((err) => err)
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (props.from === 'leadershipJournal' && props.journalId) {
      getUser()
    }
  }, [props.journalId])

  function changeState(name, type) {
    if (name == 'create_new_note') {
      type == 'show'
        ? setCreateNewNotesModal(true)
        : setCreateNewNotesModal(false)
    } else if (name == 'all_note_on_this_page') {
      type == 'show'
        ? setShowAllNoteFromThisPage(true)
        : setShowAllNoteFromThisPage(false)
    } else if (name == 'edit_single_note_modal') {
      type == 'show' ? setEditNoteModal(true) : setEditNoteModal(false)
    }
  }

  return (
    <div className='notes-wrapper'>
      {/* <Draggable onStart={() => (notesDiv ? false : true)}> */}
      <div className='text-end'>
        <button
          className='rounded-circle text-center ps-1 text-center'
          onClick={() => {
            setNotesDiv(!notesDiv)
          }}
          id='notesButton'
        >
          <FontAwesomeIcon
            // unicode={'f044'}
            icon={faEdit}
            style={{ fontSize: '20px', color: 'white' }}
          />
        </button>
      </div>
      <CreateNewNote
        from={props.from}
        data={props.data}
        show={createNewNotesModal}
        updateNotes={(data) => setNotes(data)}
        sendDataToEdit={(data) => setDataForEdit(data)}
        onHide={(data, type) => changeState(data, type)}
        changeState={(data, type) => {
          changeState(data, type)
        }}
      />
      <AllNotesFromThisPage
        show={showAllNoteFromThisPage}
        from={props.from}
        allNotes={notes}
        sendDataToEdit={(data) => setDataForEdit(data)}
        onHide={(data, type) => changeState(data, type)}
        changeState={(data, type) => {
          changeState(data, type)
        }}
      />
      <SmallPageForNote
        data={notes}
        fromPage={props.from}
        sendDataToEdit={(data) => setDataForEdit(data)}
        setNotesDiv={setNotesDiv}
        display={notesDiv}
        changeState={(data, type) => changeState(data, type)}
      />
      <EditNotes
        show={editNoteModal}
        from={props.from == 'video' && 'editFromVideo'}
        data={dataForEdit}
        updateState={(data) => updateState(data)}
        changeState={(data, type) => {
          changeState(data, type)
        }}
      />
    </div>
  )
}
