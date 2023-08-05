import { FormattedMessage } from 'react-intl'
import React, { useEffect, useState } from 'react'
import './ArchiveSelector.css'

const ArchiveSelector = (props) => {
  const [archives, setArchives] = useState(props.archives)
  const [selectArchive, setSelectArchive] = useState({})
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({}) // State variable to hold selected checkboxes
  const [dropdownOpen, setDropdownOpen] = useState(false) // State variable to control the dropdown visibility
  const [selectedArchives, setSelectedArchives] = useState([])
  const [selectedValue, setSelectedValue] = useState('')

  useEffect(() => {
    props.handleSelectedArchive(selectArchive)
  }, [selectArchive])

  useEffect(() => {
    const foundedArchiveIndex = archives.findIndex(
      (a) => a.id === props.selectedArchive.id
    )
    const value = `Mentor ${foundedArchiveIndex + 1}`
    setSelectedValue(value)
  }, [props.selectedArchive])
  const handleChangeArchive = (value) => {
    setSelectArchive(value)
  }
  const handleSelectArchive = (archive) => {
    const foundedArchiveIndex = archives.findIndex((a) => a.id === archive.id)
    const value = `Mentor ${foundedArchiveIndex + 1}`
    setSelectedValue(value)
    setSelectArchive(archive)
  }
  const handleCheckboxChange = (archive) => {
    setSelectedArchives((prevSelectedArchives) => {
      if (prevSelectedArchives.includes(archive)) {
        return prevSelectedArchives.filter((item) => item !== archive)
      } else {
        return [...prevSelectedArchives, archive]
      }
    })
  }

  useEffect(() => {
    setArchives(props.archives)
  }, [props.archives])

  return (
    <div className="col-md-12">
      <div className="custom-dropdown">
        <div
          className="selected-option"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {selectArchive ? selectedValue : 'Select an option'}
        </div>
        {dropdownOpen && (
          <div className="options">
            {archives.map((archive, index) => (
              <div
                onClick={() => handleSelectArchive(archive)}
                key={archive.id}
                className="option w-100 bg-white"
              >
                <input
                  type="checkbox"
                  checked={selectedArchives.includes(archive.title)}
                  onChange={() => handleCheckboxChange(archive.title)}
                />
                {archive.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default ArchiveSelector
