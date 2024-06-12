import React, { useEffect } from 'react'
import { DisplayRectangleData } from '../MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorSectionOneData,
  fetchSectionOneData
} from '../../../redux/myPerformanceData/actions'
function SectionOne({ instructorId }) {
  const dispatch = useDispatch()
  const { sectionOneData, sectionOneLoading } = useSelector(
    (state) => state.performanceData
  )

  useEffect(() => {
    if (instructorId) {
      dispatch(fetchInstructorSectionOneData(instructorId))
    } else {
      dispatch(fetchSectionOneData())
    }
  }, [dispatch, instructorId])

  return (
    <div className={'row g-2'}>
      <DisplayRectangleData
        name={'Number of Active Students'}
        value={
          (sectionOneData?.activeStudents ||
            sectionOneData?.activeStudents?.length) ??
          0
        }
        backgroundColor={'#ace7ec'}
        loading={sectionOneLoading}
      />
      <DisplayRectangleData
        name={'Time spent on the platform'}
        value={
          (sectionOneData?.userActiveTime ||
            sectionOneData?.userActiveTime?.length) ??
          0
        }
        backgroundColor={'#ffd1e8'}
        loading={sectionOneLoading}
      />
      <DisplayRectangleData
        name={'Number of News Briefings'}
        value={
          (sectionOneData?.numOfBriefings ||
            sectionOneData?.numOfBriefings?.length) ??
          0
        }
        backgroundColor={'#edfcd0'}
        loading={sectionOneLoading}
      />
    </div>
  )
}

export default SectionOne
