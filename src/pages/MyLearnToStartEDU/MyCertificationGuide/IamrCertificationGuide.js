import React, { useEffect } from 'react'
import IamrGuideContent from '../../../components/MyMarketReadyGuide/IamrGuideContent'
import { NotesButton } from '../../../components/Notes'
import { useSelector, useDispatch } from 'react-redux'
import { changeSidebarState } from '../../../redux'

import '../../MyMarketReadyGuide/index.css'
import { setBackButton } from '../../../redux/backButtonReducer'

function IamrCertificationGuide() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    dispatch(setBackButton(true, 'my-certification-guide'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])
  return (
    <div className='account-page-padding page-border MY_MARKET_READY_GUIDE ps-md-4 row'>
      <div className='col-12 col-md-10'>
        <h3 className='page_title mb-0'>
          Introduction to Your Market-Ready Journal
        </h3>
        <p className='desc'>
          Learn how to use your journal to prepare for certification.
        </p>
        <IamrGuideContent />
      </div>
      <div className='col-12 col-md-2'>
        <NotesButton />
      </div>
    </div>
  )
}

export default IamrCertificationGuide
