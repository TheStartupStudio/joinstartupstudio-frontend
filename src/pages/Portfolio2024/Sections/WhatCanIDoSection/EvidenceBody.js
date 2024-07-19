import React, { useState, useEffect, createRef } from 'react'
import LabeledInput from '../../Components/DisplayData/LabeledInput'
import MultiSelectDropdown from '../../../../components/MultiSelect/MultiSelect'

import { getProjects, getSkills } from '../../../../redux/portfolio/Actions'
import { connect } from 'react-redux'
import { deleteImage } from '../../../../utils/helpers'
import ReactImageUpload from '../../Components/ReactAvatarEditor/ReactImageUpload'

const EvidenceBody = ({
  evidenceType,
  evidenceName,
  initialData,
  onChangeEvidenceData,
  fetchSkills,
  skills,
  projectType,
  deleteEvidenceImage,
  deleteEvidenceImageFile
}) => {
  const editorRef = createRef()
  const [imageProperties, setImageProperties] = useState({
    originalImage: '',
    croppedImage: undefined,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0
  })

  const { originalImage, croppedImage, position, scale, rotate } =
    imageProperties
  const [selectedSkills, setSelectedSkills] = useState({
    criticalThinkingSkills: [],
    collaborationSkills: [],
    creativitySkills: [],
    leadershipSkills: [],
    enterpriseSkills: []
  })

  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [onDelete, setOnDelete] = useState(false)

  const [linkInputValue, setLinkInputValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState({
    criticalThinkingSkills: false,
    collaborationSkills: false,
    creativitySkills: false,
    leadershipSkills: false,
    enterpriseSkills: false
  })

  useEffect(() => {
    onChangeEvidenceData?.({
      selectedSkills: [
        ...(selectedSkills?.collaborationSkills ?? []),
        ...(selectedSkills?.creativitySkills ?? []),
        ...(selectedSkills?.leadershipSkills ?? []),
        ...(selectedSkills?.enterpriseSkills ?? []),
        ...(selectedSkills?.criticalThinkingSkills ?? [])
      ],
      imageFile: originalImage,
      linkInputValue
    })
  }, [selectedSkills, originalImage, linkInputValue])

  useEffect(() => {
    if (initialData) {
      let updatedSkills
      if (initialData?.selectedSkills?.length > 0) {
        updatedSkills = initialData?.selectedSkills?.map((skill) => {
          const { id, ...rest } = skill?.IamrSkill
          return { ...rest, ...skill }
        })
      }

      let groupedSkills
      if (updatedSkills && updatedSkills.length > 0) {
        groupedSkills = updatedSkills.reduce((acc, skill) => {
          const camelCasedCategory = skill.category
            .toLowerCase()
            .replace(/[-_\s.](.)/g, (_, char) => char.toUpperCase())
          const skillCopy = { ...skill }
          delete skillCopy.category

          if (!acc[camelCasedCategory]) {
            acc[camelCasedCategory] = []
          }

          acc[camelCasedCategory].push(skillCopy)

          return acc
        }, {})
      }
      setSelectedSkills(groupedSkills)
      setLinkInputValue(initialData.linkInputValue)
      setImageUrl(initialData.imageUrl)
      if (initialData?.imageFile) {
        setImageProperties({
          ...imageProperties,
          originalImage: initialData?.imageFile
        })
      } else {
        setImageProperties({
          ...imageProperties,
          originalImage: ''
        })
      }
    }
  }, [evidenceType])

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleSkillsChange = (selectedOptions, type) => {
    setSelectedSkills((prevState) => ({
      ...prevState,
      [type]: selectedOptions
    }))
  }

  const handleInputChange = (value) => {
    setLinkInputValue(value)
  }

  useEffect(() => {
    setDropdownOpen({
      criticalThinkingSkills: false,
      collaborationSkills: false,
      creativitySkills: false,
      leadershipSkills: false,
      enterpriseSkills: false
    })
  }, [evidenceType])

  const toggleDropdown = (type) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type]
    }))
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(imageUrl)
    if (deleteSuccess) {
      deleteEvidenceImage(imageUrl)
      setImageUrl(null)
    } else {
      console.error('Error: Image deletion failed')
    }
  }

  const handleDeleteImageFile = async () => {
    if (originalImage) {
      deleteEvidenceImageFile({ imageFile: '' })
      setImageFile('')
      setImageProperties({
        ...imageProperties,
        originalImage: '',
        croppedImage: undefined
      })
    }
  }

  const avatarEditorActions = [
    {
      type: 'trash',
      action: () => (imageUrl ? handleDeleteImage() : handleDeleteImageFile()),
      isDisplayed: true,
      description: 'Click here to delete image'
    }
  ]

  function handleAdd(event) {
    setImageProperties((prevState) => ({
      ...prevState,
      originalImage: event.target.files[0]
    }))
  }

  function handlePositionChange(position) {
    setImageProperties((prevState) => ({ ...prevState, position }))
  }

  async function updateCroppedImage() {
    if (editorRef?.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas()
      const blob = await new Promise((resolve) => canvasScaled.toBlob(resolve))
      const uniqueFilename = `image_${Date.now()}.png`
      const formData = new FormData()
      formData.append('img', blob, uniqueFilename)
      const imageFile = formData?.get('img')
      setImageFile(imageFile)
      setImageProperties((prevState) => ({
        ...prevState,
        croppedImage: window.URL.createObjectURL(blob)
      }))
    }
  }
  useEffect(() => {
    updateCroppedImage()
  }, [originalImage, position, scale, rotate])
  function handleImageLoadSuccess() {
    updateCroppedImage()
  }

  const handleLabelClick = (event) => {
    event.stopPropagation()
  }

  const handleFileInputChange = (event) => {
    handleAdd(event)
    event.stopPropagation()
  }
  return (
    <div className={'row py-4 px-3'}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `
              "image input input"
              "image skills1 skills2"
              "skills3 skills4 skills5"
            `,
          width: '100%',
          gridGap: '20px'
        }}
      >
        <div style={{ gridArea: 'image' }} className={'mr-2'}>
          <ReactImageUpload
            title={'Preview image for file'}
            width={'100%'}
            height={'100%'}
            value={imageUrl}
            actions={avatarEditorActions}
            onChangeImageCrop={updateCroppedImage}
            onImageLoadSuccess={handleImageLoadSuccess}
            onLabelClick={handleLabelClick}
            onFileInputChange={handleFileInputChange}
            onPositionChange={handlePositionChange}
            position={position}
            scale={scale}
            rotate={rotate}
            originalImage={originalImage}
          />
        </div>
        <div style={{ gridArea: 'input' }}>
          <div className={'mb-1'}>
            <LabeledInput
              title={`Link to ${evidenceName}`}
              name={'link-to-market-analysis-document'}
              type={'text'}
              placeholder={'https://drive.google.com/29304naf-2343hnl'}
              titleClassNames={'text-start justify-content-start'}
              onChange={handleInputChange}
              value={linkInputValue}
            />
          </div>

          <div className={'select-skill pt-4 my-3'}>Select Skill(s)</div>
          <div className={'select-skill-description'}>
            Remember, you can only tag a skill once in the portfolio.
          </div>
        </div>
        <div style={{ gridArea: 'skills1' }}>
          <MultiSelectDropdown
            title={'Critical thinking skills'}
            selectedOptions={selectedSkills?.criticalThinkingSkills ?? []}
            options={skills?.criticalThinkingSkills ?? []}
            isOpen={dropdownOpen.criticalThinkingSkills}
            handleChange={(options) =>
              handleSkillsChange(options, 'criticalThinkingSkills')
            }
            toggleDropdown={() => toggleDropdown('criticalThinkingSkills')}
          />
        </div>
        <div style={{ gridArea: 'skills2' }}>
          <MultiSelectDropdown
            title={'Collaboration skills'}
            selectedOptions={selectedSkills?.collaborationSkills ?? []}
            options={skills?.collaborationSkills ?? []}
            isOpen={dropdownOpen.collaborationSkills}
            handleChange={(options) =>
              handleSkillsChange(options, 'collaborationSkills')
            }
            toggleDropdown={() => toggleDropdown('collaborationSkills')}
          />
        </div>
        <div style={{ gridArea: 'skills3' }}>
          <MultiSelectDropdown
            title={'Creativity skills'}
            selectedOptions={selectedSkills?.creativitySkills ?? []}
            options={skills?.creativitySkills ?? []}
            isOpen={dropdownOpen.creativitySkills}
            handleChange={(options) =>
              handleSkillsChange(options, 'creativitySkills')
            }
            toggleDropdown={() => toggleDropdown('creativitySkills')}
          />
        </div>
        <div style={{ gridArea: 'skills4' }}>
          <MultiSelectDropdown
            title={'Leadership skills'}
            selectedOptions={selectedSkills?.leadershipSkills ?? []}
            options={skills?.leadershipSkills ?? []}
            isOpen={dropdownOpen.leadershipSkills}
            handleChange={(options) =>
              handleSkillsChange(options, 'leadershipSkills')
            }
            toggleDropdown={() => toggleDropdown('leadershipSkills')}
          />
        </div>
        <div style={{ gridArea: 'skills5' }}>
          <MultiSelectDropdown
            title={'Enterprise skills'}
            selectedOptions={selectedSkills?.enterpriseSkills ?? []}
            options={skills?.enterpriseSkills ?? []}
            isOpen={dropdownOpen.enterpriseSkills}
            handleChange={(options) =>
              handleSkillsChange(options, 'enterpriseSkills')
            }
            toggleDropdown={() => toggleDropdown('enterpriseSkills')}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const {
    user: { user: loggedUser }
  } = state.user
  const { skills } = state.portfolio
  return {
    loggedUser,
    skills
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchSkills: () => dispatch(getSkills()),
  fetchProjects: () => dispatch(getProjects())
})
export default connect(mapStateToProps, mapDispatchToProps)(EvidenceBody)
