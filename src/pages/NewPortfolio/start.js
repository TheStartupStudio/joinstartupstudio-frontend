import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import myValueIcon from '../../assets/images/values-icon.svg'
import start from '../../assets/images/start.png'
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
  const [selectedSection, setSelectedSection] = useState({
    value: 'alignment',
    label: 'Alignment'
  })

  // ... (keep all other existing state and ref declarations)

  const options = [
    { value: 'alignment', label: 'Alignment' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'competitiveness', label: 'Competitiveness' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedSection(selectedOption)
  }

  // Render the selected component based on the selectedSection value
  const renderSelectedComponent = () => {
    switch (selectedSection?.value) {
      case 'alignment':
        return <StartAlignment />
      case 'productivity':
        return <StartProd />
      case 'competitiveness':
        return <StartCompetitiveness />
      default:
        // Fallback to Alignment if somehow no selection exists
        return <StartAlignment />
    }
  }
  return (
    <div>
      <div className='section-description-container d-flex justify-content-between'>
        <div className='portf-section-maintitle'>
          <div className='pe-2'>
            <img src={start} alt='Start' />
          </div>
          <div>
            <div className='align-items-center portfolio-section-title'>
              <div className='section-title' style={{ fontSize: '20px' }}>
                Start:{selectedSection?.label}
              </div>
            </div>
            <div
              className='section-description'
              dangerouslySetInnerHTML={{ __html: props?.sectionDescription }}
            />
          </div>
        </div>
        {/* Dropdown Trigger */}
        <div
          style={{
            display: 'inline-block',
            borderRadius: '8px',
            background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
            padding: '1px', // Adjust this value to control border thickness
            boxShadow: '0px 4px 10px 0px #00000040'
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
                color: 'inherit' // Keeps the indicator color unchanged
              }),
              placeholder: (base) => ({
                ...base,
                color: '#000', // Example color
                fontWeight: 600,
                fontSize: '14px'
              })
            }}
            components={{
              IndicatorSeparator: () => null // Remove separator
            }}
          />
        </div>
      </div>
      {renderSelectedComponent()}
    </div>
  )
}

export default Start
