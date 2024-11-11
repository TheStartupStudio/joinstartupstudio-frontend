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
  const initialMentorState = {
    mentorImage: '',
    mentorName: '',
    mentorRole: '',
    mentorCompany: '',
    mentorDescription: '',
    showSection: true
  }
  const isCompetitiveness = props.category === 'my-competitiveness'
  const isSaving = useSelector((state) =>
    isCompetitiveness
      ? state.portfolio.howSection.myCompetitiveness.isSaving
      : state.portfolio.whoSection.myMentors.isSaving
  )

  const dispatch = useDispatch()
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
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
        mentorDescription: props.data.mentorDescription,
        showSection: props.data.showSection ?? false
      })
      // setShowSection(props.data.showSection ?? false)
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
    <PortfolioModalWrapper
      {...props}
      actions={actions}
      showSectionCheckbox={!readOnly}
      isShownSection={!mentorDetails.showSection}
      onToggleSection={(showSection) => {
        setMentorDetails({ ...mentorDetails, showSection })
      }}
      class={'portf-modal-widths'}
      switchId={isEdit() ? 'edit-mentor-switch' : 'add-mentor-switch'}
      switchName={isEdit() ? 'edit-mentor-switch' : 'add-mentor-switch'}
    >
      <div className='mentor-modal-firstrow row'>
        <div className='d-flex flex-column justify-content-center mentor-modal-imgs'>
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
        <div className='mentor-modal-inputs inputs-aligning'>
          <LabeledInput
            title='Mentor Name'
            type='text'
            value={mentorDetails.mentorName}
            onChange={(value) => handleInputChange('mentorName', value)}
            readOnly={readOnly}
            labelAlign={'start'}
            containerClassNames={'portf-quill-mentor'}
            placeholder={"Add your mentor's name"}
          />

          <LabeledInput
            title='Role or Title'
            type='text'
            value={mentorDetails.mentorRole}
            onChange={(value) => handleInputChange('mentorRole', value)}
            containerClassNames='portf-quill-mentor mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
            placeholder={
              "Add your mentor's role or title here (i.e. Director of Finance)"
            }
          />
          <LabeledInput
            title='Company'
            type='text'
            value={mentorDetails.mentorCompany}
            onChange={(value) => handleInputChange('mentorCompany', value)}
            containerClassNames='portf-quill-mentor mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
            placeholder={
              'Add the name of the organization where your mentor works'
            }
          />
        </div>
      </div>
      <div className='mt-3 inputs-aligning'>
        {!readOnly ? (
          <>
            <div className='portfolio-quill-label-sm'>Description</div>
            <ReactQuill
              className='portfolio-quill mt-2'
              value={mentorDetails.mentorDescription}
              onChange={(value) =>
                handleInputChange('mentorDescription', value)
              }
              placeholder={
                'Briefly describe the role your mentor is playing in our growth and development.'
              }
            />
          </>
        ) : (
          <LabeledInput
            title='Description'
            type='textarea'
            value={mentorDetails.mentorDescription}
            containerClassNames='readonly-desc-width mt-3'
            readOnly={readOnly}
            labelAlign={'start'}
            inputHeight={100}
            placeholder={
              'Briefly describe the role your mentor is playing in our growth and development.'
            }
          />
        )}
      </div>
      {isEdit() && !readOnly && (
        <div className='mt-5' onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton
            className='mydelete-failure-btn'
            variant='text'
            align='end'
            name='DELETE MENTOR'
          />
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
