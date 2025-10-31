import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const AddLevelModal = ({ show, onHide, onSave, existingLevels = [] }) => {
  const [levels, setLevels] = useState(
    existingLevels.length > 0 
      ? existingLevels.map((level, index) => ({ id: index + 1, title: level, isEditing: false, isNew: false }))
      : [
          { id: 1, title: 'Level 1: Entrepreneurship and You', isEditing: false, isNew: false },
          { id: 2, title: 'Level 2: Understanding Learn to Start', isEditing: false, isNew: false },
          { id: 3, title: 'Level 3: The Journey of Entrepreneurship', isEditing: false, isNew: false }
        ]
  )
  const [hasNewLevel, setHasNewLevel] = useState(false)

  const handleLevelChange = (id, value) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === id ? { ...level, title: value } : level
      )
    )
  }

  const toggleEditing = (id) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === id ? { ...level, isEditing: !level.isEditing } : level
      )
    )
  }

  const addNewLevelAfter = (afterId) => {
    const insertIndex = levels.findIndex(level => level.id === afterId)
    const newId = Math.max(...levels.map(level => level.id), 0) + 1
    
    const newLevel = { 
      id: newId, 
      title: `Level ${insertIndex + 2}: Add Level title...`, 
      isEditing: false,
      isNew: true
    }
    
    const updatedLevels = [
      ...levels.slice(0, insertIndex + 1),
      newLevel,
      ...levels.slice(insertIndex + 1)
    ]

    // Renumber all levels
    const renumberedLevels = updatedLevels.map((level, index) => {
      const levelNumber = index + 1
      const titleWithoutNumber = level.title.replace(/^Level \d+:\s*/, '')
      return {
        ...level,
        title: `Level ${levelNumber}: ${titleWithoutNumber}`
      }
    })

    setLevels(renumberedLevels)
    setHasNewLevel(true)
  }

  const deleteLevel = (id) => {
    if (levels.length > 1) {
      const filteredLevels = levels.filter(level => level.id !== id)
      
      // Renumber remaining levels
      const renumberedLevels = filteredLevels.map((level, index) => {
        const levelNumber = index + 1
        const titleWithoutNumber = level.title.replace(/^Level \d+:\s*/, '')
        return {
          ...level,
          title: `Level ${levelNumber}: ${titleWithoutNumber}`
        }
      })
      
      setLevels(renumberedLevels)
      
      // Check if any new levels remain
      const hasNewLevels = renumberedLevels.some(level => level.isNew)
      setHasNewLevel(hasNewLevels)
    }
  }

  const handleSave = () => {
    const levelTitles = levels.map(level => level.title).filter(title => title.trim() !== '')
    onSave(levelTitles)
    handleClose()
  }

  const handleSaveAndContinue = () => {
    // Mark all levels as not new
    const updatedLevels = levels.map(level => ({ ...level, isNew: false }))
    setLevels(updatedLevels)
    setHasNewLevel(false)
  }

  const handleClose = () => {
    setLevels(
      existingLevels.length > 0 
        ? existingLevels.map((level, index) => ({ id: index + 1, title: level, isEditing: false, isNew: false }))
        : [
            { id: 1, title: 'Level 1: Entrepreneurship and You', isEditing: false, isNew: false },
            { id: 2, title: 'Level 2: Understanding Learn to Start', isEditing: false, isNew: false },
            { id: 3, title: 'Level 3: The Journey of Entrepreneurship', isEditing: false, isNew: false }
          ]
    )
    setHasNewLevel(false)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="add-level-modal">
      <Modal.Body className="add-level-modal-body">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33301 10.0003V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H9.16634" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.66016 15.833H4.16016M6.66016 15.833H4.16016M4.16016 15.833V13.333M4.16016 15.833V18.333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h5 className="modal-title">Add New Level</h5>

        <div className="form-group">
          <label className="form-label">LEVEL TITLE:</label>
          
          <div className="levels-list">
            {levels.map((level) => (
              <div key={level.id}>
                <div className={`level-item ${level.isNew ? 'new-level' : ''}`}>
                  <input
                    type="text"
                    className="form-control level-input"
                    placeholder="Enter level title..."
                    value={level.title}
                    onChange={(e) => handleLevelChange(level.id, e.target.value)}
                    disabled={!level.isEditing}
                  />
                  {level.isNew ? (
                    <button
                      className="edit-level-btn"
                      onClick={() => toggleEditing(level.id)}
                      type="button"
                    >
                      <svg class="edit-pencil" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9696 4.71029L12.9672 3.71266C13.7483 2.93162 15.0146 2.93162 15.7957 3.71266L16.5028 4.41977C17.2838 5.20082 17.2838 6.46715 16.5028 7.2482L15.5052 8.24582M11.9696 4.71029L4.04225 12.6377C3.71017 12.9697 3.50555 13.4081 3.46422 13.8759L3.29065 15.8407C3.23588 16.4607 3.75476 16.9796 4.37477 16.9248L6.33956 16.7512C6.80736 16.7099 7.24571 16.5053 7.57778 16.1732L15.5052 8.24582M11.9696 4.71029L15.5052 8.24582" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    </button>
                  ) : (
                    <button 
                      className="delete-level-btn"
                      onClick={() => deleteLevel(level.id)}
                      type="button"
                      disabled={levels.length === 1}
                    >
                      <svg className="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.5 4.99935H12.8125M2.5 4.99935H7.1875M7.1875 4.99935V3.33268C7.1875 2.41221 7.93369 1.66602 8.85417 1.66602H11.1458C12.0663 1.66602 12.8125 2.41221 12.8125 3.33268V4.99935M7.1875 4.99935H12.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>

                {!hasNewLevel && (
                  <div 
                    className='d-flex justify-content-end gap-2 align-items-center mt-2 mb-3' 
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    onClick={() => addNewLevelAfter(level.id)}
                  >
                    Add New Level Here
                    <svg className="plus" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            CANCEL
          </button>
          {hasNewLevel && (
            <button className="btn-save" onClick={handleSaveAndContinue}>
              SAVE AND CONTINUE
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddLevelModal