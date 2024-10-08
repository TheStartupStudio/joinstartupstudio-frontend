import React, { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Message from './Message'
import { useSelector } from 'react-redux'

const SearchMessages = (props) => {
  const [searchedMessages, setSearchedMessages] = useState([])
  const loggedUserId = useSelector((state) => state.user.user.user.id)

  useEffect(() => {
    props.searchedValue && getSearchedMessages(props.searchedValue)
  }, [props.searchedValue])

  const getSearchedMessages = async (keyword) => {
    await axiosInstance
      .get(`/privateChat/search-mesage/${keyword}`)
      .then((res) => {
        setSearchedMessages(res.data)
      })
  }

  return (
    <div className='searchingMessages'>
      {searchedMessages.length > 0 &&
        searchedMessages.map((messages, index2) => {
          return messages?.roomMessages?.map((message, index) => {
            const friend_data =
              messages.firstUser.id !== loggedUserId
                ? messages.firstUser
                : messages.secondUser
            const connection_status =
              friend_data?.oneUser.length > 0
                ? friend_data?.oneUser[0]?.status
                : friend_data?.twoUser[0]?.status
            return (
              <Message
                key={index}
                data={message}
                searching={true}
                index={index2 === 0 && index === 0}
                // room_id={}
                clicked={() =>
                  props.openMsgFoundChat(
                    friend_data.id,
                    messages.id,
                    message.id,
                    friend_data.name,
                    friend_data.profile_image,
                    connection_status
                  )
                }
                searchKeyword={props.searchedValue}
              />
            )
          })
        })}
    </div>
  )
}

export default SearchMessages
