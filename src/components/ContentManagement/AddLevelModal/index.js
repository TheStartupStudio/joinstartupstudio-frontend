import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import './index.css'

const AddLevelModal = ({ show, onHide, onSave, existingLevels = [] }) => {
  const [levels, setLevels] = useState(
    existingLevels.length > 0 
      ? existingLevels.map((level, index) => ({ id: index + 1, title: level }))
      : [
          { id: 1, title: 'Level 1: Entrepreneurship and You' },
          { id: 2, title: 'Level 2: Understanding Learn to Start' },
          { id: 3, title: 'Level 3: The Journey of Entrepreneurship' }
        ]
  )

  const handleLevelChange = (id, value) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === id ? { ...level, title: value } : level
      )
    )
  }

  const addNewLevel = () => {
    const newId = Math.max(...levels.map(level => level.id), 0) + 1
    setLevels([...levels, { id: newId, title: '' }])
  }

  const deleteLevel = (id) => {
    if (levels.length > 1) {
      setLevels(levels.filter(level => level.id !== id))
    }
  }

  const handleSave = () => {
    const levelTitles = levels.map(level => level.title).filter(title => title.trim() !== '')
    onSave(levelTitles)
    handleClose()
  }

  const handleClose = () => {
    setLevels(
      existingLevels.length > 0 
        ? existingLevels.map((level, index) => ({ id: index + 1, title: level }))
        : [
            { id: 1, title: 'Level 1: Entrepreneurship and You' },
            { id: 2, title: 'Level 2: Understanding Learn to Start' },
            { id: 3, title: 'Level 3: The Journey of Entrepreneurship' }
          ]
    )
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
              <div key={level.id} className="level-item">
                <input
                  type="text"
                  className="form-control level-input"
                  placeholder="Enter level title..."
                  value={level.title}
                  onChange={(e) => handleLevelChange(level.id, e.target.value)}
                />
                <button 
                  className="delete-level-btn"
                  onClick={() => deleteLevel(level.id)}
                  type="button"
                  disabled={levels.length === 1}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            className="add-new-level-btn"
            onClick={addNewLevel}
          >
            <span>Add New Level Here</span>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            CANCEL
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddLevelModal