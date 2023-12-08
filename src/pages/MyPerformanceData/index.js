import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'

import './style.css'

import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../utils/hooks/useWindowWidth'
import OptionSelector from '../../components/OptionSelector'
import Bar from '../../components/Charts/Bar'
import axiosInstance from '../../utils/AxiosInstance'

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
    background: `linear-gradient(to right, #FFC0CB, #DDA0DD, #9400D3)`,
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

const DisplayCircleData = ({
  backgroundColor,
  color,
  title,
  percentage,
  marginTop
}) => {
  return (
    <div className={'d-flex justify-content-center'} style={{ marginTop }}>
      <div
        className={'p-2'}
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: backgroundColor ?? '#54c7df',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow:
            'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px'
        }}
      >
        <div className={'text-center'} style={{ color: '#fff', fontSize: 20 }}>
          {title}
        </div>
        <div
          className={'text-center'}
          style={{ color: '#fff', fontWeight: 600, fontSize: 24 }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  )
}

function MyPerformanceData() {
  const history = useHistory()
  const windowWidth = useWindowWidth()
  const [filterBy, setFilterBy] = React.useState('')
  const [curriculumCompletion, setCurriculumCompletion] = React.useState('')
  const [myPerformanceData, setMyPerformanceData] = useState({})
  const [certification, setCertification] = useState([])
  const [sectionTwoData, setSectionTwoData] = useState([])
  const [sectionOneData, setSectionOneData] = useState([])

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value)
  }

  const handleCurriculumCompletionChange = (event) => {
    setCurriculumCompletion(event.target.value)
  }

  // const [timeSpent, setTimeSpent] = useState(null)
  useEffect(() => {
    axiosInstance.get('/myPerformanceData').then(({ data }) => {
      console.log(data)
      setMyPerformanceData(data)
      // setCertification(data.certification)
    })
  }, [])

  useEffect(() => {
    axiosInstance.get('/myPerformanceData/sectionTwo').then(({ data }) => {
      setSectionTwoData(data)
    })
    axiosInstance.get('/myPerformanceData/sectionOne').then(({ data }) => {
      setSectionOneData(data)
    })
  }, [])

  useEffect(() => {
    axiosInstance
      .get('/myPerformanceData/sectionTwo-certification/mr1')
      .then(({ data }) => {
        console.log(data)
        setCertification(data.certification)
      })
  }, [])

  const handleChangeMRType = (type) => {
    axiosInstance
      .get(`/myPerformanceData/sectionTwo-certification/${type}`)
      .then(({ data }) => {
        setCertification(data.certification)
      })
  }
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
                  <div
                    className={
                      'mb-2 border-2 performance-data-card bg-white w-100 h-100 d-flex align-items-center flex-column justify-content-center'
                    }
                  >
                    <div
                      className={'text-left text-uppercase w-100 pt-4 px-4'}
                      style={{ fontSize: 20, fontWeight: 700 }}
                    >
                      Certification
                    </div>
                    <Bar
                      certification={certification}
                      handleChangeMRType={handleChangeMRType}
                    />
                  </div>
                </div>
              </div>
              <div className={'row g-2 '} style={{ minHeight: 300 }}>
                <div className={'col-md-8 p-3'}>
                  <div
                    className={
                      'mb-2 border-2 performance-data-card w-100 h-100 bg-white'
                    }
                  >
                    <div className={'row p-4 h-100'}>
                      <div className={'col-md-6'}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 20,
                            textTransform: 'uppercase'
                          }}
                        >
                          Content streamed
                        </div>
                      </div>
                      <div className={'col-md-6'}>
                        <OptionSelector
                          align={'end'}
                          width={windowWidth < 995 ? '100%' : '75%'}
                          defaultValue={'Filter by'}
                          options={[
                            { label: 'Instructor', value: 'instructor' },
                            { label: 'LTS1', value: 'lts-1' },
                            { label: 'LTS2', value: 'lts-2' },
                            { label: 'LTS3', value: 'lts-3' },
                            { label: 'FinLit', value: 'finlit' }
                          ]}
                          value={filterBy}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className={'row pt-4'}>
                        <div className={'col-lg-6 col-md-12'}>
                          <div className={'p-2'}>
                            <DisplayCircleData
                              backgroundColor={'#54c7df'}
                              title={'Masterclasses'}
                              percentage={100}
                            />
                          </div>
                        </div>
                        <div className={'col-lg-6 col-md-12'}>
                          <div className={'p-2'}>
                            <DisplayCircleData
                              backgroundColor={'#ff3399'}
                              title={'Story in Motion Episodes'}
                              percentage={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={'row'}>
                        <div className={'col-md-12'} style={{ gap: 20 }}>
                          <div className={'p-2'}>
                            <DisplayCircleData
                              marginTop={windowWidth < 995 ? '' : '-10%'}
                              backgroundColor={'#99cc33'}
                              title={'Q&As'}
                              percentage={100}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={'col-md-4 p-3 d-flex flex-column'}
                  style={{ gap: 20 }}
                >
                  <OptionSelector
                    width={'100%'}
                    defaultValue={'Curriculum Completion'}
                    options={[
                      { label: 'LTS1', value: 'lts-1' },
                      { label: 'LTS2', value: 'lts-2' },
                      { label: 'LTS3&4', value: 'lts-3&4' },
                      { label: 'FinLit', value: 'finlit' }
                    ]}
                    value={curriculumCompletion}
                    onChange={handleCurriculumCompletionChange}
                  />
                  <ProgressCard progress={20} title={'New Briefing in Task'} />
                  <ProgressCard progress={80} title={'Student Voice'} />
                  <ProgressCard
                    progress={100}
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
