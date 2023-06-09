import React, { useEffect, useState } from 'react'
import NewestProjectsByTheCommunity from './NewestProjectsByTheCommunity'
import MyProjects from './MyProjects'
import axiosInstance from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import { CreateNewStartupProfile } from '../../components/StartupProfile/modals/createNew'
import './style/index.css'
import { IsUserLevelAuthorized, ShowMessenger } from '../../utils/helpers'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { Container, Row } from 'react-bootstrap'

function MyStartupProfile() {
  const [userProject, setUserProject] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
  const [myProjects, setMyProjects] = useState([])
  const [createStartUpProfile, setCreateStartupProfile] = useState(false)

  const getMyProject = async () => {
    await axiosInstance
      .get('/business/ById')
      .then((res) => {
        setMyProjects(res.data.data)
      })
      .catch((err) => err)
  }

  const removeProject = (id) => {
    setMyProjects(myProjects.filter((project) => project.id != id))
  }

  const closeModal = (name) => {
    if (name == 'startup') {
      setCreateStartupProfile(false)
    }
  }

  const updateMyBussniess = async (data) => {
    setMyProjects((old) => [...old, data])
  }

  useEffect(() => {
    getMyProject()

    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () => {
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
    }
  }, [])

  return (
    <>
      <Container fluid>
        <Row>
          <div className="col-12 flex-grow-3 col-xl-9">
            <div
              className="account-page-padding page-border"
              style={{ borderRight: 'none !important' }}
            >
              <div className="d-md-flex">
                <div className="flex-grow-1">
                  <p className="StartupPortfolio_title mb-0">MY PROJECTS</p>
                  <h1 className="StartupPortfolio_description">
                    Sharing my solutions with the global community.
                  </h1>
                </div>
                <div className="flex-shrink-0">
                  <button
                    className="lts-button"
                    onClick={() => {
                      setCreateStartupProfile(true)
                    }}
                  >
                    ADD NEW PROJECT
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <NewestProjectsByTheCommunity width={width} />
              </div>
              <div className="mt-5">
                <MyProjects
                  width={width}
                  onClick={() => setCreateStartupProfile(true)}
                  MyProjects={myProjects && myProjects}
                  removeProject={(id) => removeProject(id)}
                  editAble={true}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-3 px-2">
            <ConnectionRequestsBox from="MyProject" type={'no-margin'} />
            <ShowMessenger />
            {/* <div
              className={`community-connect ${
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
            </div> */}
          </div>
        </Row>
        <CreateNewStartupProfile
          updateData={(data) => updateMyBussniess(data)}
          show={createStartUpProfile}
          onHide={() => closeModal('startup')}
        />
      </Container>
    </>
  )
}
export default MyStartupProfile
