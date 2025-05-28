import React, { useState, useEffect, useCallback } from 'react'
import './Portfolio.css'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
import WhatCanIDoCard from '../../components/NewPortfolio/WhatCanIDo'
import learnIcon from '../../assets/images/learn.svg'
import buildIcon from '../../assets/images/build.svg'
import brandIcon from '../../assets/images/brand.svg'
import myFailures from '../../assets/images/myfailures.png'
import editProject from '../../assets/images/EditProject.png'
import whatCanIDo from '../../assets/images/whatcanido.png'
import CarouselComponent from '../../components/Carousel/CarouselComponent'
import EditCard from '../../components/NewPortfolio/EditCard'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { uploadImage, deleteImage } from '../../utils/helpers'
import ReactImageUpload from '../Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import penIcon from '../../assets/images/pen-icon.svg'
const WhatCanIDo = ({
  sectionTitle,
  sectionDescription,
  myProjects,
  setRefreshData
}) => {
  // State management
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [editData, setEditData] = useState(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [evidences, setEvidences] = useState([])
  // const [refreshData, setRefreshData] = useState(false)
  const [imageProperties, setImageProperties] = useState(
    Array(3).fill({
      originalImage: '',
      croppedImage: null,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0
    })
  )

  // Initialize evidences when entering edit mode
  useEffect(() => {
    if (editMode && editData) {
      setEvidences(editData.evidences || [])
      setEditedContent(editData.editorContent || '')
    }
  }, [editMode, editData])

  // Handle evidence changes
  const handleEvidenceChange = useCallback((index, field, value) => {
    setEvidences((prev) => {
      const updated = [...prev]
      if (!updated[index]) {
        updated[index] = { evidenceTitle: '', linkInputValue: '', imageUrl: '' }
      }
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file, index) => {
      try {
        setIsSaving(true)
        const formData = new FormData()
        formData.append('img', file)
        const uploadedImage = await uploadImage(formData)

        if (!uploadedImage) throw new Error('Upload failed')

        handleEvidenceChange(index, 'imageUrl', uploadedImage)
        return uploadedImage.url
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload image')
        throw error
      } finally {
        setIsSaving(false)
      }
    },
    [handleEvidenceChange]
  )

  // Handle image deletion
  const handleDeleteImage = useCallback(
    async (index) => {
      const imageUrl = evidences[index]?.imageUrl
      if (!imageUrl) return

      try {
        setIsSaving(true)
        await deleteImage(imageUrl)
        handleEvidenceChange(index, 'imageUrl', '')
        toast.success('Image deleted successfully')
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete image')
      } finally {
        setIsSaving(false)
      }
    },
    [evidences, handleEvidenceChange]
  )

  // Handle file selection and immediate upload
  const handleFileSelect = useCallback(
    async (event, index) => {
      const file = event.target.files[0]
      if (!file) return

      // Update UI with preview
      setImageProperties((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          originalImage: URL.createObjectURL(file)
        }
        return updated
      })

      // Upload the file
      try {
        const imageUrl = await handleImageUpload(file, index)

        // Update with final URL
        setImageProperties((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            originalImage: imageUrl
          }
          return updated
        })
      } catch {
        // Reset if upload fails
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
    [handleImageUpload]
  )

  // Handle position changes for image cropping
  const handlePositionChange = useCallback((position, index) => {
    setImageProperties((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], position }
      return updated
    })
  }, [])

  // Handle crop completion
  const handleCropComplete = useCallback(
    async (croppedBlob, index) => {
      try {
        setIsSaving(true)
        const imageUrl = await handleImageUpload(croppedBlob, index)

        setImageProperties((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            croppedImage: croppedBlob,
            originalImage: imageUrl
          }
          return updated
        })
      } finally {
        setIsSaving(false)
      }
    },
    [handleImageUpload]
  )

  // Update project title
  const onUpdateProject = useCallback(async () => {
    if (!editData) return

    try {
      setIsSaving(true)
      const response = await axiosInstance.put(
        `/hsPortfolio/myProjects/${editData.id}`,
        { title: projectTitle }
      )
      toast.success('Project updated successfully!')
      setAddMode(false)
      setEditData(null)
      setRefreshData((prev) => !prev) // Trigger refresh
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }, [editData, projectTitle])

  // Update child content
  const onUpdateChildContent = useCallback(async () => {
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
                evidence.evidenceTitle ||
                evidence.linkInputValue
            )
          }
        }
        return child
      })

      await axiosInstance.put(`/hsPortfolio/myProjects/${parentProject.id}`, {
        updatedProjects: updatedChildren,
        title: parentProject.title
      })

      toast.success('Section updated successfully!')
      setEditMode(false)
      setEditData(null)
      setRefreshData((prev) => !prev) // Trigger refresh
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update section')
    } finally {
      setIsSaving(false)
    }
  }, [editData, editedContent, evidences, myProjects.data])
  // Render project cards
  const renderProjectCards = useCallback((project) => {
    const renderChildCard = (child, title, icon) => (
      <MainCard
        title={title}
        icon={icon}
        onClick={() => {
          setEditMode(true)
          setEditData(child)
          setEditedContent(child.editorContent || '')
          setEvidences(child.evidences || [])
        }}
      >
        <div
          style={{ fontWeight: '600', fontSize: '14px', marginBottom: '10px' }}
        >
          {title === 'LEARN'
            ? 'Problem Identification'
            : title === 'BUILD'
            ? 'My Solution'
            : 'Brand Story'}
        </div>
        <div style={{ fontSize: '12px' }}>
          {child?.editorContent?.replace(/<[^>]*>/g, '') || ''}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px'
          }}
        >
          {child.evidences?.map((evidence, idx) => (
            <WhatCanIDoCard
              key={`${title.toLowerCase()}-${evidence.id}`}
              evidence={evidence}
              content={child.editorContent}
            />
          ))}
        </div>
      </MainCard>
    )

    return (
      <MultiCard
        title={project.title || ''}
        icon={myFailures}
        onClick={() => {
          setAddMode(true)
          setEditData(project)
          setProjectTitle(project.title || '')
        }}
      >
        {project.children.find((child) => child.type === 'learn') &&
          renderChildCard(
            project.children.find((child) => child.type === 'learn'),
            'LEARN',
            learnIcon
          )}
        {project.children.find((child) => child.type === 'develop') &&
          renderChildCard(
            project.children.find((child) => child.type === 'develop'),
            'BUILD',
            buildIcon
          )}
        {project.children.find((child) => child.type === 'brand') &&
          renderChildCard(
            project.children.find((child) => child.type === 'brand'),
            'BRAND',
            brandIcon
          )}
      </MultiCard>
    )
  }, [])

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imageProperties.forEach((imgProp) => {
        if (
          imgProp.originalImage &&
          typeof imgProp.originalImage === 'string'
        ) {
          URL.revokeObjectURL(imgProp.originalImage)
        }
      })
    }
  }, [imageProperties])

  return (
    <div>
      <div className='section-description-container'>
        <div className='portf-section-maintitle'>
          <div className='pe-2'>
            <img src={whatCanIDo} alt='What can I do' />
          </div>
          <div>
            <div className='align-items-center portfolio-section-title'>
              <div className='section-title' style={{ fontSize: '20px' }}>
                {sectionTitle}
              </div>
            </div>
            <div
              className='section-description'
              dangerouslySetInnerHTML={{ __html: sectionDescription }}
            />
          </div>
        </div>
      </div>

      <div className='whatcanido-container'>
        {myProjects?.data?.length > 0 ? (
          <CarouselComponent
            data={myProjects.data}
            renderItems={renderProjectCards}
          />
        ) : (
          <div>No projects to show</div>
        )}
      </div>

      {editMode && (
        <EditCard
          title={'Edit My Section'}
          icon={editProject}
          handleSubmit={onUpdateChildContent}
          toggle={() => {
            setEditMode(false)
            setEditData(null)
          }}
          isSaving={isSaving}
        >
          <div style={{ marginTop: '10px' }}>
            <ReactQuill
              value={editedContent}
              onChange={setEditedContent}
              style={{
                maxHeight: '100px',
                marginBottom: '20px',
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

          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{ marginTop: index === 0 ? '20px' : '10px' }}
            >
              <div
                style={{
                  boxShadow: '0px 3px 6px #00000029',
                  padding: '10px',
                  borderRadius: '15px'
                }}
              >
                <div style={{ marginBottom: '5px' }}>
                  Content Upload #{index + 1}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '30px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '30%' }}>
                    <div>Thumbnail</div>
                    <ReactImageUpload
                      title={'Preview image for file'}
                      width={'100%'}
                      height={'100%'}
                      value={
                        evidences[index]?.imageUrl ||
                        imageProperties[index]?.originalImage
                      }
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
                      originalImage={imageProperties[index]?.originalImage}
                      position={imageProperties[index]?.position}
                      scale={imageProperties[index]?.scale}
                      rotate={imageProperties[index]?.rotate}
                      onCropComplete={(blob) => handleCropComplete(blob, index)}
                    />
                  </div>
                  <div style={{ width: '65%' }}>
                    {/* <div style={{ marginBottom: '20px' }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}
                      >
                        Content Upload Title:
                      </label>
                      <input
                        type='text'
                        value={evidences[index]?.evidenceTitle || ''}
                        onChange={(e) =>
                          handleEvidenceChange(
                            index,
                            'evidenceTitle',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
                          background: 'white'
                        }}
                        placeholder='Add title here...'
                      />
                      
                    </div> */}
                    <div style={{ width: '65%' }}>
                      <div style={{ marginBottom: '20px' }}>
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
                            justifyContent: 'space-between'
                          }}
                        >
                          <input
                            type='url'
                            style={{ background: 'transparent', width: '100%' }}
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
                          <img src={penIcon} alt='pen-icon' />
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
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
                            justifyContent: 'space-between'
                          }}
                        >
                          <input
                            type='url'
                            style={{ background: 'transparent', width: '100%' }}
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
                          <img src={penIcon} alt='pen-icon' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </EditCard>
      )}

      {addMode && (
        <EditCard
          toggle={() => {
            setAddMode(false)
            setEditData(null)
          }}
          handleSubmit={onUpdateProject}
          title={'Edit Project'}
          isSaving={isSaving}
          icon={editProject}
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
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
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
    </div>
  )
}

export default WhatCanIDo
