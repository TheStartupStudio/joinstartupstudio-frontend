import React, { useState } from 'react'
import './LeaderBoardPage.css'
import IntlMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'

import leaderboardStar from '../../assets/images/academy-icons/svg/leaderboard-star.svg'
import trophy from '../../assets/images/academy-icons/svg/fluent-mdl2_trophy-2.svg'
import medal from '../../assets/images/academy-icons/svg/lucide_medal.svg'
import mapPin from '../../assets/images/academy-icons/svg/map-pin.svg'
import filter from '../../assets/images/academy-icons/svg/filter.svg'
import list from '../../assets/images/academy-icons/svg/list.svg'
import clipboard from '../../assets/images/academy-icons/svg/clipboard-check.svg'
import award from '../../assets/images/academy-icons/svg/lucide_award.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'

const LeaderBoardPage = () => {
  const [activeFilter, setActiveFilter] = useState('Top Points')

  // Extended leaderboard data
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Sarah Chen',
      location: 'San Francisco, USA',
      badge: 'Master Entrepreneur',
      points: 1245,
      reflections: 28,
      videos: 28,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 2,
      rank: 2,
      name: 'Marcus Johnson',
      location: 'San Francisco, USA',
      badge: 'Master Entrepreneur',
      points: 1180,
      reflections: 25,
      videos: 14,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 3,
      rank: 3,
      name: 'James Wilson',
      location: 'San Francisco, USA',
      badge: 'Master Entrepreneur',
      points: 1002,
      reflections: 20,
      videos: 12,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 4,
      rank: 4,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 9,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 4,
      rank: 5,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 9,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 4,
      rank: 6,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 600,
      reflections: 19,
      videos: 9,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 4,
      rank: 7,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 9,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    },
    {
      id: 4,
      rank: 8,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 9,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
    }
  ]

  // Achievement badges data
  const achievementBadges = [
    {
      id: 1,
      name: 'Master Entrepreneur',
      points: '1000+ pts',
      icon: trophy,
    },
    {
      id: 2,
      name: 'Excellence Award',
      points: '750+ pts',
      icon: medal,
    },
    {
      id: 3,
      name: 'Rising Star',
      points: '500+ pts',
      icon: star,
    },
    {
      id: 4,
      name: 'Achiever',
      points: '250+ pts',
      icon: award,
    }
  ]

  // Current user data (for the right sidebar)
  const currentUser = {
    name: 'Kenia Anders',
    location: 'San Francisco, USA',
    badge: 'Rising Star',
    points: 508,
    rank: '#104',
    reflections: 28,
    videos: 28,
    avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
  }

  const filterButtons = ['Top Points', 'Reflections Completed', 'Reflections Ranked']

  const getRankIcon = (rank) => {
    const icons = {
      1: <img src={trophy} alt="Gold Trophy" />,
      2: <img src={medal} alt="Silver Medal" />,
      3: <img src={award} alt="Bronze Award" />
    }
    return icons[rank] || `#${rank}`
  }

  const getRankClass = (rank) => {
    if (rank <= 3) return 'top-rank'
    return 'other-rank'
  }

  const getBadgeBackground = (badgeType) => {
    if (badgeType === 'Master Entrepreneur') {
      return 'linear-gradient(98deg, rgba(81, 199, 223, 0.50) 17.18%, #51C7DF 82.5%)'
    } else if (badgeType === 'Rising Star') {
      return 'linear-gradient(98deg, rgba(255, 107, 157, 0.50) 17.18%, #FF6B9D 82.5%)'
    } else {
      return 'linear-gradient(98deg, rgba(153, 204, 51, 0.50) 17.18%, #99CC33 82.5%)'
    }
  }

  const getBadgeIcon = (badgeType) => {
    if (badgeType === 'Master Entrepreneur') {
      return <img src={trophy} alt="Badge Icon" className="badge-icon-board trophy-white" />
    } else if (badgeType === 'Rising Star') {
      return <img src={star} alt="Badge Icon" className="badge-icon-board trophy-white" />
    } else {
      return <img src={medal} alt="Badge Icon" className="badge-icon-board trophy-white" />
    }
  }

  return (
    <>
    <div className='d-flex space-between align-items-center'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>LEADER BOARD</h3>
              <p className='fs-13 fw-light text-black'>Earning Points Through Reflections</p>
            </div>
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
      </div>
    <div className="leaderboard-page">
      <div className="leaderboard-page-container">
        {/* Main Content */}
        <div className="leaderboard-main-content">
          {/* Filter Section */}
          <div className="leaderboard-filters">
            <div className="filter-left">
              <span className="filter-icon"><img src={filter} alt="Filter" /></span>
              <span className="filter-text">Filter by:</span>
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'Top Points' && <img src={trophy} alt="Trophy" className="filter-icon-img" />}
                  {filter === 'Reflections Completed' && <img src={clipboard} alt="Clipboard" className="filter-icon-img" />}
                  {filter === 'Reflections Ranked' && <img src={list} alt="List" className="filter-icon-img" />}
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="achievement-badges-section">
            <h3 className="section-title">Achievement Badges</h3>
            <div className="achievement-badges-grid">
              {achievementBadges.map((badge) => (
                <div key={badge.id} className="achievement-badge-card">
                  <div className="badge-icon-container" style={{ backgroundColor: badge.color + '20', border: `2px solid ${badge.color}` }}>
                    <img src={badge.icon} alt={badge.name} className="achievement-badge-icon" />
                  </div>
                  <div className="badge-info">
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-points">{badge.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="leaderboard-list-section">
            {leaderboardData.map((user, index) => (
          <div key={user.id} className={`leaderboard-item-wrapper ${getRankClass(user.rank)}`}>
            <div className={`leaderboard-item ${getRankClass(user.rank)}`}>
              <div className="responsive-header-board">
                <div className="rank-container">
                  {user.rank <= 3 ? (
                    <div className="rank-medal">
                      {getRankIcon(user.rank)}
                    </div>
                  ) : (
                    <div className="rank-number">#{user.rank}</div>
                  )}
                </div>
                
                <div className="user-avatar-container">
                  <div className="user-avatar-bg">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="user-avatar"
                    />
                  </div>
                </div>
              </div>
              
              <div className="user-info">
                <div className="user-header">
                  <h4 className="user-name">{user.name}</h4>
                  <span 
                    className="user-badge"
                    style={{ background: getBadgeBackground(user.badge) }}
                  >
                    {getBadgeIcon(user.badge)}
                    {user.badge}
                  </span>
                </div>

                <div className="user-board-details">
                  <div className="user-location">
                    <span className="location-icon"><img src={mapPin} alt="Location Icon" /></span>
                    {user.location}
                  </div>
                  
                  <div className="user-stats">
                    <span className="stat-item"><span style={{color: '#51C7DF'}}> {user.reflections} </span> Reflections</span>
                    <span className="stat-item"><span style={{color: '#99CC33'}}> {user.videos} </span> Videos</span>
                  </div>
                </div>
              </div>
              
              <div className="user-points">
                <div className="points-value">{user.points}</div>
                <div className="points-label">points</div>
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>

        {/* Right Sidebar - Current User */}
        <div className="leaderboard-sidebar">
          <div className="current-user-card">
            <div className="current-user-header">
              <img src={currentUser.avatar} alt={currentUser.name} className="current-user-avatar" />
              <div className="current-user-info">
                <h3 className="current-user-name">{currentUser.name}</h3>
                <span className="current-user-badge" style={{ background: getBadgeBackground(currentUser.badge) }}>
                  {getBadgeIcon(currentUser.badge)}
                  {currentUser.badge}
                </span>
                <div className="current-user-location">
                  <img src={mapPin} alt="Location" className="location-icon-sidebar" />
                  {currentUser.location}
                </div>
                <div className="current-user-stats">
                  <span>{currentUser.reflections} Reflections</span>
                  <span>{currentUser.videos} Videos</span>
                </div>
              </div>
            </div>
            <div className="current-user-points">
              <div className="points-display">
                <div className="points-value-sidebar">{currentUser.points} pts</div>
                <div className="points-rank">Rank {currentUser.rank}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
  )
}

export default LeaderBoardPage