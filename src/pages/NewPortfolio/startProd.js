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
    // const fetchProductivityData = async () => {
    //   try {
    //     setIsLoading(true)
    //     const response = await axiosInstance.get(
    //       '/hsPortfolio/user-start-productivity'
    //     )
    //     const data = response.data['0'] || {
    //       problem: '',
    //       problem_solving: '',
    //       solution: '',
    //       solution_solved: '',
    //       metrix_1: '',
    //       metrix_2: '',
    //       metrix_3: '',
    //       metrix_1_explanation: '',
    //       metrix_2_explanation: '',
    //       metrix_3_explanation: ''
    //     }
    //     setProductivityData(data)
    //   } catch (err) {
    //     setError(err.message || 'Failed to fetch productivity data')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    // fetchProductivityData()

    const data = 
      {
        "id": 1,
        "user_id": 128,
        "probem": null,
        "problem_solving": "<p><span style=\"color: rgb(206, 145, 120);\">wwwwwwww</span></p>",
        "solution": "ttestss",
        "solution_solved": "<p>asdasdasdas</p>",
        "metrix_1": "tes",
        "metrix_2": "tes",
        "metrix_3": "tes",
        "metrix_1_explanation": "<p>testetetasdads</p>",
        "metrix_2_explanation": "<p>dasdasdasd</p>",
        "metrix_3_explanation": "<p>asdasdasdas</p>",
        "created_at": "2025-05-01T08:22:24.000Z",
        "updated_at": "2025-05-01T08:35:11.000Z"
      }

    setProductivityData(data)

    setIsLoading(false)


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
          <div
            className="start-prod-container"
          >
            {/* The Problem Column */}
            <div className="portfolio-productivity-card" >
              
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Problem" 
                />
              <h5 className="title">
                THE PROBLEM
              </h5>
            </div>

            {/* Why It's Worth Solving Column */}
            <div className="portfolio-productivity-card" >
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Worth Solving" 
                />
              <h5 className="title">
                WHY IT'S WORTH SOLVING
              </h5>
            </div>

            {/* Executed Solution Column */}
            <div className="portfolio-productivity-card" >
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Solution" 
                />
              <h5 className="title">
                EXECUTED SOLUTION
              </h5>
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





      {/* Problem Worth Solving Card */}
      {hasProblemData ? (
        <MainCard
          title={'Metrics'}
          icon={graphUp}
          onClick={() => setEditProblemMode(true)}
        >
          <div className="start-prod-container">
            {/* The Problem Column */}
            <div className="portfolio-productivity-card" >
              
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Problem" 
                />
              <h5 className="title">
                THE PROBLEM
              </h5>
            </div>

            {/* Why It's Worth Solving Column */}
            <div className="portfolio-productivity-card" >
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Worth Solving" 
                />
              <h5 className="title">
                WHY IT'S WORTH SOLVING
              </h5>
            </div>

            {/* Executed Solution Column */}
            <div className="portfolio-productivity-card" >
                <img 
                  src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'} 
                  alt="Solution" 
                />
              <h5 className="title">
                EXECUTED SOLUTION
              </h5>
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
    </div>
  )
}

export default StartProd
