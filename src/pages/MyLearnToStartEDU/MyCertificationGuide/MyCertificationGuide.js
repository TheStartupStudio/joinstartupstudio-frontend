import React, {useEffect} from 'react'
import MyLearnToStartEDU from '../MyLearnToStartEDU'
import MyLtsGridItem from '../MyLtsGridItem'
import numberOne from '../../../assets/images/number-one.png'
import numberTwo from '../../../assets/images/number-two.png'

import NumberImage from '../NumberImage'
import { changeSidebarState } from '../../../redux'
import { useDispatch } from 'react-redux'

const MyCertificationGuide = () => {
    const dispatch = useDispatch()
  
    useEffect(() => {
          dispatch(changeSidebarState(false))
        })
  return (
    <MyLearnToStartEDU title={'My certification'}>
      <MyLtsGridItem
        title={'IAMR CERTIFICATION GUIDE'}
        description={`This guide explains the certification process and your role in it.`}
        to={'/iamr-certification-guide'}
        itemNumberImage={
          <NumberImage image={numberOne} width={80} height={80} />
        }
      />
      <MyLtsGridItem
        title={'IAMR CERTIFICATION SYSTEM'}
        description={`This is the complete certification system
        that you can use as a model in your classroom.`}
        to={'/iamr'}
        itemNumberImage={
          <NumberImage image={numberTwo} width={80} height={80} />
        }
      />
    </MyLearnToStartEDU>
  )
}

export default MyCertificationGuide
