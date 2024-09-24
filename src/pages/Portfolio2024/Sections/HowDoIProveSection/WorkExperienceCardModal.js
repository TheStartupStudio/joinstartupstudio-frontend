import React, { createRef, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { BsCalendar3 } from 'react-icons/bs'
import ReactImageUpload from '../../Components/ReactAvatarEditor/ReactImageUpload'
import PortfolioModalWrapper from '../../Components/Modals/PortfolioModalWrapper'
import ReactQuill from 'react-quill'
import LabeledInput from '../../Components/DisplayData/LabeledInput'
import { useDispatch } from 'react-redux'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ConfirmDeleteRecordModal from '../../Components/Modals/ConfirmDeleteRecordModal'
import {
  deleteMyEducation,
  deleteMyWorkExperience
} from '../../../../redux/portfolio/Actions'
import {
  deleteImage,
  formatDateToInputValue,
  uploadImage
} from '../../../../utils/helpers'
import useImageEditor from '../../../../hooks/useImageEditor'

const WorkExperienceCardModal = (props) => {
  const dispatch = useDispatch()
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const deleteAvatarImage = (deleteSuccess) => {
    if (deleteSuccess) {
      if (isEdit()) {
        props.onSave({
          id: workExperienceData?.id,
          imageUrl: null
        })
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
    imageProperties,
    handleImageLoadSuccess,
    handleFileInputChange,
    handleLabelClick,
    handlePositionChange,
    updateCroppedImage,
    imageUrl,
    setImageUrl,
    avatarEditorActions,
    editorRef
  } = useImageEditor(deleteAvatarImage, deleteAvatarImageFile)
  const [workExperienceData, setWorkExperienceData] = useState(
    props.data || {
      organizationName: '',
      location: '',
      website: '',
      startDate: formatDateToInputValue(new Date()),
      endDate: formatDateToInputValue(new Date()),
      description: '',
      jobTitle: '',
      imageUrl: null,
      currentPosition: false,
      showSection: true
    }
  )

  useEffect(() => {
    if (props.data) {
      setWorkExperienceData({
        ...props.data,
        startDate: formatDateToInputValue(props.data?.startDate || new Date()),
        endDate: formatDateToInputValue(props.data?.endDate || new Date())
      })
      setImageUrl(props.data.imageUrl)
    }
  }, [props.data])

  const handleDataChange = (value, key) => {
    const updatedData = { ...workExperienceData }
    updatedData[key] = value
    setWorkExperienceData(updatedData)
  }

  const onSaveWorkExperience = async () => {
    let uploadedImageUrl
    if (imageProperties.croppedImage) {
      uploadedImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    const newEducationData = {
      ...workExperienceData,
      imageUrl: uploadedImageUrl
        ? uploadedImageUrl
        : workExperienceData.imageUrl
    }
    props.onSave?.(newEducationData)
  }

  const modalActions = [
    {
      type: 'hide',
      action: () => props.onHide(),
      isDisplayed: true
    },
    {
      type: 'save',
      action: () => onSaveWorkExperience(),
      isDisplayed: true
    }
  ]

  const isEdit = () => !!workExperienceData?.id

  const handleDeleteWorkExperience = async (id) => {
    if (workExperienceData?.imageUrl) {
      const deletedImage = await deleteImage(workExperienceData?.imageUrl)
      if (deletedImage) {
        dispatch(deleteMyWorkExperience(id))
      }
    } else {
      dispatch(deleteMyWorkExperience(id))
    }
  }

  return (
    <PortfolioModalWrapper
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      actions={modalActions}
      class={'edit-education-modal'}
      showSectionCheckbox={true}
      isShownSection={workExperienceData.showSection}
      onToggleSection={(showSection) => {
        setWorkExperienceData({ ...workExperienceData, showSection })
      }}
      switchId={`${isEdit() ? 'edit' : 'add'}-workExperience-switch`}
      switchName={`${isEdit() ? 'edit' : 'add'}-workExperience-switch`}
    >
      <div className={'portfolio-section-container w-100 pt-1 pb-1 px-1'}>
        <div
          className={
            ' d-flex justify-content-between flex-column align-items-end mb-2'
          }
        >
          <div className={'d-flex gap-2 mb-2'}>
            <div className={'select-date d-flex align-items-center'}>
              <span>
                <BsCalendar3 className={'calendar_icon '} />
              </span>
              <span className={'select-date-label ml-2 me-1'}>Start Date</span>{' '}
              <span className={'date-input-wrapper ml-1'}>
                <input
                  className={`date-input my-1 py-2 px-2 text-dark `}
                  type={'date'}
                  name={'startDate'}
                  value={workExperienceData?.startDate}
                  onChange={(e) => {
                    const newValue = e.target.value
                    handleDataChange(newValue, 'startDate')
                  }}
                />
              </span>
            </div>
            {!workExperienceData.currentPosition && (
              <div className={'select-date d-flex align-items-center'}>
                <span>
                  <BsCalendar3 className={'calendar_icon '} />
                </span>
                <span className={'select-date-label ml-2 me-1'}>End Date</span>{' '}
                <span className={'date-input-wrapper ml-1'}>
                  <input
                    className={`date-input my-1 py-2 px-2 text-dark `}
                    type={'date'}
                    name={'endDate'}
                    value={workExperienceData?.endDate}
                    onChange={(e) => {
                      const newValue = e.target.value
                      handleDataChange(newValue, 'endDate')
                    }}
                  />
                </span>
              </div>
            )}
          </div>

          <div className={'d-flex align-items-center'}>
            <input
              type='checkbox'
              checked={workExperienceData.currentPosition}
              onChange={(e) => {
                const newValue = e.target.checked
                handleDataChange(newValue, 'currentPosition')
              }}
              className={'me-2 current-position-checkbox'}
            />
            <span className={'current-position-label'}>
              My current position
            </span>
          </div>
        </div>
        <div className={'row'}>
          <div className={' col-md-4 '}>
            {/*<div className="upload-image me-2 mb-1">*/}
            <div className='p-0 mb-1'>
              <ReactImageUpload
                value={imageUrl}
                {...imageProperties}
                onChangeImageCrop={updateCroppedImage}
                onImageLoadSuccess={handleImageLoadSuccess}
                onLabelClick={handleLabelClick}
                onFileInputChange={handleFileInputChange}
                onPositionChange={handlePositionChange}
                actions={avatarEditorActions}
                title={'Organization Logo'}
                editorRef={editorRef}
              />
            </div>
          </div>
          <div className={'col-md-8 '}>
            <>
              <LabeledInput
                titleClassNames={'portf-input-title'}
                title={'ORGANIZATION NAME'}
                name={'organizationName'}
                width={'100%'}
                value={workExperienceData?.organizationName}
                type={'text'}
                onChange={(e) => handleDataChange(e, 'organizationName')}
                labelAlign={'start'}
                placeholder={'Add the name of the organization'}
              />
              <div className={'mt-2'}>
                <LabeledInput
                  titleClassNames={'portf-input-title'}
                  type={'text'}
                  title={'Location'}
                  name={'location'}
                  width={'100%'}
                  value={workExperienceData?.location}
                  onChange={(e) => handleDataChange(e, 'location')}
                  labelAlign={'start'}
                  placeholder={'Add the location here'}
                />
              </div>
              <div className={'mt-2'}>
                <LabeledInput
                  type={'text'}
                  title={'Website'}
                  name={'website'}
                  width={'100%'}
                  titleClassNames={'bold-text portf-input-title'}
                  value={workExperienceData?.website}
                  onChange={(e) => handleDataChange(e, 'website')}
                  labelAlign={'start'}
                  placeholder={"Add the URL for the organization's website"}
                />
              </div>
            </>
          </div>
        </div>
        <div className={'mt-4'}>
          <div className={'mt-2'}>
            <LabeledInput
              type={'text'}
              title={'Job title'}
              name={'jobTitle'}
              width={'100%'}
              titleClassNames={'bold-text portf-input-title'}
              value={workExperienceData?.jobTitle}
              onChange={(e) => handleDataChange(e, 'jobTitle')}
              labelAlign={'start'}
              placeholder={'Add your job title here'}
            />
          </div>
          <div className={'mt-3'}>
            <div
              className={'portfolio-info-title mb-1'}
              style={{ textTransform: 'none' }}
            >
              {'Description'}
            </div>
            <ReactQuill
              className={'portfolio-quill'}
              value={workExperienceData?.description ?? ''}
              onChange={(value) => handleDataChange(value, 'description')}
              placeholder='Briefly describe the nature of your work experience.'
            />
          </div>
        </div>
      </div>
      {isEdit() && (
        <div className={' mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton
            variant={'text'}
            align={'end'}
            name={'DELETE WORK EXPERIENCE'}
          />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS WORK EXPERIENCE?',
          description:
            'If you delete the work experience, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteWorkExperience(workExperienceData?.id)
        }}
      />
    </PortfolioModalWrapper>
  )
}
export default WorkExperienceCardModal
