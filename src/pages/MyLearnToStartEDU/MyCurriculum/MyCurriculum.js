import React from 'react'
import '../myLTSEDU.css'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'
import EmptyGridItem from '../EmptyGridItem'

const MyCurriculum = () => {
  return (
    <MyLearnToStartEDU title={'My curriculum'}>
      <MyLtsGridItem
        title={'LTS 1'}
        description={`LTS1 curriculum guides students to create their 
          market-ready portfolio through the process of 
          creating a community-based project or startup.`}
      />
      <MyLtsGridItem
        title={'LTS 2'}
        description={`LTS2 curriculum guides students to prepare 
        for internship and employment opportunities
        as they iterate on their portfolios.`}
      />
      <MyLtsGridItem
        title={'LTS 3 & 4'}
        description={`LTS3&4 are autonomous years for students 
        to complete the IAMR Certification system.`}
      />
      <MyLtsGridItem
        title={'FINANCIAL LITERACY'}
        description={`Financial Literacy curriculum guides students 
        through research-based tasks that prepare
        them for post-graduation and beyond.`}
      />{' '}
      <MyLtsGridItem
        title={'FINANCIAL LITERACY'}
        description={`Financial Literacy curriculum guides students 
        through research-based tasks that prepare
        them for post-graduation and beyond.`}
      />
      <EmptyGridItem />
    </MyLearnToStartEDU>
  )
}

export default MyCurriculum
