import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNote, saveOrEditNote } from '../../redux'
import { FormattedMessage } from 'react-intl'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import IntlMessages from '../../utils/IntlMessages'

function Notes({ room, page, noteTitle }) {
  const [textQuillStandart, setTextQuillStandart] = useState('')
  const [noteWidget, setNoteWidget] = useState('')
  const { user } = useSelector((state) => state.user.user)
  const { loading, note } = useSelector((state) => state.course)

  const dispatch = useDispatch()

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link'
  ]

  useEffect(() => {
    setWidgetStyle()
  }, [])

  useEffect(() => setTextQuillStandart(note), [note])

  useEffect(
    function () {
      dispatch(
        getNote({
          course_id: room,
          userId: user._id
        })
      )
      setTextQuillStandart(note)
    },
    [room, user._id]
  )

  useEffect(() => {
    const handleTimeOut = setTimeout(() => {
      handleSubmit()
    }, 500)
    return () => {
      clearTimeout(handleTimeOut)
    }
  }, [textQuillStandart])

  const setWidgetStyle = () => {
    if (
      page === 'course' ||
      page === 'welcome-course' ||
      page == 'story-in-motion'
    ) {
      setNoteWidget('course-note')
    } else if (page === 'journal') {
      setNoteWidget('journal-note')
    } else if (page === 'startup-live') {
      setNoteWidget('session-note')
    } else if (
      page === 'guidance-encouragement' ||
      page === 'master-classes' ||
      page === 'startup-live-videos'
    ) {
      setNoteWidget('guidance-note')
    }
  }

  const handleChangeQuillStandart = (textQuillStandart) => {
    setTextQuillStandart(textQuillStandart)
  }

  const handleSubmit = () => {
    if (
      textQuillStandart !== '<p><br></p>' &&
      textQuillStandart !== '<p></p>'
    ) {
      dispatch(
        saveOrEditNote({
          note: textQuillStandart,
          course_id:
            page === 'course' || page === 'welcome-course' ? room : null,
          journalId: page === 'journal' ? room : null,
          contentId:
            page === 'guidance-encouragement' ||
            page === 'master-classes' ||
            page === 'startup-live-videos'
              ? room
              : null,
          userId: user.sub,
          createdFrom:
            page === 'course' || page === 'welcome-course'
              ? 'course'
              : page === 'journal'
              ? 'journal'
              : page,
          notesTitle: noteTitle
        })
      )
    }
  }

  return (
    <div style={{ marginTop: '5px' }}>
      {' '}
      <div className={`note-quill ${noteWidget}`}>
        <FormattedMessage
          id='content.write_note'
          defaultMessage='content.write_note'
        >
          {(placeholder) => (
            <ReactQuill
              placeholder={placeholder}
              theme='snow'
              name='textQuillStandart'
              value={textQuillStandart}
              onChange={handleChangeQuillStandart}
              modules={quillModules}
              formats={quillFormats}
            />
          )}
        </FormattedMessage>
        {loading ? (
          <div className='edit-note'>
            <button className='edit-button' type='button'>
              <IntlMessages id='general.saving' />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Notes
