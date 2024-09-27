import React, { useEffect, useMemo, useState } from 'react'
import './style.css'
import { useParams } from 'react-router-dom'
import ImmersionTable from './Table/ImmersionTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllIndustries,
  fetchAllIndustryProblems,
  fetchExperiences,
  fetchStep
} from '../../redux/myImmersion/actions'
import CustomPagination from './customPagination'
import ReactSelect from 'react-select'
import { Col } from 'react-bootstrap'
import SkeletonLoader from './SkeletonLoader/SkeletonLoader'
import SkeletonTableLoader from './SkeletonLoader/SkeletonTableLoader'
import { setBackButton } from '../../redux/backButtonReducer'

const DropdownSelector = ({ myImmersion, industry, setIndustry }) => {
  const industriesOptions = useMemo(() => {
    return myImmersion.industries.map((item) => ({
      label: item.name,
      value: item.name
    }))
  }, [myImmersion.industries])

  return (
    <Col md='4' sm='5' xs='6' xl='3' className='py-3 ps-3'>
      <ReactSelect
        options={industriesOptions}
        value={'Bulk Actions'}
        placeholder={industry !== '' ? industry : 'Filter by Industry'}
        onChange={(newValue) => {
          setIndustry(newValue.value)
        }}
        className='mb-0 me-0 custom-dropdown'
        // styles={dropDownStyles}
        autoFocus={false}
        isSearchable={false}
      />
    </Col>
  )
}

const Steps = () => {
  const { step } = useParams()
  const dispatch = useDispatch()
  const myImmersion = useSelector((state) => state.myImmersion)
  const [currPage, setCurrPage] = useState(1)
  const [industry, setIndustry] = useState('')
  const itemsPerPage = 5

  useEffect(() => {
    dispatch(setBackButton(true, 'my-immersion'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  const filteredData =
    industry !== ''
      ? myImmersion.industryProblems?.data?.filter(
          (item) => item.industry === industry
        )
      : myImmersion.industryProblems?.data

  const paginate = (pageNumber, event) => {
    event.preventDefault()
    setCurrPage(pageNumber)
  }

  useEffect(() => {
    if (step) {
      dispatch(fetchStep(step))
    }
  }, [step, dispatch])

  useEffect(() => {
    if (step === 'step-1') {
      dispatch(fetchAllIndustryProblems(currPage, itemsPerPage))
    } else {
      dispatch(fetchExperiences(currPage, itemsPerPage))
    }
  }, [dispatch, step, currPage, itemsPerPage])

  useEffect(() => {
    dispatch(fetchAllIndustries())
  }, [dispatch])

  return (
    <div>
      {myImmersion.loading ? (
        <SkeletonLoader />
      ) : (
        <div className='container-fluid iamr-page'>
          <div className='pt-4'>
            <h2 className='immersion-steps-title'>{myImmersion.step?.title}</h2>
            <p className='main-immersion-desc'>{myImmersion.step?.subtitle}</p>
          </div>

          <hr className='m-0' />
          <div className='steps-container'>
            <div style={{ background: '#fff', padding: '1%' }}>
              <DropdownSelector
                myImmersion={myImmersion}
                industry={industry}
                setIndustry={setIndustry}
              />

              {myImmersion.stepLoading ? (
                <SkeletonTableLoader />
              ) : (
                <ImmersionTable
                  data={
                    step && step === 'step-1'
                      ? myImmersion.industryProblems?.immersions
                      : myImmersion.experiences?.data
                  }
                  step={step}
                  immersions={myImmersion.industryProblems?.immersions}
                />
              )}
              <CustomPagination
                itemsPerPage={itemsPerPage}
                totalItems={
                  step && step === 'step-1'
                    ? industry !== ''
                      ? filteredData?.length
                      : myImmersion.industryProblems?.totalItems
                    : myImmersion.experiences?.totalItems
                }
                paginate={paginate}
                currentPage={currPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Steps
