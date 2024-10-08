import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import Message from './Message'
import './message.css'
// import './chat.css'

const Chat = (props) => {
  const [messages, setMessages] = useState([])
  // const [conversation, setConversation] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [senderData, setSenderData] = useState(null)
  const loggedUserId = useSelector((state) => state.user.user.user.id)

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      props.newMessage(newMessage, senderData)
      setNewMessage('')
    }
  }

  return (
    <>
      <div style={{ border: '1px solid black' }}>
        <div className='chatBox'>
          <div className='chatBoxHeader'>
            <div className='row mt-4 mx-4'>
              <div className='col-1'>
                <p>To: </p>
              </div>
              <div className='col-6 text-start'>
                <p>Albion Rexha</p>
              </div>
              <div className='col-5 text-end'>
                <p onClick={props.closeChat}>X</p>
              </div>
            </div>
          </div>
          <div className='chatBoxWrapper mt-2'>
            <div className='chatBoxBottom'>
              <textarea
                disabled={true}
                className='chatMessageInput'
                placeholder='write something...'
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                onKeyDown={handleSubmit}
              ></textarea>
              {/* <button
                className='chatSubmitButton'
                onClick={
              >
                Send
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Chat
