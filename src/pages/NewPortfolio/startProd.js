import { Collapse } from 'bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import graphUp from '../../assets/images/graph-up.svg'
import lightBulb from '../../assets/images/light-bulb.svg'
import questionMark from '../../assets/images/question-mark.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import nothingAdded from '../../assets/images/nothing-added.svg'
import './Portfolio.css'

function StartProd(props) {
  const isPublicView = props.isPublicView || props.portfolioType === 'public'

  const userData = useSelector((state) => state.user.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner // Add isPreviewMode check

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
  const [successMessage, setSuccessMessage] = useState(null)
  const [showMoreStates, setShowMoreStates] = useState({})

  const [editingProblem, setEditingProblem] = useState({
    problem: '',
    problem_solving: ''
  })
  const [editingSolution, setEditingSolution] = useState({
    solution: '',
    solution_solved: ''
  })
  const [editingMetrics, setEditingMetrics] = useState({
    metrix_1: '',
    metrix_2: '',
    metrix_3: '',
    metrix_1_explanation: '',
    metrix_2_explanation: '',
    metrix_3_explanation: ''
  })

  const accordionRefs = useRef([])

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setIsLoading(true)

        if (
          props.productivityData &&
          Object.keys(props.productivityData).length > 0
        ) {
          const data = props.productivityData
          setProductivityData(data)
          setEditingProblem({
            problem: data.problem,
            problem_solving: data.problem_solving
          })
          setEditingSolution({
            solution: data.solution,
            solution_solved: data.solution_solved
          })
          setEditingMetrics({
            metrix_1: data.metrix_1,
            metrix_2: data.metrix_2,
            metrix_3: data.metrix_3,
            metrix_1_explanation: data.metrix_1_explanation,
            metrix_2_explanation: data.metrix_2_explanation,
            metrix_3_explanation: data.metrix_3_explanation
          })
        } else {
          try {
            if (!isOwner) {
              setIsLoading(false)
              return
            }
            const response = await axiosInstance.get(
              '/hsPortfolio/user-start-productivity'
            )

            if (response.data && response.data.length > 0) {
              const data = response.data[0]
              setProductivityData(data)
              // Initialize editing states
              setEditingProblem({
                problem: data.problem,
                problem_solving: data.problem_solving
              })
              setEditingSolution({
                solution: data.solution,
                solution_solved: data.solution_solved
              })
              setEditingMetrics({
                metrix_1: data.metrix_1,
                metrix_2: data.metrix_2,
                metrix_3: data.metrix_3,
                metrix_1_explanation: data.metrix_1_explanation,
                metrix_2_explanation: data.metrix_2_explanation,
                metrix_3_explanation: data.metrix_3_explanation
              })
            } else {
              const emptyData = {
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
              setProductivityData(emptyData)
              setEditingProblem({
                problem: '',
                problem_solving: ''
              })
              setEditingSolution({
                solution: '',
                solution_solved: ''
              })
              setEditingMetrics({
                metrix_1: '',
                metrix_2: '',
                metrix_3: '',
                metrix_1_explanation: '',
                metrix_2_explanation: '',
                metrix_3_explanation: ''
              })
            }
          } catch (apiError) {
            // API call failed (like 401), use empty data structure
            console.warn(
              'API call failed, using empty productivity data structure:',
              apiError.message
            )
            const emptyData = {
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
            setProductivityData(emptyData)
            setEditingProblem({
              problem: '',
              problem_solving: ''
            })
            setEditingSolution({
              solution: '',
              solution_solved: ''
            })
            setEditingMetrics({
              metrix_1: '',
              metrix_2: '',
              metrix_3: '',
              metrix_1_explanation: '',
              metrix_2_explanation: '',
              metrix_3_explanation: ''
            })
          }
        }
      } catch (err) {
        console.error('Error in fetchProductivityData:', err)
        // Final fallback: Set empty data structure
        const emptyData = {
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
        setProductivityData(emptyData)
        setEditingProblem({
          problem: '',
          problem_solving: ''
        })
        setEditingSolution({
          solution: '',
          solution_solved: ''
        })
        setEditingMetrics({
          metrix_1: '',
          metrix_2: '',
          metrix_3: '',
          metrix_1_explanation: '',
          metrix_2_explanation: '',
          metrix_3_explanation: ''
        })
        setError(null) // Don't show error to user, just show empty content
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductivityData()
  }, [props.productivityData]) // Add props.productivityData as dependency

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

  // Check if any data exists
  const hasContentBesidesTags = (htmlString) => {
    if (!htmlString) return false
    const textContent = htmlString.replace(/<[^>]*>/g, '').trim()
    const isEmpty =
      htmlString === '<p><br></p>' ||
      htmlString === '<p></p>' ||
      htmlString === '<br>' ||
      htmlString === '<p>&nbsp;</p>' ||
      textContent === ''
    return !isEmpty && textContent.length > 0
  }

  const hasProblemData =
    hasContentBesidesTags(productivityData?.problem) ||
    hasContentBesidesTags(productivityData?.problem_solving)

  const hasSolutionData =
    hasContentBesidesTags(productivityData?.solution) ||
    hasContentBesidesTags(productivityData?.solution_solved)

  const hasMetricsData =
    (productivityData?.metrix_1 && productivityData.metrix_1.trim() !== '') ||
    (productivityData?.metrix_2 && productivityData.metrix_2.trim() !== '') ||
    (productivityData?.metrix_3 && productivityData.metrix_3.trim() !== '') ||
    hasContentBesidesTags(productivityData?.metrix_1_explanation) ||
    hasContentBesidesTags(productivityData?.metrix_2_explanation) ||
    hasContentBesidesTags(productivityData?.metrix_3_explanation)

  // Add canEdit checks to all edit functions
  const handleSaveProblem = async () => {
    if (!canEdit) return // Add this check
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const payload = {
        problem: editingProblem.problem,
        problem_solving: editingProblem.problem_solving
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

      const responseData = response.data?.['0'] || response.data
      if (!responseData) {
        throw new Error('Invalid response format')
      }

      setProductivityData(responseData)
      setEditingProblem({
        problem: responseData.problem,
        problem_solving: responseData.problem_solving
      })
      setSuccessMessage('Problem data saved successfully!')
      setEditProblemMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save problem data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSolution = async () => {
    if (!canEdit) return // Add this check
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const payload = {
        solution: editingSolution.solution,
        solution_solved: editingSolution.solution_solved
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

      const responseData = response.data?.['0'] || response.data
      if (!responseData) {
        throw new Error('Invalid response format')
      }

      setProductivityData(responseData)
      setEditingSolution({
        solution: responseData.solution,
        solution_solved: responseData.solution_solved
      })
      setSuccessMessage('Solution data saved successfully!')
      setEditSolutionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save solution data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMetrics = async () => {
    if (!canEdit) return // Add this check
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const payload = {
        metrix_1: editingMetrics.metrix_1,
        metrix_2: editingMetrics.metrix_2,
        metrix_3: editingMetrics.metrix_3,
        metrix_1_explanation: editingMetrics.metrix_1_explanation,
        metrix_2_explanation: editingMetrics.metrix_2_explanation,
        metrix_3_explanation: editingMetrics.metrix_3_explanation
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

      const responseData = response.data?.['0'] || response.data
      if (!responseData) {
        throw new Error('Invalid response format')
      }

      setProductivityData(responseData)
      setEditingMetrics({
        metrix_1: responseData.metrix_1,
        metrix_2: responseData.metrix_2,
        metrix_3: responseData.metrix_3,
        metrix_1_explanation: responseData.metrix_1_explanation,
        metrix_2_explanation: responseData.metrix_2_explanation,
        metrix_3_explanation: responseData.metrix_3_explanation
      })
      setSuccessMessage('Metrics data saved successfully!')
      setEditMetricsMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save metrics data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (!canEdit) return // Add this check
    // Reset editing states to current productivity data
    setEditingProblem({
      problem: productivityData.problem,
      problem_solving: productivityData.problem_solving
    })
    setEditingSolution({
      solution: productivityData.solution,
      solution_solved: productivityData.solution_solved
    })
    setEditingMetrics({
      metrix_1: productivityData.metrix_1,
      metrix_2: productivityData.metrix_2,
      metrix_3: productivityData.metrix_3,
      metrix_1_explanation: productivityData.metrix_1_explanation,
      metrix_2_explanation: productivityData.metrix_2_explanation,
      metrix_3_explanation: productivityData.metrix_3_explanation
    })

    setEditProblemMode(false)
    setEditSolutionMode(false)
    setEditMetricsMode(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const truncateAtWord = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    let lastSpace = text.lastIndexOf(' ', maxLength)

    if (lastSpace === -1) lastSpace = maxLength

    return text.substring(0, lastSpace)
  }

  return (
    <div>
      {/* Problem Worth Solving Card */}
      {hasProblemData ? (
        <MainCard
          title={'Problem Worth Solving'}
          icon={questionMark}
          onClick={canEdit ? () => setEditProblemMode(true) : () => {}}
          editSign={canEdit && !hasProblemData}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>The Problem</h5>
              <div className='value-desc'>
                {(() => {
                  const stateKey = 'problem-description'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = productivityData?.problem || ''
                  const isLong = content.replace(/<[^>]*>/g, '').length > 150

                  return (
                    <div>
                      <div
                        style={{
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          fontFamily: 'Montserrat',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hasContentBesidesTags(content) // Changed this line
                              ? content?.replace(/&nbsp;/g, ' ') || ''
                              : canEdit
                                ? 'No content has been added. Click the edit button to add.'
                                : 'No content has been added.'
                          }}
                        />
                      </div>
                      {isLong &&
                        hasContentBesidesTags(content) && ( // Changed this line
                          <span
                            onClick={() =>
                              setShowMoreStates((prev) => ({
                                ...prev,
                                [stateKey]: !prev[stateKey]
                              }))
                            }
                            style={{
                              color: '#52C7D3',
                              cursor: 'pointer',
                              fontWeight: '500',
                              fontSize: '12px'
                            }}
                          >
                            {isExpanded ? ' Read less' : 'Read more'}
                          </span>
                        )}
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>Why It's Worth Solving</h5>
              <div className='value-desc'>
                {(() => {
                  const stateKey = 'problem-solving'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = productivityData?.problem_solving || ''
                  const isLong = content.replace(/<[^>]*>/g, '').length > 150

                  return (
                    <div>
                      <div
                        style={{
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          fontFamily: 'Montserrat',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hasContentBesidesTags(content)
                              ? content?.replace(/&nbsp;/g, ' ') || ''
                              : canEdit
                                ? 'No content has been added. Click the edit button to add.'
                                : 'No content has been added.'
                          }}
                        />
                      </div>
                      {isLong && hasContentBesidesTags(content) && (
                        <span
                          onClick={() =>
                            setShowMoreStates((prev) => ({
                              ...prev,
                              [stateKey]: !prev[stateKey]
                            }))
                          }
                          style={{
                            color: '#52C7D3',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '12px'
                          }}
                        >
                          {isExpanded ? ' Read less' : 'Read more'}
                        </span>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Problem Worth Solving'}
          icon={questionMark}
          onClick={canEdit ? () => setEditProblemMode(true) : () => {}}
          editSign={canEdit}
          canEdit={canEdit}
        >
          <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
            <img src={nothingAdded} alt='nothing-added' />
            <p
              className='text-uppercase text-medium nodata-portf-text'
              style={{ color: '#6F6F6F' }}
            >
              {canEdit
                ? 'Nothing has been added yet. click the edit button to get started.'
                : 'Nothing has been added yet.'}
            </p>
          </div>
        </MainCard>
      )}

      {/* Only show edit modal when user can edit */}
      {canEdit && editProblemMode && (
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
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Identify the problem you solved for, then explain why it is worth
              solving.
            </div>
            <div className='mt-4'>
              <label className='howdoiproveit-label-text'>The Problem:</label>
              <ReactQuill
                value={editingProblem.problem || ''}
                onChange={(content) =>
                  setEditingProblem((prev) => ({ ...prev, problem: content }))
                }
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
                placeholder='Identify the specific problem you aimed to solve...'
              />
            </div>
            <div className='mt-4'>
              <label className='howdoiproveit-label-text'>
                Why It's Worth Solving:
              </label>
              <ReactQuill
                value={editingProblem.problem_solving || ''}
                onChange={(content) =>
                  setEditingProblem((prev) => ({
                    ...prev,
                    problem_solving: content
                  }))
                }
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
                placeholder='Explain why this problem is worth solving and its impact...'
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
          onClick={canEdit ? () => setEditSolutionMode(true) : () => {}}
          editSign={canEdit && !hasSolutionData}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>My Solution</h5>
              <div className='value-desc'>
                {(() => {
                  const stateKey = 'solution-description'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = productivityData?.solution || ''
                  const isLong = content.replace(/<[^>]*>/g, '').length > 150

                  return (
                    <div>
                      <div
                        style={{
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          fontFamily: 'Montserrat',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hasContentBesidesTags(content) // Changed this line
                              ? content?.replace(/&nbsp;/g, ' ') || ''
                              : canEdit
                                ? 'No content has been added. Click the edit button to add.'
                                : 'No content has been added.'
                          }}
                        />
                      </div>
                      {isLong &&
                        hasContentBesidesTags(content) && ( // Changed this line
                          <span
                            onClick={() =>
                              setShowMoreStates((prev) => ({
                                ...prev,
                                [stateKey]: !prev[stateKey]
                              }))
                            }
                            style={{
                              color: '#52C7D3',
                              cursor: 'pointer',
                              fontWeight: '500',
                              fontSize: '12px'
                            }}
                          >
                            {isExpanded ? ' Read less' : 'Read more'}
                          </span>
                        )}
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>
                How My Solution Solved The Problem
              </h5>
              <div className='value-desc'>
                {(() => {
                  const stateKey = 'solution-solved'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = productivityData?.solution_solved || ''
                  const isLong = content.replace(/<[^>]*>/g, '').length > 150

                  return (
                    <div>
                      <div
                        style={{
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          fontFamily: 'Montserrat',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'none' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hasContentBesidesTags(content)
                              ? content?.replace(/&nbsp;/g, ' ') || ''
                              : canEdit
                                ? 'No content has been added. Click the edit button to add.'
                                : 'No content has been added.'
                          }}
                        />
                      </div>
                      {isLong && hasContentBesidesTags(content) && (
                        <span
                          onClick={() =>
                            setShowMoreStates((prev) => ({
                              ...prev,
                              [stateKey]: !prev[stateKey]
                            }))
                          }
                          style={{
                            color: '#52C7D3',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '12px'
                          }}
                        >
                          {isExpanded ? ' Read less' : 'Read more'}
                        </span>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Executed Solution'}
          icon={lightBulb}
          onClick={canEdit ? () => setEditSolutionMode(true) : () => {}}
          editSign={canEdit}
          canEdit={canEdit}
        >
          <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
            <img src={nothingAdded} alt='nothing-added' />
            <p
              className='text-uppercase text-medium nodata-portf-text'
              style={{ color: '#6F6F6F' }}
            >
              {canEdit
                ? 'Nothing has been added yet. click the edit button to get started.'
                : 'Nothing has been added yet.'}
            </p>
          </div>
        </MainCard>
      )}

      {/* Only show edit modal when user can edit */}
      {canEdit && editSolutionMode && (
        <EditCard
          title={hasSolutionData ? 'Edit Solution' : 'Add Solution'}
          icon={lightBulb}
          handleSubmit={handleSaveSolution}
          toggle={handleCancelEdit}
        >
          <div>
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Describe the solution you executed and explain how it solved the
              problem.
            </div>
            <div className='mt-4'>
              <label className='howdoiproveit-label-text'>My Solution:</label>
              <input
                className='form-control'
                value={editingSolution.solution || ''}
                onChange={(e) =>
                  setEditingSolution((prev) => ({
                    ...prev,
                    solution: e.target.value
                  }))
                }
                style={{
                  border: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: 'black',
                  background: 'transparent',
                  boxShadow: '0px 3px 14px #00000029',
                  marginBottom: '15px'
                }}
                placeholder='Describe the solution you created and executed...'
              />
            </div>
            <div className='mt-4'>
              <label className='howdoiproveit-label-text'>
                How My Solution Solved The Problem:
              </label>
              <ReactQuill
                value={editingSolution.solution_solved || ''}
                onChange={(content) =>
                  setEditingSolution((prev) => ({
                    ...prev,
                    solution_solved: content
                  }))
                }
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                  borderRadius: '15px'
                }}
                placeholder='Explain how your solution effectively addressed and resolved the problem...'
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
          onClick={canEdit ? () => setEditMetricsMode(true) : () => {}}
          editSign={canEdit && !hasMetricsData}
          canEdit={canEdit}
        >
          {hasMetricsData ? (
            <div style={{ position: 'relative' }}>
              <div
                className='d-grid gap-3 value-container-grid-resp'
                style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
              >
                {/* Metric 1 */}
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>METRIC 1:</h4>
                  <h5 className='value-subheader'>
                    {productivityData.metrix_1}
                  </h5>
                  <h4 className='value-header mt-3'>Explanation of Results:</h4>
                  <div className='value-desc'>
                    {(() => {
                      const stateKey = 'metric-1-explanation'
                      const isExpanded = showMoreStates[stateKey] || false
                      const content =
                        productivityData?.metrix_1_explanation || ''
                      const isLong =
                        content.replace(/<[^>]*>/g, '').length > 150

                      return (
                        <div>
                          <div
                            style={{
                              maxWidth: '100%',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              fontFamily: 'Montserrat',
                              fontSize: '13px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '1.4',
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: isExpanded
                                  ? content?.replace(/&nbsp;/g, ' ') || ''
                                  : content?.replace(/&nbsp;/g, ' ') || ''
                              }}
                            />
                          </div>
                          {isLong && (
                            <span
                              onClick={() =>
                                setShowMoreStates((prev) => ({
                                  ...prev,
                                  [stateKey]: !prev[stateKey]
                                }))
                              }
                              style={{
                                color: '#52C7D3',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '12px'
                              }}
                            >
                              {isExpanded ? ' Read less' : 'Read more'}
                            </span>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Metric 2 */}
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>METRIC 2:</h4>
                  <h5 className='value-subheader'>
                    {productivityData.metrix_2}
                  </h5>
                  <h4 className='value-header mt-3'>Explanation of Results:</h4>
                  <div className='value-desc'>
                    {(() => {
                      const stateKey = 'metric-2-explanation'
                      const isExpanded = showMoreStates[stateKey] || false
                      const content =
                        productivityData?.metrix_2_explanation || ''
                      const isLong =
                        content.replace(/<[^>]*>/g, '').length > 150

                      return (
                        <div>
                          <div
                            style={{
                              maxWidth: '100%',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              fontFamily: 'Montserrat',
                              fontSize: '13px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '1.4',
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: isExpanded
                                  ? content?.replace(/&nbsp;/g, ' ') || ''
                                  : content?.replace(/&nbsp;/g, ' ') || ''
                              }}
                            />
                          </div>
                          {isLong && (
                            <span
                              onClick={() =>
                                setShowMoreStates((prev) => ({
                                  ...prev,
                                  [stateKey]: !prev[stateKey]
                                }))
                              }
                              style={{
                                color: '#52C7D3',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '12px'
                              }}
                            >
                              {isExpanded ? ' Read less' : 'Read more'}
                            </span>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Metric 3 */}
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>METRIC 3:</h4>
                  <h5 className='value-subheader'>
                    {productivityData.metrix_3}
                  </h5>
                  <h4 className='value-header mt-3'>Explanation of Results:</h4>
                  <div className='value-desc'>
                    {(() => {
                      const stateKey = 'metric-3-explanation'
                      const isExpanded = showMoreStates[stateKey] || false
                      const content =
                        productivityData?.metrix_3_explanation || ''
                      const isLong =
                        content.replace(/<[^>]*>/g, '').length > 150

                      return (
                        <div>
                          <div
                            style={{
                              maxWidth: '100%',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              fontFamily: 'Montserrat',
                              fontSize: '13px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '1.4',
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: isExpanded
                                  ? content?.replace(/&nbsp;/g, ' ') || ''
                                  : content?.replace(/&nbsp;/g, ' ') || ''
                              }}
                            />
                          </div>
                          {isLong && (
                            <span
                              onClick={() =>
                                setShowMoreStates((prev) => ({
                                  ...prev,
                                  [stateKey]: !prev[stateKey]
                                }))
                              }
                              style={{
                                color: '#52C7D3',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '12px'
                              }}
                            >
                              {isExpanded ? ' Read less' : 'Read more'}
                            </span>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
              <img src={nothingAdded} alt='nothing-added' />
              <p
                className='text-uppercase text-medium nodata-portf-text'
                style={{ color: '#6F6F6F' }}
              >
                {canEdit
                  ? 'Nothing has been added yet. click the edit button to get started.'
                  : 'Nothing has been added yet.'}
              </p>
            </div>
          )}
        </MainCard>
      ) : (
        <MainCard
          title={'Metrics'}
          icon={graphUp}
          onClick={canEdit ? () => setEditMetricsMode(true) : () => {}}
          editSign={canEdit}
          canEdit={canEdit}
        >
          <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
            <img src={nothingAdded} alt='nothing-added' />
            <p
              className='text-uppercase text-medium nodata-portf-text'
              style={{ color: '#6F6F6F' }}
            >
              {canEdit
                ? 'Nothing has been added yet. click the edit button to get started.'
                : 'Nothing has been added yet.'}
            </p>
          </div>
        </MainCard>
      )}

      {/* Only show edit modal when user can edit */}
      {canEdit && editMetricsMode && (
        <EditCard
          title={hasMetricsData ? 'Edit Metrics' : 'Add Metrics'}
          icon={graphUp}
          handleSubmit={handleSaveMetrics}
          toggle={handleCancelEdit}
        >
          <div>
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
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
              className='modal-metrics-container'
            >
              <div style={{ flex: 1 }}>
                <label className='howdoiproveit-label-text'>Metric 1:</label>
                <input
                  className='form-control'
                  value={editingMetrics.metrix_1 || ''}
                  onChange={(e) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_1: e.target.value
                    }))
                  }
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editingMetrics.metrix_1_explanation || ''}
                  onChange={(content) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_1_explanation: content
                    }))
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className='howdoiproveit-label-text'>Metric 2:</label>
                <input
                  className='form-control'
                  value={editingMetrics.metrix_2 || ''}
                  onChange={(e) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_2: e.target.value
                    }))
                  }
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editingMetrics.metrix_2_explanation || ''}
                  onChange={(content) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_2_explanation: content
                    }))
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className='howdoiproveit-label-text'>Metric 3:</label>
                <input
                  className='form-control'
                  value={editingMetrics.metrix_3 || ''}
                  onChange={(e) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_3: e.target.value
                    }))
                  }
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editingMetrics.metrix_3_explanation || ''}
                  onChange={(content) =>
                    setEditingMetrics((prev) => ({
                      ...prev,
                      metrix_3_explanation: content
                    }))
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
