import { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import useIamrInboxContext from './iamrInboxContext'

import './index.css'

function InboxMenu() {
  const { questionsMenuSelected, selectQuestionsMenu } = useIamrInboxContext()
  return (
    <div className='col-3 inbox-menu p-0'>
      <h4>INBOX</h4>
      <div
        //prettier-ignore
        className={`menu-option ${questionsMenuSelected ? 'selected' : ''}`}
        onClick={() => selectQuestionsMenu(true)}
      >
        <h5 className='my-auto'> STUDENT QUESTIONS</h5>
        <div className='unread-tickets-number'>25</div>
      </div>
      <div
        //prettier-ignore
        className={`menu-option ${!questionsMenuSelected ? 'selected' : ''}`}
        onClick={() => selectQuestionsMenu(false)}
      >
        <h5 className='my-auto'> CERTIFICATION/FEEDBACK REQUESTS</h5>
      </div>
    </div>
  )
}

export default InboxMenu
