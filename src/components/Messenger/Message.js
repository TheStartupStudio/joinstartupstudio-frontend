import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { parseISO } from 'date-fns'
import parse from 'html-react-parser'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import './message.css'
import avatar from '../../assets/images/profile-image.png'

// import { format } from '../../../node_modules'

const Message = (props) => {
  const messageData = props.data
  const loggedUser = useSelector((state) => state.user.user.user)
  const own = messageData.from.id == loggedUser.id
  const message = messageData.message
  const messageDate =
    props.searching && format(parseISO(messageData.createdAt), 'MMM dd, yyyy')
  const visibleScroll = props.visibleScrollBar
  const [messageText, setMessageText] = useState('')
  const profile_image = messageData.from.profile_image
    ? messageData.from.profile_image
    : avatar

  useEffect(() => {
    if (props.searching) {
      const message = messageData.message
      if (
        new RegExp(
          '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'
        ).test(message)
      ) {
        return setMessageText(message)
      }

      const words = props.searchKeyword
      const regex = RegExp(words, 'gi') // case insensitive
      const replacement = '<span style="font-weight: 600">' + words + '</span>'
      setMessageText(message.replace(regex, replacement))
    }
  }, [props.searchKeyword])

  return (
    <>
      {!props.searching ? (
        <div className={own ? 'message own' : 'message'}>
          <div
            className={
              own
                ? visibleScroll
                  ? 'messageTop me-2'
                  : 'messageTop'
                : 'messageTop'
            }
          >
            <p className='messageText' style={{ whiteSpace: 'pre-line' }}>
              <span className='d-block mb-1'>
                {own ? loggedUser.name : messageData.from.name}
              </span>
              {parse(message)}
            </p>
          </div>
          <div className='messageBottom'></div>
        </div>
      ) : (
        <>
          <div
            className={'conversation-body'}
            onClick={() => {
              props.clicked()
            }}
          >
            <div className={`d-flex convo-container`}>
              {props.index == true && (
                <div className='w-100'>
                  <hr className={'my-2'} />
                </div>
              )}
              <div className={'m-auto'}>
                <img
                  className={`rounded-circle chatProfileImage`}
                  src={profile_image}
                  alt=''
                />
              </div>
              <div className={'lastMessage px-2 w-50'}>
                <p className={``}>{messageData.from.name}</p>
                <p className={'foundMessage'}>{parse(messageText)}</p>
              </div>
              <div className={'my-auto'}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{
                    color: '#BBBDBF',
                    fontSize: '20px',
                    textAlign: 'right',
                    marginRight: '2px'
                  }}
                />
              </div>
              <div className='w-100'>
                <hr className={'my-2'} />
              </div>
            </div>
          </div>
        </>
        // <div>
        //   <div className='message'>
        //     <div className='messageTop'>
        //       <img
        //         className='messageImg mx-3'
        //         src='https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        //         alt=''
        //       />
        //       <div>
        //         <p>{messageData.from.name}</p>
        //         <p className='messageText mb-1 d-inline-flex'>{message}</p>
        //         <p className='messageDate'>{messageDate}</p>
        //       </div>
        //     </div>
        //     <div className='messageBottom'></div>
        //   </div>
        // </div>
      )}
    </>
  )
}
export default Message
