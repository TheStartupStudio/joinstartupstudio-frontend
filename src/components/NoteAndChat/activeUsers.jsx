import React from 'react'
import IntlMessages from '../../utils/IntlMessages'

function ActiveUsers(props) {
  const { users } = props
  const onlineUsers = [...new Set(users)]

  return (
    <div className='activeUsers'>
      <div id='users'>
        <h2 className='headline comunity'>
          <IntlMessages id='chat.engage_with_comunity' />
        </h2>
        <h2 className='headline online-users'>
          <IntlMessages id='chat.there_are' />
          {onlineUsers.length}
          <IntlMessages id='chat.other_participants' />
        </h2>
      </div>
    </div>
  )
}

export default ActiveUsers
