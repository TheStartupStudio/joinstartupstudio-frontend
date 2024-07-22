import React, { useEffect, useState } from 'react'
import ProjectSection from './ProjectSection'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import ProjectModal from './ProjectModal'

function Project(props) {
  const [id, setId] = useState(null)
  const [project, setProject] = useState(null)

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
  }, [props.project, props.project?.children])

  const onUpdateProject = (project) => {
    setProject(project)
  }
  const [isEditSection, setIsEditSection] = useState(false)
  const mode = useSelector((state) => state.portfolio.mode)

  const actions = [
    {
      type: 'edit',
      // action: () => setIsEditSection(true),
      action: () => handleShowAddProjectModal(),
      // handleShowAddProjectModal(),
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

  const learnEvidencesInitial = [
    { title: 'MARKET ANALYSIS', type: 'evidence-1' },
    { title: 'INDUSTRY ANALYSIS', type: 'evidence-2' },
    { title: 'PROBLEM IDENTIFICATION', type: 'evidence-3' }
  ]

  const developEvidencesInitial = [
    { title: 'SOLUTION SLIDE DECK', type: 'evidence-1' },
    { title: 'CONCEPT PLAN', type: 'evidence-2' },
    { title: 'BUSINESS PLAN', type: 'evidence-3' }
  ]

  const brandEvidencesInitial = [
    { title: 'BRAND CHARTER', type: 'evidence-1' },
    { title: 'BRAND GUIDELINES BOOKLET', type: 'evidence-2' },
    { title: 'BRAND VIDEO', type: 'evidence-3' }
  ]
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
    initialEvidences
  ) => {
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
    <div className={'portfolio-data-container mb-3'}>
      <SectionActions actions={actions} />

      <h3 className={'text-center mb-2'}>My project #{props.index + 1}</h3>

      <div>
        {renderSection(
          'learn',
          'LEARN',
          'Your commitment to conscious consumption, research, and analysis.',
          'Problem identification',
          learnEvidencesInitial,
          ''
        )}

        {renderSection(
          'develop',
          'DEVELOP',
          'Your ability to execute through the development of employability and industry skills.',
          'My solution',
          developEvidencesInitial
        )}

        {renderSection(
          'brand',
          'BRAND',
          'Your ability to communicate and market your value.',
          'Branded material',
          brandEvidencesInitial
        )}
      </div>
      {showAddProjectModal && (
        <ProjectModal
          onHide={handleHideAddProjectModal}
          onShow={handleShowAddProjectModal}
          show={showAddProjectModal}
          project={project.children ? project.children : project}
          isEdit={id}
          modalTitle={'Edit Project'}
          onUpdateProject={onUpdateProject}
          onAddProject={(project) => {
            if (project.children.length > 0) {
              setProject(project.children)
              setId(project.id)
            }
          }}
          onDeleteProject={props.onDeleteProject}
        />
      )}
    </div>
  )
}

export default Project
