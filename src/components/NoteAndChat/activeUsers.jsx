import React from 'react'
import IntlMessages from '../../utils/IntlMessages'

function ActiveUsers(props) {
  const { users } = props
  const onlineUsers = [...new Set(users)]

  return (
    <div className='activeUsers'>
      <div id='users'>
        <h2 className='headline comunity'>
          Engage in your Startup Live Webinar. <br />
          Send in questions to engage with our community of guest experts.
        </h2>
        <h2 className='headline online-users'>
          <IntlMessages id='chat.there_are' />
          {onlineUsers.length > 0 ? onlineUsers.length - 1 : 0}
          <IntlMessages id='chat.other_participants' />
        </h2>
      </div>
    </div>
  )
}

export default ActiveUsers
