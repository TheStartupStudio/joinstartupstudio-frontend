import React from 'react'
import message from '../../assets/images/academy-icons/svg/message-text.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import editIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'

const CategoryList = ({ 
  categories, 
  selectedCategory, 
  onCategoryClick, 
  isAdmin = false,
  onEditCategories,
  dbCategories = [],
  staticCategories = []
}) => {
  const getCategoryIcon = (categoryName) => {
    // Check if it's a database category with an icons field
    const dbCategory = dbCategories.find(cat => cat.name === categoryName)
    if (dbCategory?.icons) {
      return dbCategory.icons
    }
    
    // Fallback to hardcoded icons for static categories
    switch (categoryName) {
      case 'All Discussions':
        return message
      case 'Following':
        return star
      default:
        // Default fallback icon for any category without an icon
        return speechBalloon
    }
  }

  return (
    <div className="categories-list">
      {categories.map((category, index) => (
        <div key={category}>
          <div
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryClick(category)}
          >
            <img src={getCategoryIcon(category)} alt={`${category} Icon`} className={`${category === 'Following' ? 'icon' : ''}`}/>
            <span>{category}</span>
          </div>
          {category === 'Following' && (
            <hr style={{ width: '100%', borderColor: 'gray', margin: '8px 0' }} />
          )}
        </div>
      ))}
      
      {isAdmin && (
        <div
          className="category-item"
          onClick={onEditCategories}
          style={{ cursor: 'pointer', marginTop: '8px', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Edit Categories</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.99984 10H15.4165M15.4165 10L10.4165 5M15.4165 10L10.4165 15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}

export default CategoryList
