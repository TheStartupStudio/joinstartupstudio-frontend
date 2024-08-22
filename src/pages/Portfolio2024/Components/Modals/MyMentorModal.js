import React, { useEffect, useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import ReactQuill from 'react-quill'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMyMentor,
  deleteMyMentor,
  deleteMentorImage,
  updateMyMentor,
  updateMyCompetitiveness,
  addMyCompetitiveness,
  deleteMyCompetitivenessImage,
  deleteMyCompetitiveness
} from '../../../../redux/portfolio/Actions'
import LabeledInput from '../DisplayData/LabeledInput'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import ConfirmDeleteRecordModal from './ConfirmDeleteRecordModal'
import ReactImageUpload from '../ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../../../hooks/useImageEditor'

const MyMentorModal = (props) => {
  const mode = props.mode
  const initialMentorState = {
    mentorImage: '',
    mentorName: '',
    mentorRole: '',
    mentorCompany: '',
    mentorDescription: ''
  }
  const isCompetitiveness = props.category === 'my-competitiveness'
  const isSaving = useSelector((state) =>
    isCompetitiveness
      ? state.portfolio.howSection.myCompetitiveness.isSaving
      : state.portfolio.whoSection.myMentors.isSaving
  )

  const dispatch = useDispatch()
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [mentorDetails, setMentorDetails] = useState(initialMentorState)
  const [id, setId] = useState(null)

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
    setImageUrl,
    avatarEditorActions
  } = useImageEditor(deleteAvatarImage, deleteAvatarImageFile)

  useEffect(() => {
    if (props.data?.id) {
      setMentorDetails({
        mentorImage: props.data.mentorImage,
        mentorName: props.data.mentorName,
        mentorRole: props.data.mentorRole,
        mentorCompany: props.data.mentorCompany,
        mentorDescription: props.data.mentorDescription
      })
      setId(props.data.id)
      setImageUrl(props.data.mentorImage)
      if (props.data.mentorImage) {
        setImageProperties({ ...imageProperties, originalImage: '' })
      }
    } else {
      setMentorDetails(initialMentorState)
      setId(null)
      setImageUrl(null)
    }
  }, [props.data])

  const handleInputChange = (field, value) => {
    setMentorDetails((prevState) => ({ ...prevState, [field]: value }))
  }

  const isEdit = () => !!id

  const saveMyMentorData = async () => {
    const newMentorImage = imageProperties.croppedImage
      ? await uploadImage(imageProperties.croppedImage)
      : null

    const mentorData = {
      ...mentorDetails,
      mentorImage: newMentorImage || mentorDetails.mentorImage,
      category: props.category ?? 'my-mentors'
    }

    if (isCompetitiveness) {
      if (isEdit()) {
        dispatch(updateMyCompetitiveness(mentorData, id, 'my-competitiveness'))
      } else {
        dispatch(addMyCompetitiveness(mentorData, 'my-competitiveness'))
      }
    } else {
      if (isEdit()) {
        dispatch(updateMyMentor(mentorData, id, 'my-mentors'))
      } else {
        dispatch(createMyMentor(mentorData, 'my-mentors'))
      }
    }
  }

  const handleDeleteMentor = async () => {
    if (mentorDetails.mentorImage) {
      const deletedImage = await deleteImage(mentorDetails.mentorImage)
      if (deletedImage) {
        isCompetitiveness
          ? dispatch(deleteMyCompetitiveness(id))
          : dispatch(deleteMyMentor(id))
      }
    } else {
      isCompetitiveness
        ? dispatch(deleteMyCompetitiveness(id))
        : dispatch(deleteMyMentor(id))
    }
  }

  function deleteAvatarImage(deleteSuccess) {
    if (deleteSuccess) {
      const updatedMentorData = { mentorImage: null }
      if (isEdit()) {
        isCompetitiveness
          ? dispatch(deleteMyCompetitivenessImage(updatedMentorData, id))
          : dispatch(deleteMentorImage(updatedMentorData, id))
      } else {
        console.error(
          'Error: Trying to delete image for a mentor that does not exist'
        )
      }
    } else {
      console.error('Error: Image deletion failed')
    }
  }

  function deleteAvatarImageFile(imageFile) {
    console.log('imageFile', imageFile)
  }

  const readOnly = props.mode === 'preview'
  const actions = [
    {
      type: 'save',
      action: saveMyMentorData,
      isDisplayed: !readOnly,
      containSpinner: true,
      isSaving
    },
    {
      type: 'hide',
      isDisplayed: true,
      action: props.onHide
    }
  ]

  return (
    <PortfolioModalWrapper {...props} actions={actions}>
      <div className='row'>
        <div className='col-md-4 d-flex align-items-center flex-column justify-content-center'>
          <ReactImageUpload
            value={userImageUrl}
            {...imageProperties}
            onChangeImageCrop={updateCroppedProfileImage}
            onImageLoadSuccess={handleImageLoadSuccess}
            onLabelClick={handleLabelClick}
            onFileInputChange={handleFileInputChange}
            onPositionChange={handlePositionChange}
            actions={avatarEditorActions}
            title='Mentor Image'
            editorRef={editorRef}
            readOnly={readOnly}
          />
        </div>
        <div className='col-md-8'>
          <LabeledInput
            title='Mentor Name'
            type='text'
            value={mentorDetails.mentorName}
            onChange={(value) => handleInputChange('mentorName', value)}
            readOnly={readOnly}
            labelAlign={'start'}
          />

          <LabeledInput
            title='Role or Title'
            type='text'
            value={mentorDetails.mentorRole}
            onChange={(value) => handleInputChange('mentorRole', value)}
            containerClassNames='mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
          />
          <LabeledInput
            title='Company'
            type='text'
            value={mentorDetails.mentorCompany}
            onChange={(value) => handleInputChange('mentorCompany', value)}
            containerClassNames='mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
          />
        </div>
      </div>
      <div className='mt-3'>
        {!readOnly ? (
          <>
            <div className='portfolio-quill-label-sm'>Description</div>
            <ReactQuill
              className='portfolio-quill mt-2'
              value={mentorDetails.mentorDescription}
              onChange={(value) =>
                handleInputChange('mentorDescription', value)
              }
            />
          </>
        ) : (
          <LabeledInput
            title='Description'
            type='textarea'
            value={mentorDetails.mentorDescription}
            containerClassNames='mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
            inputHeight={100}
          />
        )}
      </div>
      {isEdit() && !readOnly && (
        <div className='mt-5' onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton variant='text' align='end' name='DELETE MENTOR' />
        </div>
      )}
      {confirmDeleteModal && (
        <ConfirmDeleteRecordModal
          onHide={() => setConfirmDeleteModal(false)}
          show={confirmDeleteModal}
          modalContent={{
            title: 'YOU’RE ABOUT TO DELETE THIS MENTOR?',
            description:
              'If you delete the mentor, it is not recoverable and will no longer appear in your portfolio.',
            action: handleDeleteMentor
          }}
        />
      )}
    </PortfolioModalWrapper>
  )
}

export default MyMentorModal
