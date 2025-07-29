import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import './ForumPage.css'
import IntlMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'

import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import searchIcon from '../../assets/images/academy-icons/svg/search-black.svg'
import pin from '../../assets/images/academy-icons/svg/pin.svg'
import message from '../../assets/images/academy-icons/svg/message-text.svg'
import reply from '../../assets/images/academy-icons/svg/reply.svg'
import chatBubble from '../../assets/images/academy-icons/svg/chat-bubble-empty.svg'
import threeDots from '../../assets/images/academy-icons/svg/more-horiz.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import editIcon from '../../assets/images/academy-icons/svg/pen-icon.svg' // Add this import
import AcademyBtn from '../../components/AcademyBtn'
import StartNewDiscussionModal from './StartNewDiscussionModal'

const StartupForumPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Latest First')
  const [selectedCategory, setSelectedCategory] = useState('All Discussions')
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false) // Add this state

  // Add function to toggle modal
  const toggleDiscussionModal = () => {
    setShowDiscussionModal(prev => !prev)
    // Clear editing post when closing modal
    if (showDiscussionModal) {
      setEditingPost(null)
    }
  }

  // Add function to handle edit post
  const handleEditPost = (post, event) => {
    event.stopPropagation() // Prevent forum post click
    setEditingPost(post)
    setShowDiscussionModal(true)
  }

  // Add function to handle new discussion
  const handleNewDiscussion = () => {
    setEditingPost(null)
    setShowDiscussionModal(true)
  }

  // Function to get the current category from URL
  const getCurrentCategoryFromUrl = () => {
    const path = location.pathname.toLowerCase()
    
    if (path.includes('introductions')) return 'Introductions'
    if (path.includes('announcements')) return 'Announcements'
    if (path.includes('celebrations')) return 'Celebrations'
    if (path.includes('ideas') || path.includes('feedback')) return 'Ideas & Feedback'
    if (path.includes('misc')) return 'Misc. Topics'
    if (path.includes('following')) return 'Following'
    return 'All Discussions'
  }

  // Set active category based on current URL
  useEffect(() => {
    setSelectedCategory(getCurrentCategoryFromUrl())
  }, [location.pathname])

  // Function to handle category navigation
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    
    // Navigate to corresponding page
    switch (category) {
      case 'All Discussions':
        history.push('/startup-forum')
        break
      case 'Following':
        history.push('/startup-forum/following')
        break
      case 'Introductions':
        history.push('/startup-forum/introductions')
        break
      case 'Announcements':
        history.push('/startup-forum/announcements')
        break
      case 'Celebrations':
        history.push('/startup-forum/celebrations')
        break
      case 'Ideas & Feedback':
        history.push('/startup-forum/ideas-feedback')
        break
      case 'Misc. Topics':
        history.push('/startup-forum/misc-topics')
        break
      default:
        history.push('/startup-forum')
    }
  }

  // Function to get header content based on URL
  const getHeaderContent = () => {
    const path = location.pathname.toLowerCase()
    
    if (path.includes('introductions')) {
      return {
        icon: wavingHand,
        title: 'INTRODUCTIONS',
        description: 'Welcome to our newest members. Please share a little about yourself, what brought you to the Academy in Entrepreneurship, and what your goal or vision is.'
      }
    } else if (path.includes('announcements')) {
      return {
        icon: loudSpeaker,
        title: 'ANNOUNCEMENTS',
        description: 'Find announcements, news, and updates about the platform and Learn to Start.'
      }
    } else if (path.includes('celebrations')) {
      return {
        icon: partyPopper,
        title: 'CELEBRATIONS',
        description: 'Celebrate your achievements and the achievements of your peers.'
      }
    } else if (path.includes('ideas') || path.includes('feedback')) {
      return {
        icon: lightBulb,
        title: 'IDEAS & FEEDBACK',
        description: 'Share your ideas and get feedback from your peers.'
      }
    } else if (path.includes('misc')) {
      return {
        icon: speechBalloon,
        title: 'MISC. TOPICS',
        description: 'Ask questions and chat about other course or entrepreneurship topics.'
      }
    }
    // Return null if no specific category is matched
    return null
  }

  const headerContent = getHeaderContent()

  // Function to get the appropriate icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Introductions':
        return wavingHand
      case 'Announcements':
        return loudSpeaker
      case 'Celebrations':
        return partyPopper
      case 'Ideas & Feedback':
        return lightBulb
      default:
        return speechBalloon
    }
  }

  // Extended forum data
  const forumData = [
    {
      id: 1,
      category: 'Introductions',
      isNew: true,
      title: 'Introduce Yourself!',
      description: 'Hey everyone! New member here. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      
      ]
    },
    {
      id: 2,
      category: 'Announcements',
      isNew: true,
      title: 'You can now message using the new forum!',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas lacuis massa nisl malesuada lacinia int...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
      ]
    },
    {
      id: 3,
      category: 'Celebrations',
      title: 'Just launched my new product!',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas lacuis massa nisl malesuada lacinia int...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
      ]
    },
    {
      id: 4,
      category: 'Ideas & Feedback',
      title: 'Idea for new business - need feedback',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas lacuis massa nisl malesuada lacinia int...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
      ]
    },
    {
      id: 5,
      category: 'Misc. Topics',
      title: 'Anyone in the Dallas area want to meet up?',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas lacuis massa nisl malesuada lacinia int...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      ]
    }
  ]

  const categories = [
    'All Discussions',
    'Following',
    'Introductions',
    'Announcements',
    'Celebrations',
    'Ideas & Feedback',
    'Misc. Topics'
  ]

  const filterOptions = ['Latest First', 'Oldest First', 'Most Comments']

  return (
    <>
      <div className='d-flex space-between align-items-center'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>Startup Forum</h3>
              <p className='fs-13 fw-light text-black'>Connect with others and Share Your Achievements</p>
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

      <div className="forum-page">
        <div className="forum-page-container">
          <div className="forum-main-content">
            {/* Search and Controls */}
            <div className="forum-controls">
              <div className="search-section">
                <div className="search-box">
                  <img 
                    src={searchIcon} 
                    alt="Search" 
                    className="forum-search-icon"
                    style={{
                      filter: isSearchFocused 
                        ? 'brightness(0) saturate(100%) invert(47%) sepia(68%) saturate(478%) hue-rotate(166deg) brightness(94%) contrast(89%)'
                        : 'none',
                      transition: 'filter 0.2s ease'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search discussions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="search-input"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conditionally render header content only if it exists */}
            {headerContent && (
              <div className='d-flex flex-column gap-2 mb-2'>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={headerContent.icon} alt={`${headerContent.title} Icon`} style={{ width: '24px', height: '24px' }} />
                  <span className='fs-21 fw-bold'>{headerContent.title}</span>
                </div>
                <p className='fs-15 fw-light'>{headerContent.description}</p>
              </div>
            )}

            {/* Forum Posts */}
            <div className="forum-posts-section">
              {forumData.map((post, index) => (
                <div key={post.id} className="forum-post"
                  onClick={ () => history.push(`/startup-forum/1`) }
                >
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

                    <div className='d-flex gap-3 align-items-center'>
                      <div className='d-flex align-items-center gap-2 justify-content-center'>
                        <img src={message} alt="Message Icon" />
                        <p className='mb-0 pb-0 post-date-paragraph'>Posted: <span>12/23/2025</span></p>
                      </div>
                      <div className='d-flex align-items-center gap-2 justify-content-center'>
                        <img src={reply} alt="Reply Icon" />
                        <p className='mb-0 pb-0 post-date-paragraph'>Latest reply from <span>@cassiewallace</span></p>
                      </div>
                    </div>

                    <p className="post-description">{post.description}</p>
                  </div>


                <div className='d-flex flex-column gap-2 justify-content-end'>

                  <div className="post-right-section">
                    {post.participants.slice(0, 4).map((participant, idx) => (
                      <img
                        key={idx}
                        src={participant}
                        alt="participant"
                        className="participant-avatar"
                      />
                    ))}
                      <div className="participant-more" onClick={(e) => handleEditPost(post, e)}><img src={threeDots} alt="More Participants" /></div>

                  </div>
                   <div className="post-comments-count">
                      <img src={chatBubble} alt="Comments Icon" className="comments-icon" />
                      <span className="post-date-paragraph">{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="forum-sidebar">
            <div className="sidebar-section">
              <div className="categories-list">
                <AcademyBtn
                  title={'Start New Discussion'}
                  onClick={handleNewDiscussion}
                />
                
                {categories.map((category, index) => (
                  <div key={category}>
                    <div
                      className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category === 'All Discussions' && <img src={message} alt="Speech Bubble Icon" />}
                      {category === 'Following' && <img src={star} alt="Star Icon" className='icon' />}
                      {category === 'Introductions' && <img src={wavingHand} alt="Waving Hand Icon" />}
                      {category === 'Announcements' && <img src={loudSpeaker} alt="Megaphone Icon" />}
                      {category === 'Celebrations' && <img src={partyPopper} alt="Party Popper Icon" />}
                      {category === 'Ideas & Feedback' && <img src={lightBulb} alt="Light Bulb Icon" />}
                      {category === 'Misc. Topics' && <img src={speechBalloon} alt="Speech Bubble Icon" />}
                      <span>{category}</span>
                    </div>
                    {category === 'Following' && <hr style={{ width: '100%', borderColor: 'gray', margin: '8px 0' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start New Discussion Modal */}
      <StartNewDiscussionModal 
        show={showDiscussionModal}
        onHide={toggleDiscussionModal}
        editingPost={editingPost}
      />
    </>
  )
}

export default StartupForumPage