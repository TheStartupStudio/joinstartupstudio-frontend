import React from 'react'
import Badg1Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-1.svg'
import Badg3Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-3.svg'
import Badg5Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-5.svg'
import Badg10Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-10.svg'
import Badg15Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-15.svg'
import Badg20Colored from '../../../assets/images/platform-badges/colored/Platform Badges_colored-20.svg'
import Badge1Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-1.svg'
import Badge3Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-3.svg'
import Badge5Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-5.svg'
import Badge10Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-10.svg'
import Badge15Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-15.svg'
import Badge20Grey from '../../../assets/images/platform-badges/grey/Platform Badges_grey-20.svg'

const badgeImages = {
  1: { colored: Badg1Colored, grey: Badge1Grey },
  3: { colored: Badg3Colored, grey: Badge3Grey },
  5: { colored: Badg5Colored, grey: Badge5Grey },
  10: { colored: Badg10Colored, grey: Badge10Grey },
  15: { colored: Badg15Colored, grey: Badge15Grey },
  20: { colored: Badg20Colored, grey: Badge20Grey }
}

const Badge = ({ active, activeImg, unActiveImg }) => {
  return (
    <div
      className={`badge-container__icon ${
        active ? 'badge-container__icon__active' : ''
      }`}
    >
      <img
        src={active ? activeImg : unActiveImg}
        className="w-100 h-100"
        alt="badge"
      />
    </div>
  )
}

const BadgeItem = ({ icon, title, activeRange }) => {
  const badgeValues = [1, 3, 5, 10, 15, 20]
  return (
    <div className="badge-item">
      <h4
        className="d-flex align-items-center pb-3"
        style={{ color: '#707070' }}
      >
        {icon} {title}
      </h4>
      <div className="d-flex ">
        {badgeValues.map((value) => (
          <Badge
            key={value}
            activeImg={badgeImages[value].colored}
            unActiveImg={badgeImages[value].grey}
            active={value <= activeRange}
          />
        ))}
      </div>
    </div>
  )
}

export default BadgeItem
