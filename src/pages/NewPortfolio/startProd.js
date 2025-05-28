import { Collapse } from 'bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import graphUp from '../../assets/images/graph-up.svg'
import lightBulb from '../../assets/images/light-bulb.svg'
import questionMark from '../../assets/images/question-mark.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import './Portfolio.css'

function StartProd(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [productivityData, setProductivityData] = useState({
    id: null,
    user_id: null,
    problem: '',
    problem_solving: '',
    solution: '',
    solution_solved: '',
    metrix_1: '',
    metrix_2: '',
    metrix_3: '',
    metrix_1_explanation: '',
    metrix_2_explanation: '',
    metrix_3_explanation: '',
    created_at: '',
    updated_at: ''
  })
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [editProblemMode, setEditProblemMode] = useState(false)
  const [editSolutionMode, setEditSolutionMode] = useState(false)
  const [editMetricsMode, setEditMetricsMode] = useState(false)

  const accordionRefs = useRef([])

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get(
          '/hsPortfolio/user-start-productivity'
        )
        const data = response.data['0'] || {
          problem: '',
          problem_solving: '',
          solution: '',
          solution_solved: '',
          metrix_1: '',
          metrix_2: '',
          metrix_3: '',
          metrix_1_explanation: '',
          metrix_2_explanation: '',
          metrix_3_explanation: ''
        }
        setProductivityData(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch productivity data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductivityData()
  }, [])

  useEffect(() => {
    accordionRefs.current.forEach((ref) => {
      if (ref) {
        new Collapse(ref, { toggle: false })
      }
    })
  }, [productivityData])

  const handleAccordionClick = (index, event) => {
    event.preventDefault()
    const target = accordionRefs.current[index]
    if (target) {
      const bsCollapse = Collapse.getInstance(target) || new Collapse(target)
      bsCollapse.toggle()
    }
  }

  const handleFormChange = (field, value) => {
    setProductivityData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProblem = async () => {
    try {
      setIsLoading(true)
      const payload = {
        problem: productivityData.problem,
        problem_solving: productivityData.problem_solving
      }

      let response
      if (productivityData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-productivity/${productivityData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-productivity`,
          payload
        )
      }

      setProductivityData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditProblemMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save problem data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSolution = async () => {
    try {
      setIsLoading(true)
      const payload = {
        solution: productivityData.solution,
        solution_solved: productivityData.solution_solved
      }

      let response
      if (productivityData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-productivity/${productivityData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-productivity`,
          payload
        )
      }

      setProductivityData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditSolutionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save solution data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMetrics = async () => {
    try {
      setIsLoading(true)
      const payload = {
        metrix_1: productivityData.metrix_1,
        metrix_2: productivityData.metrix_2,
        metrix_3: productivityData.metrix_3,
        metrix_1_explanation: productivityData.metrix_1_explanation,
        metrix_2_explanation: productivityData.metrix_2_explanation,
        metrix_3_explanation: productivityData.metrix_3_explanation
      }

      let response
      if (productivityData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-productivity/${productivityData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-productivity`,
          payload
        )
      }

      setProductivityData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditMetricsMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save metrics data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditProblemMode(false)
    setEditSolutionMode(false)
    setEditMetricsMode(false)
  }

  // Check if any data exists
  const hasProblemData =
    productivityData?.problem || productivityData?.problem_solving
  const hasSolutionData =
    productivityData?.solution || productivityData?.solution_solved
  const hasMetricsData =
    productivityData?.metrix_1 ||
    productivityData?.metrix_2 ||
    productivityData?.metrix_3

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {/* Problem Worth Solving Card */}
      {hasProblemData ? (
        <MainCard
          title={'Problem Worth Solving'}
          icon={questionMark}
          onClick={() => setEditProblemMode(true)}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>The Problem</h5>
              {showMoreMyStory
                ? productivityData.problem
                : (productivityData.problem || '').slice(0, 250)}
              {productivityData.problem &&
                productivityData.problem.length > 250 && (
                  <span
                    onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreMyStory ? ' Show less' : '... Show more'}
                  </span>
                )}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>Why It's Worth Solving</h5>
              {showMoreMyStory
                ? productivityData.problem_solving
                : (productivityData.problem_solving || '').slice(0, 250)}
              {productivityData.problem_solving &&
                productivityData.problem_solving.length > 250 && (
                  <span
                    onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreMyStory ? ' Show less' : '... Show more'}
                  </span>
                )}
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Problem Worth Solving'}
          icon={questionMark}
          onClick={() => setEditProblemMode(true)}
        />
      )}

      {/* Edit Problem Card */}
      {editProblemMode && (
        <EditCard
          title={
            hasProblemData
              ? 'Edit Problem Worth Solving'
              : 'Add Problem Worth Solving'
          }
          icon={questionMark}
          handleSubmit={handleSaveProblem}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Identify the problem you solved for, then explain why it is worth
              solving.
            </div>
            <div className='mt-4'>
              <label>The Problem:</label>
              <ReactQuill
                value={productivityData.problem || ''}
                onChange={(content) => handleFormChange('problem', content)}
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
              />
            </div>
            <div className='mt-4'>
              <label>Why It's Worth Solving:</label>
              <ReactQuill
                value={productivityData.problem_solving || ''}
                onChange={(content) =>
                  handleFormChange('problem_solving', content)
                }
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
              />
            </div>
          </div>
        </EditCard>
      )}

      {/* Executed Solution Card */}
      {hasSolutionData ? (
        <MainCard
          title={'Executed Solution'}
          icon={lightBulb}
          onClick={() => setEditSolutionMode(true)}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>My Solution</h5>
              {showMoreMyStory
                ? productivityData.solution
                : (productivityData.solution || '').slice(0, 250)}
              {productivityData.solution &&
                productivityData.solution.length > 250 && (
                  <span
                    onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreMyStory ? ' Show less' : '... Show more'}
                  </span>
                )}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>
                How My Solution Solved The Problem
              </h5>
              {showMoreMyStory
                ? productivityData.solution_solved
                : (productivityData.solution_solved || '').slice(0, 250)}
              {productivityData.solution_solved &&
                productivityData.solution_solved.length > 250 && (
                  <span
                    onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}
                  >
                    {showMoreMyStory ? ' Show less' : '... Show more'}
                  </span>
                )}
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Executed Solution'}
          icon={lightBulb}
          onClick={() => setEditSolutionMode(true)}
        />
      )}

      {/* Edit Solution Card */}
      {editSolutionMode && (
        <EditCard
          title={hasSolutionData ? 'Edit Solution' : 'Add Solution'}
          icon={lightBulb}
          handleSubmit={handleSaveSolution}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Describe the solution you executed and explain how it solved the
              problem.
            </div>
            <div className='mt-4'>
              <label>My Solution:</label>
              <input
                className='form-control'
                value={productivityData.solution || ''}
                onChange={(e) => handleFormChange('solution', e.target.value)}
                style={{
                  border: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: 'black',
                  background: 'transparent',
                  boxShadow: '0px 3px 14px #00000029',
                  marginBottom: '15px'
                }}
              />
            </div>
            <div className='mt-4'>
              <label>How My Solution Solved The Problem:</label>
              <ReactQuill
                value={productivityData.solution_solved || ''}
                onChange={(content) =>
                  handleFormChange('solution_solved', content)
                }
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
              />
            </div>
          </div>
        </EditCard>
      )}

      {/* Metrics Card */}
      {hasMetricsData ? (
        <MainCard
          title={'Metrics'}
          icon={graphUp}
          onClick={() => setEditMetricsMode(true)}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>METRIC 1:</h4>
                <h5 className='value-subheader'>{productivityData.metrix_1}</h5>
                <h4 className='value-header mt-3'>Explanation of Results:</h4>
                {showMoreMyStory
                  ? productivityData.metrix_1_explanation
                  : (productivityData.metrix_1_explanation || '').slice(0, 250)}
                {productivityData.metrix_1_explanation &&
                  productivityData.metrix_1_explanation.length > 250 && (
                    <span
                      onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                      style={{
                        color: 'blue',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {showMoreMyStory ? ' Show less' : '... Show more'}
                    </span>
                  )}
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>METRIC 2:</h4>
                <h5 className='value-subheader'>{productivityData.metrix_2}</h5>
                <h4 className='value-header mt-3'>Explanation of Results:</h4>
                {showMoreMyStory
                  ? productivityData.metrix_2_explanation
                  : (productivityData.metrix_2_explanation || '').slice(0, 250)}
                {productivityData.metrix_2_explanation &&
                  productivityData.metrix_2_explanation.length > 250 && (
                    <span
                      onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                      style={{
                        color: 'blue',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {showMoreMyStory ? ' Show less' : '... Show more'}
                    </span>
                  )}
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>METRIC 3:</h4>
                <h5 className='value-subheader'>{productivityData.metrix_3}</h5>
                <h4 className='value-header mt-3'>Explanation of Results:</h4>
                {showMoreMyStory
                  ? productivityData.metrix_3_explanation
                  : (productivityData.metrix_3_explanation || '').slice(0, 250)}
                {productivityData.metrix_3_explanation &&
                  productivityData.metrix_3_explanation.length > 250 && (
                    <span
                      onClick={() => setShowMoreMyStory(!showMoreMyStory)}
                      style={{
                        color: 'blue',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {showMoreMyStory ? ' Show less' : '... Show more'}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Metrics'}
          icon={graphUp}
          onClick={() => setEditMetricsMode(true)}
        />
      )}

      {/* Edit Metrics Card */}
      {editMetricsMode && (
        <EditCard
          title={hasMetricsData ? 'Edit Metrics' : 'Add Metrics'}
          icon={graphUp}
          handleSubmit={handleSaveMetrics}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Provide metrics that demonstrate the impact of your solution and
              explain the results.
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <div style={{ flex: 1 }}>
                <label>Metric 1:</label>
                <input
                  className='form-control'
                  value={productivityData.metrix_1 || ''}
                  onChange={(e) => handleFormChange('metrix_1', e.target.value)}
                  style={{
                    border: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: 'black',
                    background: 'transparent',
                    boxShadow: '0px 3px 14px #00000029',
                    marginBottom: '15px'
                  }}
                />
                <label>Explanation:</label>
                <ReactQuill
                  value={productivityData.metrix_1_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('metrix_1_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Metric 2:</label>
                <input
                  className='form-control'
                  value={productivityData.metrix_2 || ''}
                  onChange={(e) => handleFormChange('metrix_2', e.target.value)}
                  style={{
                    border: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: 'black',
                    background: 'transparent',
                    boxShadow: '0px 3px 14px #00000029',
                    marginBottom: '15px'
                  }}
                />
                <label>Explanation:</label>
                <ReactQuill
                  value={productivityData.metrix_2_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('metrix_2_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Metric 3:</label>
                <input
                  className='form-control'
                  value={productivityData.metrix_3 || ''}
                  onChange={(e) => handleFormChange('metrix_3', e.target.value)}
                  style={{
                    border: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: 'black',
                    background: 'transparent',
                    boxShadow: '0px 3px 14px #00000029',
                    marginBottom: '15px'
                  }}
                />
                <label>Explanation:</label>
                <ReactQuill
                  value={productivityData.metrix_3_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('metrix_3_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
            </div>
          </div>
        </EditCard>
      )}
    </div>
  )
}

export default StartProd
