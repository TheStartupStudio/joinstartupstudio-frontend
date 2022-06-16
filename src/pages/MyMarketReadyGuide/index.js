import React, { useEffect } from 'react'
import FirstDiv from '../../components/MyMarketReadyGuide/FirstDiv'
import { NotesButton } from '../../components/Notes'
import { useSelector, useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'

import './index.css'

function MyMarket() {
  useEffect(() => {
    dispatch(changeSidebarState(false))
  })
  const dispatch = useDispatch()
  return (
    <div className='account-page-padding page-border MY_MARKET_READY_GUIDE ps-md-4 row'>
      <div className='col-12 col-md-10'>
        <h3 className='page_title mb-0'>MY MARKET-READY GUIDE</h3>
        <p className='desc'>
          Gather and track your progress towards becoming market-ready.
        </p>
        <FirstDiv />
      </div>
      <div className='col-12 col-md-2'>
        <NotesButton />
      </div>
    </div>
  )
}

export default MyMarket
