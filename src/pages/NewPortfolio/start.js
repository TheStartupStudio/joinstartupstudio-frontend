import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import myValueIcon from '../../assets/images/values-icon.svg'
import start from '../../assets/icons/Start.png'
import passion from '../../assets/images/passion.svg'
import leaf from '../../assets/images/leaf.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import dropdown from '../../assets/images/icons8-dropdown-30.png'
import leaderStar from '../../assets/images/leaderboard-star.svg'
import { Collapse } from 'bootstrap'
import './Portfolio.css'

import StartAlignment from './startAlignment'
import StartProd from './startProd'
import StartCompetitiveness from './startcompetitiveness'

function Start(props) {
  const isPublicView = props.isPublicView || props.portfolioType === 'public'

  const userData = useSelector((state) => state.user.user)
  const loggedInUserId = userData?.user?.id

  const isOwner =
    loggedInUserId && props?.userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView && !props.isPreviewMode && isOwner

  const [selectedSection, setSelectedSection] = useState({
    value: 'alignment',
    label: 'Alignment'
  })
  const userRole = useSelector((state) => state.user?.user?.role)

  const options = [
    { value: 'alignment', label: 'Alignment' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'competitiveness', label: 'Competitiveness' }
  ]

  const description = {
    alignment:
      "Alignment is defined by confidence in one's abilities, interests and passions in the world, always rooted in the power of Story, Failure, Relationships, and Mentorship",
    productivity:
      "Productivity is defined by usefulness as a result of one's ability to Learn, Build, and Brand regardless of what one is seeking to solve.",
    competitiveness:
      "Competitiveness is defined by being unafraid of risk, relying on one's proof of skills, experience, and network to serve oneself and others."
  }

  const handleChange = (selectedOption) => {
    setSelectedSection(selectedOption)
  }

  const renderSelectedComponent = () => {
    switch (selectedSection?.value) {
      case 'alignment':
        return (
          <StartAlignment
            isPublicView={isPublicView}
            portfolioType={props.portfolioType}
            userBasicInfo={props.userBasicInfo}
            canEdit={canEdit}
            alignmentData={props.alignmentData}
            isPreviewMode={props.isPreviewMode} // Add this
          />
        )
      case 'productivity':
        return (
          <StartProd
            isPublicView={isPublicView}
            portfolioType={props.portfolioType}
            userBasicInfo={props.userBasicInfo}
            canEdit={canEdit}
            productivityData={props.productivityData}
            isPreviewMode={props.isPreviewMode} // Add this
          />
        )
      case 'competitiveness':
        return (
          <StartCompetitiveness
            isPublicView={isPublicView}
            portfolioType={props.portfolioType}
            userBasicInfo={props.userBasicInfo}
            canEdit={canEdit}
            competitivenessData={props.competitivenessData}
            isPreviewMode={props.isPreviewMode} // Add this
          />
        )
      default:
        return (
          <StartAlignment
            isPublicView={isPublicView}
            portfolioType={props.portfolioType}
            userBasicInfo={props.userBasicInfo}
            canEdit={canEdit}
            alignmentData={props.alignmentData}
            isPreviewMode={props.isPreviewMode} // Add this
          />
        )
    }
  }

  return (
    <div>
      <div
        className={`section-description-container d-flex justify-content-between start-section-description-container${
          props.hideSectionHeader ? ' start-section-header-compact' : ''
        }`}
      >
        {!props.hideSectionHeader && (
          <div
            className={`portf-section-maintitle ${
              userRole === 'instructor' || userRole === 'admin'
                ? `instructor-start-portfolio-container`
                : `student-start-portfolio-container`
            }`}
          >
            <div className='pe-2'>
              <img
                src={start}
                alt='Start'
                style={{ width: '72px', height: '70px' }}
              />
            </div>
            <div>
              <div className='align-items-center portfolio-section-title'>
                <div className='section-title' style={{ fontSize: '20px' }}>
                  Start: {selectedSection?.label}
                </div>
              </div>
              <div
                className='section-description'
                dangerouslySetInnerHTML={{
                  __html: description[selectedSection.value]
                }}
              />
            </div>
          </div>
        )}
        {/* Dropdown Trigger */}
        <div
          style={{
            display: 'inline-block',
            borderRadius: '8px',
            background: 'linear-gradient(to bottom, #EE3C96 0%, #52C7D3 100%)',
            padding: '1px',
            boxShadow: '0px 4px 10px 0px #00000040',
            marginBottom: '20px',
            marginLeft: props.hideSectionHeader ? 'auto' : undefined
          }}
        >
          <Select
            options={options}
            value={selectedSection}
            onChange={handleChange}
            placeholder='SELECT SECTION TO VIEW'
            menuPortalTarget={document.body}
            isSearchable={false}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (base, state) => ({
                ...base,
                width: '270px',
                minHeight: '40px',
                overflow: 'hidden',
                border: 'none',
                borderRadius: '6px',
                boxShadow: state.isFocused ? 'none' : base.boxShadow,
                borderColor: state.isFocused ? 'transparent' : base.borderColor,
                cursor: 'pointer'
              }),
              singleValue: (base) => ({
                ...base,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: 'inherit'
              }),
              placeholder: (base) => ({
                ...base,
                color: '#000',
                fontWeight: 600,
                fontSize: '14px'
              }),
              option: (base) => ({
                ...base,
                backgroundColor: 'transparent !important',
                ':hover': { backgroundColor: 'lightblue !important' },
                color: '#000'
              })
            }}
            components={{
              IndicatorSeparator: () => null
            }}
          />
        </div>
      </div>
      {renderSelectedComponent()}
    </div>
  )
}

export default Start
