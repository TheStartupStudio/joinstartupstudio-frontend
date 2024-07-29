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

const WhatCanIDo = ({ fetchProjects, myProjects }) => {
  const [projects, setProjects] = useState([])
  console.log('projects', projects)
  useEffect(() => {
    if (myProjects?.data) {
      setProjects(myProjects?.data)
    }
  }, [myProjects?.data])
  const mode = useSelector((state) => state.portfolio.mode)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  const handleShowAddProjectModal = () => setShowAddProjectModal(true)
  const handleHideAddProjectModal = () => setShowAddProjectModal(false)

  useEffect(() => {
    fetchProjects()
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
      isDisplayed: true
    }
  ]
  return (
    <div className={'position-relative'}>
      {projects?.length > 0 ? (
        projects?.map((project, index) => (
          <React.Fragment key={project.id}>
            <Project
              id={project.id}
              project={project}
              index={index}
              onDeleteProject={onDeleteProject}
              onAddProject={(project) => {
                const nonSavedProject = projects.find((project) => !project.id)
                if (nonSavedProject) {
                  setProjects([project])
                }
              }}
            />
          </React.Fragment>
        ))
      ) : (
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
      )}
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
  const {
    user: { user: loggedUser }
  } = state.user
  const {
    whatSection: { myProjects }
  } = state.portfolio
  return {
    loggedUser,
    myProjects
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: () => dispatch(getProjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatCanIDo)
