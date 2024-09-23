import React, { useEffect, useState } from 'react'
import './style.css'
import axiosInstance from '../../../utils/AxiosInstance'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import {
  FaPencilAlt,
  FaCheck,
  FaEye,
  FaTrashAlt,
  FaBackspace
} from 'react-icons/fa'

const AddImmersionModal = ({ viewExprience, onClose }) => {
  const [status, setStatus] = useState(viewExprience?.status === 'Active')
  const [companyName, setCompanyName] = useState(
    viewExprience?.company_name || ''
  )
  const [editingImmersion, setEditingImmersion] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false) // New state for delete confirmation
  const [companyDescription, setCompanyDescription] = useState(
    viewExprience?.company_description || ''
  )
  const [industry, setIndustry] = useState(viewExprience?.industry || '')
  const [industryProblem, setIndustryProblem] = useState(
    viewExprience?.industry_problem || ''
  )
  const [researchGuidance, setResearchGuidance] = useState(
    viewExprience?.research_guidance || ''
  )

  const toggleEditing = () => setEditingImmersion(!editingImmersion)

  const handleStatusChange = () => setStatus(!status)

  const handleSubmit = async () => {
    const formData = {
      status: status ? 'Active' : 'Inactive',
      companyName,
      companyDescription,
      industry,
      industryProblem,
      researchGuidance,
      step: 4
    }

    try {
      if (viewExprience) {
        await axiosInstance.put(
          `/immersion/immersionsAll/${viewExprience.id}`,
          formData
        )
      } else {
        await axiosInstance.post('/immersion/immersionsAll', formData)
      }
      console.log('Form Data Submitted:', formData)
    } catch (err) {
      console.log(err, 'Error in submission')
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/immersion/immersionsAll/${viewExprience.id}`)
      console.log('Experience Deleted')
      onClose() // Close modal after deletion
    } catch (err) {
      console.log(err, 'Error in deletion')
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        {/* Modal Header */}
        <div className='modal-header'>
          {viewExprience && (
            <div className='portfolio-actions' onClick={toggleEditing}>
              {editingImmersion ? (
                <>
                  <FaCheck className={'action-box public-icon'} />
                  <FaEye className={'action-box pencil-icon'} />
                </>
              ) : (
                <>
                  <FaCheck className={'action-box public-icon'} />
                  <FaPencilAlt className={'action-box pencil-icon'} />
                </>
              )}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              marginTop: '30px',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <h5>
              {viewExprience
                ? editingImmersion
                  ? 'Edit Immersion Step 1: Industry Problem'
                  : 'View Immersion Step 1: Industry Problem'
                : 'Add Immersion Step 1: Industry Problem'}
            </h5>
            <div className='status-toggle'>
              <span>Status</span>
              <span style={{ fontSize: '12px', color: 'grey' }}>
                {'Inactive'}
              </span>
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={status}
                  onChange={handleStatusChange}
                  disabled={!editingImmersion} // Only editable when in edit mode
                />
                <span className='slider'></span>
              </label>
              <span style={{ fontSize: '12px', color: 'grey' }}>
                {'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className='modal-body'>
          {/* Form Fields */}
          <div className='input-group'>
            <p className='input-group-title'>Company Details</p>
            <input
              type='text'
              placeholder='Name of Company'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={!editingImmersion}
            />
            <textarea
              placeholder='Description of Company'
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              disabled={!editingImmersion}
            />
          </div>

          <div className='input-group'>
            <p className='input-group-title'>Industry Details</p>
            <input
              type='text'
              placeholder='Industry'
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={!editingImmersion}
            />
            <textarea
              placeholder='Industry Problem'
              value={industryProblem}
              onChange={(e) => setIndustryProblem(e.target.value)}
              disabled={!editingImmersion}
            />
          </div>

          <div className='input-group'>
            <p className='input-group-title'>Research Guidance</p>
            <textarea
              style={{ width: '100%' }}
              placeholder='Research Guidance'
              value={researchGuidance}
              onChange={(e) => setResearchGuidance(e.target.value)}
              disabled={!editingImmersion}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className='modal-footer'>
          {editingImmersion && (
            <>
              <div
                className='delete-button'
                onClick={() => setShowDeleteConfirm(true)} // Open delete confirmation modal
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  // onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                  // className='action-box'
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ marginLeft: '5px' }}>Delete Experience</span>
              </div>
              <div className='cancel-edit' onClick={toggleEditing}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  // onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                  // className='action-box'
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ marginLeft: '5px' }}>Cancel Edits</span>
              </div>
            </>
          )}

          {!viewExprience && (
            <button className='cancel-button' onClick={onClose}>
              Cancel
            </button>
          )}
          {!viewExprience && (
            <button className='add-button' onClick={handleSubmit}>
              {'Add Experience'}
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className='modal-overlay'>
            <div className='modal-container'>
              <div className='modal-header'>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                  className='action-box'
                  style={{ cursor: 'pointer' }}
                />
                <h5>Delete Immersion Experience</h5>
              </div>
              <div className='modal-body'>
                <p>
                  Are you sure you want to delete this experience? All
                  submissions will also be deleted.
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  className='delete-confirm-button'
                  onClick={handleDelete}
                >
                  YES, DELETE EXPERIENCE
                </button>
                <button
                  className='cancel-button'
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddImmersionModal
