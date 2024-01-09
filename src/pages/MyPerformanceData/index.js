import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import './style.css'
import OptionSelector from '../../components/OptionSelector'
import axiosInstance from '../../utils/AxiosInstance'
import BarChartJs from '../../components/Charts/BarChartJs'
import SelectInput from '../../components/SelectInput'
import ContentStreamed from './contentStreamed'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCertificationData,
  fetchInstructorDebriefData,
  fetchSectionOneData,
  fetchSectionTwoData
} from '../../redux/myPerformanceData/actions'

const ProgressCard = ({ title, progress }) => {
  return (
    <div
      className={
        'p-4 w-100 position-relative border-2 performance-data-slider w-100 h-100 d-flex align-items-center flex-column justify-content-center'
      }
    >
      <div style={{ fontWeight: 600 }} className={'text-center'}>
        {title}
      </div>
      <div className={'w-100 pt-4 pb-3'}>
        <ProgressBar progress={progress} />
      </div>
      <div style={{ fontWeight: 600 }}>{progress}%</div>
    </div>
  )
}
const ProgressBar = ({ progress }) => {
  const Dot = ({
    backgroundColor,
    width,
    height,
    gap,
    children,
    containsStripes
  }) => (
    <div
      style={{
        backgroundColor,
        width,
        height,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap
      }}
    >
      {containsStripes && (
        <>
          <div
            style={{
              backgroundColor: '#fff',
              height: '60%',
              width: '10%',
              borderRadius: 10
            }}
          ></div>
          <div
            style={{
              backgroundColor: '#fff',
              height: '60%',
              width: '10%',
              borderRadius: 10
            }}
          ></div>
          <div
            style={{
              backgroundColor: '#fff',
              height: '60%',
              width: '10%',
              borderRadius: 10
            }}
          ></div>
        </>
      )}
      {children && children}
    </div>
  )

  const ProgressDot = ({ backgroundColor, width, height, gap }) => (
    <div
      className="progress-dot"
      style={{
        ...dotStyle,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow:
          'rgba(0, 0, 0, 0.10) 0px 31px 100px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
      }}
    >
      <Dot backgroundColor="#e8e8e8" width="80%" height="80%" gap="">
        <Dot backgroundColor="#68c5c8" width="95%" height="95%" gap="">
          <Dot backgroundColor="#8bd2d5" width="80%" height="80%" gap="">
            <Dot
              backgroundColor="#68c5c8"
              width="80%"
              height="80%"
              gap="10%"
              containsStripes={true}
            ></Dot>
          </Dot>
        </Dot>
      </Dot>
    </div>
  )
  const progressStyle = {
    width: `${progress}%`,
    // background: `linear-gradient(to right, #FFC0CB, #DDA0DD, #9400D3)`,
    background: `linear-gradient(to right, #FF3399, #51C7DF)`,
    height: 40,
    position: 'relative',
    overflow: 'unset'
  }
  const dotStyle = {
    position: 'absolute',
    right: -29.5,
    width: 50,
    height: 50,
    borderRadius: '50%',
    background: '#fff',
    zIndex: 2
  }

  const overlayStyle = {
    position: 'absolute',
    width: `${100}%`,
    height: 40,
    zIndex: 1,
    background: `repeating-linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 10px,
      rgba(0, 0, 0, 0.15) 10px,
      rgba(0, 0, 0, 0.15) 20px
    )`
  }

  return (
    <div
      className="progress w-100 h-100 position-relative "
      style={{
        overflow: 'unset'
      }}
    >
      <div className="progress-bar" style={progressStyle}>
        {/*<div className="progress-dot" style={dotStyle}></div>*/}
        <ProgressDot width="60px" height="60px" />
        <div className={'progress-bar-overlay'} style={overlayStyle}></div>
      </div>
    </div>
  )
}

const DisplayRectangleData = ({ name, value, backgroundColor }) => {
  return (
    <div className={'col-md-4 d-flex align-items-center p-3'}>
      <div
        style={{
          backgroundColor: backgroundColor ?? '#ace7ec'
        }}
        className={
          'p-4 performance-data-card w-100 h-100 d-flex align-items-center flex-column justify-content-center'
        }
      >
        <div className={'text-center'} style={{ fontWeight: 600 }}>
          {name}
        </div>
        <div
          className={'text-center'}
          style={{ fontWeight: 700, fontSize: 40 }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

function MyPerformanceData() {
  const dispatch = useDispatch()
  const [curriculumCompletion, setCurriculumCompletion] = React.useState('lts1')
  const {
    sectionOneData,
    sectionTwoData,
    certification,
    instructorDebriefData
  } = useSelector((state) => state.performanceData)

  const handleCurriculumCompletionChange = (event) => {
    setCurriculumCompletion(event.target.value)
  }

  const handleChangeMRType = (type) => {
    dispatch(fetchCertificationData(type))
  }

  useEffect(() => {
    dispatch(fetchSectionOneData())
    dispatch(fetchSectionTwoData())
    dispatch(fetchCertificationData('mr1'))
    dispatch(fetchInstructorDebriefData(curriculumCompletion))
  }, [dispatch, curriculumCompletion])

  return (
    <Container fluid>
      <Row className={'g-2'}>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2 pb-4">
              <div className="col-md-12 d-flex align-items-center ">
                <h3 className="page-title mb-0">My PERFORMANCE DATA</h3>
              </div>
              <div className="col-md-12 d-flex align-items-center ">
                <p className="page-description">
                  Welcome to the Performance Data page of your platform. Here
                  you will access graphs and tables that demonstrate how you and
                  your students are using the platform.
                </p>
              </div>
            </div>
            <div
              className="row ps-2 pb-4"
              style={{ backgroundColor: '#f8f7f7', minHeight: 200 }}
            >
              <div className={'row g-2'}>
                <DisplayRectangleData
                  name={'Number of Active Students'}
                  value={sectionOneData?.activeStudents}
                  backgroundColor={'#ace7ec'}
                />
                <DisplayRectangleData
                  name={'Time spent on the platform'}
                  value={sectionOneData?.userActiveTime ?? '5hrs 35min'}
                  backgroundColor={'#ffd1e8'}
                />
                <DisplayRectangleData
                  name={'Number of New Briefings'}
                  value={sectionOneData?.numOfBriefings ?? '17'}
                  backgroundColor={'#edfcd0'}
                />
              </div>
              <div className={'row g-2 '} style={{ minHeight: 300 }}>
                <div
                  className={'col-md-4 p-3 d-flex flex-column'}
                  style={{ gap: 20 }}
                >
                  <ProgressCard
                    progress={sectionTwoData?.trainingCompletion}
                    title={'Training completion'}
                  />
                  <ProgressCard
                    progress={sectionTwoData?.instructorNotesCompletion}
                    title={'Instructor notes completion'}
                  />
                </div>
                <div className={'col-md-8 p-3'}>
                  {/*// d-flex align-items-center flex-column justify-content-center*/}
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

                    <div className={'d-flex justify-content-end w-100 pe-2 '}>
                      <SelectInput
                        options={[
                          { name: 'MR1', value: 'mr1' },
                          { name: 'MR2', value: 'mr2' }
                        ]}
                        onChange={(e) => handleChangeMRType(e)}
                      />
                    </div>
                    <div
                      className={
                        ' d-flex align-items-center flex-column justify-content-center'
                      }
                    >
                      <BarChartJs
                        data={certification}
                        handleChangeDataType={(e) => handleChangeMRType(e)}
                        dataTypes={[
                          { name: 'MR1', value: 'mr1' },
                          { name: 'MR2', value: 'mr2' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={'row g-2 '} style={{ minHeight: 300 }}>
                <ContentStreamed />
                <div
                  className={'col-md-4 p-3 d-flex flex-column'}
                  style={{ gap: 20 }}
                >
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
                    title={'New Briefing in Task'}
                  />
                  <ProgressCard
                    progress={instructorDebriefData?.student_voice ?? 0}
                    title={'Student Voice'}
                  />
                  <ProgressCard
                    progress={instructorDebriefData?.time_for_portfolio ?? 0}
                    title={'Time for Portfolio/Journal'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MyPerformanceData
