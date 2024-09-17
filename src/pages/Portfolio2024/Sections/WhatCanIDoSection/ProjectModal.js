import React, { useEffect, useState } from 'react'
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

  const initialEvidenceData = [
    {
      selectedSkills: [],
      imageFile: null,
      imageUrl: null,
      linkInputValue: '',
      titleInputValue: '',
      type: 'evidence-1'
    },
    {
      selectedSkills: [],
      imageFile: null,
      imageUrl: null,
      linkInputValue: '',
      titleInputValue: '',
      type: 'evidence-2'
    },
    {
      selectedSkills: [],
      imageFile: null,
      imageUrl: null,
      linkInputValue: '',
      titleInputValue: '',
      type: 'evidence-3'
    }
  ]
  const initialProject = [
    {
      showSection: true,
      editorContent: '',
      evidences: [...initialEvidenceData],
      type: 'learn'
    },
    {
      showSection: true,
      editorContent: '',
      evidences: [...initialEvidenceData],
      type: 'develop'
    },
    {
      showSection: true,
      editorContent: '',
      evidences: [...initialEvidenceData],
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
    placeholder,
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
        placeholder={placeholder}
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
        'Give an overview of your approach to research and analysis in determining that the problem you identified is worth solving.',
        // 'Upload and explain your proof of certification skill using any or all of the following: market analysis, industry analysis, problem identification. You can only tag a skill once in the portfolio.',
        'Problem identification',
        "While Learn to Start's extensive alumni network offers valuable insights into the program's impact on both professional and personal lives, this potential has yet to be fully revealed to a broader audience. To better highlight the program's outcomes, it's essential to share more alumni stories in easily accessible spaces, enabling the public to truly appreciate the program's influence.  ",
        {
          menuItem1: 'Content Upload #1',
          menuItem2: 'Content Upload #2',
          menuItem3: 'Content Upload #3'
          // menuItem1: 'Market Analysis Document',
          // menuItem2: 'Industry Analysis Document',
          // menuItem3: 'Problem Identification'
        }
      )}
      {renderEditProject(
        'develop',
        'DEVELOP: YOUR ABILITY TO EXECUTE THROUGH THE DEVELOPMENT OF EMPLOYABILITY AND INDUSTRY SKILLS.',
        'Give an overview of your approach to execution in creating a solution that solves the problem you identified.',
        // 'Upload and explain your proof of certification skill using any or all of the following: solution slide deck, concept plan, business plan. You can only tag a skill once in the portfolio.',
        // 'Problem identification',
        'My Solution',
        "Leverage the power of Learn to Start's extensive alumni network by conducting Zoom interviews with former participants to explore the program's impact on their lives. During these conversations, emphasize key themes that are crucial for thriving as a productive, aligned, and capable individual in the 21st-century marketplace. ",
        {
          menuItem1: 'Content Upload #1',
          menuItem2: 'Content Upload #2',
          menuItem3: 'Content Upload #3'
          // menuItem1: 'Solution Slide Deck',
          // menuItem2: 'Concept Plan Document',
          // menuItem3: 'Business Plan Document'
        }
      )}
      {renderEditProject(
        'brand',
        'BRAND: YOUR ABILITY TO COMMUNICATE AND MARKET YOUR VALUE.',
        'Give an overview of your approach to communicating the value of your solution.',
        // 'Upload and explain your proof of certification skill using any or all of the following: brand charter, brand guidelines booklet, brand video. You can only tag a skill once in the portfolio.',
        'BRAND DESCRIPTION',
        'By introducing the new "Alumni Spotlight" segment on the Learn to Start Live Platform, alumni stories are now accessible to a broader audience. These articles highlight the profound impact Learn to Start has had on students\' lives and showcase how they are applying their skills after graduation.',
        {
          menuItem1: 'Content Upload #1',
          menuItem2: 'Content Upload #2',
          menuItem3: 'Content Upload #3'
          // menuItem1: 'Brand Charter Document',
          // menuItem2: 'Brand Guidelines Booklet',
          // menuItem3: 'Brand Video'
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
