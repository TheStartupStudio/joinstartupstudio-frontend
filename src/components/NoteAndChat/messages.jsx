import React, { useState, useEffect } from 'react'
import moment from 'moment'

function Messages(props) {
  const [initialUsers, setInitialUsers] = useState([])
  const [userColors, setUserColors] = useState({})
  const [initialColors, setInitialColors] = useState([
    { bgColor: '#FBC2E1', color: '#333d3d' },
    { bgColor: '#ACE7EC', color: '#333d3d' },
    { bgColor: '#E4F0C6', color: '#333d3d' },
    { bgColor: '#BBBDBF', color: '#333d3d' },
    { bgColor: '#01C5D1', color: '#ffffff' },
    { bgColor: '#A7CA42', color: '#ffffff' },
    { bgColor: '#F2359D', color: '#ffffff' },
    { bgColor: '#333D3D', color: '#ffffff' }
  ])
  const [remainingColors, setRemainingColors] = useState()

  useEffect(() => {
    setInitialUsers(props.initialUsers)
  })

  useEffect(() => {
    const initialColorsSelected = []
    if (
      initialUsers &&
      props.initialUsers &&
      !initialUsers.length !== props.initialUsers.length
    ) {
      props.initialUsers.map((item) => {
        if (!userColors[item]) {
          const colorObj = getColor()
          initialColorsSelected.push(colorObj)
          setUserColors((prevValues) => ({
            ...prevValues,
            [item]: colorObj
          }))
        }
      })
    }
  }, [props.initialUsers, initialUsers])

  useEffect(() => {
    setRemainingColors(initialColors)
  }, [])

  const getDate = (date) => {
    if (isToday(moment(date))) {
      return moment(date).format('hh:mm a')
    } else if (isYesterday(moment(date))) {
      return 'Yesteday at ' + moment(date).format('hh:mm a')
    } else {
      return moment(date).format('MMM-DD-yy hh:mm a')
    }
  }

  const isToday = (momentDate) => {
    var today = moment()
    return momentDate.isSame(today, 'd')
  }

  const isYesterday = (momentDate) => {
    var yesterday = moment().subtract(1, 'day')
    return momentDate.isSame(yesterday, 'd')
  }

  const getBackgroundColor = (message) => {
    if (!userColors[message.from]) {
      const colorObj = getColor(message)
      setUserColors((prevValues) => ({
        ...prevValues,
        [message.from]: colorObj
      }))
    }
    return {
      backgroundColor:
        userColors[message.from] && userColors[message.from].bgColor,
      color: userColors[message.from] && userColors[message.from].color
    }
  }

  const getColor = (message) => {
    if (userColors[message]) {
      return userColors[message]
    }

    if (remainingColors.length === 0) {
    }
    const newVariable = [...remainingColors]
    const index = Math.floor(Math.random() * Math.floor(newVariable.length))
    const selectedColorArr = newVariable.splice(index, 1)
    const selectedColor = selectedColorArr.length && selectedColorArr[0]
    setRemainingColors(newVariable)

    setUserColors({ ...userColors, [message.from]: selectedColor })
    return selectedColor
  }

  return (
    <div className='messages'>
      <div className='scrollbar' id='list'>
        <ul className='messages-ul'>
          {props.messages &&
            props.messages
              .filter((message) => message.room === props.room)
              .map((message, index) => {
                return (
                  <li
                    className={
                      message.isCurrentPerson
                        ? 'message-li current-user'
                        : 'message-li'
                    }
                    key={index}
                  >
                    {message.url && (
                      <div>
                        <div className='msg'>
                          <h4>{message.from}</h4>
                          <div className='body-message'>
                            <a
                              href={message.url}
                              rel='noopener noreferrer'
                              target='_blank'
                            >
                              My current location
                            </a>
                          </div>
                        </div>
                        <span className='createdDate'>
                          {message.createdDate}
                        </span>
                      </div>
                    )}

                    {!message.url && (
                      <div className='singleMessage'>
                        <div
                          className='msg'
                          style={getBackgroundColor(message)}
                        >
                          <h4 style={getBackgroundColor(message)}>
                            {message.from}
                          </h4>
                          <div className='body-message'>
                            <p>{message.text}</p>
                          </div>
                        </div>
                        <span className='createdDate'>
                          {getDate(message.createdDate)}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
        </ul>
      </div>
    </div>
  )
}

export default Messages
