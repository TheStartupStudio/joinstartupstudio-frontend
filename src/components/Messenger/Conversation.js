import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import './conversation.css'
import avatar from '../../assets/images/profile-image.png'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'

const Conversation = (props) => {
  const conversation = props.conversation
  const user = props.conversation?.firstUser
    ? props.conversation.firstUser
    : props.conversation.secondUser
  const profile_image = user.profile_image ? user.profile_image : avatar
  const connection_status =
    user?.oneUser.length > 0
      ? user?.oneUser[0]?.status
      : user?.twoUser[0]?.status
  const [read, setRead] = useState(true)
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const options = { defaultProtocol: 'https' }

  useEffect(() => {
    if (
      props.conversation?.roomMessages[0]?.user_id === loggedUserId ||
      props.conversation?.read
    ) {
      setRead(true)
    } else {
      setRead(false)
    }
  }, [props])

  return (
    <>
      <div
        className={'conversation-body'}
        onClick={() => {
          setRead(true)
          props.openChat(
            user.id,
            conversation.id,
            user.name,
            profile_image,
            connection_status
          )
        }}
      >
        <div className={`d-flex convo-container`}>
          {props.index === 0 && (
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
            <p className={``}>
              {user.name}{' '}
              {/* {!read && (
                <FontAwesomeIcon
                  icon={faCircle}
                  style={{
                    color: '#01c5d1',
                    fontSize: '10px',
                    textAlign: 'right',
                    marginLeft: '5px'
                    // marginBottom: '3px'
                  }}
                  // className='my-auto py-auto'
                />
              )} */}
            </p>
            <p className={`${!read && 'fw-bold'}`}>
              {parse(conversation?.roomMessages[0]?.message)}
            </p>
          </div>
          <div className={'my-auto'}>
            {/* {!read && (
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: '#01c5d1',
                  fontSize: '10px',
                  textAlign: 'right',
                  marginRight: '10px',
                  marginBottom: '3px'
                }}
                // className='my-auto py-auto'
              />
            )} */}
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{
                color: `${!read ? '#01c5d1' : '#BBBDBF'}`,
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
  )
}
export default Conversation
