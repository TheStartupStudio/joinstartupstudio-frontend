import { useState } from 'react'
import Select from 'react-select'

function SelectLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  return (
    <div
      style={{
        display: 'inline-block',
        borderRadius: '8px',
        background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
        padding: '1px', // Adjust this value to control border thickness
        height: '58px',
        boxShadow: '0px 4px 10px 0px #00000040'
      }}
    >
      <Select
        options={options}
        value={selectedLanguage}
        onChange={handleChange}
        placeholder='Select Language'
        menuPortalTarget={document.body}
        isSearchable={false}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base, state) => ({
            ...base,
            width: '240px',
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
          })
        }}
        components={{
          IndicatorSeparator: () => null // Remove separator
        }}
      />
    </div>
  )
}

export default SelectLanguage
