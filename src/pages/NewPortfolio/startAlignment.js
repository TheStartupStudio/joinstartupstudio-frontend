import React, { useEffect, useRef, useState } from 'react'
import myValueIcon from '../../assets/images/values-icon.svg'
import passion from '../../assets/images/passion.svg'
import leaf from '../../assets/images/leaf.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import dropdown from '../../assets/images/icons8-dropdown-30.png'
import leaderStar from '../../assets/images/leaderboard-star.svg'
import { Collapse } from 'bootstrap'
import axiosInstance from '../../utils/AxiosInstance'
import './Portfolio.css'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import EditPencil from '../../assets/images/edit-pencil.png'

function StartAlignment(props) {
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alignmentData, setAlignmentData] = useState({
    id: null,
    user_id: null,
    value_1: '',
    value_2: '',
    value_3: '',
    value_1_explanation: '',
    value_2_explanation: '',
    value_3_explanation: '',
    passion: '',
    connected_interest_1: '',
    connected_interest_2: '',
    explanation: '',
    leadership: '',
    collaboration: '',
    feedback: '',
    opportunities: '',
    environment: '',
    definition_of_success: '',
    created_at: '',
    updated_at: ''
  })
  const [editValuesMode, setEditValuesMode] = useState(false)
  const [editPassionMode, setEditPassionMode] = useState(false)
  const [editWorkCultureMode, setEditWorkCultureMode] = useState(false)
  const [editSuccessMode, setEditSuccessMode] = useState(false)

  const accordionRefs = useRef([])

  useEffect(() => {
    // const fetchAlignmentData = async () => {
    //   try {
    //     setIsLoading(true)
    //     const response = await axiosInstance.get(
    //       '/hsPortfolio/user-start-alignment'
    //     )
    //     const data = response.data['0'] || {
    //       value_1: '',
    //       value_2: '',
    //       value_3: '',
    //       value_1_explanation: '',
    //       value_2_explanation: '',
    //       value_3_explanation: '',
    //       passion: '',
    //       connected_interest_1: '',
    //       connected_interest_2: '',
    //       explanation: '',
    //       leadership: '',
    //       collaboration: '',
    //       feedback: '',
    //       opportunities: '',
    //       environment: '',
    //       definition_of_success: ''
    //     }
    //     setAlignmentData(data)
    //   } catch (err) {
    //     setError(err.message || 'Failed to fetch alignment data')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    // fetchAlignmentData()


      const data = {
        id: 3,
        user_id: 128,
        value_1: "test",
        value_2: "test", 
        value_3: "test",
        passion: "test ",
        connected_interest_1: "test ",
        connected_interest_2: "ttest ",
        explanation: "<p><span style=\"color: rgb(212, 212, 212);\"> </span><span style=\"color: rgb(156, 220, 254);\">onCancel</span><span style=\"color: rgb(212, 212, 212);\">=</span><span style=\"color: rgb(86, 156, 214);\">{</span><span style=\"color: rgb(220, 220, 170);\">handleCancelEdit</span><span style=\"color: rgb(86, 156, 214);\">}&nbsp;</span><span style=\"color: rgb(212, 212, 212);\"> </span></p>",
        leadership: "<h4>Instructions:111</h4>",
        collaboration: "<h4>Instructions:</h4>",
        feedback: "<h4>Instructions:</h4>",
        opportunities: "<h4>Instructions:</h4>",
        environment: "<h4>Instructions:</h4>",
        definition_of_success: "<p>test succes1</p>",
        value_1_explanation: "<p>aking and you practice them daily. Once you have identified your&nbsp;</p>",
        value_2_explanation: "<p>aking and you practice them daily. Once you have identified your 3</p>",
        value_3_explanation: "<p>aking and you practice them daily. Once you have identified your 3 values, explain what</p>",
        created_at: "2025-05-01T06:45:10.000Z",
        updated_at: "2025-05-27T00:18:06.000Z"
      }
        setAlignmentData(data)

        setIsLoading(false)
  }, [])

  useEffect(() => {
    accordionRefs.current.forEach((ref) => {
      if (ref) {
        new Collapse(ref, { toggle: false })
      }
    })
  }, [alignmentData])

  const handleAccordionClick = (index, event) => {
    event.preventDefault()
    const target = accordionRefs.current[index]
    if (target) {
      const bsCollapse = Collapse.getInstance(target) || new Collapse(target)
      bsCollapse.toggle()
    }
  }

  const handleValuesCardClick = () => {
    setEditValuesMode(true)
  }

  const handlePassionCardClick = () => {
    setEditPassionMode(true)
  }

  const handleWorkCultureCardClick = () => {
    setEditWorkCultureMode(true)
  }

  const handleSuccessCardClick = () => {
    setEditSuccessMode(true)
  }

  const handleValuesFormChange = (field, value) => {
    setAlignmentData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFormChange = (field, value) => {
    setAlignmentData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveValues = async () => {
    try {
      setIsLoading(true)
      const payload = {
        value_1: alignmentData.value_1,
        value_2: alignmentData.value_2,
        value_3: alignmentData.value_3,
        value_1_explanation: alignmentData.value_1_explanation,
        value_2_explanation: alignmentData.value_2_explanation,
        value_3_explanation: alignmentData.value_3_explanation
      }

      let response
      if (alignmentData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-alignment/${alignmentData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-alignment`,
          payload
        )
      }

      // Merge the existing data with the updated values
      setAlignmentData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditValuesMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save values')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassion = async () => {
    try {
      setIsLoading(true)
      const payload = {
        passion: alignmentData.passion,
        connected_interest_1: alignmentData.connected_interest_1,
        connected_interest_2: alignmentData.connected_interest_2,
        explanation: alignmentData.explanation
      }

      let response
      if (alignmentData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-alignment/${alignmentData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-alignment`,
          payload
        )
      }

      // Merge the existing data with the updated values
      setAlignmentData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditPassionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save passion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveWorkCulture = async () => {
    try {
      setIsLoading(true)
      const payload = {
        leadership: alignmentData.leadership,
        collaboration: alignmentData.collaboration,
        feedback: alignmentData.feedback,
        opportunities: alignmentData.opportunities,
        environment: alignmentData.environment
      }

      let response
      if (alignmentData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-alignment/${alignmentData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-alignment`,
          payload
        )
      }

      // Merge the existing data with the updated values
      setAlignmentData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditWorkCultureMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save work culture')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSuccess = async () => {
    try {
      setIsLoading(true)
      const payload = {
        definition_of_success: alignmentData.definition_of_success
      }

      let response
      if (alignmentData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-alignment/${alignmentData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-alignment`,
          payload
        )
      }

      // Merge the existing data with the updated values
      setAlignmentData((prev) => ({
        ...prev,
        ...response.data['0']
      }))
      setEditSuccessMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save success definition')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditValuesMode(false)
    setEditPassionMode(false)
    setEditWorkCultureMode(false)
    setEditSuccessMode(false)
  }

  // Check if any values exist
  const hasValuesData =
    alignmentData?.value_1 || alignmentData?.value_2 || alignmentData?.value_3
  const hasPassionData =
    alignmentData?.passion ||
    alignmentData?.connected_interest_1 ||
    alignmentData?.connected_interest_2 ||
    alignmentData?.explanation
  const hasWorkCultureData =
    alignmentData?.leadership ||
    alignmentData?.collaboration ||
    alignmentData?.feedback ||
    alignmentData?.opportunities ||
    alignmentData?.environment
  const hasSuccessData = alignmentData?.definition_of_success

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {/* Values Card */}
      {hasValuesData ? (
        <MainCard
          title={'Values'}
          icon={myValueIcon}
          onClick={handleValuesCardClick}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              {alignmentData.value_1 && (
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>VALUE 1:</h4>
                  <h5 className='value-subheader'>{alignmentData.value_1}</h5>
                  {showMoreMyStory
                    ? alignmentData?.value_1_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      )
                    : (
                        alignmentData?.value_1_explanation?.replace(
                          /<[^>]*>/g,
                          ''
                        ) || ''
                      ).slice(0, 250)}
                  {alignmentData.value_1_explanation &&
                    alignmentData.value_1_explanation.length > 250 && (
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
              )}
              {alignmentData.value_2 && (
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>VALUE 2:</h4>
                  <h5 className='value-subheader'>{alignmentData.value_2}</h5>
                  {showMoreMyStory
                    ? alignmentData?.value_2_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      )
                    : (
                        alignmentData?.value_2_explanation?.replace(
                          /<[^>]*>/g,
                          ''
                        ) || ''
                      ).slice(0, 250)}
                  {alignmentData.value_2_explanation &&
                    alignmentData.value_2_explanation.length > 250 && (
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
              )}
              {alignmentData.value_3 && (
                <div style={{ fontSize: '13px', color: 'grey' }}>
                  <h4 className='value-header'>VALUE 3:</h4>
                  <h5 className='value-subheader'>{alignmentData.value_3}</h5>
                  {showMoreMyStory
                    ? alignmentData?.value_3_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      )
                    : (
                        alignmentData?.value_3_explanation?.replace(
                          /<[^>]*>/g,
                          ''
                        ) || ''
                      ).slice(0, 250)}
                  {alignmentData.value_3_explanation &&
                    alignmentData.value_3_explanation.length > 250 && (
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
              )}
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Values'}
          icon={myValueIcon}
          onClick={handleValuesCardClick}
        />
      )}

      {/* Edit Values Card - shown when in edit mode */}
      {editValuesMode && (
        <EditCard
          title={hasValuesData ? 'Edit Values' : 'Add Values'}
          icon={myValueIcon}
          handleSubmit={handleSaveValues}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Identify your 3 core values as you enter the marketplace. These
              values inform all of your decision-making and you practice them
              daily. Once you have identified your 3 values, explain what they
              mean to you as a professional.
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}
            >
              {/* Value 1 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '30%'
                }}
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label>Value 1:</label>
                  <input
                    className='form-control'
                    value={alignmentData.value_1 || ''}
                    onChange={(e) =>
                      handleValuesFormChange('value_1', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>
                <div className='mt-3'>
                  <label>Explanation:</label>
                  <ReactQuill
                    value={alignmentData.value_1_explanation || ''}
                    onChange={(content) =>
                      handleValuesFormChange('value_1_explanation', content)
                    }
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                      borderRadius: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Value 2 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '30%'
                }}
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label>Value 2:</label>
                  <input
                    className='form-control'
                    value={alignmentData.value_2 || ''}
                    onChange={(e) =>
                      handleValuesFormChange('value_2', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>
                <div className='mt-3'>
                  <label>Explanation:</label>
                  <ReactQuill
                    value={alignmentData.value_2_explanation || ''}
                    onChange={(content) =>
                      handleValuesFormChange('value_2_explanation', content)
                    }
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                      borderRadius: '15px'
                    }}
                  />
                </div>
              </div>

              {/* Value 3 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '30%'
                }}
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label>Value 3:</label>
                  <input
                    className='form-control'
                    value={alignmentData.value_3 || ''}
                    onChange={(e) =>
                      handleValuesFormChange('value_3', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>
                <div className='mt-3'>
                  <label>Explanation:</label>
                  <ReactQuill
                    value={alignmentData.value_3_explanation || ''}
                    onChange={(content) =>
                      handleValuesFormChange('value_3_explanation', content)
                    }
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                      borderRadius: '15px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </EditCard>
      )}
      {hasPassionData ? (
        <MainCard
          title={'Passion'}
          icon={passion}
          onClick={handlePassionCardClick}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>PASSION:</h4>
                <h5 className='value-subheader'>{alignmentData.passion}</h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>CONNECTED INTEREST 1:</h4>
                <h5 className='value-subheader'>
                  {alignmentData.connected_interest_1}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>CONNECTED INTEREST 2:</h4>
                <h5 className='value-subheader'>
                  {alignmentData.connected_interest_2}
                </h5>
              </div>
            </div>

            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>Explanation</h5>
              {showMoreMyStory
                ? alignmentData.explanation.replace(/<[^>]*>/g, '') || ''
                : (
                    alignmentData.explanation.replace(/<[^>]*>/g, '') ||
                    '' ||
                    ''
                  ).slice(0, 600)}
              {alignmentData.explanation &&
                alignmentData.explanation.length > 250 && (
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
          title={'Passion'}
          icon={passion}
          onClick={handlePassionCardClick}
        />
      )}

      {/* Edit Passion Card */}
      {editPassionMode && (
        <EditCard
          title={hasPassionData ? 'Edit Passion' : 'Add Passion'}
          icon={passion}
          handleSubmit={handleSavePassion}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Share your main passion and two connected interests. Explain how
              these influence your professional life.
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '33%' }}>
                  <label>Passion:</label>
                  <input
                    className='form-control'
                    value={alignmentData.passion || ''}
                    onChange={(e) =>
                      handleFormChange('passion', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>
                <div style={{ width: '33%' }}>
                  <label>Connected Interest 1:</label>
                  <input
                    className='form-control'
                    value={alignmentData.connected_interest_1 || ''}
                    onChange={(e) =>
                      handleFormChange('connected_interest_1', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>

                <div style={{ width: '33%' }}>
                  <label>Connected Interest 2:</label>
                  <input
                    className='form-control'
                    value={alignmentData.connected_interest_2 || ''}
                    onChange={(e) =>
                      handleFormChange('connected_interest_2', e.target.value)
                    }
                    style={{
                      border: 'none',
                      width: '100%',
                      fontSize: '0.875rem',
                      color: 'black',
                      background: 'transparent',
                      boxShadow: '0px 3px 14px #00000029'
                    }}
                  />
                </div>
              </div>
              <div>
                <label>Explanation:</label>
                <ReactQuill
                  value={alignmentData.explanation || ''}
                  onChange={(content) =>
                    handleFormChange('explanation', content)
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

      {hasWorkCultureData ? (
        <MainCard
          title={'Work Culture'}
          icon={leaf}
          onClick={handleWorkCultureCardClick}
        >
          <h5 className='value-subheader'>What I Am Seeking:</h5>
          <div className='accordion mt-5' id='progressAccordion'>
            {[
              {
                title: 'LEADERSHIP',
                question: 'What type of leadership do you respond to?',
                answer: alignmentData.leadership
              },
              {
                title: 'COLLABORATION',
                question:
                  'What type of collaboration do you want to participate in?',
                answer: alignmentData.collaboration
              },
              {
                title: 'FEEDBACK',
                question: 'What type of feedback do you want to receive?',
                answer: alignmentData.feedback
              },
              {
                title: 'OPPORTUNITIES',
                question:
                  'What type of opportunities do you want to have access to?',
                answer: alignmentData.opportunities
              },
              {
                title: 'ENVIRONMENT',
                question: 'What type of environment do you want to work in?',
                answer: alignmentData.environment
              }
            ].map((item, index) => (
              <div
                className='accordion-item progress-details-accordion mt-3'
                key={index}
              >
                <h2 className='accordion-header' id={`heading${index}`}>
                  <button
                    className='accordion-button collapsed text-secondary fw-medium d-flex justify-content-between rounded-1'
                    type='button'
                    onClick={(e) => handleAccordionClick(index, e)}
                    aria-expanded='false'
                    aria-controls={`collapse${index}`}
                  >
                    <span style={{ fontSize: '.85rem' }}>{item.title}</span>
                    <img
                      style={{ width: '16px' }}
                      src={dropdown}
                      alt='dropdown-img'
                    />
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  ref={(el) => (accordionRefs.current[index] = el)}
                  className='accordion-collapse collapse'
                  aria-labelledby={`heading${index}`}
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body'>
                    <h4 className='text-black'>{item.question}</h4>
                    <p className='text-black ml-2 accordion-paragraph'>
                      {item?.answer?.replace(/<[^>]*>/g, '') || ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Work Culture'}
          icon={leaf}
          onClick={handleWorkCultureCardClick}
        />
      )}

      {editWorkCultureMode && (
        <EditCard
          title={hasWorkCultureData ? 'Edit Work Culture' : 'Add Work Culture'}
          icon={leaf}
          handleSubmit={handleSaveWorkCulture}
          onCancel={() => setEditWorkCultureMode(false)}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              For each of the 5 categories fo work culture, you must explain the
              type of each you are seeking in your profession.What type
              ofleadership do you respond to? What type of collaboration do you
              want to participate in? What type of feedback do you want to
              recieve? What type of opportunities do you want to have access to
              ? What type of environment do you want to work in?
            </div>

            <div className='accordion mt-5' id='workCultureAccordion'>
              {[
                {
                  title: 'LEADERSHIP',
                  question: 'What type of leadership do you respond to?',
                  field: 'leadership',
                  content: alignmentData.leadership || ''
                },
                {
                  title: 'COLLABORATION',
                  question:
                    'What type of collaboration do you want to participate in?',
                  field: 'collaboration',
                  content: alignmentData.collaboration || ''
                },
                {
                  title: 'FEEDBACK',
                  question: 'What type of feedback do you want to receive?',
                  field: 'feedback',
                  content: alignmentData.feedback || ''
                },
                {
                  title: 'OPPORTUNITIES',
                  question:
                    'What type of opportunities do you want to have access to?',
                  field: 'opportunities',
                  content: alignmentData.opportunities || ''
                },
                {
                  title: 'ENVIRONMENT',
                  question: 'What type of environment do you want to work in?',
                  field: 'environment',
                  content: alignmentData.environment || ''
                }
              ].map((item, index) => (
                <div
                  className='accordion-item progress-details-accordion mt-3'
                  key={index}
                >
                  <h2 className='accordion-header' id={`editHeading${index}`}>
                    <button
                      className='accordion-button collapsed text-secondary fw-medium d-flex justify-content-between rounded-1'
                      type='button'
                      onClick={(e) => handleAccordionClick(index, e)}
                      aria-expanded='false'
                      aria-controls={`editCollapse${index}`}
                    >
                      <span style={{ fontSize: '.85rem' }}>{item.title}</span>
                      <img
                        style={{ width: '16px' }}
                        src={dropdown}
                        alt='dropdown-img'
                      />
                    </button>
                  </h2>
                  <div
                    id={`editCollapse${index}`}
                    ref={(el) => (accordionRefs.current[index] = el)}
                    className='accordion-collapse collapse'
                    aria-labelledby={`editHeading${index}`}
                    data-bs-parent='#workCultureAccordion'
                  >
                    <div className='accordion-body'>
                      <h4 className='text-black'>{item.question}</h4>
                      <div className='mt-3'>
                        <ReactQuill
                          value={item.content}
                          onChange={(content) =>
                            handleFormChange(item.field, content)
                          }
                          style={{
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                            borderRadius: '15px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EditCard>
      )}

      {/* Success Card */}
      {hasSuccessData ? (
        <MainCard
          title={'Success'}
          icon={leaderStar}
          onClick={handleSuccessCardClick}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader'>Definition of Success:</h5>
              {showMoreMyStory
                ? alignmentData?.definition_of_success?.replace(/<[^>]*>/g, '')
                : alignmentData.definition_of_success
                    ?.slice(0, 250)
                    .replace(/<[^>]*>/g, '')}
              {alignmentData.definition_of_success &&
                alignmentData.definition_of_success.length > 250 && (
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
          title={'Success'}
          icon={leaderStar}
          onClick={handleSuccessCardClick}
        />
      )}

      {editSuccessMode && (
        <EditCard
          title={
            hasSuccessData
              ? 'Edit Success Definition'
              : 'Add Success Definition'
          }
          icon={leaderStar}
          handleSubmit={handleSaveSuccess}
          onCancel={() => setEditSuccessMode(false)}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Explain your individual definition of success. How do you define
              yourself and how do you measure it for yourself?
            </div>
            <div className='mt-4'>
              <label>Definition of Success:</label>
              <ReactQuill
                value={alignmentData.definition_of_success || ''}
                onChange={(content) =>
                  handleFormChange('definition_of_success', content)
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

export default StartAlignment
