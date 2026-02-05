import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'

const AssignTasksModal = ({
  show,
  onHide,
  onSave,
  type = 'content',
  levels = []
}) => {
  const [taskAssignments, setTaskAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUnassignedJournals = async () => {
    try {
      setLoading(true)
      setError(null)

      let endpoint = ''
      if (type === 'content') {
        endpoint = '/LtsJournals/entrepreneurship/unassigned-journals'
      } else if (type === 'masterclass') {
        endpoint = '/contents/master-class/unassigned-content'
      } else {
        // For dynamic categories, use the new generic endpoint
        endpoint = `/LtsJournals/unassigned-journals-by-category?category=${type}`
      }

      const response = await axiosInstance.get(endpoint)

      let journalsData = []
      if (type === 'masterclass') {
        journalsData = response.data.data
      } else {
        journalsData = response.data
      }

      const assignments = journalsData.map(journal => ({
        id: journal.id,
        title: journal.title,
        selectedLevel: '',
        journalData: journal
      }))

      setTaskAssignments(assignments)
    } catch (err) {
      console.error('Error fetching unassigned journals:', err)
      setError('Failed to load unassigned journals')
      setTaskAssignments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      fetchUnassignedJournals()
    }
  }, [show, type])

  const handleLevelChange = (journalId, levelId) => {
    setTaskAssignments(prevAssignments =>
      prevAssignments.map(assignment =>
        assignment.id === journalId ? { ...assignment, selectedLevel: levelId } : assignment
      )
    )
  }

  const handleDelete = async (contentId) => {
    try {
      const endpoint = type === 'masterclass'
        ? `/contents/${contentId}`
        : `/LtsJournals/${contentId}/delete-with-content`

      await axiosInstance.delete(endpoint)

      setTaskAssignments(prevAssignments =>
        prevAssignments.filter(assignment => assignment.id !== contentId)
      )

      console.log(`${type} content ${contentId} deleted successfully`)

    } catch (error) {
      console.error(`Error deleting ${type} content:`, error)
      alert(`Failed to delete ${type} content. Please try again.`)
    }
  }

  const handleSaveAndClose = () => {
    const assignments = taskAssignments
      .filter(assignment => assignment.selectedLevel !== '')
      .map(assignment => ({
        contentId: assignment.id,
        journalId: assignment.id,
        levelId: assignment.selectedLevel
      }))

    onSave(assignments)
    handleClose()
  }

  const handleClose = () => {
    setTaskAssignments([])
    setError(null)
    onHide()
  }

  const getCategoryDisplayName = () => {
    const categoryNames = {
      'content': 'Content',
      'masterclass': 'Studio Guidance',
      'Leadership Journal': 'Leadership Journal',
      'test ground': 'Test Ground'
    }
    return categoryNames[type] || type.charAt(0).toUpperCase() + type.slice(1)
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

        <h5 className="modal-title">
          Assign {getCategoryDisplayName()} Journal to Levels
        </h5>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading unassigned journals...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="form-group">
            <label className="form-label">
              UNASSIGNED {getCategoryDisplayName().toUpperCase()} JOURNALS
            </label>

            {taskAssignments.length === 0 ? (
              <div className="text-center py-4">
                <p>No unassigned journals found.</p>
              </div>
            ) : (
              <div className="tasks-list">
                {taskAssignments.map((journal) => (
                  <div key={journal.id} className="task-item">
                    <span className="task-title">{journal.title}</span>

                    <div className="task-actions">
                      <select
                        className="level-select"
                        value={journal.selectedLevel}
                        onChange={(e) => handleLevelChange(journal.id, e.target.value)}
                      >
                        <option value="">Select level</option>
                        {levels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                    className="delete-task-btn"
                    onClick={() => handleDelete(journal.id)}
                    type="button"
                  >
                    <svg className="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.5 4.99935H12.8125M2.5 4.99935H7.1875M7.1875 4.99935V3.33268C7.1875 2.41221 7.93369 1.66602 8.85417 1.66602H11.1458C12.0663 1.66602 12.8125 2.41221 12.8125 3.33268V4.99935M7.1875 4.99935H12.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && (
          <div className="modal-actions">
            <button className="btn-cancel" onClick={handleClose}>
              CANCEL
            </button>
            <button
              className="btn-save"
              onClick={handleSaveAndClose}
              disabled={taskAssignments.filter(a => a.selectedLevel !== '').length === 0}
            >
              SAVE AND CLOSE
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default AssignTasksModal