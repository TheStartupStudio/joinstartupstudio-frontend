import React from 'react'
import './LeaderBoard.css'
import leaderboardStar from '../../assets/images/academy-icons/svg/leaderboard-star.svg'
import trophy from '../../assets/images/academy-icons/svg/fluent-mdl2_trophy-2.svg'
import medal from '../../assets/images/academy-icons/svg/lucide_medal.svg'
import mapPin from '../../assets/images/academy-icons/svg/map-pin.svg'

const LeaderBoard = () => {
  // Dummy leaderboard data
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Sarah Chen',
      location: 'San Francisco, USA',
      badge: 'Master Entrepreneur',
      points: 1245,
      reflections: 26,
      videos: 28,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',

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
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',

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
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',

    },
    {
      id: 4,
      rank: 4,
      name: 'Emma Rodrigues',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 3,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
    },
    {
      id: 5,
      rank: 5,
      name: 'Priya Patel',
      location: 'San Francisco, USA',
      badge: 'Excellence Award',
      points: 885,
      reflections: 19,
      videos: 5,
      avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
    }
  ]

  const getRankIcon = (rank) => {
    const icons = {
      1: <img src={trophy} alt="Gold Trophy" />,
      2: <img src={medal} alt="Silver Medal" />,
      3: <img src={trophy} alt="Bronze Award" />
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
    } else {
      return 'linear-gradient(98deg, rgba(153, 204, 51, 0.50) 17.18%, #99CC33 82.5%)'
    }
  }

  const getBadgeIcon = (badgeType) => {
    if (badgeType === 'Master Entrepreneur') {
      return <img src={trophy} alt="Badge Icon" className="badge-icon-board trophy-white" />
    } else {
      return <img src={medal} alt="Badge Icon" className="badge-icon-board trophy-white" />
    }
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-title-container">
          <div className="leaderboard-icon"><img src={leaderboardStar} alt="Leaderboard Star" /></div>
          <h3 className="leaderboard-title">Leader Board</h3>
        </div>
        <button className="go-to-leaderboard-btn">
          Go to Leader Board
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="leaderboard-content">
        {leaderboardData.map((user, index) => (
          <div key={user.id} className={`leaderboard-item ${getRankClass(user.rank)}`}>
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
              <div 
                className="user-avatar-bg"
              >
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
        ))}
      </div>
    </div>
  )
}

export default LeaderBoard