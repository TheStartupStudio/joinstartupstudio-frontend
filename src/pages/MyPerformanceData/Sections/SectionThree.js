import React, { useEffect } from 'react'
import ContentStreamed from './ContentStreamed'
import OptionSelector from '../../../components/OptionSelector'
import { ProgressCard } from '../MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorDebriefData,
  fetchInstructorDebriefDataWithId
} from '../../../redux/myPerformanceData/actions'

function SectionThree({ instructorId }) {
  const dispatch = useDispatch()
  const [curriculumCompletion, setCurriculumCompletion] = React.useState('')
  console.log('curriculumCompletion', curriculumCompletion)
  const { instructorDebriefData, instructorDebriefLoading } = useSelector(
    (state) => state.performanceData
  )

  const handleCurriculumCompletionChange = (event) => {
    setCurriculumCompletion(event.target.value)
  }

  useEffect(() => {
    if (instructorId) {
      dispatch(
        fetchInstructorDebriefDataWithId(curriculumCompletion, instructorId)
      )
    } else {
      dispatch(fetchInstructorDebriefData(curriculumCompletion))
    }
  }, [dispatch, curriculumCompletion, instructorId])

  function handleProgressValue(value) {
    if (isNaN(value) || value === undefined || value === null) {
      return 0
    }
    return value
  }
  return (
    <div className={'row g-2 '} style={{ minHeight: 300 }}>
      <ContentStreamed instructorId={instructorId} />
      <div className={'col-md-4 p-3 d-flex flex-column'} style={{ gap: 20 }}>
        <OptionSelector
          width={'100%'}
          options={[
            { label: 'Curriculum Completion', value: '', disabled: true },
            { label: 'LTS1', value: 'lts1' },
            { label: 'LTS2', value: 'lts2' },
            { label: 'LTS3&4', value: 'lts3&4' }
          ]}
          value={curriculumCompletion}
          onChange={handleCurriculumCompletionChange}
        />
        <ProgressCard
          progress={handleProgressValue(instructorDebriefData?.news_briefing)}
          title={'News Briefings in Task'}
          loading={instructorDebriefLoading}
        />
        <ProgressCard
          progress={handleProgressValue(instructorDebriefData?.student_voice)}
          title={'Student Voice'}
          loading={instructorDebriefLoading}
        />
        <ProgressCard
          progress={handleProgressValue(
            instructorDebriefData?.time_for_portfolio
          )}
          title={'Time for Portfolio/Journal'}
          loading={instructorDebriefLoading}
        />
      </div>
    </div>
  )
}

export default SectionThree
