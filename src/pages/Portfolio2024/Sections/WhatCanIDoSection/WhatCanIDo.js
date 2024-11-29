import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import ProjectModal from './ProjectModal'
import { getProjects, getSkills } from '../../../../redux/portfolio/Actions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import Project from './Project'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import projectImage from '../../../../assets/images/HS-Portfolio-Icons/project.png'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import CarouselComponent from '../../../../components/Carousel/CarouselComponent'

const WhatCanIDo = ({ fetchProjects, myProjects, portfolioType, data }) => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (portfolioType !== 'peer' || portfolioType !== 'public') {
      if (myProjects?.data) {
        setProjects(myProjects?.data)
      }
    }
  }, [myProjects?.data])
  const mode = useSelector((state) => state.portfolio.mode)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  const handleShowAddProjectModal = () => setShowAddProjectModal(true)
  const handleHideAddProjectModal = () => setShowAddProjectModal(false)

  useEffect(() => {
    if (portfolioType === 'peer' || portfolioType === 'public') {
      setProjects(
        data?.myProjects?.data?.length > 0 ? data?.myProjects?.data : []
      )
    }
    if (portfolioType !== 'peer' && portfolioType !== 'public') {
      fetchProjects()
    }
  }, [])

  const onDeleteProject = (projectId) => {
    const filteredProjects = projects?.filter(
      (project) => project.id !== projectId
    )
    setProjects(filteredProjects)
  }

  const emptyDataActions = [
    {
      type: 'add',
      action: () => handleShowAddProjectModal(),
      isDisplayed: mode === 'edit'
    }
  ]

  return (
    <div className={'position-relative'} style={{ marginTop: '30px' }}>
      <div className={'row gap-4'}>
        {projects?.length > 0 ? (
          <>
            <CarouselComponent
              className={'yespadding-caro'}
              data={projects}
              renderItems={(item, index) => {
                return (
                  <>
                    <React.Fragment key={item.id}>
                      <Project
                        id={item.id}
                        project={item}
                        index={index}
                        onDeleteProject={onDeleteProject}
                        onAddProject={(project) => {
                          const nonSavedProject = projects.find(
                            (project) => !project.id
                          )
                          if (nonSavedProject) {
                            setProjects([project])
                          }
                        }}
                      />
                    </React.Fragment>
                  </>
                )
              }}
            />
          </>
        ) : (
          <>
            <PortfolioDataContainer title={'Project'} height={440}>
              <NoDataDisplay
                src={projectImage}
                classNames={'mt-1'}
                text={
                  'You don’t have any projects yet! Click the button to add one.'
                }
              />
              <SectionActions actions={emptyDataActions} />
            </PortfolioDataContainer>
          </>
        )}
      </div>

      {projects?.length > 0 &&
        projects.some((project) => project.id) &&
        mode === 'edit' && (
          <AddEntryButton
            title={`Add new 'My Projects' section`}
            onClick={handleShowAddProjectModal}
          />
        )}
      {showAddProjectModal && (
        <ProjectModal
          onHide={handleHideAddProjectModal}
          onShow={handleShowAddProjectModal}
          show={showAddProjectModal}
          onAddProject={(project) => {
            setProjects([...projects, project])
          }}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  const userState = state.user ?? {}
  const portfolioState = state.portfolio ?? {}

  const { user: loggedUser = null } = userState

  const { whatSection: { myProjects } = {} } = portfolioState

  return {
    loggedUser,
    myProjects
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: () => dispatch(getProjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatCanIDo)
