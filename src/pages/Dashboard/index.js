import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import IntlMessages from '../../utils/IntlMessages'
import Profile from '../../components/Profile'
import Calendar from '../../components/Calendar'
import RecommendedConnections from '../../components/Connections/recommendedConnections'
import { changeSidebarState } from '../../redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { IsUserLevelAuthorized, ShowMessenger } from '../../utils/helpers'
import NewestProjectsByTheCommunity from '../StartupProfile/NewestProjectsByTheCommunity'
import Messenger from '../../components/Messenger/Messenger'
import UserContactForm from '../../components/UserContactForm'

function Dashboard() {
  const [width, setWidth] = useState(window.innerWidth)
  const dispatch = useDispatch()
  const [newMessage, setNewMessage] = useState([])
  const [chatId, setChatId] = useState('')

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 col-xl-9 pe-0 me-0'>
          <div className='account-page-padding page-border'>
            <h3 className='page-title'>
              <IntlMessages id='navigation.dashboard' />
            </h3>
            <p className='page-description'>
              <IntlMessages id='dashboard.page_description' />
            </p>
            <Profile
              newMessage={newMessage}
              chatOpened={chatId}
              clearChat={() => setChatId('')}
            />

            <div className='mt-4'>
              <div className='row'>
                <NewestProjectsByTheCommunity width={width} from='Dashboard' />
              </div>
            </div>
            <div className='my-4'>
              <div className='row'>
                <div className='col-md-12 col-lg-8'>
                  <h3
                    className='page-title'
                    style={{ textTransform: 'capitalize' }}
                  >
                    <IntlMessages id='dashboard.recommended_connections' />
                  </h3>
                </div>
                <div className='col-md-12 col-lg-4 text-lg-end'>
                  <h2
                    className='view-connections link mt-2'
                    style={{ cursor: 'pointer' }}
                  >
                    <Link to='/my-connections'>
                      <IntlMessages id='dashboard.view_all_connections' />
                    </Link>
                  </h2>
                </div>
                <RecommendedConnections width={width} />
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <Calendar />
            {IsUserLevelAuthorized() ? (
              <Messenger
                chatOpened={(id) => setChatId(id)}
                newMessage={(message) => setNewMessage(message)}
              />
            ) : (
              <UserContactForm />
            )}
            <div
              className={`community-connect px-3 ${
                !IsUserLevelAuthorized() && 'notAllowed'
              } my-2`}
            >
              <Link to='/my-connections'>
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{
                    color: '#01C5D1',
                    background: 'white',
                    borderRadius: '50%',
                    height: '25px',
                    width: '36px',
                    opacity: '1'
                  }}
                />
              </Link>
              <Link to='/my-connections'>
                <p className='my-auto ms-2'>Connect with my community</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
