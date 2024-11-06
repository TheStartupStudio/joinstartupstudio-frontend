import React, { useEffect, useState } from 'react'
import './style.css'
import axiosInstance from '../../../utils/AxiosInstance'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'

const AddImmersionModal = ({
  viewExprience,
  onClose,
  immersionStep,
  onSuccess = () => {},
  justView
}) => {
  // Initialize states for form fields
  const [status, setStatus] = useState(viewExprience?.status === 'active')
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [industryProblem, setIndustryProblem] = useState('')
  const [researchGuidance, setResearchGuidance] = useState('')
  const [immersionStepName, setImmersionStepName] = useState('')

  const [editingImmersion, setEditingImmersion] = useState(!viewExprience) // Start editing if no viewExprience
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Store initial values
  const [initialValues, setInitialValues] = useState({
    status: viewExprience?.status === 'active',
    companyName:
      viewExprience?.company_name || viewExprience?.companyName || '',
    companyDescription:
      viewExprience?.company_description ||
      viewExprience?.companyDescription ||
      '',
    industry: viewExprience?.industry || '',
    industryProblem:
      viewExprience?.industry_problem || viewExprience?.industryProblem || '',
    researchGuidance:
      viewExprience?.research_guidance || viewExprience?.researchGuidance || ''
  })

  // Set the form values when the component mounts or when `viewExprience` changes
  useEffect(() => {
    let immersionStep = '' // Move this outside the if block

    if (viewExprience) {
      setStatus(initialValues.status)
      setCompanyName(initialValues.companyName)
      setCompanyDescription(initialValues.companyDescription)
      setIndustry(initialValues.industry)
      setIndustryProblem(initialValues.industryProblem)
      setResearchGuidance(initialValues.researchGuidance)

      if (viewExprience.step === 1) {
        immersionStep = 'Step 1: Industry Problem'
      } else if (viewExprience.step === 2) {
        immersionStep = 'Step 2: Immersion Experience'
      } else if (viewExprience.step === 3) {
        immersionStep = 'Step 3: Internship'
      } else if (viewExprience.step === 4) {
        immersionStep = 'Step 4: Entry-Level Employment'
      }
    }

    setImmersionStepName(immersionStep)
  }, [initialValues, viewExprience])

  // Function to reset fields to their original values
  const resetFields = () => {
    setStatus(initialValues.status)
    setCompanyName(initialValues.companyName)
    setCompanyDescription(initialValues.companyDescription)
    setIndustry(initialValues.industry)
    setIndustryProblem(initialValues.industryProblem)
    setResearchGuidance(initialValues.researchGuidance)
    setEditingImmersion(false) // Switch back to view mode
  }

  const toggleEditing = () => setEditingImmersion(!editingImmersion)

  const handleStatusChange = () => setStatus(!status)

  const handleSubmit = async () => {
    const formData = {
      immersionId: viewExprience ? viewExprience.id : null,
      status: status ? 'Active' : 'Inactive',
      companyName,
      companyDescription,
      industry,
      industryProblem,
      researchGuidance,
      step: immersionStep ? immersionStep.value : 1 // Default step 1 if immersionStep is not provided
    }

    try {
      if (viewExprience) {
        // Update existing immersion
        await axiosInstance.post(`/immersion/immersionsAll`, formData)
      } else {
        // Create a new immersion
        await axiosInstance.post('/immersion/immersionsAll', formData)
      }
      onSuccess()
      onClose() // Close the modal after submit
    } catch (err) {
      console.error('Error in submission:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/immersion/immersionsAll/${viewExprience.id}`)

      onSuccess()
      onClose() // Close modal after deletion
    } catch (err) {
      console.error('Error in deletion:', err)
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        {/* Modal Header */}
        <div className='immersion-modal-header'>
          {viewExprience && (
            <div
              className='portfolio-actions'
              style={{ borderTopRightRadius: '36px' }}
            >
              {editingImmersion ? (
                <>
                  <FaCheck
                    className={'action-box public-icon'}
                    onClick={handleSubmit} // Save changes to backend
                    style={{ cursor: 'pointer' }}
                    title='Save Changes'
                  />

                  {!justView && (
                    <FaEye
                      className={'action-box pencil-icon'}
                      onClick={toggleEditing} // Switch to view-only mode
                      style={{ cursor: 'pointer' }}
                      title='Switch to View Mode'
                    />
                  )}
                </>
              ) : (
                <>
                  <FaCheck
                    className={'action-box public-icon'}
                    onClick={onClose} // Close the modal
                    style={{ cursor: 'pointer' }}
                    title='Close'
                  />

                  {!justView && (
                    <FaPencilAlt
                      className={'action-box pencil-icon'}
                      onClick={toggleEditing} // Switch to edit mode
                      style={{ cursor: 'pointer' }}
                      title='Edit Experience'
                    />
                  )}
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
            <h5>{viewExprience ? immersionStepName : immersionStep.name}</h5>
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
        <div className='immersion-modal-body'>
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
          {editingImmersion && viewExprience && (
            <>
              <div
                className='delete-button'
                onClick={() => setShowDeleteConfirm(true)} // Open delete confirmation modal
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ marginLeft: '5px' }}>Delete Experience</span>
              </div>
              <div className='cancel-edit' onClick={resetFields}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
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
              Add Experience
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className='modal-overlay'>
            <div className='modal-container-delete'>
              <div className='immersion-modal-header'>
                <div className='portfolio-actions'>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                    className='action-box-delete'
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      width: '45px'
                    }}
                  />
                </div>

                <h5 style={{ marginTop: '10px' }}>
                  Delete Immersion Experience
                </h5>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderTop: '1px solid black'
                }}
                className='modal-body-delete'
              >
                <p style={{ paddingTop: '25px' }}>
                  Are you sure you want to delete this experience? All
                  submissions will also be deleted.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: 'none'
                }}
                className='modal-footer'
              >
                <button
                  className='delete-confirm-button'
                  onClick={handleDelete}
                >
                  YES, DELETE EXPERIENCE
                </button>
                <button
                  style={{ border: 'none' }}
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
