import React, { useState, useEffect, useCallback } from 'react'
import './Portfolio.css'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
import WhatCanIDoCard from '../../components/NewPortfolio/WhatCanIDo'
import learnIcon from '../../assets/images/learn.svg'
import buildIcon from '../../assets/images/build.svg'
import brandIcon from '../../assets/images/brand.svg'
import titleIcon from '../../assets/images/material-symbols_stacks-outline-rounded.svg'
import editProject from '../../assets/images/EditProject.png'
import myFailures from '../../assets/images/myfailures.png'
import nothingAdded from '../../assets/images/nothing-added.svg'
// removed unused whatCanIDo image import
import sparkIcon from '../../assets/images/spark.svg'
import CarouselComponent from '../../components/Carousel/CarouselComponent'
import EditCard from '../../components/NewPortfolio/EditCard'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { uploadImage, deleteImage } from '../../utils/helpers'
import ReactImageUpload from '../Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import penIcon from '../../assets/images/pen-icon.svg'
import ConfirmationModal from '../../components/NewPortfolio/ConfirmationModal'
import what from '../../assets/icons/What.png'
import { useSelector } from 'react-redux'

const WhatCanIDo = ({
  sectionTitle,
  sectionDescription,
  myProjects,
  setRefreshData,
  portfolioType,
  isPublicView,
  userBasicInfo,
  isPreviewMode,
  hideSectionHeader
}) => {
  const isPublicView1 = isPublicView || portfolioType === 'public'
  const userData = useSelector((state) => state.user?.user)
  const loggedInUserId = userData?.user?.id

  const isOwner = loggedInUserId && userBasicInfo?.userId === loggedInUserId
  const canEdit = !isPublicView1 && !isPreviewMode && isOwner

  const [carouselActiveIndex, setCarouselActiveIndex] = useState(0)
  // removed unused isRefreshing state

  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [editData, setEditData] = useState(null)
  // removed separate projectTitle state (using projectData.title)
  const [editedContent, setEditedContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [evidences, setEvidences] = useState([])
  const [showEditProject, setShowEditProject] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)

  const [continueAddingProject, setContinueAddingProject] = useState(null)
  const [currentSection, setCurrentSection] = useState('title')

  const createEmptyEvidences = (count) =>
    Array(count)
      .fill()
      .map((_, index) => ({
        id: null,
        selectedSkills: [],
        imageFile: null,
        imageUrl: null,
        linkInputValue: '',
        titleInputValue: '',
        type: `evidence-${index + 1}`
      }))

  const [projectData, setProjectData] = useState({
    title: '',
    learn: { id: null, editorContent: '', evidences: createEmptyEvidences(3) },
    develop: {
      id: null,
      editorContent: '',
      evidences: createEmptyEvidences(3)
    },
    brand: { id: null, editorContent: '', evidences: createEmptyEvidences(3) }
  })
  // removed unused continueAdding state
  const [imageProperties, setImageProperties] = useState(
    Array(3).fill({
      originalImage: '',
      croppedImage: null,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0
    })
  )

  useEffect(() => {
    if (editMode && editData) {
      setEvidences(editData.evidences || [])
      setEditedContent(editData.editorContent || '')
    }
  }, [editMode, editData])

  const handleContinue = () => {
    if (!canEdit) return
    handleAddProject(true)
  }

  const handleEvidenceChange = useCallback(
    (index, field, value) => {
      if (!canEdit) return
      setEvidences((prev) => {
        const updated = [...prev]
        if (!updated[index]) {
          updated[index] = {
            evidenceTitle: '',
            linkInputValue: '',
            imageUrl: ''
          }
        }
        updated[index] = { ...updated[index], [field]: value }
        return updated
      })
    },
    [canEdit]
  )

  const handleImageUpload = useCallback(
    async (file, index) => {
      if (!canEdit) return
      try {
        setIsSaving(true)
        const formData = new FormData()
        formData.append('img', file)
        const uploadedImage = await uploadImage(formData)

        if (!uploadedImage) throw new Error('Upload failed')

        if (addMode) {
          setProjectData((prev) => {
            const sectionData = { ...prev[currentSection] }
            const newEvidences = [...sectionData.evidences]
            newEvidences[index] = {
              ...newEvidences[index],
              imageUrl: uploadedImage
            }
            return {
              ...prev,
              [currentSection]: {
                ...sectionData,
                evidences: newEvidences
              }
            }
          })
        } else {
          handleEvidenceChange(index, 'imageUrl', uploadedImage)
        }

        return uploadedImage.url
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload image')
        throw error
      } finally {
        setIsSaving(false)
      }
    },
    [handleEvidenceChange, addMode, currentSection, canEdit]
  )

  const handleDeleteImage = useCallback(
    async (index) => {
      if (!canEdit) return
      const imageUrl = evidences[index]?.imageUrl
      if (!imageUrl) return

      try {
        setIsSaving(true)
        await deleteImage(imageUrl)
        handleEvidenceChange(index, 'imageUrl', '')
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete image')
      } finally {
        setIsSaving(false)
      }
    },
    [evidences, handleEvidenceChange, canEdit]
  )

  const handleDeleteProject = async () => {
    if (!canEdit) return
    if (!projectToDelete) return

    try {
      await axiosInstance.delete(`hsPortfolio/myProjects/${projectToDelete.id}`)

      setShowDeleteConfirmation(false)
      setProjectToDelete(null)
      setAddMode(false)
      setContinueAddingProject(null)
      setCurrentSection('title')
      setProjectData({
        title: '',
        learn: { editorContent: '', evidences: createEmptyEvidences(3) },
        develop: { editorContent: '', evidences: createEmptyEvidences(3) },
        brand: { editorContent: '', evidences: createEmptyEvidences(3) }
      })

      setRefreshData((prev) => !prev)
      toast.success('Project deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete project')
    }
  }

  const confirmDelete = useCallback(
    (project) => {
      if (!canEdit) return
      setProjectToDelete(project)
      setShowEditProject(false)
      setShowDeleteConfirmation(true)

      setAddMode(false)
      setProjectData({
        title: '',
        learn: { editorContent: '', evidences: createEmptyEvidences(3) },
        develop: { editorContent: '', evidences: createEmptyEvidences(3) },
        brand: { editorContent: '', evidences: createEmptyEvidences(3) }
      })
    },
    [canEdit]
  )
  const handleFileSelect = useCallback(
    async (event, index) => {
      if (!canEdit) return
      const file = event.target.files[0]
      if (!file) return

      try {
        const imageUrl = await handleImageUpload(file, index)
        setImageProperties((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            originalImage: imageUrl
          }
          return updated
        })
      } catch {
        setImageProperties((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            originalImage: ''
          }
          return updated
        })
      }
    },
    [handleImageUpload, canEdit]
  )

  const handlePositionChange = useCallback(
    (position, index) => {
      if (!canEdit) return
      setImageProperties((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], position }
        return updated
      })
    },
    [canEdit]
  )

  const handleAddProject = useCallback(
    async (isContinue = false) => {
      if (!canEdit) return
      try {
        setIsSaving(true)
        // Allow blank project titles per requirement; no validation blocking save

        const payload = {
          title: projectData.title,
          projects: ['learn', 'develop', 'brand'].map((type, index) => {
            const sectionData =
              projectData[type === 'develop' ? 'develop' : type]
            const existingEvidences =
              continueAddingProject?.children?.find(
                (child) => child.type === type
              )?.evidences || []

            return {
              id: continueAddingProject
                ? continueAddingProject?.id + (index + 1)
                : null,
              parentId: continueAddingProject
                ? continueAddingProject?.id
                : null,
              showSection: true,
              editorContent: sectionData?.editorContent || '',
              evidences: sectionData?.evidences.map((evidence, index) => ({
                id: existingEvidences[index]?.id || null,
                selectedSkills: [],
                imageFile: null,
                imageUrl: evidence?.imageUrl || null,
                linkInputValue: evidence?.linkInputValue || '',
                evidenceTitle: evidence?.evidenceTitle || '',
                type: `evidence-${index + 1}`
              })),
              type: type
            }
          })
        }

        if (!continueAddingProject) {
          const response = await axiosInstance.post(
            '/hsPortfolio/myProjects',
            payload
          )
          setContinueAddingProject(response.data.project)

          toast.success('Project created successfully!')
        } else {
          await axiosInstance.put(
            `/hsPortfolio/myProjects/${continueAddingProject.id}`,
            {
              updatedProjects: payload.projects,
              title: payload.title
            }
          )

          toast.success('Project updated successfully!')
        }

        if (!isContinue) {
          setAddMode(false)
          setContinueAddingProject(null)
          setRefreshData((prev) => !prev)
          setTimeout(() => {
            setCarouselActiveIndex(Math.ceil(myProjects.data.length / 1) - 1)
          }, 300)
          setCurrentSection('title')
          setProjectData({
            title: '',
            learn: { editorContent: '', evidences: createEmptyEvidences(3) },
            develop: { editorContent: '', evidences: createEmptyEvidences(3) },
            brand: { editorContent: '', evidences: createEmptyEvidences(3) }
          })

          if (myProjects?.data) {
            const itemsPerPage = 1
            const lastPageIndex = Math.ceil(
              myProjects.data.length / itemsPerPage
            )
            setTimeout(() => {
              setCarouselActiveIndex(lastPageIndex)
            }, 300)
          }
        } else {
          const sections = ['title', 'learn', 'develop', 'brand']
          const currentIndex = sections.indexOf(currentSection)
          if (currentIndex < sections.length - 1) {
            setCurrentSection(sections[currentIndex + 1])
          }
        }
      } catch (error) {
        console.error('Operation failed:', error)
        toast.error(
          `Failed to ${continueAddingProject ? 'update' : 'create'} project`
        )
      } finally {
        setIsSaving(false)
      }
    },
    [
      projectData,
      currentSection,
      continueAddingProject,
      setRefreshData,
      myProjects?.data,
      canEdit
    ]
  )

  const onUpdateChildContent = useCallback(async () => {
    if (!canEdit) return
    if (!editData) return

    try {
      setIsSaving(true)

      const parentProject = myProjects.data.find((proj) =>
        proj.children.some((child) => child.id === editData.id)
      )

      if (!parentProject) throw new Error('Parent project not found')

      const updatedChildren = parentProject.children.map((child) => {
        if (child.id === editData.id) {
          return {
            ...child,
            editorContent: editedContent,
            evidences: evidences.filter(
              (evidence) =>
                evidence.imageUrl ||
                evidence?.evidenceTitle ||
                evidence?.linkInputValue
            )
          }
        }
        return child
      })

      await axiosInstance.put(`/hsPortfolio/myProjects/${parentProject.id}`, {
        updatedProjects: updatedChildren,
        title: parentProject.title
      })

      console.log('Ardi 323, ', updatedChildren)

      toast.success('Section updated successfully!')
      setEditMode(false)
      setEditData(null)
      setRefreshData((prev) => !prev)
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update section')
    } finally {
      setIsSaving(false)
    }
  }, [
    editData,
    editedContent,
    evidences,
    myProjects.data,
    setRefreshData,
    canEdit
  ])

  const handleEditProject = useCallback(
    (project) => {
      if (!canEdit) return
      setCurrentProject(project)
      setProjectData({
        title: project.title,
        learn: { editorContent: '', evidences: createEmptyEvidences(3) },
        develop: { editorContent: '', evidences: createEmptyEvidences(3) },
        brand: { editorContent: '', evidences: createEmptyEvidences(3) }
      })
      setShowEditProject(true)
    },
    [canEdit]
  )

  const saveProjectTitle = async () => {
    if (!canEdit) return
    try {
      setIsSaving(true)
      await axiosInstance.put(`/hsPortfolio/myProjects/${currentProject.id}`, {
        title: projectData.title,
        updatedProjects: currentProject.children
      })
      setShowEditProject(false)
      setRefreshData((prev) => !prev)
      toast.success('Project title updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update project title')
    } finally {
      setIsSaving(false)
    }
  }
  const userRole = useSelector((state) => state.user?.user?.role)

  const typeToIcon = {
    title: titleIcon,
    learn: learnIcon,
    develop: buildIcon,
    brand: brandIcon
  }

  const instructionsText = {
    learn:
      'Give an overview of your approach to research and analysis in determining that the problem you identified is worth solving.',
    develop:
      'Give an overview of your approach to execution in creating a solution that solves the problem you identified.',
    brand:
      'Give an overview of your approach to communicating the value of your solution.'
  }

  const descriptionText = {
    learn: 'Problem Identification:',
    develop: 'My Solution:',
    brand: 'Brand Story Descriptions'
  }

  // Removed content-based filtering helpers to always show project & section placeholders

  // Removed obsolete hasAnyEvidence helper (empty detection simplified)

  // Only treat items with a persisted id as real projects
  const validProjects = myProjects?.data?.filter((p) => p && p.id) || []

  const renderProjectCards = useCallback(
    (project) => {
      // A project must have an id (persisted) and children to display section cards
      const isEmpty =
        !project ||
        !project.id ||
        !project.children ||
        project.children.length === 0

      const renderChildCard = (child, title, icon) => (
        <MainCard
          title={title}
          icon={icon}
          onClick={
            canEdit
              ? () => {
                  if (!child || !child.id) {
                    setAddMode(true)
                    setEditData(null)
                    setCurrentSection('title')
                    setProjectData({
                      title: '',
                      learn: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      },
                      develop: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      },
                      brand: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      }
                    })
                  } else {
                    setEditMode(true)
                    setEditData(child)
                    setEditedContent(child?.editorContent || '')
                    setEvidences(child?.evidences || [])
                  }
                }
              : () => {}
          }
          editSign={!child || !child.id}
          canEdit={canEdit}
        >
          {child && (
            <>
              <div
                style={{
                  fontFamily: 'Montserrat',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  marginBottom: '12px',
                  padding: '4px 0',
                  lineHeight: '1.4',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal'
                }}
              >
                {title === 'LEARN'
                  ? 'Problem Identification'
                  : title === 'BUILD'
                  ? 'My Solution'
                  : 'Brand Story'}
              </div>
              {child?.editorContent && (
                <div
                  className={`${
                    userRole === 'admin'
                      ? `admin-whatcanido-portfolio-container`
                      : ` `
                  }`}
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: '15px',
                    fontStyle: 'normal',
                    fontWeight: 300,
                    lineHeight: '1.5',
                    padding: '8px 0',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                    maxHeight: '100px',
                    paddingRight: '10px'
                  }}
                  dangerouslySetInnerHTML={{ __html: child.editorContent }}
                />
              )}
              {child?.evidences && child.evidences.length > 0 && (
                <div className='whatcanido-card-container'>
                  {child.evidences.map((evidence, idx) => (
                    <WhatCanIDoCard
                      key={`${title.toLowerCase()}-${
                        evidence.id || `evidence-${idx}`
                      }`}
                      evidence={evidence}
                      content={child?.editorContent}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </MainCard>
      )

      if (isEmpty) return null

      return (
        <MultiCard
          title={
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                top: '30px',
                fontSize: '21px',
                fontWeight: 500
              }}
            >
              {project.title && project.title.trim() !== ''
                ? project.title
                : '\u00A0'}
            </div>
          }
          icon={'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
          onAddClick={
            canEdit
              ? () => {
                  setAddMode(true)
                  setEditData(null)
                  setCurrentSection('title')
                  setProjectData({
                    title: '',
                    learn: {
                      editorContent: '',
                      evidences: createEmptyEvidences(3)
                    },
                    develop: {
                      editorContent: '',
                      evidences: createEmptyEvidences(3)
                    },
                    brand: {
                      editorContent: '',
                      evidences: createEmptyEvidences(3)
                    }
                  })
                }
              : () => {}
          }
          onEdit={canEdit ? () => handleEditProject(project) : () => {}}
          onDelete={canEdit ? () => confirmDelete(project) : () => {}}
          onClick={
            canEdit
              ? () => {
                  setAddMode(true)
                  setEditData(project)
                }
              : () => {}
          }
          addIcon={canEdit}
          editIcon={canEdit}
          deleteIcon={canEdit}
          iconWrapperStyle={{ background: 'transparent' }}
          canEdit={canEdit}
        >
          {project.children.find((c) => c.type === 'learn') &&
            renderChildCard(
              project.children.find((c) => c.type === 'learn'),
              'LEARN',
              learnIcon
            )}
          {project.children.find((c) => c.type === 'develop') &&
            renderChildCard(
              project.children.find((c) => c.type === 'develop'),
              'BUILD',
              buildIcon
            )}
          {project.children.find((c) => c.type === 'brand') &&
            renderChildCard(
              project.children.find((c) => c.type === 'brand'),
              'BRAND',
              brandIcon
            )}
        </MultiCard>
      )
    },
    [userRole, canEdit, confirmDelete, handleEditProject]
  )

  // Also fix the main render logic to handle empty arrays properly
  return (
    <div className='delete-project-modal' style={{ minHeight: '100dvh' }}>
      {canEdit &&
        (editMode || showEditProject || addMode || showDeleteConfirmation) && (
          <div className='modal-backdrop' />
        )}
      {!hideSectionHeader && (
        <div className='section-description-container'>
          <div className='portf-section-maintitle'>
            <div className='pe-2'>
              <img
                src={what}
                alt='What can I do'
                style={{ width: '72px', height: '70px' }}
              />
            </div>
            <div>
              <div className='align-items-center portfolio-section-title'>
                <div className='section-title' style={{ fontSize: '20px' }}>
                  {sectionTitle || 'WHAT CAN I DO?'}
                </div>
              </div>
              <div
                className='section-description'
                dangerouslySetInnerHTML={{
                  __html:
                    sectionDescription ||
                    'Studio Builders communicate the value they have produced in themselves through the outcomes of Learn, Develop and Brand'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className='whatcanido-container'>
        {validProjects.length > 0 ? (
          <CarouselComponent
            data={validProjects}
            renderItems={renderProjectCards}
            initialActiveIndex={carouselActiveIndex}
          />
        ) : (
          <MultiCard
            title='My Projects'
            icon={myFailures}
            onAddClick={
              canEdit
                ? () => {
                    setAddMode(true)
                    setEditData(null)
                    setCurrentSection('title')
                    setProjectData({
                      title: '',
                      learn: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      },
                      develop: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      },
                      brand: {
                        editorContent: '',
                        evidences: createEmptyEvidences(3)
                      }
                    })
                  }
                : () => {}
            }
            addIcon={canEdit}
            iconWrapperStyle={{ background: 'transparent' }}
            canEdit={canEdit}
          >
            <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
              <img src={nothingAdded} alt='nothing-added' />
              <p
                className='text-uppercase text-medium nodata-portf-text'
                style={{ color: '#6F6F6F' }}
              >
                {canEdit
                  ? 'Nothing has been added yet. click the plus button to get started.'
                  : 'Nothing has been added yet.'}
              </p>
            </div>
          </MultiCard>
        )}
      </div>

      {/* Only show modals when user can edit */}
      {canEdit && editMode && (
        <EditCard
          title={'Edit'}
          icon={typeToIcon[editData.type]}
          handleSubmit={onUpdateChildContent}
          toggle={() => {
            setEditMode(false)
            setEditData(null)
          }}
          isSaving={isSaving}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={sparkIcon} width={15} alt='Spark' />
                <div style={{ marginLeft: '5px' }}>Instructions:</div>
              </div>
              <div>
                <p style={{ marginTop: '10px', fontSize: '12px' }}>
                  {instructionsText[editData.type]}
                </p>

                <div style={{ fontSize: '12px' }}>
                  {descriptionText[editData.type]}
                </div>
                <div
                  style={{ width: '100%', marginBottom: '20px' }}
                  className='whatcanido-edit-container'
                >
                  <ReactQuill
                    value={editedContent}
                    onChange={setEditedContent}
                    style={{
                      marginBottom: '40px',
                      boxShadow:
                        '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}
                    className='text-black custom-quill'
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }],
                        ['link', 'image']
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%'
              }}
            >
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    boxShadow: '0px 3px 6px #00000029',
                    padding: '20px',
                    borderRadius: '15px',
                    width: '100%'
                  }}
                >
                  <div
                    style={{ marginBottom: '15px ' }}
                    className='contentupload-text'
                  >
                    Content Upload #{index + 1}
                  </div>

                  <div
                    style={{ display: 'flex', gap: '20px', width: '100%' }}
                    className='whatcanido-content-upload-container'
                  >
                    <div
                      style={{ width: '30%', minWidth: '200px' }}
                      className='whatcanido-contentupload-input-resp'
                    >
                      <div
                        style={{ marginBottom: '10px' }}
                        className='contentupload-thumbnail-text'
                      >
                        Thumbnail
                      </div>
                      <ReactImageUpload
                        title={'Preview image for file'}
                        width={'100%'}
                        height={'200px'}
                        value={evidences[index]?.imageUrl || ''}
                        actions={[
                          {
                            type: 'trash',
                            action: () => handleDeleteImage(index),
                            isDisplayed: true,
                            description: 'Click here to delete image'
                          }
                        ]}
                        onLabelClick={(e) => e.stopPropagation()}
                        onFileInputChange={(e) => handleFileSelect(e, index)}
                        onPositionChange={(pos) =>
                          handlePositionChange(pos, index)
                        }
                        originalImage={evidences[index]?.imageUrl || ''}
                        position={imageProperties[index]?.position}
                        scale={imageProperties[index]?.scale}
                        rotate={imageProperties[index]?.rotate}
                      />
                    </div>

                    <div
                      style={{
                        width: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                      }}
                      className='whatcanido-contentupload-input-resp'
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px'
                          }}
                          className='contentupload-content-title'
                        >
                          Content Upload Title:
                        </label>
                        <div
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <input
                            type='text'
                            style={{
                              background: 'transparent',
                              width: '100%'
                            }}
                            value={evidences[index]?.evidenceTitle || ''}
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                'evidenceTitle',
                                e.target.value
                              )
                            }
                            placeholder='Add title here...'
                          />
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M11.9686 4.70931L12.9663 3.71169C13.7473 2.93064 15.0136 2.93064 15.7947 3.71169L16.5018 4.41879C17.2829 5.19984 17.2829 6.46617 16.5018 7.24722L15.5042 8.24484M11.9686 4.70931L4.04127 12.6367C3.7092 12.9688 3.50457 13.4071 3.46324 13.8749L3.28968 15.8397C3.2349 16.4597 3.75378 16.9786 4.37379 16.9238L6.33858 16.7502C6.80639 16.7089 7.24473 16.5043 7.5768 16.1722L15.5042 8.24484M11.9686 4.70931L15.5042 8.24484'
                              stroke='black'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px'
                          }}
                          className='contentupload-content-title'
                        >
                          Content Upload Link:
                        </label>
                        <div
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <input
                            type='url'
                            style={{
                              background: 'transparent',
                              width: '100%'
                            }}
                            value={evidences[index]?.linkInputValue || ''}
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                'linkInputValue',
                                e.target.value
                              )
                            }
                            placeholder='Add link here...'
                          />
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M11.9686 4.70931L12.9663 3.71169C13.7473 2.93064 15.0136 2.93064 15.7947 3.71169L16.5018 4.41879C17.2829 5.19984 17.2829 6.46617 16.5018 7.24722L15.5042 8.24484M11.9686 4.70931L4.04127 12.6367C3.7092 12.9688 3.50457 13.4071 3.46324 13.8749L3.28968 15.8397C3.2349 16.4597 3.75378 16.9786 4.37379 16.9238L6.33858 16.7502C6.80639 16.7089 7.24473 16.5043 7.5768 16.1722L15.5042 8.24484M11.9686 4.70931L15.5042 8.24484'
                              stroke='black'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EditCard>
      )}

      {/* Edit Project Title Modal */}
      {canEdit && showEditProject && (
        <EditCard
          toggle={() => {
            setShowEditProject(false)
            setCurrentProject(null)
          }}
          handleSubmit={saveProjectTitle}
          title={'Edit Project'}
          isSaving={isSaving}
          icon={editProject}
          onDelete={() => confirmDelete(currentProject)}
        >
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}
              >
                Project Title:
              </label>
              <input
                type='text'
                value={projectData.title}
                onChange={(e) =>
                  setProjectData((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                  background: 'white'
                }}
                placeholder='Add project title here...'
              />
            </div>
          </div>
        </EditCard>
      )}

      {/* Delete Confirmation Modal */}
      {canEdit && showDeleteConfirmation && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteProject}
          title='Delete Project'
          message='Are you sure you want to delete this project?'
          confirmText='YES, DELETE'
          cancelText='NO, TAKE ME BACK'
        />
      )}

      {/* Add Project Modal */}
      {canEdit && addMode && (
        <EditCard
          toggle={() => {
            setAddMode(false)
            setContinueAddingProject(null)
            setCurrentSection('title')
            setProjectData({
              title: '',
              learn: { editorContent: '', evidences: [] },
              develop: { editorContent: '', evidences: [] },
              brand: { editorContent: '', evidences: [] }
            })
          }}
          handleSubmit={() => handleAddProject(false)}
          handleContinue={handleContinue}
          title={continueAddingProject ? currentSection : 'Add New Project'}
          isSaving={isSaving}
          icon={typeToIcon[currentSection]}
          // continueAdding prop removed
          addingModal={true}
        >
          {currentSection === 'title' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  Project Title:
                </label>
                <input
                  type='text'
                  value={projectData.title}
                  onChange={(e) =>
                    setProjectData((prev) => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                    background: 'white'
                  }}
                  placeholder='Add project title here...'
                />
              </div>
            </div>
          )}

          {(currentSection === 'learn' ||
            currentSection === 'develop' ||
            currentSection === 'brand') && (
            <div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={sparkIcon} width={15} alt='Spark' />
                  <div style={{ marginLeft: '5px' }}>Instructions:</div>
                </div>

                <p style={{ marginTop: '10px', fontSize: '12px' }}>
                  {instructionsText[currentSection]}
                </p>
              </div>
              <div style={{ fontSize: '12px' }}>
                {descriptionText[currentSection]}
              </div>

              <div
                style={{ width: '100%', marginBottom: '20px' }}
                className='whatcanido-edit-container'
              >
                <ReactQuill
                  value={projectData[currentSection]?.editorContent}
                  placeholder='Describe the problem you identified...'
                  onChange={(content) =>
                    setProjectData((prev) => ({
                      ...prev,
                      [currentSection]: {
                        ...prev[currentSection],
                        editorContent: content
                      }
                    }))
                  }
                  style={{
                    marginBottom: '40px',
                    boxShadow:
                      '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  className='text-black'
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image']
                    ]
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  width: '100%'
                }}
              >
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    style={{
                      boxShadow: '0px 3px 6px #00000029',
                      padding: '20px',
                      borderRadius: '15px',
                      width: '100%'
                    }}
                  >
                    <div style={{ marginBottom: '15px', fontWeight: '600' }}>
                      Content Upload #{index + 1}
                    </div>

                    <div
                      style={{ display: 'flex', gap: '20px', width: '100%' }}
                    >
                      <div style={{ width: '30%', minWidth: '200px' }}>
                        <div style={{ marginBottom: '10px' }}>Thumbnail</div>
                        <ReactImageUpload
                          title={'Preview image for file'}
                          width={'100%'}
                          height={'200px'}
                          value={
                            projectData[currentSection]?.evidences[index]
                              ?.imageUrl || ''
                          }
                          actions={[
                            {
                              type: 'trash',
                              action: () => {
                                const newEvidences = [
                                  ...projectData[currentSection]?.evidences
                                ]
                                newEvidences[index] = {
                                  ...newEvidences[index],
                                  imageUrl: ''
                                }
                                setProjectData((prev) => ({
                                  ...prev,
                                  [currentSection]: {
                                    ...prev[currentSection],
                                    evidences: newEvidences
                                  }
                                }))
                                handleDeleteImage(index)
                              },
                              isDisplayed: true,
                              description: 'Click here to delete image'
                            }
                          ]}
                          onLabelClick={(e) => e.stopPropagation()}
                          onFileInputChange={(e) => handleFileSelect(e, index)}
                          onPositionChange={(pos) =>
                            handlePositionChange(pos, index)
                          }
                          originalImage={
                            projectData[currentSection]?.evidences[index]
                              ?.imageUrl || ''
                          }
                          position={imageProperties[index]?.position}
                          scale={imageProperties[index]?.scale}
                          rotate={imageProperties[index]?.rotate}
                        />
                      </div>

                      <div
                        style={{
                          width: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '15px'
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '8px',
                              fontWeight: '600'
                            }}
                          >
                            Content Upload Title:
                          </label>
                          <div
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                              background: 'white',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <input
                              style={{
                                width: '100%',
                                background: 'white'
                              }}
                              type='text'
                              value={
                                projectData[currentSection]?.evidences[index]
                                  ?.evidenceTitle || ''
                              }
                              onChange={(e) => {
                                const newEvidences = [
                                  ...projectData[currentSection]?.evidences
                                ]
                                newEvidences[index] = {
                                  ...newEvidences[index],
                                  evidenceTitle: e.target.value
                                }
                                setProjectData((prev) => ({
                                  ...prev,
                                  [currentSection]: {
                                    ...prev[currentSection],
                                    evidences: newEvidences
                                  }
                                }))
                              }}
                              placeholder='Add title here...'
                            />
                            <img src={penIcon} alt='pen-icon' />
                          </div>
                        </div>

                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '8px',
                              fontWeight: '600'
                            }}
                          >
                            Content Upload Link:
                          </label>
                          <div
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                              background: 'white',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <input
                              style={{
                                width: '100%',
                                background: 'white'
                              }}
                              type='url'
                              value={
                                projectData[currentSection]?.evidences[index]
                                  ?.linkInputValue || ''
                              }
                              onChange={(e) => {
                                const newEvidences = [
                                  ...projectData[currentSection]?.evidences
                                ]
                                newEvidences[index] = {
                                  ...newEvidences[index],
                                  linkInputValue: e.target.value
                                }
                                setProjectData((prev) => ({
                                  ...prev,
                                  [currentSection]: {
                                    ...prev[currentSection],
                                    evidences: newEvidences
                                  }
                                }))
                              }}
                              placeholder='Add link here...'
                            />
                            <img src={penIcon} alt='pen-icon' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </EditCard>
      )}
    </div>
  )
}

export default WhatCanIDo
