import { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import searchIcon from '../../assets/images/search-icon.png'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useIamrInboxContext from './iamrInboxContext'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'

function TicketMessage({ message }) {
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const handleSearch = () => {}

  return (
    <div
      className={`chat-message ${
        loggedUserId === message.sent_from ? 'self' : ''
      } w-100`}
    >
      <div className='row'>
        <div className='chat-user col-4'>
          {/* prettier-ignore */}
          <img src={imgTest} alt='profile' className='rounded-circle'/>
          <div className='d-flex flex-column mx-2'>
            <p>{message.User.name}</p>
          </div>
        </div>
        <div className='status col-8'>
          <p className='chat-date m-0'>
            {beautifulDateFormat(message.createdAt, 'EEEE')}
          </p>
        </div>
      </div>
      <div className='message-text mt-2'>
        <p>{message.message}</p>
        <p>{beautifulDateFormat(message.createdAt, 'hh:mm a')}</p>
      </div>
    </div>
  )
}

export default TicketMessage
