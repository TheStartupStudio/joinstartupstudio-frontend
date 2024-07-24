import React, { useEffect, useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import ReactQuill from 'react-quill'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMyMentor,
  deleteMyMentor,
  deleteMentorImage,
  updateMyMentor
} from '../../../../redux/portfolio/Actions'
import LabeledInput from '../DisplayData/LabeledInput'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ImageUploader from '../ReactAvatarEditor/ImageUploader'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import ConfirmDeleteRecordModal from './ConfirmDeleteRecordModal'
import ReactImageUpload from '../ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../../../hooks/useImageEditor'

function MyMentorModal(props) {
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.myMentors.isSaving
  )
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [mentorImage, setMentorImage] = useState('')
  const [mentorName, setMentorName] = useState('')
  const [mentorRole, setMentorRole] = useState('')
  const [mentorCompany, setMentorCompany] = useState('')
  const [mentorDescription, setMentorDescription] = useState('')
  const [id, setId] = useState(null)
  const dispatch = useDispatch()
  const deleteAvatarImage = (deleteSuccess) => {
    console.log('deleteSuccess', deleteSuccess)
    if (deleteSuccess) {
      const updatedMentorData = {
        mentorImage: null
      }

      if (isEdit()) {
        dispatch(deleteMentorImage(updatedMentorData, id))
      } else {
        console.error(
          'Error: Trying to delete image for a mentor that does not exist'
        )
      }
    } else {
      console.error('Error: Image deletion failed')
    }
  }
  const deleteAvatarImageFile = (imageFile) => {
    console.log('imageFile', imageFile)
  }
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
    setImageUrl: setImageUrl,
    avatarEditorActions
  } = useImageEditor(deleteAvatarImage, deleteAvatarImageFile)

  useEffect(() => {
    if (props.data) {
      setMentorDescription(props.data?.mentorDescription)
      setMentorName(props.data?.mentorName)
      setMentorRole(props.data?.mentorRole)
      setMentorCompany(props.data?.mentorCompany)
      setMentorImage(props.data?.mentorImage)
      setId(props.data?.id)
      setImageUrl(props.data?.mentorImage)
      if (props.data?.mentorImage) {
        setImageProperties({ ...imageProperties, originalImage: '' })
      }
    }
  }, [props.data])

  const isEdit = () => !!id

  const saveMyMentorData = async () => {
    let newMentorImage
    // if (imageFile) {
    //   newMentorImage = await uploadImage(imageFile)
    // }
    if (!!imageProperties.croppedImage) {
      newMentorImage = await uploadImage(imageProperties.croppedImage)
    }

    const mentorData = {
      mentorImage: newMentorImage ? newMentorImage : mentorImage,
      mentorDescription,
      mentorName,
      mentorRole,
      mentorCompany,
      category: props.category ?? 'my-mentors'
    }
    if (isEdit()) {
      dispatch(updateMyMentor(mentorData, id))
    } else {
      dispatch(createMyMentor(mentorData))
    }
  }

  const actions = [
    {
      type: 'save',
      action: () => saveMyMentorData(),
      isDisplayed: true,
      containSpinner: true,
      isSaving: isSaving
    },
    {
      type: 'hide',
      isDisplayed: true,
      action: () => props.onHide()
    }
  ]

  const updateCroppedImage = (croppedImage) => {
    setImageFile(croppedImage)
  }

  const handleDeleteMentor = () => {
    dispatch(deleteMyMentor(id))
  }

  return (
    <PortfolioModalWrapper {...props} actions={actions}>
      <div className={'row'}>
        <div
          className={
            'col-md-4 d-flex align-items-center flex-column justify-content-center'
          }
        >
          <ReactImageUpload
            value={userImageUrl}
            {...imageProperties}
            onChangeImageCrop={updateCroppedProfileImage}
            onImageLoadSuccess={handleImageLoadSuccess}
            onLabelClick={handleLabelClick}
            onFileInputChange={handleFileInputChange}
            onPositionChange={handlePositionChange}
            actions={avatarEditorActions}
            title={'Mentor Image'}
            // type={'circle'}
            editorRef={editorRef}
          />
          {/*<ImageUploader*/}
          {/*  onChangeImageCrop={updateCroppedImage}*/}
          {/*  value={mentorImage}*/}
          {/*  actions={avatarEditorActions}*/}
          {/*  width={'100%'}*/}
          {/*  height={'100%'}*/}
          {/*  isRelativeSize={false}*/}
          {/*/>*/}
        </div>
        <div className={'col-md-8'}>
          <div className={''}>
            <LabeledInput
              title={'Mentor Name'}
              type={'text'}
              value={mentorName}
              onChange={(value) => setMentorName(value)}
            />
          </div>
          <div className={'mt-3'}>
            <LabeledInput
              title={'Role or Title'}
              type={'text'}
              value={mentorRole}
              onChange={(value) => setMentorRole(value)}
            />
          </div>
          <div className={'mt-3'}>
            <LabeledInput
              title={'Company'}
              type={'text'}
              value={mentorCompany}
              onChange={(value) => setMentorCompany(value)}
            />
          </div>
        </div>
      </div>
      <div className={'mt-3'}>
        <div className={'portfolio-quill-label-sm'}>{'Description'}</div>
        <ReactQuill
          className={'portfolio-quill mt-2'}
          value={mentorDescription}
          onChange={(value) => setMentorDescription(value)}
        />
      </div>
      {isEdit() && (
        <div className={'mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton
            variant={'text'}
            align={'end'}
            name={'DELETE NEW MENTOR'}
          />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS MENTOR?',
          description:
            'If you delete the mentor, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteMentor()
        }}
      />
    </PortfolioModalWrapper>
  )
}

export default MyMentorModal
