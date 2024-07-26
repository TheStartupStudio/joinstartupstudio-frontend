import React, { useEffect, useLayoutEffect, useState } from 'react'
import PortfolioModalWrapper from '../../Components/Modals/PortfolioModalWrapper'
import EditProjectSection from './EditProjectSection'
import axiosInstance from '../../../../utils/AxiosInstance'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import { toast } from 'react-toastify'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ConfirmDeleteRecordModal from '../../Components/Modals/ConfirmDeleteRecordModal'

function ProjectModal(props) {
  const [isEdit, setIsEdit] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    props.isEdit && setIsEdit(props.isEdit)
  }, [props.isEdit])
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const projectModalActions = [
    {
      type: 'save',
      action: () => {
        return isEdit ? onUpdateProject?.() : onAddProject?.()
      },
      containSpinner: true,
      isDisplayed: true,
      isSaving
    },
    {
      type: 'hide',
      isDisplayed: true,
      action: () => props.onHide()
    }
  ]
  const initialProject = [
    {
      showSection: true,
      editorContent: '',
      evidences: [],
      type: 'learn'
    },
    {
      showSection: true,
      editorContent: '',
      evidences: [],
      type: 'develop'
    },
    {
      showSection: true,
      editorContent: '',
      evidences: [],
      type: 'brand'
    }
  ]

  const [project, setProject] = useState(initialProject)
  const foundedProject = project?.find((project) => project?.parentId)
  useEffect(() => {
    if (props.project) {
      setProject(props.project)
    }
  }, [props.project])

  const onChange = (data, type) => {
    const updatedProject = project.map((item) => {
      if (item.type === type) {
        return { ...item, ...data }
      }
      return item
    })
    setProject(updatedProject)
  }

  const handleEvidenceUpload = async (evidences) => {
    return await Promise.all(
      evidences.map(async (evidence) => {
        const convertImageFileToFormData = (imageFile) => {
          const formData = new FormData()
          formData.append('img', imageFile)
          return formData
        }
        if (evidence.imageFile) {
          evidence.imageUrl = await uploadImage(
            convertImageFileToFormData(evidence.imageFile)
          )
          delete evidence.imageFile
        }
        return evidence
      })
    )
  }

  const onAddProject = async () => {
    setIsSaving(true)
    const updatedProjects = await Promise.all(
      project.map(async (proj) => {
        const updatedEvidences = await handleEvidenceUpload(proj.evidences)
        return { ...proj, evidences: updatedEvidences }
      })
    )
    await axiosInstance
      .post('/hsPortfolio/myProjects', updatedProjects)
      .then((res) => {
        setIsSaving(false)
        if (props.onAddProject) {
          props.onAddProject(res.data.project)
        }

        props.onHide()
        toast.success('Project updated successfully!')
      })
  }

  const onUpdateProject = async () => {
    setIsSaving(true)
    try {
      const updatedProjects = await Promise.all(
        project.map(async (proj) => {
          const updatedEvidences = await handleEvidenceUpload(proj.evidences)
          return { ...proj, evidences: updatedEvidences }
        })
      )

      await axiosInstance
        .put(
          `/hsPortfolio/myProjects/${foundedProject?.parentId}`,
          updatedProjects
        )
        .then((res) => {
          props.onUpdateProject(res.data.project)
          props.onHide()
          setIsSaving(false)
          toast.success('Project created successfully!')
        })
    } catch (error) {
      console.error('Error saving projects:', error)
    }
  }

  const handleEvidenceDeletion = async (evidences) => {
    return await Promise.all(
      evidences.map(async (evidence) => {
        if (evidence.imageUrl) {
          await deleteImage(evidence.imageUrl)
        }
        return evidence
      })
    )
  }

  const onDeleteProject = async () => {
    try {
      await Promise.all(
        project?.map(async (childProject) => {
          if (childProject?.evidences?.length > 0)
            await handleEvidenceDeletion(childProject?.evidences)
        })
      )

      await axiosInstance
        .delete(`/hsPortfolio/myProjects/${foundedProject?.parentId}`)
        .then(() => {
          props.onDeleteProject?.(foundedProject?.parentId)
          props.onHide()
          toast.success('Project and associated data deleted successfully!')
        })
    } catch (error) {
      console.error('Error deleting project and associated data:', error)
      toast.error('Error deleting project and associated data.')
    }
  }

  const filterDataByType = (data, type) => {
    return data?.find((item) => item.type === type)
  }

  const renderEditProject = (
    type,
    title,
    description,
    editorTitle,
    evidencesMenuItems
  ) => {
    let data
    if (props.project) {
      data = filterDataByType(props.project, type)
    }

    return (
      <EditProjectSection
        type={type}
        title={title}
        description={description}
        editorTitle={editorTitle}
        evidencesMenuItems={evidencesMenuItems}
        onChange={(data) => onChange(data, type)}
        projectData={data}
      />
    )
  }

  return (
    <PortfolioModalWrapper
      title={props.modalTitle ?? 'Add project'}
      show={props.show}
      onHide={props.onHide}
      actions={projectModalActions}
      class={'add-project-modal '}
    >
      {renderEditProject(
        'learn',
        'LEARN: YOUR COMMITMENT TO CONSCIOUS CONSUMPTION, RESEARCH, AND ANALYSIS.',
        'Upload and explain your proof of certification skill using any or all of the following: market analysis, industry analysis, problem identification. You can only tag a skill once in the portfolio.',
        'Problem identification',
        {
          menuItem1: 'Market Analysis Document',
          menuItem2: 'Industry Analysis Document',
          menuItem3: 'Problem Identification'
        }
      )}
      {renderEditProject(
        'develop',
        'DEVELOP: YOUR ABILITY TO EXECUTE THROUGH THE DEVELOPMENT OF EMPLOYABILITY AND INDUSTRY SKILLS.',
        'Upload and explain your proof of certification skill using any or all of the following: solution slide deck, concept plan, business plan. You can only tag a skill once in the portfolio.',
        'Problem identification',
        {
          menuItem1: 'Solution Slide Deck',
          menuItem2: 'Concept Plan Document',
          menuItem3: 'Business Plan Document'
        }
      )}
      {renderEditProject(
        'brand',
        'BRAND: YOUR ABILITY TO COMMUNICATE AND MARKET YOUR VALUE.',
        'Upload and explain your proof of certification skill using any or all of the following: brand charter, brand guidelines booklet, brand video. You can only tag a skill once in the portfolio.',
        'BRAND DESCRIPTION',
        {
          menuItem1: 'Brand Charter Document',
          menuItem2: 'Brand Guidelines Booklet',
          menuItem3: 'Brand Video'
        }
      )}

      {isEdit && (
        <div className={' mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton variant={'text'} align={'end'} name={'DELETE PROJECT'} />
        </div>
      )}

      {confirmDeleteModal && (
        <ConfirmDeleteRecordModal
          onHide={() => setConfirmDeleteModal(false)}
          show={confirmDeleteModal}
          modalContent={{
            title: 'YOU’RE ABOUT TO DELETE THIS PROJECT?',
            description:
              'If you delete the project, it is not recoverable and will no longer appear in your portfolio.',
            action: () => onDeleteProject()
          }}
        />
      )}
    </PortfolioModalWrapper>
  )
}

export default ProjectModal
