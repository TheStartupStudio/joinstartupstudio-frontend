import React from 'react'
import '../myLTSEDU.css'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'
import EmptyGridItem from '../EmptyGridItem'
// import numberOne from '../../../assets/images/number-1.png'
// import numberTwo from '../../../assets/images/number-2.png'
// import numberThree from '../../../assets/images/number-3.png'
// import numberFour from '../../../assets/images/number-4.png'
import numberOne from '../../../assets/images/number-one.png'
import numberTwo from '../../../assets/images/number-two.png'
import numberThree from '../../../assets/images/number-three.png'
import numberFour from '../../../assets/images/number-four.png'
import NumberImage from '../NumberImage'

const MyCurriculum = () => {
  return (
    <MyLearnToStartEDU title={'My curriculum'}>
      <MyLtsGridItem
        title={'LTS 1'}
        description={`LTS1 curriculum guides students to create their 
          market-ready portfolio through the process of 
          creating a community-based project or startup.`}
        to="/new-hs1-journal/task"
        itemNumberImage={<NumberImage image={numberOne} />}
      />
      <MyLtsGridItem
        title={'LTS 2'}
        description={`LTS2 curriculum guides students to prepare 
        for internship and employment opportunities
        as they iterate on their portfolios.`}
        itemNumberImage={<NumberImage image={numberTwo} />}
        to="/new-hs2-journal/task"
      />
      <MyLtsGridItem
        title={'LTS 3 & 4'}
        description={`LTS3&4 are autonomous years for students 
        to complete the IAMR Certification system.`}
        itemNumberImage={<NumberImage image={numberThree} />}
      />
      <MyLtsGridItem
        title={'FINANCIAL LITERACY'}
        description={`Financial Literacy curriculum guides students 
        through research-based tasks that prepare
        them for post-graduation and beyond.`}
        itemNumberImage={<NumberImage image={numberFour} />}
      />{' '}
      {/*<EmptyGridItem />*/}
    </MyLearnToStartEDU>
  )
}

export default MyCurriculum
