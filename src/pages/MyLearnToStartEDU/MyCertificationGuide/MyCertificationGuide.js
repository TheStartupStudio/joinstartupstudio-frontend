import React from 'react'
import '../myLTSEDU.css'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'

// import numberOne from '../../../assets/images/number-1.png'
// import numberTwo from '../../../assets/images/number-2.png'
import numberOne from '../../../assets/images/number-one.png'
import numberTwo from '../../../assets/images/number-two.png'

import NumberImage from '../NumberImage'

const MyCertificationGuide = () => {
  return (
    <MyLearnToStartEDU title={'My certification'}>
      <MyLtsGridItem
        title={'IAMR CERTIFICATION GUIDE'}
        description={`This guide explains the certification process and your role in it.`}
        itemNumberImage={<NumberImage image={numberOne} />}
      />
      <MyLtsGridItem
        title={'IAMR CERTIFICATION SYSTEM'}
        description={`This is the complete certification system
        that you can use as a model in your classroom.`}
        itemNumberImage={<NumberImage image={numberTwo} />}
      />
    </MyLearnToStartEDU>
  )
}

export default MyCertificationGuide
