import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import industrySkills from '../../assets/images/city.svg'
import recognitionOfSkillsIcon from '../../assets/images/user-star.svg'
import skillsInActionIcon from '../../assets/images/skills-action.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import './Portfolio.css'

function StartCompetitiveness(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [competitivenessData, setCompetitivenessData] = useState({
    id: null,
    user_id: null,
    iss_skill_1: '',
    iss_skill_2: '',
    iss_skill_3: '',
    its_skill_1: '',
    its_skill_2: '',
    its_skill_3: '',
    is_explanation: '',
    exprience_1: '',
    exprience_2: '',
    exprience_3: '',
    exprience_1_explanation: '',
    exprience_2_explanation: '',
    exprience_3_explanation: '',
    mentor_1: '',
    mentor_2: '',
    mentor_3: '',
    mentor_1_explanation: '',
    mentor_2_explanation: '',
    mentor_3_explanation: ''
  })
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [editIndustrySkillsMode, setEditIndustrySkillsMode] = useState(false)
  const [editSkillsActionMode, setEditSkillsActionMode] = useState(false)
  const [editRecognitionMode, setEditRecognitionMode] = useState(false)

  useEffect(() => {
    const fetchCompetitivenessData = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get(
          '/hsPortfolio/user-start-competitiveness'
        )
        const data = response.data['0'] || {
          id: null, // Make sure id is included in the default object
          user_id: null,
          iss_skill_1: '',
          iss_skill_2: '',
          iss_skill_3: '',
          its_skill_1: '',
          its_skill_2: '',
          its_skill_3: '',
          is_explanation: '',
          exprience_1: '',
          exprience_2: '',
          exprience_3: '',
          exprience_1_explanation: '',
          exprience_2_explanation: '',
          exprience_3_explanation: '',
          mentor_1: '',
          mentor_2: '',
          mentor_3: '',
          mentor_1_explanation: '',
          mentor_2_explanation: '',
          mentor_3_explanation: ''
        }
        setCompetitivenessData(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch competitiveness data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitivenessData()
  }, [])

  const handleFormChange = (field, value) => {
    setCompetitivenessData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveIndustrySkills = async () => {
    try {
      setIsLoading(true)
      const payload = {
        iss_skill_1: competitivenessData.iss_skill_1,
        iss_skill_2: competitivenessData.iss_skill_2,
        iss_skill_3: competitivenessData.iss_skill_3,
        its_skill_1: competitivenessData.its_skill_1,
        its_skill_2: competitivenessData.its_skill_2,
        its_skill_3: competitivenessData.its_skill_3,
        is_explanation: competitivenessData.is_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditIndustrySkillsMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save industry skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSkillsAction = async () => {
    try {
      setIsLoading(true)
      const payload = {
        exprience_1: competitivenessData.exprience_1,
        exprience_2: competitivenessData.exprience_2,
        exprience_3: competitivenessData.exprience_3,
        exprience_1_explanation: competitivenessData.exprience_1_explanation,
        exprience_2_explanation: competitivenessData.exprience_2_explanation,
        exprience_3_explanation: competitivenessData.exprience_3_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditSkillsActionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save skills in action')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRecognition = async () => {
    try {
      setIsLoading(true)

      const payload = {
        mentor_1: competitivenessData.mentor_1,
        mentor_2: competitivenessData.mentor_2,
        mentor_3: competitivenessData.mentor_3,
        mentor_1_explanation: competitivenessData.mentor_1_explanation,
        mentor_2_explanation: competitivenessData.mentor_2_explanation,
        mentor_3_explanation: competitivenessData.mentor_3_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditRecognitionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save recognition data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditIndustrySkillsMode(false)
    setEditSkillsActionMode(false)
    setEditRecognitionMode(false)
  }

  // Check if any data exists
  const hasIndustrySkillsData =
    competitivenessData?.iss_skill_1 ||
    competitivenessData?.iss_skill_2 ||
    competitivenessData?.iss_skill_3 ||
    competitivenessData?.its_skill_1 ||
    competitivenessData?.its_skill_2 ||
    competitivenessData?.its_skill_3 ||
    competitivenessData?.is_explanation

  const hasSkillsActionData =
    competitivenessData?.exprience_1 ||
    competitivenessData?.exprience_2 ||
    competitivenessData?.exprience_3

  const hasRecognitionData =
    competitivenessData?.mentor_1 ||
    competitivenessData?.mentor_2 ||
    competitivenessData?.mentor_3

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {/* Industry Skills Card */}
      {hasIndustrySkillsData ? (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={() => setEditIndustrySkillsMode(true)}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px'
            }}
          >
            Industry-Specific Skills
          </div>
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 1:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.iss_skill_1}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 2:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.iss_skill_2}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 3:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.iss_skill_3}
                </h5>
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px'
            }}
          >
            Industry-Transcendent Skills
          </div>
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 1:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.its_skill_1}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 2:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.its_skill_2}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Skill 3:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.its_skill_3}
                </h5>
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px'
            }}
          >
            How These Skills Combine to Increase My Value
          </div>
          <div style={{ fontSize: '13px', color: 'grey' }}>
            {showMoreMyStory
              ? competitivenessData?.is_explanation?.replace(/<[^>]*>/g, '')
              : (competitivenessData?.is_explanation || '')
                  .slice(0, 250)
                  .replace(/<[^>]*>/g, '')}
            {competitivenessData.is_explanation &&
              competitivenessData.is_explanation.length > 250 && (
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
        </MainCard>
      ) : (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={() => setEditIndustrySkillsMode(true)}
        />
      )}

      {/* Edit Industry Skills Card */}
      {editIndustrySkillsMode && (
        <EditCard
          title={
            hasIndustrySkillsData
              ? 'Edit Industry Skills'
              : 'Add Industry Skills'
          }
          icon={industrySkills}
          handleSubmit={handleSaveIndustrySkills}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              List your industry-specific and transcendent skills, then explain
              how they combine to increase your value.
            </div>

            <div
              style={{
                fontSize: '16px',
                fontWeight: '500',
                margin: '20px 0 10px'
              }}
            >
              Industry-Specific Skills
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Skill 1:</label>
                <input
                  className='form-control'
                  value={competitivenessData.iss_skill_1 || ''}
                  onChange={(e) =>
                    handleFormChange('iss_skill_1', e.target.value)
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
              <div style={{ flex: 1 }}>
                <label>Skill 2:</label>
                <input
                  className='form-control'
                  value={competitivenessData.iss_skill_2 || ''}
                  onChange={(e) =>
                    handleFormChange('iss_skill_2', e.target.value)
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
              <div style={{ flex: 1 }}>
                <label>Skill 3:</label>
                <input
                  className='form-control'
                  value={competitivenessData.iss_skill_3 || ''}
                  onChange={(e) =>
                    handleFormChange('iss_skill_3', e.target.value)
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

            <div
              style={{
                fontSize: '16px',
                fontWeight: '500',
                margin: '20px 0 10px'
              }}
            >
              Industry-Transcendent Skills
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Skill 1:</label>
                <input
                  className='form-control'
                  value={competitivenessData.its_skill_1 || ''}
                  onChange={(e) =>
                    handleFormChange('its_skill_1', e.target.value)
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
              <div style={{ flex: 1 }}>
                <label>Skill 2:</label>
                <input
                  className='form-control'
                  value={competitivenessData.its_skill_2 || ''}
                  onChange={(e) =>
                    handleFormChange('its_skill_2', e.target.value)
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
              <div style={{ flex: 1 }}>
                <label>Skill 3:</label>
                <input
                  className='form-control'
                  value={competitivenessData.its_skill_3 || ''}
                  onChange={(e) =>
                    handleFormChange('its_skill_3', e.target.value)
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

            <div style={{ marginTop: '20px' }}>
              <label>How These Skills Combine to Increase My Value:</label>
              <ReactQuill
                value={competitivenessData.is_explanation || ''}
                onChange={(content) =>
                  handleFormChange('is_explanation', content)
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

      {/* Skills in Action Card */}
      {hasSkillsActionData ? (
        <MainCard
          title={'Skills in Action'}
          icon={skillsInActionIcon}
          onClick={() => setEditSkillsActionMode(true)}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Experience 1:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.exprience_1}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Experience 2:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.exprience_2}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Experience 3:</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.exprience_3}
                </h5>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData?.exprience_1_explanation?.replace(
                      /<[^>]*>/g,
                      ''
                    )
                  : (
                      competitivenessData?.exprience_1_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      ) || ''
                    ).slice(0, 250)}
                {competitivenessData.exprience_1_explanation &&
                  competitivenessData.exprience_1_explanation.length > 250 && (
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
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData.exprience_2_explanation
                  : (competitivenessData.exprience_2_explanation || '').slice(
                      0,
                      250
                    )}
                {competitivenessData.exprience_2_explanation &&
                  competitivenessData.exprience_2_explanation.length > 250 && (
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
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData?.exprience_3_explanation?.replace(
                      /<[^>]*>/g,
                      ''
                    )
                  : (
                      competitivenessData.exprience_3_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      ) || ''
                    ).slice(0, 250)}
                {competitivenessData.exprience_3_explanation &&
                  competitivenessData.exprience_3_explanation.length > 250 && (
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
          title={'Skills in Action'}
          icon={skillsInActionIcon}
          onClick={() => setEditSkillsActionMode(true)}
        />
      )}

      {/* Edit Skills in Action Card */}
      {editSkillsActionMode && (
        <EditCard
          title={
            hasSkillsActionData
              ? 'Edit Skills in Action'
              : 'Add Skills in Action'
          }
          icon={skillsInActionIcon}
          handleSubmit={handleSaveSkillsAction}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Describe your experiences demonstrating these skills and explain
              their impact.
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Experience 1:</label>
                <input
                  className='form-control'
                  value={competitivenessData.exprience_1 || ''}
                  onChange={(e) =>
                    handleFormChange('exprience_1', e.target.value)
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
                <label>Explanation:</label>
                <ReactQuill
                  value={competitivenessData.exprience_1_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('exprience_1_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Experience 2:</label>
                <input
                  className='form-control'
                  value={competitivenessData.exprience_2 || ''}
                  onChange={(e) =>
                    handleFormChange('exprience_2', e.target.value)
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
                <label>Explanation:</label>
                <ReactQuill
                  value={competitivenessData.exprience_2_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('exprience_2_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Experience 3:</label>
                <input
                  className='form-control'
                  value={competitivenessData.exprience_3 || ''}
                  onChange={(e) =>
                    handleFormChange('exprience_3', e.target.value)
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
                <label>Explanation:</label>
                <ReactQuill
                  value={competitivenessData.exprience_3_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('exprience_3_explanation', content)
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

      {/* Recognition of Skills Card */}
      {hasRecognitionData ? (
        <MainCard
          title={'Recognition of Skills'}
          icon={recognitionOfSkillsIcon}
          onClick={() => setEditRecognitionMode(true)}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Mentor 1</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.mentor_1}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Mentor 2</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.mentor_2}
                </h5>
              </div>
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Mentor 3</h4>
                <h5 className='value-subheader'>
                  {competitivenessData.mentor_3}
                </h5>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3'
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '13px', color: 'grey' }}>
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData?.mentor_1_explanation?.replace(
                      /<[^>]*>/g,
                      ''
                    )
                  : (
                      competitivenessData?.mentor_1_explanation?.replace(
                        /<[^>]*>/g,
                        ''
                      ) || ''
                    ).slice(0, 250)}
                {competitivenessData.mentor_1_explanation &&
                  competitivenessData.mentor_1_explanation.length > 250 && (
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
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData.mentor_2_explanation
                  : (competitivenessData.mentor_2_explanation || '').slice(
                      0,
                      250
                    )}
                {competitivenessData.mentor_2_explanation &&
                  competitivenessData.mentor_2_explanation.length > 250 && (
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
                <h4 className='value-header'>Explanation</h4>
                {showMoreMyStory
                  ? competitivenessData.mentor_3_explanation
                  : (competitivenessData.mentor_3_explanation || '').slice(
                      0,
                      250
                    )}
                {competitivenessData.mentor_3_explanation &&
                  competitivenessData.mentor_3_explanation.length > 250 && (
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
          title={'Recognition of Skills'}
          icon={recognitionOfSkillsIcon}
          onClick={() => setEditRecognitionMode(true)}
        />
      )}

      {/* Edit Recognition of Skills Card */}
      {editRecognitionMode && (
        <EditCard
          title={
            hasRecognitionData
              ? 'Edit Recognition of Skills'
              : 'Add Recognition of Skills'
          }
          icon={recognitionOfSkillsIcon}
          handleSubmit={handleSaveRecognition}
          toggle={handleCancelEdit}
        >
          <div>
            <div style={{ marginTop: '30px', fontWeight: '600' }}>
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              List mentors who have recognized your skills and explain their
              feedback.
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Mentor 1:</label>
                <input
                  className='form-control'
                  value={competitivenessData.mentor_1 || ''}
                  onChange={(e) => handleFormChange('mentor_1', e.target.value)}
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
                  value={competitivenessData.mentor_1_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('mentor_1_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Mentor 2:</label>
                <input
                  className='form-control'
                  value={competitivenessData.mentor_2 || ''}
                  onChange={(e) => handleFormChange('mentor_2', e.target.value)}
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
                  value={competitivenessData.mentor_2_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('mentor_2_explanation', content)
                  }
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                    borderRadius: '15px'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Mentor 3:</label>
                <input
                  className='form-control'
                  value={competitivenessData.mentor_3 || ''}
                  onChange={(e) => handleFormChange('mentor_3', e.target.value)}
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
                  value={competitivenessData.mentor_3_explanation || ''}
                  onChange={(content) =>
                    handleFormChange('mentor_3_explanation', content)
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

export default StartCompetitiveness
