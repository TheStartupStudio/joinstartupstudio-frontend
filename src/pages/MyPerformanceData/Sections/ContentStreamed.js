import React, { useEffect, useState } from 'react'
import OptionSelector from '../../../components/OptionSelector'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorMasterclassPercentage,
  fetchInstructorPodcastPercentage,
  fetchInstructorQAPercentage,
  fetchMasterclassPercentage,
  fetchPodcastPercentage,
  fetchQAPercentage
} from '../../../redux/myPerformanceData/actions'
import useWindowWidth from '../../../hooks/useWindowWidth'
import CustomSpinner from '../../../components/CustomSpinner'

const DisplayCircleData = ({
  backgroundColor,
  title,
  percentage,
  marginTop,
  loading
}) => {
  return (
    <div className={'p-2'}>
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
          <div
            className={'text-center'}
            style={{ color: '#fff', fontSize: 20 }}
          >
            {title}
          </div>
          {loading ? (
            <CustomSpinner />
          ) : (
            <div
              className={'text-center'}
              style={{ color: '#fff', fontWeight: 600, fontSize: 24 }}
            >
              {percentage} {typeof percentage === 'string' ? '' : '%'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ContentStreamed = ({ instructorId }) => {
  const dispatch = useDispatch()
  const windowWidth = useWindowWidth()
  const [filterBy, setFilterBy] = useState('')
  const [masterclassPercentage, setMasterclassPercentage] = useState(0)
  const [podcastPercentage, setPodcastPercentage] = useState(0)
  const [qaPercentage, setQaPercentage] = useState(0)
  const myPerformanceData = useSelector((state) => state.performanceData)

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value)

    if (instructorId) {
      dispatch(
        fetchInstructorMasterclassPercentage(event.target.value, instructorId)
      )
      dispatch(
        fetchInstructorPodcastPercentage(event.target.value, instructorId)
      )
      dispatch(fetchInstructorQAPercentage(event.target.value, instructorId))
    } else {
      dispatch(fetchMasterclassPercentage(event.target.value))
      dispatch(fetchPodcastPercentage(event.target.value))
      dispatch(fetchQAPercentage(event.target.value))
    }
  }

  useEffect(() => {
    dispatch(fetchMasterclassPercentage(''))
    dispatch(fetchPodcastPercentage(''))
    dispatch(fetchQAPercentage(''))
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
              options={[
                { label: 'Filter by', value: '', disabled: true },
                { label: 'Instructor', value: 'instructor' },
                { label: 'LTS1', value: 'LTS1' },
                { label: 'LTS2', value: 'LTS2' },
                { label: 'LTS3', value: 'LTS3' }
              ]}
              value={filterBy}
              onChange={handleFilterChange}
            />
          </div>
          <div className={'row pt-4'}>
            {/* <div className={'col-lg-6 col-md-12'}>
              <DisplayCircleData
                backgroundColor={'#54c7df'}
                title={'Masterclasses'}
                percentage={
                  typeof masterclassPercentage !== 'string'
                    ? !isNaN(masterclassPercentage)
                      ? +masterclassPercentage.toFixed(2)
                      : 0
                    : masterclassPercentage
                }
                loading={myPerformanceData.masterclassLoading}
              />
            </div> */}
            <div className={'col-lg-6 col-md-12'}>
              <DisplayCircleData
                backgroundColor={'#99cc33'}
                title={'Q&As'}
                percentage={
                  typeof qaPercentage !== 'string'
                    ? !isNaN(qaPercentage)
                      ? +qaPercentage.toFixed(2)
                      : 0
                    : qaPercentage
                }
                loading={myPerformanceData.qaLoading}
              />
            </div>

            <div className={'col-lg-6 col-md-12'}>
              <DisplayCircleData
                backgroundColor={'#ff3399'}
                title={'Story in Motion Episodes'}
                percentage={
                  typeof podcastPercentage !== 'string'
                    ? !isNaN(podcastPercentage)
                      ? +podcastPercentage.toFixed(2)
                      : 0
                    : podcastPercentage
                }
                loading={myPerformanceData.podcastLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentStreamed
