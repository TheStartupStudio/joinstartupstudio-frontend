import React, { useEffect, useState } from 'react'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import UserInfo from '../../Components/UserInfo'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import { useDispatch, useSelector } from 'react-redux'
import EditPortfolioSubmission from '../../Components/EditPortfolioSubmission'
import ReactQuill from 'react-quill'
import SectionActions from '../../Components/Actions/SectionActions'
import {
  deleteMyFailureImage,
  saveMyStory
} from '../../../../redux/portfolio/Actions'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import ReactImageUpload from '../../Components/ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../../../hooks/useImageEditor'
import SocialMediaInput from '../../Components/SocialMediaInput'

import LabeledInput from '../../Components/DisplayData/LabeledInput'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FaFacebook, FaFacebookF, FaGlobe } from 'react-icons/fa'

const MyStory = (props) => {
  const mode = useSelector((state) => state.portfolio.mode)
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.myStory.isSaving
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

  const saveMyStoryData = async () => {
    let newThumbnailUrl
    let userImageUrl
    if (state.imageFile) {
      newThumbnailUrl = await uploadImage(state.imageFile)
    }

    if (!!imageProperties.croppedImage) {
      userImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    const myStory = {
      story: state.story,
      valueProposition: state.valueProposition,
      videoUrl: state.videoUrl,
      thumbnailUrl: newThumbnailUrl ? newThumbnailUrl : state.thumbnailUrl,
      userImageUrl,
      socialMediaLinks: state.socialMediaLinks,
      userTitle: state.userTitle
    }

    dispatch(saveMyStory(MyStory, state.id))
  }

  const actions = [
    {
      type: 'edit',
      action: () =>
        setState((prevState) => ({ ...prevState, isEditSection: true })),
      isDisplayed: mode === 'edit' && state.isEditSection === false
    },
    {
      type: 'save',
      action: () => saveMyStoryData(),
      isSaving: isSaving,
      isDisplayed: mode === 'edit' && state.isEditSection === true
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
          saveMyStory(
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
    <>
      {state?.isEditSection && mode === 'edit' ? (
        <>
          <div className={'row'}>
            <div className={'mt-3 '}>
              <div
                className={'portfolio-info-title'}
                style={{ marginBottom: '10px' }}
              >
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
      ) : (
        <>
          <div className={'row'}>
            <div className={'mt-3 value-prop-modal'}>
              <PortfolioInfoBox
                title={'My story'}
                content={displayContent(
                  state.story,
                  null,
                  'You haven’t added your story yet! Click the edit button to add your story.'
                )}
                contentClasses={'mystory-port-infobox text-start'}
                height={150}
              />
            </div>
          </div>
        </>
      )}

      <SectionActions actions={actions} />
    </>
  )
}

export default MyStory
