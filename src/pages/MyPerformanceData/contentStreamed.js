import React, { useEffect, useState } from 'react'
import OptionSelector from '../../components/OptionSelector'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMasterclassPercentage,
  fetchPodcastPercentage,
  fetchQAPercentage
} from '../../redux/myPerformanceData/actions'
import useWindowWidth from '../../utils/hooks/useWindowWidth'

const DisplayCircleData = ({
  backgroundColor,
  color,
  title,
  percentage,
  marginTop,
  loading
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
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '30px' }}
          >
            <span className=" spinner-border-primary spinner-border-sm " />
          </div>
        ) : (
          <div
            className={'text-center'}
            style={{ color: '#fff', fontWeight: 600, fontSize: 24 }}
          >
            {percentage}%
          </div>
        )}
      </div>
    </div>
  )
}

const ContentStreamed = () => {
  const dispatch = useDispatch()
  const windowWidth = useWindowWidth()
  const [filterBy, setFilterBy] = useState('instructor')
  const [masterclassPercentage, setMasterclassPercentage] = useState(0)
  const [podcastPercentage, setPodcastPercentage] = useState(0)
  const [qaPercentage, setQaPercentage] = useState(0)
  const myPerformanceData = useSelector((state) => state.performanceData)

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value)

    dispatch(fetchMasterclassPercentage(event.target.value))
    dispatch(fetchPodcastPercentage(event.target.value))
    dispatch(fetchQAPercentage(event.target.value))
  }

  useEffect(() => {
    dispatch(fetchMasterclassPercentage('instructor'))
    dispatch(fetchPodcastPercentage('instructor'))
    dispatch(fetchQAPercentage('instructor'))
  }, [dispatch])

  useEffect(() => {
    setMasterclassPercentage(myPerformanceData.masterclassPercentage)
    setPodcastPercentage(myPerformanceData.podcastPercentage)
    setQaPercentage(myPerformanceData.qaPercentage)
  }, [
    myPerformanceData.masterclassPercentage,
    myPerformanceData.podcastPercentage,
    myPerformanceData.qaPercentage
  ])
  return (
    <div className={'col-md-8 p-3'}>
      <div
        className={'mb-2 border-2 performance-data-card w-100 h-100 bg-white'}
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
                { label: 'LTS1', value: 'LTS1' },
                { label: 'LTS2', value: 'LTS2' },
                { label: 'LTS3', value: 'LTS3' },
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
                  percentage={
                    !isNaN(masterclassPercentage)
                      ? masterclassPercentage.toFixed(2)
                      : 0
                  }
                  loading={myPerformanceData.loading}
                />
              </div>
            </div>
            <div className={'col-lg-6 col-md-12'}>
              <div className={'p-2'}>
                <DisplayCircleData
                  backgroundColor={'#ff3399'}
                  title={'Story in Motion Episodes'}
                  percentage={
                    !isNaN(podcastPercentage) ? podcastPercentage.toFixed(2) : 0
                  }
                  loading={myPerformanceData.loading}
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
                  percentage={
                    !isNaN(qaPercentage) ? qaPercentage.toFixed(2) : 0
                  }
                  loading={myPerformanceData.loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentStreamed
