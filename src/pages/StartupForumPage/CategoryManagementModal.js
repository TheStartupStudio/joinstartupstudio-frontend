import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './CategoryManagementModal.css'
import editIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'

const CategoryManagementModal = ({ show, onHide, onSuccess }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)

  // Static categories that cannot be removed
  const staticCategories = [
    'All Discussions',
    'Following',
    'Introductions',
    'Announcements',
    'Celebrations',
    'Ask for Feedback',
    'Ask for Collaboration',
    'Ask for Mentorship',
  ]

  // Get emoji icon for category
  const getCategoryEmoji = (categoryName) => {
    const emojiMap = {
      'Introductions': '👋',
      'Announcements': '📢',
      'Celebrations': '🎉',
      'Ask for Feedback': '💡',
      'Ask for Collaboration': '🤝',
      'Ask for Mentorship': '🎓'
    }
    return emojiMap[categoryName] || '💬'
  }

  const isStaticCategory = (categoryName) => {
    return staticCategories.includes(categoryName)
  }

  // Fetch categories when modal opens
  useEffect(() => {
    if (show) {
      fetchCategories()
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

  const handleDragEnd = async () => {
    if (draggedItem === null) return

    // Update order for all categories
    const updatedCategories = categories.map((cat, index) => ({
      ...cat,
      order: index
    }))

    setDraggedItem(null)

    // Save new order to backend
    try {
      await Promise.all(
        updatedCategories.map(cat =>
          axiosInstance.put(`/forum/categories/${cat.id}`, { order: cat.order })
        )
      )
      toast.success('Category order updated')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
      fetchCategories() // Reload on error
    }
  }

  const handleEditCategory = async (categoryId, newName) => {
    if (!newName.trim()) {
      toast.error('Category name cannot be empty')
      return
    }

    setLoading(true)
    try {
      const category = categories.find(cat => cat.id === categoryId)
      await axiosInstance.put(`/forum/categories/${categoryId}`, {
        ...category,
        name: newName,
        slug: newName.toLowerCase().replace(/\s+/g, '-')
      })
      
      toast.success('Category updated successfully')
      setEditingCategoryId(null)
      fetchCategories()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.response?.data?.message || 'Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return
    }

    if (isStaticCategory(newCategoryName)) {
      toast.error('Cannot create a category with the same name as a static category')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post('/forum/categories', {
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        order: categories.length,
        is_active: true
      })
      
      toast.success('Category created successfully')
      setNewCategoryName('')
      fetchCategories()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.response?.data?.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    
    if (category && isStaticCategory(category.name)) {
      toast.error('Cannot delete static categories')
      return
    }

    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    setLoading(true)
    try {
      await axiosInstance.delete(`/forum/categories/${categoryId}`)
      toast.success('Category deleted successfully')
      fetchCategories()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error.response?.data?.message || 'Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = () => {
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="category-management-modal-clean"
      backdrop="static"
    >
      <Modal.Body style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Manage Categories
          </h3>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
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
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    opacity: draggedItem === index ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (draggedItem === null) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Drag Handle */}
                  <div style={{ cursor: 'grab', color: '#9CA3AF' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8H21M3 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>

                  {/* Category Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
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
                          border: '1px solid #52C7DE',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '14px',
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
                        <span>{getCategoryEmoji(category.name)}</span>
                        <span>{category.name}</span>
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
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <img src={editIcon} alt="Edit" style={{ width: '18px', height: '18px' }} />
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
                      onMouseEnter={(e) => {
                        if (!isStaticCategory(category.name)) {
                          e.currentTarget.style.backgroundColor = '#FEE2E2'
                        }
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Category Input */}
              <div
                style={{
                  backgroundColor: 'white',
                  border: '1px dashed #D1D5DB',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '20px' }} /> {/* Spacer for alignment */}
                
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
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#6B7280'
                  }}
                />

                {newCategoryName && (
                  <button
                    onClick={handleAddCategory}
                    disabled={loading}
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
          marginTop: '32px'
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
            style={{
              backgroundColor: '#52C7DE',
              border: 'none',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            SAVE CHANGES
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CategoryManagementModal