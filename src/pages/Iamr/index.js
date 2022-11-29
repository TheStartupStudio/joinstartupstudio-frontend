import React, { useState } from 'react'
import Calendar from '../../components/Calendar'
import IamrContents from './IamrContentsAccordion'
import ImrContent from './ImrContent'
import './index.css'

const Index = () => {
  const [certificationsSkills, setCertificationsSkills] = useState([
    { id: 1, title: 'title 1' },
    { id: 2, title: 'title 2' },
    { id: 3, title: 'title 3' },
    { id: 4, title: 'title 4' },
    { id: 5, title: 'title 5' }
  ])

  return (
    <div>
      <div className='row'>
        <div className='col-12 col-xl-9'>
          <div className='account-page-padding page-border'>
            <div className='iamr-header row border-bottom pb-3'>
              <h3 className='mb-4 py-0'>MY CERTIFICATION</h3>
              <p className='text-uppercase py-2'>
                Welcome to <span>i am market ready certification system</span>
              </p>
            </div>
            <div className='row'>
              <IamrContents />
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
