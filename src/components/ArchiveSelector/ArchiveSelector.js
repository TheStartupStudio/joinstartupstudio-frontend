import { FormattedMessage } from 'react-intl'
import React, { useEffect, useState } from 'react'
import './ArchiveSelector.css'
import moment from 'moment'

const ArchiveSelector = (props) => {
  const [archives, setArchives] = useState(props.archives)
  const [selectArchive, setSelectArchive] = useState({})
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedArchives, setSelectedArchives] = useState([])
  const [selectedValue, setSelectedValue] = useState('')

  useEffect(() => {
    props.handleSelectedArchive(selectArchive)
  }, [selectArchive])

  useEffect(() => {
    const foundedArchiveIndex = archives?.findIndex(
      (a) => a.id === props.selectedArchive?.id
    )
    const selectedValue = `${archiveOptionTitle()} ${foundedArchiveIndex + 1}`
    const selectArchive = `Select ${archiveOptionTitle()} `
    setSelectedValue(foundedArchiveIndex > -1 ? selectedValue : selectArchive)
  }, [props.selectedArchive, archives])

  const handleChangeArchive = (value) => {
    setSelectArchive(value)
  }
  const archiveOptionTitle = () => {
    if (props?.archiveTitle === 'teamMeeting') {
      return 'Meeting'
    } else if (props?.archiveTitle === 'feedback') {
      return 'Feedback'
    } else if (props?.archiveTitle === 'mentorMeeting') {
      return 'Mentor'
    }
  }
  const handleSelectArchive = (archive) => {
    const foundedArchiveIndex = archives?.findIndex((a) => a.id === archive.id)
    const value = `${archiveOptionTitle()} ${foundedArchiveIndex + 1}`
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
    <div className='col-md-12'>
      <div className='custom-dropdown'>
        <div
          className='selected-option'
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {selectArchive ? selectedValue : 'Select an option'}
        </div>
        {dropdownOpen && (
          <div className='options'>
            {archives?.map((archive, index) => (
              <div
                onClick={() => handleSelectArchive(archive)}
                key={archive.id}
                className='option w-100 bg-white'
              >
                <input
                  type='checkbox'
                  checked={archive.id === props.selectedArchive.id}
                  onChange={() => handleCheckboxChange(archive.title)}
                />
                <div className={'d-flex flex-column'}>
                  <div>
                    {archiveOptionTitle()} {index + 1}
                  </div>
                  <div>
                    Date:
                    {archive.updatedAt
                      ? moment(archive.updatedAt).format('DD-MM-YYYY')
                      : moment(archive.createdAt).format('DD-MM-YYYY')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default ArchiveSelector
