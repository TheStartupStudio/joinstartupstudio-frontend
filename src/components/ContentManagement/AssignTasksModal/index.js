import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'

const AssignTasksModal = ({ show, onHide, onSave, tasks = [] }) => {
  const [taskAssignments, setTaskAssignments] = useState(
    tasks.map(task => ({
      id: task.id,
      title: task.title,
      selectedLevel: ''
    }))
  )

  const handleLevelChange = (taskId, level) => {
    setTaskAssignments(prevAssignments =>
      prevAssignments.map(assignment =>
        assignment.id === taskId ? { ...assignment, selectedLevel: level } : assignment
      )
    )
  }

  const handleDelete = (taskId) => {
    setTaskAssignments(prevAssignments =>
      prevAssignments.filter(assignment => assignment.id !== taskId)
    )
  }

  const handleSaveAndClose = () => {
    const assignments = taskAssignments
      .filter(assignment => assignment.selectedLevel !== '')
      .map(assignment => ({
        taskId: assignment.id,
        level: assignment.selectedLevel
      }))
    
    onSave(assignments)
    handleClose()
  }

  const handleClose = () => {
    setTaskAssignments(
      tasks.map(task => ({
        id: task.id,
        title: task.title,
        selectedLevel: ''
      }))
    )
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="assign-tasks-modal">
      <Modal.Body className="assign-tasks-modal-body">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33301 10.0003V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H9.16634" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.66016 15.833H4.16016M6.66016 15.833H4.16016M4.16016 15.833V13.333M4.16016 15.833V18.333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h5 className="modal-title">View & Assign Uncategorized Tasks</h5>

        <div className="form-group">
          <label className="form-label">TASKS TO ASSIGN</label>
          
          <div className="tasks-list">
            {taskAssignments.map((task) => (
              <div key={task.id} className="task-item">
                <span className="task-title">{task.title}</span>
                
                <div className="task-actions">
                  <select
                    className="level-select"
                    value={task.selectedLevel}
                    onChange={(e) => handleLevelChange(task.id, e.target.value)}
                  >
                    <option value="">Select new level</option>
                    <option value="level-1">Level 1</option>
                    <option value="level-2">Level 2</option>
                    <option value="level-3">Level 3</option>
                    <option value="level-4">Level 4</option>
                  </select>

                  <button
                    className="delete-task-btn"
                    onClick={() => handleDelete(task.id)}
                    type="button"
                  >
                    <svg className="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.5 4.99935H12.8125M2.5 4.99935H7.1875M7.1875 4.99935V3.33268C7.1875 2.41221 7.93369 1.66602 8.85417 1.66602H11.1458C12.0663 1.66602 12.8125 2.41221 12.8125 3.33268V4.99935M7.1875 4.99935H12.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            CANCEL
          </button>
          <button className="btn-save" onClick={handleSaveAndClose}>
            SAVE AND CLOSE
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AssignTasksModal