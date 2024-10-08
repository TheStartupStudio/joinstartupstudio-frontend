import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Notes from './notes'
import Chat from './chat'
import IntlMessages from '../../utils/IntlMessages'

function NoteAndChat({ room, page, notesTitle }) {
  const [noteActive, setNoteActive] = useState(true)
  const [chatActive, setChatActive] = useState(false)
  const [noteAndChatWidget, setNoteAndChatWidget] = useState('')

  useEffect(() => {
    setWidgetStyle()
  }, [])

  useEffect(() => {
    toggledAccordion()
  }, [noteActive, chatActive])

  const setWidgetStyle = () => {
    if (page === 'course' || page === 'welcome-course') {
      setNoteAndChatWidget('course-accordion')
    } else if (page === 'journal') {
      setNoteAndChatWidget('jorunal-accordion')
    } else if (page === 'startup-live') {
      setNoteAndChatWidget('session-note-chat-header session-margin')
    } else if (page === 'guidance-encouragement' || page === 'master-classes') {
      setNoteAndChatWidget('guidance-accordion')
    } else if (page === 'startup-live-videos') {
      setNoteAndChatWidget('startup-live-accordion')
    }
  }

  const toggledAccordion = () => {
    if (noteActive === false) {
      setChatActive(true)
      scrollToBottom()
    } else if (noteActive === true) {
      setChatActive(false)
    }
  }

  const scrollToBottom = () => {
    // selectors
    var listHeight = document.querySelector('.messages #list ul')
    var newMessage = document.querySelector('.messages #list ul li:last-child')
    if (newMessage) {
      // heights
      var messagesWrapperHeight = listHeight.clientHeight

      document.querySelector('#list').scrollTo(0, messagesWrapperHeight)
    }
  }

  return (
    <Accordion defaultActiveKey='0' className={noteAndChatWidget}>
      <div className='note-chat'>
        <Card.Header
          className={
            page === 'startup-live'
              ? 'session-note-chat-header'
              : 'note-chat-header'
          }
        >
          <h5 className='mb-0'>
            <Accordion.Toggle
              className='btn'
              data-toggle='collapse'
              data-target='#collapseOne'
              aria-expanded={noteActive ? 'true' : 'false'}
              aria-controls='collapseOne'
              eventKey='0'
              onClick={() => setNoteActive(true)}
            >
              <IntlMessages id='content.my_notes' />
            </Accordion.Toggle>
          </h5>
        </Card.Header>
        <Card.Header
          className={
            page === 'startup-live'
              ? 'session-note-chat-header'
              : 'note-chat-header'
          }
        >
          <h5 className='mb-0'>
            <Accordion.Toggle
              className='btn collapsed'
              data-toggle='collapse'
              data-target='#collapseTwo'
              aria-controls='collapseTwo'
              eventKey='1'
              aria-expanded={chatActive ? 'true' : 'false'}
              onClick={() => setNoteActive(false)}
            >
              <IntlMessages id='content.my_chat' />
            </Accordion.Toggle>
          </h5>
        </Card.Header>
      </div>
      <div className='card'>
        <Accordion.Collapse eventKey='0'>
          <Notes room={room} page={page} noteTitle={notesTitle} />
        </Accordion.Collapse>
      </div>
      <Accordion.Collapse eventKey='1'>
        <Chat room={room === 0 ? '0' : room} />
      </Accordion.Collapse>
    </Accordion>
  )
}

export default NoteAndChat
