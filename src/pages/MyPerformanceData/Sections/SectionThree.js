import React, { useEffect } from 'react'
import ContentStreamed from './ContentStreamed'
import OptionSelector from '../../../components/OptionSelector'
import { ProgressCard } from '../MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInstructorDebriefData } from '../../../redux/myPerformanceData/actions'

function SectionThree(props) {
  const dispatch = useDispatch()
  const [curriculumCompletion, setCurriculumCompletion] = React.useState('lts1')
  const { instructorDebriefData, instructorDebriefLoading } = useSelector(
    (state) => state.performanceData
  )

  const handleCurriculumCompletionChange = (event) => {
    setCurriculumCompletion(event.target.value)
  }

  useEffect(() => {
    dispatch(fetchInstructorDebriefData(curriculumCompletion))
  }, [curriculumCompletion])

  return (
    <div className={'row g-2 '} style={{ minHeight: 300 }}>
      <ContentStreamed />
      <div className={'col-md-4 p-3 d-flex flex-column'} style={{ gap: 20 }}>
        <OptionSelector
          width={'100%'}
          defaultValue={'Curriculum Completion'}
          options={[
            { label: 'LTS1', value: 'lts1' },
            { label: 'LTS2', value: 'lts2' },
            { label: 'LTS3&4', value: 'lts3&4' },
            { label: 'FinLit', value: 'finlit' }
          ]}
          value={curriculumCompletion}
          onChange={handleCurriculumCompletionChange}
        />
        <ProgressCard
          progress={instructorDebriefData?.news_briefing ?? 0}
          title={'News Briefings in Task'}
          loading={instructorDebriefLoading}
        />
        <ProgressCard
          progress={instructorDebriefData?.student_voice ?? 0}
          title={'Student Voice'}
          loading={instructorDebriefLoading}
        />
        <ProgressCard
          progress={instructorDebriefData?.time_for_portfolio ?? 0}
          title={'Time for Portfolio/Journal'}
          loading={instructorDebriefLoading}
        />
      </div>
    </div>
  )
}

export default SectionThree
