import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import ProjectModal from './ProjectModal'
import { getProjects, getSkills } from '../../../../redux/portfolio/Actions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import Project from './Project'

const WhatCanIDo = ({ fetchProjects, myProjects }) => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (myProjects?.data) {
      setProjects(myProjects?.data)
    }
    // else {
    //   setProjects(initialProjects)
    // }
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

  console.log('projects', projects)

  return (
    <div className={'position-relative'}>
      {projects?.map((project, index) => (
        <React.Fragment key={project.id}>
          <Project
            id={project.id}
            project={project}
            index={index}
            onDeleteProject={onDeleteProject}
          />
        </React.Fragment>
      ))}
      {mode === 'edit' && (
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
