import React, { useEffect } from 'react'
import { DisplayRectangleData } from '../MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSectionOneData } from '../../../redux/myPerformanceData/actions'
function SectionOne() {
  const dispatch = useDispatch()
  const { sectionOneData, sectionOneLoading } = useSelector(
    (state) => state.performanceData
  )

  useEffect(() => {
    dispatch(fetchSectionOneData())
  }, [dispatch])
  return (
    <div className={'row g-2'}>
      <DisplayRectangleData
        name={'Number of Active Students'}
        value={sectionOneData?.activeStudents}
        backgroundColor={'#ace7ec'}
        loading={sectionOneLoading}
      />
      <DisplayRectangleData
        name={'Time spent on the platform'}
        value={sectionOneData?.userActiveTime ?? ''}
        backgroundColor={'#ffd1e8'}
        loading={sectionOneLoading}
      />
      <DisplayRectangleData
        name={'Number of New Briefings'}
        value={sectionOneData?.numOfBriefings ?? ''}
        backgroundColor={'#edfcd0'}
        loading={sectionOneLoading}
      />
    </div>
  )
}

export default SectionOne
