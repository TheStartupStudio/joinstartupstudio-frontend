import React from 'react'
import '../myLTSEDU.css'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'

const MyCertificationGuide = () => {
  return (
    <MyLearnToStartEDU title={'My certification'}>
      <MyLtsGridItem
        title={'IAMR CERTIFICATION GUIDE'}
        description={`This guide explains the certification process and your role in it.`}
      />
      <MyLtsGridItem
        title={'IAMR CERTIFICATION SYSTEM'}
        description={`This is the complete certification system
        that you can use as a model in your classroom.`}
      />
    </MyLearnToStartEDU>
  )
}

export default MyCertificationGuide
