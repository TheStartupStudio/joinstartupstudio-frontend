import React, { useEffect } from 'react'
import BarChartJs from '../../../components/Charts/BarChartJs'
import { ProgressCard } from '../MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCertificationData,
  fetchInstructorCertificationData,
  fetchInstructorSectionTwoData,
  fetchSectionTwoData
} from '../../../redux/myPerformanceData/actions'
import useWindowWidth from '../../../hooks/useWindowWidth'
import CustomSpinner from '../../../components/CustomSpinner'

function SectionTwo({ instructorId }) {
  const windowWidth = useWindowWidth()
  const dispatch = useDispatch()
  const {
    sectionTwoData,
    certification,
    sectionTwoLoading,
    certificationLoading
  } = useSelector((state) => state.performanceData)

  useEffect(() => {
    if (instructorId) {
      dispatch(fetchInstructorSectionTwoData(instructorId))
      dispatch(fetchInstructorCertificationData(instructorId))
    } else {
      dispatch(fetchSectionTwoData())
      dispatch(fetchCertificationData())
    }
  }, [dispatch, instructorId])

  function handleProgressValue(value) {
    if (isNaN(value) || value === undefined || value === null) {
      return 0
    }
    return value
  }

  return (
    <div className={'row g-2 '} style={{ minHeight: 300 }}>
      <div className={'col-md-4 p-3 d-flex flex-column'} style={{ gap: 20 }}>
        <ProgressCard
          progress={handleProgressValue(sectionTwoData?.trainingCompletion)}
          title={'Training completion'}
          loading={sectionTwoLoading}
        />
        <ProgressCard
          progress={handleProgressValue(
            sectionTwoData?.instructorNotesCompletion
          )}
          title={'Instructor notes completion'}
          loading={sectionTwoLoading}
        />
      </div>
      <div className={'col-md-8 p-3'}>
        <div
          className={
            'position-relative mb-2 border-2 performance-data-card bg-white w-100 h-100 '
          }
        >
          <div
            className={'text-left text-uppercase w-100 pt-4 px-4'}
            style={{ fontSize: 20, fontWeight: 700 }}
          >
            Certification
          </div>

          <div
            className={
              ' d-flex align-items-center flex-column justify-content-center'
            }
            style={{ height: windowWidth < 995 ? '30%' : '80%' }}
          >
            {!certificationLoading ? (
              <BarChartJs data={certification} />
            ) : (
              <CustomSpinner color={'primary'} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionTwo
