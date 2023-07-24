import React from 'react'
import '../myLTSEDU.css'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'
import EmptyGridItem from '../EmptyGridItem'

import NumberImage from '../NumberImage'
import lts1 from '../../../assets/images/LTS 1.png'
import lts2 from '../../../assets/images/LTS 2.png'
import lts3 from '../../../assets/images/LTS 3&4.png'
import financialLiteracy from '../../../assets/images/LTS FINANCIAL LITERACY.png'

const MyCurriculum = () => {
  return (
    <MyLearnToStartEDU title={'My curriculum'}>
      <MyLtsGridItem
        title={'LTS 1'}
        description={`LTS1 curriculum guides students to create their 
          market-ready portfolio through the process of 
          creating a community-based project or startup.`}
        to="/new-hs1-journal/task"
        itemNumberImage={<NumberImage image={lts1} />}
      />
      <MyLtsGridItem
        title={'LTS 2'}
        description={`LTS2 curriculum guides students to prepare 
        for internship and employment opportunities
        as they iterate on their portfolios.`}
        itemNumberImage={<NumberImage image={lts2} />}
        to="/new-hs2-journal/task"
      />
      <MyLtsGridItem
        title={'LTS 3 & 4'}
        description={`LTS3&4 are autonomous years for students 
        to complete the IAMR Certification system.`}
        itemNumberImage={<NumberImage image={lts3} />}
        to="/hs3-hs4-journal/task"
      />
      <MyLtsGridItem
        title={'FINANCIAL LITERACY'}
        description={`Financial Literacy curriculum guides students 
        through research-based tasks that prepare
        them for post-graduation and beyond.`}
        itemNumberImage={<NumberImage image={financialLiteracy} />}
        to="/financial-literacy/task"
      />{' '}
      {/*<EmptyGridItem />*/}
    </MyLearnToStartEDU>
  )
}

export default MyCurriculum
