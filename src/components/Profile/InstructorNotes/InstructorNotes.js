import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useState } from 'react'
import NewNoteModal from '../../Modals/InstructorNotes/NewNoteModal'
import InstructorNotesBox from './InstructorNotesBox'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import notificationSocket from '../../../utils/notificationSocket'
import { toast } from 'react-toastify'

const InstructorNotes = (props) => {
  const [newNoteModal, setNewNoteModal] = useState(false)
  const [instructorNotes, setInstructorNotes] = useState(false)
  const [receivedNotes, setReceivedNotes] = useState([])
  const [sliceIndex, setSliceIndex] = useState(3)
  const { id } = useParams()

  useEffect(() => {
    const fetchNotes = async () => {
      await axiosInstance
        .get(`/instructor-notes/${id}`)
        .then(({ data }) => setReceivedNotes(data.data))
    }
    fetchNotes()
  }, [id])

  const handleShowMore = () => {
    if (typeof sliceIndex === 'undefined') {
      setSliceIndex(3)
    } else {
      setSliceIndex(undefined)
    }
  }

  const onSaveNote = (newNote) => {
    try {
      notificationSocket?.emit('addNote', {
        newNote
      })
      setNewNoteModal(false)
    } catch (e) {
      toast.error('Note deleting error!')
    }
  }

  return (
    <div className="p-3">
    <div className="border p-3 my-account">
      <div
          className={`my-account col-md-6   ${'intructor-notes__btn-active'}  `}
          onClick={props.instructorNotesHandler}
        >
          <FontAwesomeIcon
            icon={faClipboardList}
            size="xl"
            style={{ color: 'white', fontSize: '40px' }}
          />
          <h4>INSTRUCTOR NOTES</h4>
        </div>

        <div className="my-account mt-4 mb-2 intructor-notes">
          <h4 className="mt-2">INSTRUCTOR NOTES</h4>
          <InstructorNotesBox
            receivedNotes={receivedNotes}
            sliceIndex={sliceIndex}
          />

          {receivedNotes?.length > 3 && (
            <div className="d-flex justify-content-end">
              <a
                href
                style={{ fontSize: '16px', cursor: 'pointer' }}
                className="text-info"
                onClick={handleShowMore}
              >
                {typeof sliceIndex !== 'undefined' ? 'View all' : 'View less'}
              </a>
            </div>
          )}
        </div>

        <NewNoteModal
          show={newNoteModal}
          onSave={onSaveNote}
          onHide={() => setNewNoteModal(false)}
          close={() => setNewNoteModal(false)}
        />
      </div>
      {instructorNotes && (
        <div className="end-button me-3">
          <button className="btn" onClick={() => setNewNoteModal(true)}>
            Add a note
          </button>
        </div>
      )}
    </div>
  )
}

export default InstructorNotes
