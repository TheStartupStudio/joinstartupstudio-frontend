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
    // Check if it's a database category with an icon
    const dbCategory = dbCategories.find(cat => cat.name === categoryName)
    if (dbCategory?.icon) {
      return dbCategory.icon
    }
    
    // Fallback to hardcoded icons for static categories
    switch (categoryName) {
      case 'All Discussions':
        return message
      case 'Following':
        return star
      case 'Introductions':
        return wavingHand
      case 'Announcements':
        return loudSpeaker
      case 'Celebrations':
        return partyPopper
      case 'Ask for Feedback':
        return speechBalloon
      case 'Ask for Collaboration':
        return wavingHand
      case 'Ask for Mentorship':
        return lightBulb
      default:
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
          style={{ cursor: 'pointer', marginTop: '8px' }}
        >
          <img src={editIcon} alt="Edit Icon" style={{ width: '20px' }} />
          <span>Edit Categories</span>
        </div>
      )}
    </div>
  )
}

export default CategoryList
