import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  attachGlobalIdToPayload,
  canChooseClientInUI,
  fetchClientsConfig,
  parseClientsConfigResponse,
  getClientAndGlobalBody,
  getClientPayloadValue,
  getHostnameSubdomainLabel
} from '../../../utils/clientHostname'
import AlertPopup from '../../UserManagment/AlertPopup/index'
import './index.css'

const AddLevelModal = ({ show, onHide, onSave, existingLevels = [], category = 'entrepreneurship', selectedCategory = 'Leadership Journal', manageContentId }) => {
  const [levels, setLevels] = useState([])
  const [hasNewLevel, setHasNewLevel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [levelToDelete, setLevelToDelete] = useState(null)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('all')
  /** Prevents re-sync from parent wiping local edits; reset when modal closes. */
  const hasSeededLevelsForOpenRef = useRef(false)
  /** Monotonic UI id per modal session — never rely on API `id` alone for React/list identity. */
  const nextRowKeyIdRef = useRef(0)

  const getApiEndpoint = (action, id = null) => {
    if (category === 'leadership') {
      switch (action) {
        case 'create':
          return '/LtsJournals/leadership-journal/levels'
        case 'update':
          return `/LtsJournals/leadership-journal/levels/${id}`
        case 'delete':
          return `/LtsJournals/leadership-journal/levels/${id}`
        default:
          return '/LtsJournals/leadership-journal/levels'
      }
    }

    const basePath = category === 'masterclass' ? 'contents' : 'LtsJournals'
    const categoryPath = category === 'masterclass' ? 'masterclass' : 'entrepreneurship'
    switch (action) {
      case 'create':
        return `/${basePath}/${categoryPath}/levels`
      case 'update':
        return `/${basePath}/${categoryPath}/levels/${id}`
      case 'delete':
        return `/${basePath}/${categoryPath}/levels/${id}`
      default:
        return `/${basePath}/${categoryPath}/levels`
    }
  }

  useEffect(() => {
    if (!show) {
      hasSeededLevelsForOpenRef.current = false
      nextRowKeyIdRef.current = 0
      return
    }
    // Do not re-run when parent passes a new `existingLevels` array reference while
    // the user is editing — that was resetting every row and syncing inputs.
    if (hasSeededLevelsForOpenRef.current) return
    if (existingLevels.length === 0) return

    const levelsArray = existingLevels.map((level, index) => {
      const rowKey = `rk-${++nextRowKeyIdRef.current}`

      if (typeof level === 'string') {
        return {
          rowKey,
          id: null,
          title: level,
          order: index + 1,
          originalOrder: index + 1,
          isEditing: false,
          isNew: false,
          isEdited: false,
          isDeleted: false
        }
      }
      return {
        rowKey,
        id: level.id,
        title: level.title,
        order: level.order || index + 1,
        originalOrder: level.order || index + 1,
        isEditing: false,
        isNew: false,
        isEdited: false,
        isDeleted: false,
        originalTitle: level.title,
        globalId: level.globalId
      }
    })
    setLevels(levelsArray)
    setHasNewLevel(false)
    hasSeededLevelsForOpenRef.current = true
  }, [show, existingLevels])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetchClientsConfig(axiosInstance)
        const clientsList = parseClientsConfigResponse(response)
        if (clientsList.length > 0) {
          setClients(clientsList)
          setSelectedClient((prev) => prev || 'all')
        } else {
          setClients([])
          setSelectedClient('all')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        setClients([])
        setSelectedClient('all')
      }
    }

    if (
      show &&
      canChooseClientInUI() &&
      (category === 'entrepreneurship' ||
        category === 'masterclass' ||
        category === 'leadership')
    ) {
      fetchClients()
    }
  }, [show, category])

  const handleLevelChange = (rowKey, value) => {
    if (rowKey == null || rowKey === '') return
    setLevels(prevLevels => {
      const idx = prevLevels.findIndex((l) => l.rowKey === rowKey)
      if (idx === -1) return prevLevels
      return prevLevels.map((level, i) =>
        i === idx ? { ...level, title: value, isEdited: true } : level
      )
    })
  }

  const toggleEditing = (rowKey) => {
    if (rowKey == null || rowKey === '') return
    setLevels(prevLevels => {
      const idx = prevLevels.findIndex((l) => l.rowKey === rowKey)
      if (idx === -1) return prevLevels
      return prevLevels.map((l, i) =>
        i === idx ? { ...l, isEditing: !l.isEditing } : l
      )
    })
  }

  const addNewLevelAfter = (afterRowKey) => {
    const insertIndex = levels.findIndex((level) => level.rowKey === afterRowKey)
    if (insertIndex === -1) return
    const newOrder = insertIndex + 2

    const newTitle = category === 'leadership' ? 'Add Section title...' : 'Add Level title...'

    // Generate a temporary ID for the new level
    const tempId = `temp-${Date.now()}`
    const rowKey = `rk-${++nextRowKeyIdRef.current}`

    const newLevel = {
      rowKey,
      id: tempId,
      title: newTitle,
      order: newOrder,
      isEditing: true,
      isNew: true,
      isEdited: false
    }

    const updatedLevels = [
      ...levels.slice(0, insertIndex + 1),
      newLevel,
      ...levels.slice(insertIndex + 1)
    ]

    // Renumber all levels
    const renumberedLevels = updatedLevels.map((level, index) => ({
      ...level,
      order: index + 1
    }))

    setLevels(renumberedLevels)
    setHasNewLevel(true)
  }

  const deleteLevel = (rowKey) => {
    if (levels.length <= 1) {
      toast.warning('Cannot delete the last level')
      return
    }

    setLevelToDelete(rowKey)
    setShowDeleteAlert(true)
  }

  const confirmDeleteLevel = async () => {
    const rowKey = levelToDelete
    const levelToDeleteObj = levels.find((level) => level.rowKey === rowKey)

    if (!levelToDeleteObj) {
      setShowDeleteAlert(false)
      setLevelToDelete(null)
      return
    }

    try {
      setLoading(true)

      if (!levelToDeleteObj.isNew && levelToDeleteObj.id) {
        await axiosInstance.delete(
          getApiEndpoint('delete', levelToDeleteObj.id),
          { data: getClientAndGlobalBody(selectedClient, levelToDeleteObj.globalId) }
        )
      }

      const remaining = levels.filter((level) => level.rowKey !== rowKey)
      const renumbered = remaining.map((level, index) => ({
        ...level,
        order: index + 1,
        originalOrder: index + 1
      }))

      setLevels(renumbered)
      setHasNewLevel(renumbered.some(level => level.isNew))

      if (!levelToDeleteObj.isNew) {
        toast.success('Level deleted successfully!')
        if (onSave) onSave()
      }
    } catch (error) {
      console.error('Error deleting level:', error)
      toast.error(error.response?.data?.message || 'Failed to delete level')
    } finally {
      setLoading(false)
      setShowDeleteAlert(false)
      setLevelToDelete(null)
    }
  }

  const cancelDeleteLevel = () => {
    setShowDeleteAlert(false)
    setLevelToDelete(null)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const activeLevels = levels.filter(level => !level.isDeleted)

      // Create all new levels
      for (const level of activeLevels) {
        if (
          level.isNew &&
          level.id &&
          String(level.id).startsWith('temp-')
        ) {
          // Create new level
          const createPayload = {
            title: level.title,
            order: level.order,
            published: true
          }

          if (
            category === 'entrepreneurship' ||
            category === 'masterclass' ||
            category === 'leadership'
          ) {
            createPayload.client = getClientPayloadValue(selectedClient)
          }

          // If category is 'leadership', include selectedCategory and manageContentId in payload
          if (category === 'leadership') {
            createPayload.category = selectedCategory
            if (manageContentId) {
              createPayload.manageContentId = manageContentId
            }
          }

          console.log('Create payload:', createPayload)
          const response = await axiosInstance.post(getApiEndpoint('create'), createPayload)
          // Update the temp ID with the real ID
          level.id = response.data.id
          // Keep existing rowKey so rows stay distinct in the UI (do not reuse srv-${id} only).
        }
      }

      // Only update levels whose title or order actually changed
      for (let i = 0; i < activeLevels.length; i++) {
        const level = activeLevels[i]
        const correctOrder = i + 1

        if (level.id == null || String(level.id).startsWith('temp-')) {
          continue
        }

        const titleChanged = level.isEdited || level.title !== level.originalTitle
        const orderChanged = correctOrder !== level.originalOrder

        if (!titleChanged && !orderChanged) {
          continue
        }

        const updatePayload = {
          title: level.title,
          order: correctOrder
        }

        if (
          category === 'entrepreneurship' ||
          category === 'masterclass' ||
          category === 'leadership'
        ) {
          updatePayload.client = getClientPayloadValue(selectedClient)
        }

        if (category === 'leadership') {
          updatePayload.category = selectedCategory
          if (manageContentId) {
            updatePayload.manageContentId = manageContentId
          }
        }

        console.log('[AddLevelModal] PUT only changed level:', level.id, { titleChanged, orderChanged })
        await axiosInstance.put(
          getApiEndpoint('update', level.id),
          attachGlobalIdToPayload(updatePayload, level.globalId)
        )
      }

      // Update local state to reflect saved changes
      const updatedLevels = activeLevels.map((level, i) => ({
        ...level,
        isNew: false,
        isEdited: false,
        isEditing: false,
        isDeleted: false,
        originalTitle: level.title,
        originalOrder: i + 1
      }))
      setLevels(updatedLevels)
      setHasNewLevel(false)

      toast.success('Changes saved successfully!')
      if (onSave) {
        onSave()
        handleClose()
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error(error.response?.data?.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }


  const handleSaveAndContinue = () => {
    const updatedLevels = levels.map(level => ({
      ...level,
      isNew: false,
      isEditing: false,
      originalTitle: level.title
    }))
    setLevels(updatedLevels)
    setHasNewLevel(false)
    toast.success('Changes saved!')
  }

  const handleClose = () => {
    setLevels([])
    setHasNewLevel(false)
    onHide()
  }

  return (
    <>
    <Modal show={show && !showDeleteAlert} onHide={handleClose} centered size="lg" className="add-level-modal">
      <Modal.Body className="add-level-modal-body">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33301 10.0003V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H9.16634" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.66016 15.833H4.16016M6.66016 15.833H4.16016M4.16016 15.833V13.333M4.16016 15.833V18.333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h5 className="modal-title">Add New {category === 'leadership' ? 'Section' : category === 'masterclass' ? 'Category' : 'Level'}</h5>

        {(category === 'entrepreneurship' ||
          category === 'masterclass' ||
          category === 'leadership') && (
          <div className="form-group">
            <label className="form-label">CLIENT:</label>
            {canChooseClientInUI() ? (
              <select
                className="form-control client-select"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                disabled={loading}
              >
                <option value="all">All</option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="form-control client-select client-readonly"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 0
                }}
              >
                {getHostnameSubdomainLabel() || '—'}
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">LEVEL TITLE:</label>
          
          <div className="levels-list">
            {levels.filter(level => !level.isDeleted).map((level) => (
              <div key={level.rowKey}>
                <div className={`level-item ${level.isNew ? 'new-level' : ''}`}>
                  <input
                    type="text"
                    className="form-control level-input"
                    placeholder="Enter level title..."
                    value={level.title}
                    onChange={(e) =>
                      handleLevelChange(level.rowKey, e.target.value)
                    }
                    disabled={!level.isEditing}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="edit-level-btn"
                      onClick={() => toggleEditing(level.rowKey)}
                      type="button"
                      disabled={loading}
                      title={level.isEditing ? 'Save changes' : 'Edit level'}
                    >
                      {level.isEditing ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg className="edit-pencil" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.9696 4.71029L12.9672 3.71266C13.7483 2.93162 15.0146 2.93162 15.7957 3.71266L16.5028 4.41977C17.2838 5.20082 17.2838 6.46715 16.5028 7.2482L15.5052 8.24582M11.9696 4.71029L4.04225 12.6377C3.71017 12.9697 3.50555 13.4081 3.46422 13.8759L3.29065 15.8407C3.23588 16.4607 3.75476 16.9796 4.37477 16.9248L6.33956 16.7512C6.80736 16.7099 7.24571 16.5053 7.57778 16.1732L15.5052 8.24582M11.9696 4.71029L15.5052 8.24582" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <button 
                      className="delete-level-btn"
                      onClick={() => deleteLevel(level.rowKey)}
                      type="button"
                      disabled={levels.length === 1 || loading}
                      title="Delete level"
                    >
                      <svg className="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.5 4.99935H12.8125M2.5 4.99935H7.1875M7.1875 4.99935V3.33268C7.1875 2.41221 7.93369 1.66602 8.85417 1.66602H11.1458C12.0663 1.66602 12.8125 2.41221 12.8125 3.33268V4.99935M7.1875 4.99935H12.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!hasNewLevel && (
                  <div 
                    className='d-flex justify-content-end gap-2 align-items-center mt-2 mb-3' 
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1
                    }}
                    onClick={() => !loading && addNewLevelAfter(level.rowKey)}
                  >
                    Add New {category === 'leadership' ? 'Section' : category === 'masterclass' ? 'Category' : 'Level'} Here
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
          <button className="btn-cancel" style={{ fontSize: '14px' }} onClick={handleClose} disabled={loading}>
            CANCEL
          </button>
          <button className="btn-cancel" style={{ backgroundColor: '#51c7df', color: '#fff' }} onClick={handleSave} disabled={loading}>
            {loading ? 'SAVING...' : 'SAVE'}
          </button>

        </div>
      </Modal.Body>
    </Modal>

    <AlertPopup
      show={showDeleteAlert}
      onHide={cancelDeleteLevel}
      onConfirm={confirmDeleteLevel}
      title={`Delete ${category === 'leadership' ? 'Section' : category === 'masterclass' ? 'Category' : 'Level'}?`}
      message={`Are you sure you want to delete this ${category === 'leadership' ? 'section' : category === 'masterclass' ? 'category' : 'level'}? Deleting this level will NOT remove tasks assigned to it, but they will no longer be accessible to learners.`}
      confirmText={`Yes, Delete ${category === 'leadership' ? 'Section' : category === 'masterclass' ? 'Category' : 'Level'}`}
      loading={loading}
    />
    </>
  )
}

export default AddLevelModal