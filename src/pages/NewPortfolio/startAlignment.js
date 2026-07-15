import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
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
import nothingAdded from '../../assets/images/nothing-added.svg'

function StartAlignment(props) {
  const isPublicView = props.isPublicView || props.portfolioType === 'public'

  const userData = useSelector((state) => state.user.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner

  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [showMorePassion, setShowMorePassion] = useState(false)
  const [showMoreSuccess, setShowMoreSuccess] = useState(false)
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
  const [editableAlignmentData, setEditableAlignmentData] = useState({
    ...alignmentData
  })
  const [editValuesMode, setEditValuesMode] = useState(false)
  const [editPassionMode, setEditPassionMode] = useState(false)
  const [editWorkCultureMode, setEditWorkCultureMode] = useState(false)
  const [editSuccessMode, setEditSuccessMode] = useState(false)

  const accordionRefs = useRef([])

  const [showMoreStates, setShowMoreStates] = useState({})

  useEffect(() => {
    const fetchAlignmentData = async () => {
      try {
        setIsLoading(true)

        if (
          props.alignmentData &&
          Object.keys(props.alignmentData).length > 0
        ) {
          setAlignmentData(props.alignmentData)
          setEditableAlignmentData(props.alignmentData)
        } else {
          try {
            if (!isOwner) {
              setIsLoading(false)
              return
            }
            const response = await axiosInstance.get(
              '/hsPortfolio/user-start-alignment'
            )
            console.log('API Response:', response)

            const data =
              response.data && response.data.length > 0
                ? response.data[0]
                : {
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
                    definition_of_success: ''
                  }

            setAlignmentData(data)
            setEditableAlignmentData(data)
          } catch (apiError) {
            console.warn(
              'API call failed, using empty data structure:',
              apiError.message
            )

            const emptyData = {
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
              definition_of_success: ''
            }

            setAlignmentData(emptyData)
            setEditableAlignmentData(emptyData)
          }
        }
      } catch (err) {
        console.error('Error in fetchAlignmentData:', err)
        const emptyData = {
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
          definition_of_success: ''
        }

        setAlignmentData(emptyData)
        setEditableAlignmentData(emptyData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlignmentData()
  }, [props.alignmentData])

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
    if (!canEdit) return
    setEditableAlignmentData({ ...alignmentData })
    setEditValuesMode(true)
  }

  const handlePassionCardClick = () => {
    if (!canEdit) return
    setEditableAlignmentData({ ...alignmentData })
    setEditPassionMode(true)
  }

  const handleWorkCultureCardClick = () => {
    if (!canEdit) return
    setEditableAlignmentData({ ...alignmentData })
    setEditWorkCultureMode(true)
  }

  const handleSuccessCardClick = () => {
    if (!canEdit) return
    setEditableAlignmentData({ ...alignmentData })
    setEditSuccessMode(true)
  }

  const handleValuesFormChange = (field, value) => {
    setEditableAlignmentData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFormChange = (field, content) => {
    setEditableAlignmentData((prev) => ({
      ...prev,
      [field]: content
    }))
  }

  const handleSaveValues = async () => {
    try {
      setIsLoading(true)
      const payload = {
        value_1: editableAlignmentData.value_1,
        value_2: editableAlignmentData.value_2,
        value_3: editableAlignmentData.value_3,
        value_1_explanation: editableAlignmentData.value_1_explanation,
        value_2_explanation: editableAlignmentData.value_2_explanation,
        value_3_explanation: editableAlignmentData.value_3_explanation
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

      const updatedData = response.data
      setAlignmentData((prev) => ({
        ...prev,
        ...updatedData
      }))
      setEditableAlignmentData((prev) => ({
        ...prev,
        ...updatedData
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
        passion: editableAlignmentData.passion,
        connected_interest_1: editableAlignmentData.connected_interest_1,
        connected_interest_2: editableAlignmentData.connected_interest_2,
        explanation: editableAlignmentData.explanation
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

      const updatedData = response.data
      setAlignmentData((prev) => ({
        ...prev,
        ...updatedData
      }))
      setEditableAlignmentData((prev) => ({
        ...prev,
        ...updatedData
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
        leadership: editableAlignmentData.leadership,
        collaboration: editableAlignmentData.collaboration,
        feedback: editableAlignmentData.feedback,
        opportunities: editableAlignmentData.opportunities,
        environment: editableAlignmentData.environment
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

      const updatedData = response.data
      setAlignmentData((prev) => ({
        ...prev,
        ...updatedData
      }))
      setEditableAlignmentData((prev) => ({
        ...prev,
        ...updatedData
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
        definition_of_success: editableAlignmentData.definition_of_success
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

      const updatedData = response.data
      setAlignmentData((prev) => ({
        ...prev,
        ...updatedData
      }))
      setEditableAlignmentData((prev) => ({
        ...prev,
        ...updatedData
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

  const hasValuesData =
    alignmentData?.value_1 ||
    alignmentData?.value_2 ||
    alignmentData?.value_3 ||
    hasContentBesidesTags(alignmentData?.value_1_explanation) ||
    hasContentBesidesTags(alignmentData?.value_2_explanation) ||
    hasContentBesidesTags(alignmentData?.value_3_explanation)

  const hasPassionData =
    alignmentData?.passion ||
    alignmentData?.connected_interest_1 ||
    alignmentData?.connected_interest_2 ||
    hasContentBesidesTags(alignmentData?.explanation)

  const hasWorkCultureData =
    hasContentBesidesTags(alignmentData?.leadership) ||
    hasContentBesidesTags(alignmentData?.collaboration) ||
    hasContentBesidesTags(alignmentData?.feedback) ||
    hasContentBesidesTags(alignmentData?.opportunities) ||
    hasContentBesidesTags(alignmentData?.environment)

  const hasSuccessData = hasContentBesidesTags(
    alignmentData?.definition_of_success
  )

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
      {/* Values Card */}
      {hasValuesData ? (
        <MainCard
          title={'Value'}
          icon={myValueIcon}
          onClick={canEdit ? handleValuesCardClick : () => {}}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                alignItems: 'start',
                wordBreak: 'break-word'
              }}
            >
              {[1, 2, 3].map((num) => {
                const value = alignmentData[`value_${num}`]
                const explanation =
                  alignmentData[`value_${num}_explanation`] || ''

                if (!value) return null

                const stateKey = `value-${num}`
                const isExpanded = showMoreStates[stateKey] || false
                const content = explanation.replace(/<[^>]*>/g, '') || ''
                const isLong = content.length > 150

                return (
                  <div key={num} style={{ fontSize: '13px', color: 'grey' }}>
                    <h4 className='value-header'>{`VALUE ${num}:`}</h4>
                    <h5 className='value-subheader'>{value}</h5>
                    <div
                      style={{
                        maxWidth: '100%',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      className='value-desc'
                    >
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
                            __html: isExpanded
                              ? explanation?.replace(/&nbsp;/g, ' ') || ''
                              : explanation?.replace(/&nbsp;/g, ' ') || ''
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
                  </div>
                )
              })}
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Values'}
          icon={myValueIcon}
          onClick={canEdit ? handleValuesCardClick : () => {}}
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
      {canEdit && editValuesMode && (
        <EditCard
          title={hasValuesData ? 'Edit Values' : 'Add Values'}
          icon={myValueIcon}
          handleSubmit={handleSaveValues}
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
              className='start-value-container-resp'
            >
              {/* Value 1 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '30%'
                }}
                className='start-value-inputs-resp'
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label className='howdoiproveit-label-text'>Value 1:</label>
                  <input
                    className='form-control'
                    value={editableAlignmentData.value_1 || ''}
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
                  <label className='howdoiproveit-label-text'>
                    Explanation:
                  </label>
                  <ReactQuill
                    value={editableAlignmentData.value_1_explanation || ''}
                    placeholder='Add explanation here'
                    onChange={(content) =>
                      handleValuesFormChange('value_1_explanation', content)
                    }
                    style={{
                      height: '300px',
                      borderRadius: '15px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden'
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
                className='start-value-inputs-resp'
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label className='howdoiproveit-label-text'>Value 2:</label>
                  <input
                    className='form-control'
                    value={editableAlignmentData.value_2 || ''}
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
                  <label className='howdoiproveit-label-text'>
                    Explanation:
                  </label>
                  <ReactQuill
                    value={editableAlignmentData.value_2_explanation || ''}
                    placeholder='Add explanation here'
                    onChange={(content) =>
                      handleValuesFormChange('value_2_explanation', content)
                    }
                    style={{
                      height: '300px',
                      borderRadius: '15px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden'
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
                className='start-value-inputs-resp'
              >
                <div style={{ position: 'relative' }} className='mt-4'>
                  <label className='howdoiproveit-label-text'>Value 3:</label>
                  <input
                    className='form-control'
                    value={editableAlignmentData.value_3 || ''}
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
                  <label className='howdoiproveit-label-text'>
                    Explanation:
                  </label>
                  <ReactQuill
                    value={editableAlignmentData.value_3_explanation || ''}
                    placeholder='Add explanation here'
                    onChange={(content) =>
                      handleValuesFormChange('value_3_explanation', content)
                    }
                    style={{
                      height: '300px',
                      borderRadius: '15px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden'
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
          onClick={canEdit ? handlePassionCardClick : () => {}}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div
              className='d-grid gap-3 value-container-grid-resp'
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
              <div
                className='value-desc'
                style={{
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {(() => {
                  const stateKey = 'passion-explanation'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = alignmentData?.explanation || ''
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
        </MainCard>
      ) : (
        <MainCard
          title={'Passion'}
          icon={passion}
          onClick={canEdit ? handlePassionCardClick : () => {}}
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
      {canEdit && editPassionMode && (
        <EditCard
          title={hasPassionData ? 'Edit Passion' : 'Add Passion'}
          icon={passion}
          handleSubmit={handleSavePassion}
          toggle={handleCancelEdit}
          modalDialogClassName={'start-passion-modal-dialog'}
        >
          <div>
            <div
              style={{
                marginTop: '30px',
                color: '#000',
                fontFamily: 'Montserrat',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Identify your primary passion and 2 of your interests that connect
              to it. Together, your passion and interests communicate the type
              of work you want to do. Once you have identified your passion and
              interests, explain what they mean to you as a professional.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginTop: '15px'
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
                className='passion-inputs-container'
              >
                <div style={{ width: '35%' }} className='passion-input-resp'>
                  <label className='passion-title-label'>Passion:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className='form-control passion-input'
                      placeholder='Add passion here...'
                      value={editableAlignmentData.passion || ''}
                      onChange={(e) =>
                        handleValuesFormChange('passion', e.target.value)
                      }
                      style={{
                        border: 'none',
                        width: '100%',
                        fontSize: '0.875rem',
                        color: 'black',
                        background: 'transparent',
                        boxShadow: '0px 3px 14px #00000029',
                        paddingRight: '40px'
                      }}
                    />
                    <img
                      src={EditPencil}
                      alt='Edit'
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: '50%' }} className='passion-input-resp'>
                  <label className='passion-title-label'>
                    Connected Interest 1:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className='form-control passion-input'
                      placeholder='Add connected interest here...'
                      value={editableAlignmentData.connected_interest_1 || ''}
                      onChange={(e) =>
                        handleValuesFormChange(
                          'connected_interest_1',
                          e.target.value
                        )
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
                    <img
                      src={EditPencil}
                      alt='Edit'
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ width: '50%' }} className='passion-input-resp'>
                  <label className='passion-title-label'>
                    Connected Interest 2:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className='form-control passion-input'
                      placeholder='Add connected interest here...'
                      value={editableAlignmentData.connected_interest_2 || ''}
                      onChange={(e) =>
                        handleValuesFormChange(
                          'connected_interest_2',
                          e.target.value
                        )
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
                    <img
                      src={EditPencil}
                      alt='Edit'
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className='passion-title-label'>Explanation:</label>
                <ReactQuill
                  value={editableAlignmentData?.explanation || ''}
                  onChange={(content) =>
                    handleValuesFormChange('explanation', content)
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
          onClick={canEdit ? handleWorkCultureCardClick : () => {}}
          canEdit={canEdit}
        >
          <h5 className='value-subheader seeking-title-acordioncard'>
            What I Am Seeking:
          </h5>
          <div className='accordion' id='progressAccordion'>
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
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  ref={(el) => (accordionRefs.current[index] = el)}
                  className='accordion-collapse collapse'
                  aria-labelledby={`heading${index}`}
                  data-bs-parent='#progressAccordion'
                >
                  <div
                    className='text-black ml-2 accordion-full-box'
                    style={{
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      margin: '0 10px 15px 0'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.answer || '' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MainCard>
      ) : (
        <MainCard
          title={'Work Culture'}
          icon={leaf}
          onClick={canEdit ? handleWorkCultureCardClick : () => {}}
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
      {canEdit && editWorkCultureMode && (
        <EditCard
          title={hasWorkCultureData ? 'Edit Work Culture' : 'Add Work Culture'}
          icon={leaf}
          handleSubmit={handleSaveWorkCulture}
          toggle={() => setEditWorkCultureMode(false)}
        >
          <div>
            <div
              style={{ marginTop: '30px', fontWeight: '500' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              For each of the 5 categories of work culture, you must explain the
              type of each you are seeking in your profession. What type of
              leadership do you respond to? What type of collaboration do you
              want to participate in? What type of feedback do you want to
              receive? What type of opportunities do you want to have access to?
              What type of environment do you want to work in?
            </div>
            <div
              style={{ marginTop: '30px', fontWeight: '500' }}
              className='howdoiproveit-label-text'
            >
              What I Am Seeking:
            </div>
            <div className='accordion mt-1' id='workCultureAccordion'>
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
                          value={editableAlignmentData[item.field] || ''}
                          onChange={(content) =>
                            handleFormChange(item.field, content)
                          }
                          style={{
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px',
                            borderRadius: '15px',
                            height: 'auto',
                            minHeight: '150px'
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
          onClick={canEdit ? handleSuccessCardClick : () => {}}
          canEdit={canEdit}
        >
          <div style={{ position: 'relative' }}>
            <div className='mt-3' style={{ fontSize: '13px', color: 'grey' }}>
              <h5 className='value-subheader seeking-title-acordioncard'>
                Definition of Success:
              </h5>
              <div className='success-desc-text'>
                {(() => {
                  const stateKey = 'success-definition'
                  const isExpanded = showMoreStates[stateKey] || false
                  const content = alignmentData?.definition_of_success || ''
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
        </MainCard>
      ) : (
        <MainCard
          title={'Success'}
          icon={leaderStar}
          onClick={canEdit ? handleSuccessCardClick : () => {}}
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
      {canEdit && editSuccessMode && (
        <EditCard
          title={
            hasSuccessData
              ? 'Edit Success Definition'
              : 'Add Success Definition'
          }
          icon={leaderStar}
          handleSubmit={handleSaveSuccess}
          toggle={() => setEditSuccessMode(false)}
        >
          <div>
            <div
              style={{ marginTop: '30px', fontWeight: '600' }}
              className='howdoiproveit-label-text'
            >
              Instructions:
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
              Explain your individual definition of success. How do you define
              yourself and how do you measure it for yourself?
            </div>
            <div className='mt-4'>
              <label className='howdoiproveit-label-text'>
                Definition of Success:
              </label>
              <ReactQuill
                value={editableAlignmentData.definition_of_success || ''}
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
