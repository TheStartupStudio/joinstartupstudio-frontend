import React from 'react'
import './ForumSection.css'
import mentorship from '../../assets/images/academy-icons/svg/icon.core-mentorship-icon.svg'
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import pin from '../../assets/images/academy-icons/svg/pin.svg'

const ForumSection = () => {
  // Function to get the appropriate icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Introductions':
        return wavingHand
      case 'Announcements':
        return loudSpeaker
      case 'Celebrations':
        return partyPopper
      default:
        return speechBalloon
    }
  }

  // Dummy forum data
  const forumData = [
    {
      id: 1,
      category: 'Introductions',
      title: 'Introduce Yourself!',
      description: 'Hey everyone! New member here. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla l...',
      author: {
        name: 'John Doe',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      isNew: true,
    },
    {
      id: 2,
      category: 'Announcements',
      title: 'You can now message using the new forum!',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
      author: {
        name: 'Admin',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      isNew: true,
    },
    {
      id: 3,
      category: 'Celebrations',
      title: 'Just launched my new product!',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
      author: {
        name: 'Sarah Smith',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      isNew: false,
    },
    {
      id: 4,
      category: 'Misc. Topics',
      title: 'Anyone in the Dallas area want to meet up?',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      isNew: false,
    },
    {
      id: 5,
      category: 'Misc. Topics',
      title: 'Anyone in the Dallas area want to meet up?',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas...',
      author: {
        name: 'Lisa Brown',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      isNew: false,
    }
  ]

  return (
    <div className="forum-section">
      <div className="forum-header">
        <div className="forum-title-container">
          <div className="forum-icon"><img src={mentorship} alt="Mentorship Icon" /></div>
          <h3 className="forum-title">Startup Forum</h3>
        </div>
        <button className="go-to-forum-btn">
          Go to Forum
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="forum-content">
        {forumData.map((post, index) => (
          <div key={post.id} className="forum-post">
            <div className="post-avatar-container">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="post-avatar"
              />
              {post.isNew && <div className="new-indicator"><img src={pin} alt="Pin Icon" /></div>}
            </div>
            
            <div className="post-content">
              <div className="post-header">
                <span 
                  className="post-category"
                  style={{ backgroundColor: post.categoryColor }}
                >
                  <img 
                    src={getCategoryIcon(post.category)} 
                    alt={post.category}
                    className="category-icon"
                  />
                  {post.category}
                </span>
              </div>
              
              <h4 className="post-title">{post.title}</h4>
              <p className="post-description">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForumSection