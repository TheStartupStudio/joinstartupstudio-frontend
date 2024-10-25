import React, { useEffect, useState } from 'react'
import ProjectSection from './ProjectSection'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import ProjectModal from './ProjectModal'

function Project(props) {
  const [id, setId] = useState(null)
  const [project, setProject] = useState(null)
  const [title, setTitle] = useState('')

  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  const handleShowAddProjectModal = () => {
    setShowAddProjectModal(true)
  }
  const handleHideAddProjectModal = () => setShowAddProjectModal(false)
  useEffect(() => {
    if (props.id) setId(props.id)
  }, [props.id])
  useEffect(() => {
    if (props.project?.children) {
      setProject(props.project?.children)
    } else {
      setProject(props.project)
    }
    setTitle(props.project?.title)
  }, [props.project, props.project?.children, props.project?.title])

  const onUpdateProject = (project) => {
    setProject(project)
    setTitle(project.title)
  }
  const [isEditSection, setIsEditSection] = useState(false)
  const mode = useSelector((state) => state.portfolio.mode)

  const actions = [
    {
      type: 'edit',
      action: () => handleShowAddProjectModal(),
      isDisplayed: mode === 'edit' && isEditSection === false
    },
    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  const getProjectSectionByType = (type) => {
    if (project?.children) {
      return project?.children?.find((child, index) => child.type === type)
    } else {
      return project?.find((child, index) => child.type === type)
    }
  }

  const getEvidenceData = (evidencesInitialData, type) => {
    const evidences = getProjectSectionByType(type)?.evidences
    let newEvidences = evidencesInitialData?.map((evidence, index) => {
      const evidenceFounded = evidences?.find((ev) => ev.type === evidence.type)
      if (evidenceFounded) {
        return {
          ...evidence,
          ...evidenceFounded
        }
      }
      return evidence
    })
    return newEvidences
  }


  const getProjectContent = (type) => {
    return getProjectSectionByType(type)?.editorContent
  }

  const getProjectShowSection = (type) => {
    return getProjectSectionByType(type)?.showSection
  }
  const renderSection = (
    type,
    title,
    subTitle,
    contentTitle,

  ) => {
    const initialEvidences = [
      {  type: 'evidence-1' },
      {  type: 'evidence-2' },
      {  type: 'evidence-3' }
    ]
    const evidences = getEvidenceData(initialEvidences, type)
    const content = getProjectContent(type)
    const showSection = getProjectShowSection(type)
    if (showSection)
      return (
        <ProjectSection
          key={title}
          type={type}
          title={title}
          subtitle={subTitle}
          content={{
            title: contentTitle,
            text: content
          }}
          evidences={evidences}
        />
      )
  }

  return (
    <div className={'portfolio-data-container mb-3 justify-content-start'}>
      <SectionActions actions={actions} />

      <h3 className={'text-center mb-2 my-project-title'}>
        {title}
      </h3>

      <div>
        {renderSection(
          'learn',
          'LEARN',
          'Your commitment to conscious consumption, research, and analysis.',
          'Problem identification',
        )}

        {renderSection(
          'develop',
          'DEVELOP',
          'Your ability to execute through the development of employability and industry skills.',
          'My solution',
        )}

        {renderSection(
          'brand',
          'BRAND',
          'Your ability to communicate and market your value.',
          'Branded material',
        )}
      </div>
      {showAddProjectModal && (
        <ProjectModal
          onHide={handleHideAddProjectModal}
          onShow={handleShowAddProjectModal}
          show={showAddProjectModal}
          project={project.children ? project.children : project}
          projectTitle={title}
          isEdit={id}
          modalTitle={'Edit Project'}
          onUpdateProject={onUpdateProject}
          onAddProject={(project) => {
            if (project.children.length > 0) {
              setProject(project.children)
              setId(project.id)
              props.onAddProject(project)
            }
          }}
          onDeleteProject={props.onDeleteProject}
        />
      )}
    </div>
  )
}

export default Project
