import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import { useDispatch, useSelector } from 'react-redux'
import useImageEditor from '../../../../hooks/useImageEditor'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import { saveUserBasicData } from '../../../../redux/portfolio/Actions'
import EditPortfolioSubmission from '../EditPortfolioSubmission'
import ReactImageUpload from '../ReactAvatarEditor/ReactImageUpload'
import LabeledInput from '../DisplayData/LabeledInput'
import SocialMediaInput from '../SocialMediaInput'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FaFacebookF, FaGlobe } from 'react-icons/fa'

function UserBasicInfoModal(props) {
  const mode = useSelector((state) => state.portfolio.mode)
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.userStory.isSaving
  )
  const {
    editorRef,
    imageProperties,
    setImageProperties,
    handleImageLoadSuccess,
    handleFileInputChange,
    handleLabelClick,
    handlePositionChange,
    updateCroppedImage: updateCroppedProfileImage,
    imageUrl: userImageUrl,
    setImageUrl: setUserImageUrl,
    avatarEditorActions
  } = useImageEditor()

  const [state, setState] = useState({
    isEditSection: false,
    imageFile: null,
    userImageUrl: null,
    thumbnailUrl: '',
    videoUrl: '',
    valueProposition: '',
    story: '',
    id: null,
    userTitle: null,
    socialMediaLinks: {
      linkedIn: '',
      facebook: '',
      xTwitter: '',
      instagram: '',
      website: ''
    }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    if (props.data) {
      setState((prevState) => ({
        ...prevState,
        thumbnailUrl: props.data?.thumbnailUrl,
        videoUrl: props.data?.videoUrl,
        valueProposition: props.data?.valueProposition,
        story: props.data?.story,
        id: props.data?.id,
        isEditSection: false,
        userTitle: props.data?.userTitle,
        socialMediaLinks: props.data?.socialMediaLinks,
        userImageUrl: props.data?.userImageUrl
      }))
      setUserImageUrl(props.data?.userImageUrl)
      if (props.data?.userImageUrl) {
        setImageProperties({ ...imageProperties, originalImage: '' })
      }
    }
  }, [props.data])

  const isEdit = () => !!state.id

  const saveData = async () => {
    let newThumbnailUrl
    let userImageUrl
    if (state.imageFile) {
      newThumbnailUrl = await uploadImage(state.imageFile)
    }

    if (!!imageProperties.croppedImage) {
      userImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    const data = {
      story: state.story,
      valueProposition: state.valueProposition,
      videoUrl: state.videoUrl,
      thumbnailUrl: newThumbnailUrl ? newThumbnailUrl : state.thumbnailUrl,
      userImageUrl,
      socialMediaLinks: state.socialMediaLinks,
      userTitle: state.userTitle
    }

    props.onSave?.(data)
  }

  const actions = [
    {
      type: 'save',
      action: () => saveData(),
      isSaving: props.isSaving,
      containSpinner: true,
      isDisplayed: true
    },
    {
      type: 'hide',
      isDisplayed: true,
      action: () => props.onHide()
    }
  ]

  const updateCroppedImage = (croppedImage) => {
    setState((prevState) => ({ ...prevState, imageFile: croppedImage }))
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(state.thumbnailUrl)
    if (deleteSuccess) {
      if (isEdit()) {
        dispatch(
          saveUserBasicData(
            {
              thumbnailUrl: null
            },
            state.id
          )
        )
      } else {
        console.error(
          'Error: Trying to delete image for a failure that does not exist'
        )
      }
    } else {
      console.error('Error: Image deletion failed')
    }
  }

  const handleInputChange = (field, value) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform, value) => {
    setState((prevState) => ({
      ...prevState,
      socialMediaLinks: {
        ...prevState.socialMediaLinks,
        [platform]: value
      }
    }))
  }

  const handleDeleteImageFile = async () => {
    setState({ ...state, imageFile: null })
  }

  const isValidContent = (content) => {
    if (content === null || content === undefined) {
      return false
    }

    const trimmedContent = content.trim()
    const htmlTagPattern = /<[^>]*>/g
    const textOnlyContent = trimmedContent.replace(htmlTagPattern, '').trim()
    return textOnlyContent !== ''
  }

  const displayContent = (content, clickEditText, noThingAddedText) => {
    if (mode === 'edit' && !state?.isEditSection && !isValidContent(content)) {
      return clickEditText ?? noThingAddedText
    } else if (mode === 'edit' && !state?.isEditSection) {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    } else if (mode === 'preview') {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    }
  }

  return (
    <PortfolioModalWrapper {...props} actions={actions}>
      <>
        <div className={'row'}>
          <div className={'col-md-6'}>
            <EditPortfolioSubmission
              videoUrl={state?.videoUrl}
              onChangeVideoUrl={(videoUrl) =>
                handleInputChange('videoUrl', videoUrl)
              }
              onChangeImageCrop={updateCroppedImage}
              value={state?.thumbnailUrl}
              title={'MY PERSONAL BRAND STORY'}
              deleteImage={handleDeleteImage}
              deleteImageFile={handleDeleteImageFile}
            />
          </div>
          <div className={'col-md-6'}>
            <div className={'d-flex flex-column h-100'}>
              <div className={'mb-2 d-flex justify-content-center'}>
                <ReactImageUpload
                  value={userImageUrl}
                  {...imageProperties}
                  onChangeImageCrop={updateCroppedProfileImage}
                  onImageLoadSuccess={handleImageLoadSuccess}
                  onLabelClick={handleLabelClick}
                  onFileInputChange={handleFileInputChange}
                  onPositionChange={handlePositionChange}
                  actions={avatarEditorActions}
                  title={'User Image'}
                  type={'circle'}
                  editorRef={editorRef}
                />
              </div>
              <LabeledInput
                title={'Title'}
                type={'text'}
                align={'start'}
                value={state?.userTitle}
                onChange={(value) => handleInputChange('userTitle', value)}
              />
              <div>
                <SocialMediaInput
                  icon={<FaLinkedinIn />}
                  value={state?.socialMediaLinks?.linkedIn || ''}
                  onChange={(value) =>
                    handleSocialMediaChange('linkedIn', value)
                  }
                />
                <SocialMediaInput
                  icon={<FaInstagram />}
                  value={state?.socialMediaLinks?.instagram || ''}
                  onChange={(value) =>
                    handleSocialMediaChange('instagram', value)
                  }
                />
                <SocialMediaInput
                  icon={<FaXTwitter />}
                  value={state?.socialMediaLinks?.xTwitter || ''}
                  onChange={(value) =>
                    handleSocialMediaChange('xTwitter', value)
                  }
                />
                <SocialMediaInput
                  icon={<FaFacebookF />}
                  value={state?.socialMediaLinks?.facebook || ''}
                  onChange={(value) =>
                    handleSocialMediaChange('facebook', value)
                  }
                />
                <SocialMediaInput
                  icon={<FaGlobe />}
                  value={state?.socialMediaLinks?.website || ''}
                  onChange={(value) =>
                    handleSocialMediaChange('website', value)
                  }
                />
              </div>

              <div className={'mt-2 '}>
                <div className={'portfolio-info-title my-2'}>
                  {props.title ?? 'My value proposition'}
                </div>
                <ReactQuill
                  className={'portfolio-quill'}
                  value={state.valueProposition || ''}
                  onChange={(value) =>
                    handleInputChange('valueProposition', value)
                  }
                  placeholder={
                    'Your statement of value consisting of your passions/interests, skills, and outcomes.'
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className={'row'}>
          <div className={'mt-3 '}>
            <div className={'portfolio-info-title'}>
              {props.title ?? 'My story'}
            </div>
            <ReactQuill
              className={'portfolio-quill'}
              value={state.story || ''}
              onChange={(value) => handleInputChange('story', value)}
              placeholder={'Your answers to the three program questions.'}
            />
          </div>
        </div>
      </>
    </PortfolioModalWrapper>
  )
}

export default UserBasicInfoModal
