import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './CategoryManagementModal.css'
import editIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'

// Icon library for selection
const ICON_LIBRARY = [
  { name: 'Waving Hand', path: wavingHand },
  { name: 'Loudspeaker', path: loudSpeaker },
  { name: 'Party Popper', path: partyPopper },
  { name: 'Speech Balloon', path: speechBalloon },
  { name: 'Light Bulb', path: lightBulb }
]

const CategoryManagementModal = ({ show, onHide, onSuccess }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [selectedIcon, setSelectedIcon] = useState(speechBalloon) // Default icon
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showAddIconPicker, setShowAddIconPicker] = useState(false)
  const [editingIconForCategory, setEditingIconForCategory] = useState(null)
  
  // Track pending changes
  const [pendingChanges, setPendingChanges] = useState({
    updated: [], // { id, name, slug, order }
    deleted: [], // category ids
    added: [], // { name, slug, order, tempId }
    reordered: false
  })

  // Static categories that cannot be removed or reordered
  const staticCategories = [
    'All Discussions',
    'Following'
  ]

  // Get icon for category
  const getCategoryIcon = (category) => {
    // If category is an object with icons property, use it
    if (typeof category === 'object' && category.icons) {
      return category.icons
    }
    
    // If it's just a name string, use fallback
    const categoryName = typeof category === 'string' ? category : category?.name
    const iconMap = {
      'Introductions': wavingHand,
      'Announcements': loudSpeaker,
      'Celebrations': partyPopper,
      'Ask for Feedback': lightBulb,
      'Ask for Collaboration': speechBalloon,
      'Ask for Mentorship': lightBulb
    }
    return iconMap[categoryName] || speechBalloon
  }

  const isStaticCategory = (categoryName) => {
    return staticCategories.includes(categoryName)
  }

  // Fetch categories when modal opens
  useEffect(() => {
    if (show) {
      fetchCategories()
      // Reset pending changes when modal opens
      setPendingChanges({
        updated: [],
        deleted: [],
        added: [],
        reordered: false
      })
      // Reset icon picker state
      setShowIconPicker(false)
      setEditingIconForCategory(null)
      setShowAddIconPicker(false)
      setSelectedIcon(speechBalloon)
    }
  }, [show])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/forum/categories')
      const sortedCategories = (response.data || [])
        .filter(cat => !['All Discussions', 'Following', 'Reported Posts'].includes(cat.name))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      setCategories(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === index) return

    const newCategories = [...categories]
    const draggedCategory = newCategories[draggedItem]
    newCategories.splice(draggedItem, 1)
    newCategories.splice(index, 0, draggedCategory)
    
    setCategories(newCategories)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    if (draggedItem === null) return

    // Update order for all categories, starting from order 2 (after All Discussions and Following)
    const updatedCategories = categories.map((cat, index) => ({
      ...cat,
      order: index + 2
    }))

    setDraggedItem(null)
    
    // Mark that reordering has occurred
    setPendingChanges(prev => ({
      ...prev,
      reordered: true
    }))

    // Update local state immediately for UI
    setCategories(updatedCategories)
  }

  const handleEditCategory = (categoryId, newName, newIcon = null) => {
    if (!newName.trim()) {
      toast.error('Category name cannot be empty')
      return
    }

    const category = categories.find(cat => cat.id === categoryId)
    
    // Update local state
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              name: newName, 
              slug: newName.toLowerCase().replace(/\s+/g, '-'),
              icons: newIcon !== null ? newIcon : cat.icons
            }
          : cat
      )
    )
    
    // Track the change
    setPendingChanges(prev => {
      const existingIndex = prev.updated.findIndex(u => u.id === categoryId)
      const updatedList = [...prev.updated]
      
      if (existingIndex >= 0) {
        updatedList[existingIndex] = {
          ...category,
          name: newName,
          slug: newName.toLowerCase().replace(/\s+/g, '-'),
          icons: newIcon !== null ? newIcon : category.icons
        }
      } else {
        updatedList.push({
          ...category,
          name: newName,
          slug: newName.toLowerCase().replace(/\s+/g, '-'),
          icons: newIcon !== null ? newIcon : category.icons
        })
      }
      
      return { ...prev, updated: updatedList }
    })
    
    setEditingCategoryId(null)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      return
    }

    if (isStaticCategory(newCategoryName)) {
      toast.error('Cannot create a category with the same name as a static category')
      return
    }

    // Create temporary ID for new category
    const tempId = `temp-${Date.now()}`
    const newCategory = {
      id: tempId,
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      order: categories.length + 2,
      is_active: true,
      icons: selectedIcon,
      isNew: true
    }
    
    // Update local state
    setCategories(prev => [...prev, newCategory])
    
    // Track the new category
    setPendingChanges(prev => ({
      ...prev,
      added: [...prev.added, newCategory]
    }))
    
    setNewCategoryName('')
    setSelectedIcon(speechBalloon) // Reset to default
  }

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    
    if (category && isStaticCategory(category.name)) {
      toast.error('Cannot delete static categories')
      return
    }

    // Show delete confirmation modal
    setCategoryToDelete(categoryId)
    setShowDeleteModal(true)
  }

  const confirmDeleteCategory = () => {
    const categoryId = categoryToDelete
    const category = categories.find(cat => cat.id === categoryId)

    // Update local state
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    
    // Track the deletion
    if (category.isNew) {
      // If it's a new category that hasn't been saved yet, just remove it from added list
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.filter(cat => cat.id !== categoryId)
      }))
    } else {
      // Track deletion for existing category
      setPendingChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, categoryId],
        // Remove from updated list if it was there
        updated: prev.updated.filter(cat => cat.id !== categoryId)
      }))
    }

    // Close modal
    setShowDeleteModal(false)
    setCategoryToDelete(null)
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    
    try {
      // Process deletions
      for (const categoryId of pendingChanges.deleted) {
        await axiosInstance.delete(`/forum/categories/${categoryId}`)
      }
      
      // Process additions
      for (const category of pendingChanges.added) {
        await axiosInstance.post('/forum/categories', {
          name: category.name,
          slug: category.slug,
          order: category.order,
          is_active: category.is_active,
          icons: category.icons
        })
      }
      
      // Process updates
      for (const category of pendingChanges.updated) {
        await axiosInstance.put(`/forum/categories/${category.id}`, {
          ...category,
          name: category.name,
          slug: category.slug,
          icons: category.icons
        })
      }
      
      // Process reordering if it occurred
      if (pendingChanges.reordered) {
        // Get only real categories (not the newly added ones that haven't been saved yet)
        const realCategories = categories.filter(cat => !cat.isNew)
        await Promise.all(
          realCategories.map(cat =>
            axiosInstance.put(`/forum/categories/${cat.id}`, { order: cat.order })
          )
        )
      }
      
      toast.success('Changes saved successfully')
      
      // Reset pending changes
      setPendingChanges({
        updated: [],
        deleted: [],
        added: [],
        reordered: false
      })
      
      if (onSuccess) onSuccess()
      onHide()
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error(error.response?.data?.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="category-management-modal-clean"
      backdrop={showDeleteModal ? false : "static"}
      style={{ zIndex: showDeleteModal ? 1050 : 1055 }}
    >
      <Modal.Body style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#E2E6EC',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6663 10.0013V4.83316C16.6663 4.67403 16.6031 4.52142 16.4906 4.4089L13.9254 1.8437C13.8129 1.73118 13.6603 1.66797 13.5011 1.66797H3.93301C3.60164 1.66797 3.33301 1.9366 3.33301 2.26797V17.7346C3.33301 18.066 3.60164 18.3346 3.93301 18.3346H9.16634" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.66699 8.33333H13.3337M6.66699 5H10.0003M6.66699 11.6667H9.16699" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.9618 14.1179L15.7951 13.2846C16.16 12.9196 16.7517 12.9196 17.1166 13.2846C17.4815 13.6495 17.4815 14.2411 17.1166 14.6061L16.2833 15.4394M14.9618 14.1179L12.5077 16.572C12.3578 16.7219 12.2594 16.9156 12.2267 17.1251L12.0328 18.3683L13.276 18.1745C13.4855 18.1418 13.6792 18.0435 13.8291 17.8935L16.2833 15.4394M14.9618 14.1179L16.2833 15.4394" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.333 1.66797V4.4013C13.333 4.73267 13.6016 5.0013 13.933 5.0013H16.6663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>
            Manage Categories
          </h3>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '16px',
            backgroundColor: 'rgba(227, 229, 233, 0.50)',
            padding: '4px',
            borderRadius: '4px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_4090_19087)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_4090_19087">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <h4 style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>
              Categories
            </h4>
          </div>

          {loading && categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Loading...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    opacity: draggedItem === index ? 0.5 : 1
                  }}
                  // onMouseEnter={(e) => {
                  //   if (draggedItem === null) {
                  //     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  //   }
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.currentTarget.style.boxShadow = 'none'
                  // }}
                >
                  {/* Drag Handle */}
                  <div style={{ cursor: 'grab', color: '#9CA3AF' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4.50001 18C4.35801 18 4.23934 17.952 4.14401 17.856C4.04867 17.76 4.00067 17.641 4.00001 17.499C3.99934 17.357 4.04734 17.2383 4.14401 17.143C4.24067 17.0477 4.35934 17 4.50001 17H19.5C19.642 17 19.7607 17.048 19.856 17.144C19.9513 17.24 19.9993 17.359 20 17.501C20.0007 17.643 19.9527 17.7617 19.856 17.857C19.7593 17.9523 19.6407 18 19.5 18H4.50001ZM4.50001 14.327C4.35801 14.327 4.23934 14.279 4.14401 14.183C4.04867 14.087 4.00067 13.968 4.00001 13.826C3.99934 13.684 4.04734 13.5653 4.14401 13.47C4.24067 13.3747 4.35934 13.327 4.50001 13.327H19.5C19.642 13.327 19.7607 13.375 19.856 13.471C19.952 13.567 20 13.686 20 13.828C20 13.97 19.952 14.0887 19.856 14.184C19.76 14.2793 19.6413 14.327 19.5 14.327H4.50001ZM4.50001 10.673C4.35801 10.673 4.23934 10.625 4.14401 10.529C4.04801 10.433 4.00001 10.314 4.00001 10.172C4.00001 10.03 4.04801 9.91133 4.14401 9.816C4.24001 9.72067 4.35867 9.673 4.50001 9.673H19.5C19.642 9.673 19.7607 9.721 19.856 9.817C19.9513 9.913 19.9993 10.032 20 10.174C20.0007 10.316 19.9527 10.4347 19.856 10.53C19.7593 10.6253 19.6407 10.673 19.5 10.673H4.50001ZM4.50001 7C4.35801 7 4.23934 6.952 4.14401 6.856C4.04867 6.76 4.00067 6.641 4.00001 6.499C3.99934 6.357 4.04734 6.23833 4.14401 6.143C4.24067 6.04767 4.35934 6 4.50001 6H19.5C19.642 6 19.7607 6.048 19.856 6.144C19.9513 6.24 19.9993 6.359 20 6.501C20.0007 6.643 19.9527 6.76167 19.856 6.857C19.7593 6.95233 19.6407 7 19.5 7H4.50001Z" fill="black"/>
                    </svg>
                  </div>

                  {/* Category Info */}
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    // gap: '4px',
                    border: '1px solid #E5E7EB', 
                    padding: '8px 18px',
                    borderRadius: '12px',
                    background: '#FFF',
                    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6F6F6F',

                      }}>
                      Category:
                    </div>
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        defaultValue={category.name}
                        onBlur={(e) => handleEditCategory(category.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditCategory(category.id, e.target.value)
                          }
                        }}
                        autoFocus
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          fontSize: '15px',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {/* Icon selector button for editing */}
                        <button
                          onClick={() => {
                            setEditingIconForCategory(category.id)
                            setShowIconPicker(!showIconPicker)
                            setShowAddIconPicker(false)
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <img
                            src={getCategoryIcon(category)}
                            alt="category icon"
                            style={{ width: '20px', height: '20px' }}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="#6F6F6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span>{category.name}</span>
                        
                        {/* Icon picker for editing existing category */}
                        {editingIconForCategory === category.id && showIconPicker && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            minWidth: '120px'
                          }}>
                            {ICON_LIBRARY.map((icon) => (
                              <button
                                key={icon.name}
                                onClick={() => {
                                  handleEditCategory(category.id, category.name, icon.path)
                                  setEditingIconForCategory(null)
                                  setShowIconPicker(false)
                                }}
                                style={{
                                  background: category.icons === icon.path ? '#E0F2FE' : 'white',
                                  border: category.icons === icon.path ? '2px solid #52C7DE' : '1px solid #E5E7EB',
                                  borderRadius: '6px',
                                  padding: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                  gap: '8px'
                                }}
                                title={icon.name}
                              >
                                <img src={icon.path} alt={icon.name} style={{ width: '20px', height: '20px' }} />
                                {/* <span style={{ fontSize: '12px', color: '#6F6F6F' }}>{icon.name}</span> */}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setEditingCategoryId(category.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        transition: 'background 0.2s',
                        position: 'absolute',
                        right: '100px'
                      }}
                      // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M11.9696 4.70833L12.9672 3.71071C13.7483 2.92966 15.0146 2.92966 15.7957 3.71071L16.5028 4.41782C17.2838 5.19887 17.2838 6.4652 16.5028 7.24624L15.5052 8.24387M11.9696 4.70833L4.04225 12.6357C3.71017 12.9678 3.50554 13.4061 3.46422 13.8739L3.29065 15.8387C3.23588 16.4587 3.75475 16.9776 4.37477 16.9228L6.33956 16.7493C6.80736 16.7079 7.2457 16.5033 7.57778 16.1712L15.5052 8.24387M11.9696 4.70833L15.5052 8.24387" stroke="#6F6F6F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isStaticCategory(category.name)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: isStaticCategory(category.name) ? 'not-allowed' : 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        opacity: isStaticCategory(category.name) ? 0.3 : 1,
                        transition: 'background 0.2s'
                      }}
                      // onMouseEnter={(e) => {
                      //   if (!isStaticCategory(category.name)) {
                      //     e.currentTarget.style.backgroundColor = '#FEE2E2'
                      //   }
                      // }}
                      // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Category Input */}
              <div
                style={{
                  position: 'relative',
                  marginLeft:'35px',
                  backgroundColor: 'white',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 10px 0px',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Icon selector button */}
                  <button
                    onClick={() => {
                      setShowAddIconPicker(!showAddIconPicker)
                      setEditingIconForCategory(null)
                      setShowIconPicker(false)
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <img
                      src={selectedIcon}
                      alt="Selected icon"
                      style={{ width: '20px', height: '20px' }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="#6F6F6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <input
                    type="text"
                    placeholder="Add New Category Name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory()
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: '#6B7280'
                    }}
                  />

                  {newCategoryName ? (
                    <button
                      onClick={handleAddCategory}
                      disabled={false}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#52C7DE'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleAddCategory}
                      disabled={true}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#6F6F6F',
                        opacity: 0.5
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Icon picker dropdown */}
                {showAddIconPicker && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    minWidth: '120px'
                  }}>
                    {ICON_LIBRARY.map((icon) => (
                      <button
                        key={icon.name}
                        onClick={() => {
                          setSelectedIcon(icon.path)
                          setShowAddIconPicker(false)
                        }}
                        style={{
                          background: selectedIcon === icon.path ? '#E0F2FE' : 'white',
                          border: selectedIcon === icon.path ? '2px solid #52C7DE' : '1px solid #E5E7EB',
                          borderRadius: '6px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          gap: '8px'
                        }}
                        title={icon.name}
                      >
                        <img src={icon.path} alt={icon.name} style={{ width: '20px', height: '20px' }} />
                        {/* <span style={{ fontSize: '12px', color: '#6F6F6F' }}>{icon.name}</span> */}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          marginTop: '60px',
          marginBottom: '10px'
        }}>
          <Button
            onClick={onHide}
            style={{
              backgroundColor: '#E5E7EB',
              border: 'none',
              color: '#374151',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={loading}
            style={{
              backgroundColor: '#52C7DE',
              border: 'none',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>

    {/* Delete Confirmation Modal - Rendered separately for proper z-index */}
    <Modal
      show={showDeleteModal}
      onHide={() => {
        setShowDeleteModal(false)
        setCategoryToDelete(null)
      }}
      centered
      size="sm"
      backdrop="static"
      className="delete-category-modal"
      style={{ zIndex: 1060 }}
    >
        <Modal.Body style={{ padding: '40px', textAlign: 'center' }}>
          <div className='d-flex flex-column gap-3 mb-4'>
          {/* Warning Icon */}
          <div style={{ 
            width: '36px', 
            height: '36px', 
            backgroundColor: '#E2E6EC',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.1266 17.4987H3.87405C2.33601 17.4987 1.37357 15.8351 2.14023 14.5018L8.26651 3.84736C9.03552 2.50995 10.9651 2.50995 11.7341 3.84736L17.8604 14.5018C18.6271 15.8351 17.6646 17.4987 16.1266 17.4987Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M10 14.1763L10.0083 14.167" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          {/* Title */}
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            marginBottom: '16px',
            color: '#231F20',
            width: 'fit-content',
          }}>
            Delete Category?
          </h3>

          </div>

          {/* Description */}
          <p style={{ 
            fontSize: '15px', 
            color: '#000',
            marginBottom: '32px'
          }}>
            Are you sure you want to delete this category? Deleting the category will also delete all associated discussions. This cannot be undone.
          </p>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'center'
          }}>
            <Button
              onClick={() => {
                setShowDeleteModal(false)
                setCategoryToDelete(null)
              }}
              style={{
                backgroundColor: '#E5E7EB',
                border: 'none',
                color: '#374151',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                flex: 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D1D5DB'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E7EB'
              }}
            >
              NO, TAKE ME BACK
            </Button>
            <Button
              onClick={confirmDeleteCategory}
              style={{
                backgroundColor: '#EC4899',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                flex: 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DB2777'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EC4899'
              }}
            >
              DELETE CATEGORY
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
  
}

export default CategoryManagementModal