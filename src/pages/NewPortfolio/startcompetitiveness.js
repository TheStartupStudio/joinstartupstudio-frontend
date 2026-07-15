import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux' // Add this import
import axiosInstance from '../../utils/AxiosInstance'
import industrySkills from '../../assets/images/city.svg'
import recognitionOfSkillsIcon from '../../assets/images/user-star.svg'
import skillsInActionIcon from '../../assets/images/skills-action.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import nothingAdded from '../../assets/images/nothing-added.svg'
import './Portfolio.css'

function StartCompetitiveness(props) {
  const isPublicView = props.isPublicView || props.portfolioType === 'public'

  const userData = useSelector((state) => state.user.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner // Add isPreviewMode check

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

  // New state for edit form data
  const [editFormData, setEditFormData] = useState({
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

  const [showMoreStates, setShowMoreStates] = useState({})
  const [editIndustrySkillsMode, setEditIndustrySkillsMode] = useState(false)
  const [editSkillsActionMode, setEditSkillsActionMode] = useState(false)
  const [editRecognitionMode, setEditRecognitionMode] = useState(false)
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const fetchCompetitivenessData = async () => {
      try {
        setIsLoading(true)

        if (
          props.competitivenessData &&
          Object.keys(props.competitivenessData).length > 0
        ) {
          setCompetitivenessData(props.competitivenessData)
          setInitialData(props.competitivenessData)
        } else {
          try {
            if (!isOwner) return
            const response = await axiosInstance.get(
              '/hsPortfolio/user-start-competitiveness'
            )

            if (response.data && response.data.length > 0) {
              setCompetitivenessData(response.data[0])
              setInitialData(response.data[0])
            } else {
              console.log(
                'API returned empty array, using empty competitiveness data structure'
              )
              const emptyData = {
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
              }
              setCompetitivenessData(emptyData)
              setInitialData(emptyData)
            }
          } catch (apiError) {
            // API call failed (like 401), use empty data structure
            console.warn(
              'API call failed, using empty competitiveness data structure:',
              apiError.message
            )
            const emptyData = {
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
            }
            setCompetitivenessData(emptyData)
            setInitialData(emptyData)
          }
        }
      } catch (err) {
        console.error('Error in fetchCompetitivenessData:', err)
        // Final fallback: Set empty data structure
        const emptyData = {
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
        }
        setCompetitivenessData(emptyData)
        setInitialData(emptyData)
        setError(null) // Don't show error to user, just show empty content
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitivenessData()
  }, [props.competitivenessData])

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // Add the hasContentBesidesTags function
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

  // Modal open handlers that check canEdit first
  const openIndustrySkillsModal = () => {
    if (!canEdit) return // Add this check
    setEditFormData({
      iss_skill_1: competitivenessData.iss_skill_1,
      iss_skill_2: competitivenessData.iss_skill_2,
      iss_skill_3: competitivenessData.iss_skill_3,
      its_skill_1: competitivenessData.its_skill_1,
      its_skill_2: competitivenessData.its_skill_2,
      its_skill_3: competitivenessData.its_skill_3,
      is_explanation: competitivenessData.is_explanation
    })
    setEditIndustrySkillsMode(true)
  }

  const openSkillsActionModal = () => {
    if (!canEdit) return // Add this check
    setEditFormData({
      exprience_1: competitivenessData.exprience_1,
      exprience_2: competitivenessData.exprience_2,
      exprience_3: competitivenessData.exprience_3,
      exprience_1_explanation: competitivenessData.exprience_1_explanation,
      exprience_2_explanation: competitivenessData.exprience_2_explanation,
      exprience_3_explanation: competitivenessData.exprience_3_explanation
    })
    setEditSkillsActionMode(true)
  }

  const openRecognitionModal = () => {
    if (!canEdit) return // Add this check
    setEditFormData({
      mentor_1: competitivenessData.mentor_1,
      mentor_2: competitivenessData.mentor_2,
      mentor_3: competitivenessData.mentor_3,
      mentor_1_explanation: competitivenessData.mentor_1_explanation,
      mentor_2_explanation: competitivenessData.mentor_2_explanation,
      mentor_3_explanation: competitivenessData.mentor_3_explanation
    })
    setEditRecognitionMode(true)
  }

  const handleSaveIndustrySkills = async () => {
    if (!canEdit) return // Add this check
    try {
      setIsLoading(true)
      const payload = {
        iss_skill_1: editFormData.iss_skill_1,
        iss_skill_2: editFormData.iss_skill_2,
        iss_skill_3: editFormData.iss_skill_3,
        its_skill_1: editFormData.its_skill_1,
        its_skill_2: editFormData.its_skill_2,
        its_skill_3: editFormData.its_skill_3,
        is_explanation: editFormData.is_explanation
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
        id: response.data.id || prev.id
      }))
      setInitialData(response.data)
      setEditIndustrySkillsMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save industry skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSkillsAction = async () => {
    if (!canEdit) return // Add this check
    try {
      setIsLoading(true)
      const payload = {
        exprience_1: editFormData.exprience_1,
        exprience_2: editFormData.exprience_2,
        exprience_3: editFormData.exprience_3,
        exprience_1_explanation: editFormData.exprience_1_explanation,
        exprience_2_explanation: editFormData.exprience_2_explanation,
        exprience_3_explanation: editFormData.exprience_3_explanation
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
        id: response.data.id || prev.id
      }))
      setInitialData(response.data)
      setEditSkillsActionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save skills in action')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRecognition = async () => {
    if (!canEdit) return // Add this check
    try {
      setIsLoading(true)
      const payload = {
        mentor_1: editFormData.mentor_1,
        mentor_2: editFormData.mentor_2,
        mentor_3: editFormData.mentor_3,
        mentor_1_explanation: editFormData.mentor_1_explanation,
        mentor_2_explanation: editFormData.mentor_2_explanation,
        mentor_3_explanation: editFormData.mentor_3_explanation
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
        id: response.data.id || prev.id
      }))
      setInitialData(response.data)
      setEditRecognitionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save recognition data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (!canEdit) return // Add this check
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
    hasContentBesidesTags(competitivenessData?.is_explanation)

  const hasSkillsActionData =
    competitivenessData?.exprience_1 ||
    competitivenessData?.exprience_2 ||
    competitivenessData?.exprience_3 ||
    hasContentBesidesTags(competitivenessData?.exprience_1_explanation) ||
    hasContentBesidesTags(competitivenessData?.exprience_2_explanation) ||
    hasContentBesidesTags(competitivenessData?.exprience_3_explanation)

  const hasRecognitionData =
    competitivenessData?.mentor_1 ||
    competitivenessData?.mentor_2 ||
    competitivenessData?.mentor_3 ||
    hasContentBesidesTags(competitivenessData?.mentor_1_explanation) ||
    hasContentBesidesTags(competitivenessData?.mentor_2_explanation) ||
    hasContentBesidesTags(competitivenessData?.mentor_3_explanation)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Industry Skills Card */}
      {hasIndustrySkillsData ? (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={canEdit ? openIndustrySkillsModal : () => {}}
          canEdit={canEdit}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px'
            }}
            className='value-subheader'
          >
            Industry-Specific Skills
          </div>
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
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
            className='value-subheader'
          >
            Industry-Transcendent Skills
          </div>
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
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
            className='value-subheader'
          >
            How These Skills Combine to Increase My Value
          </div>
          <div className='value-desc'>
            {(() => {
              const stateKey = 'industry-skills-explanation'
              const isExpanded = showMoreStates[stateKey] || false
              const content = competitivenessData?.is_explanation || ''
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
                      lineHeight: '1.4'
                    }}
                  >
                    <div
                      style={{
                        // Add these styles for 2-line truncation with ellipsis
                        display: isExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'none' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: hasContentBesidesTags(content)
                          ? content?.replace(/&nbsp;/g, ' ')
                          : canEdit
                            ? 'No content has been added. Click the edit button to add.'
                            : 'No content has been added.'
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
        </MainCard>
      ) : (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={canEdit ? openIndustrySkillsModal : () => {}}
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
      {canEdit && editIndustrySkillsMode && (
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
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
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
              className='howdoiproveit-label-text'
            >
              Industry-Specific Skills
            </div>
            <div
              style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}
              className='competitiveness-skills-container'
            >
              <div style={{ flex: 1 }}>
                <label>Skill 1:</label>
                <input
                  className='form-control'
                  value={editFormData.iss_skill_1 || ''}
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
                  value={editFormData.iss_skill_2 || ''}
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
                  value={editFormData.iss_skill_3 || ''}
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
              className='howdoiproveit-label-text'
            >
              Industry-Transcendent Skills
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Skill 1:</label>
                <input
                  className='form-control'
                  value={editFormData.its_skill_1 || ''}
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
                  value={editFormData.its_skill_2 || ''}
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
                  value={editFormData.its_skill_3 || ''}
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
              <label className='howdoiproveit-label-text'>
                How These Skills Combine to Increase My Value:
              </label>
              <ReactQuill
                value={editFormData.is_explanation || ''}
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
          onClick={canEdit ? openSkillsActionModal : () => {}}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
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
              className='d-grid explanation-grid-resp'
              style={{
                gridTemplateColumns: '1fr 1fr 1fr'
              }}
            >
              {/* Experience 1 Explanation */}
              <div
                style={{ fontSize: '13px', color: 'grey' }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc explanation-value-desc'>
                  {(() => {
                    const stateKey = 'experience-1-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.exprience_1_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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

              {/* Experience 2 Explanation */}
              <div
                style={{
                  fontSize: '13px',
                  color: 'grey',
                  transform: 'translateX(5px)'
                }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc'>
                  {(() => {
                    const stateKey = 'experience-2-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.exprience_2_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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

              {/* Experience 3 Explanation */}
              <div
                style={{
                  fontSize: '13px',
                  color: 'grey',
                  transform: 'translateX(10px)'
                }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc'>
                  {(() => {
                    const stateKey = 'experience-3-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.exprience_3_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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
                              marginLeft: '5px',
                              fontWeight: '500',
                              fontSize: '12px'
                            }}
                          >
                            {isExpanded ? ' Read less' : '... Read more'}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Skills in Action'}
          icon={skillsInActionIcon}
          onClick={canEdit ? openSkillsActionModal : () => {}}
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
      {canEdit && editSkillsActionMode && (
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
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Describe your experiences demonstrating these skills and explain
              their impact.
            </div>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                marginTop: '20px'
              }}
              className='competitiveness-experience-container'
            >
              <div style={{ flex: 1 }}>
                <label className='howdoiproveit-label-text'>
                  Experience 1:
                </label>
                <input
                  className='form-control'
                  value={editFormData.exprience_1 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.exprience_1_explanation || ''}
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
                <label className='howdoiproveit-label-text'>
                  Experience 2:
                </label>
                <input
                  className='form-control'
                  value={editFormData.exprience_2 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.exprience_2_explanation || ''}
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
                <label className='howdoiproveit-label-text'>
                  Experience 3:
                </label>
                <input
                  className='form-control'
                  value={editFormData.exprience_3 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.exprience_3_explanation || ''}
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
          onClick={canEdit ? openRecognitionModal : () => {}}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
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
              className='d-grid explanation-grid-resp'
              style={{
                gridTemplateColumns: '1fr 1fr 1fr'
              }}
            >
              {/* Mentor 1 Explanation */}
              <div
                style={{ fontSize: '13px', color: 'grey' }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc'>
                  {(() => {
                    const stateKey = 'mentor-1-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.mentor_1_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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

              {/* Mentor 2 Explanation */}
              <div
                style={{
                  fontSize: '13px',
                  color: 'grey',
                  transform: 'translateX(5px)'
                }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc'>
                  {(() => {
                    const stateKey = 'mentor-2-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.mentor_2_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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

              {/* Mentor 3 Explanation */}
              <div
                style={{
                  fontSize: '13px',
                  color: 'grey',
                  transform: 'translateX(10px)'
                }}
                className='explanation-value-desc-cont'
              >
                <h4 className='value-header'>Explanation</h4>
                <div className='value-desc'>
                  {(() => {
                    const stateKey = 'mentor-3-explanation'
                    const isExpanded = showMoreStates[stateKey] || false
                    const content =
                      competitivenessData?.mentor_3_explanation || ''
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
                            lineHeight: '1.4'
                          }}
                        >
                          <div
                            style={{
                              // Add these styles for 2-line truncation with ellipsis
                              display: isExpanded ? 'block' : '-webkit-box',
                              WebkitLineClamp: isExpanded ? 'none' : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: content?.replace(/&nbsp;/g, ' ') || ''
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
        </MainCard>
      ) : (
        <MainCard
          title={'Recognition of Skills'}
          icon={recognitionOfSkillsIcon}
          onClick={canEdit ? openRecognitionModal : () => {}}
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
      {canEdit && editRecognitionMode && (
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
            <div
              style={{ marginTop: '30px' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              List mentors who have recognized your skills and explain their
              feedback.
            </div>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                marginTop: '20px'
              }}
              className='competitiveness-experience-container'
            >
              <div style={{ flex: 1 }}>
                <label className='howdoiproveit-label-text'>Mentor 1:</label>
                <input
                  className='form-control'
                  value={editFormData.mentor_1 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.mentor_1_explanation || ''}
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
                <label className='howdoiproveit-label-text'>Mentor 2:</label>
                <input
                  className='form-control'
                  value={editFormData.mentor_2 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.mentor_2_explanation || ''}
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
                <label className='howdoiproveit-label-text'>Mentor 3:</label>
                <input
                  className='form-control'
                  value={editFormData.mentor_3 || ''}
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
                <label className='howdoiproveit-label-text'>Explanation:</label>
                <ReactQuill
                  value={editFormData.mentor_3_explanation || ''}
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
