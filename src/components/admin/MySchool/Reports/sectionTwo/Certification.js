import React, { useEffect } from 'react'
import { Col } from 'react-bootstrap'
import { InfoBox } from '../../ContentItems'
import { BarChartJs } from '../../../../Charts/BarChartJs'
import CustomSpinner from '../../../../CustomSpinner'
import { useDispatch, useSelector } from 'react-redux'
import useWindowWidth from '../../../../../hooks/useWindowWidth'
import {
  fetchInstructorCertificationData,
  fetchInstructorSectionTwoData
} from '../../../../../redux/myPerformanceData/actions'

const Certification = ({ selectedInstructor }) => {
  const windowWidth = useWindowWidth()
  const dispatch = useDispatch()

  const { certification, certificationLoading } = useSelector(
    (state) => state.performanceData
  )

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(fetchInstructorSectionTwoData(selectedInstructor.userId))
      dispatch(fetchInstructorCertificationData(selectedInstructor.userId))
    }
  }, [dispatch, selectedInstructor])

  return (
    <Col className=' px-0'>
      <InfoBox style={{ minHeight: '500px' }}>
        <span className='fw-bold'>CERTIFICATION</span>

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
      </InfoBox>
    </Col>
  )
}

export default Certification
