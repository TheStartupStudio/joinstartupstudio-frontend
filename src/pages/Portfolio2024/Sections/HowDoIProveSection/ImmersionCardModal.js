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
import { deleteMyEducation } from '../../../../redux/portfolio/Actions'
import {
  convertImageFileToFormData,
  formatDateToInputValue,
  uploadImage
} from '../../../../utils/helpers'
import useImageEditor from '../../../../hooks/useImageEditor'
import EditPortfolioSubmission from '../../Components/EditPortfolioSubmission'

const ImmersionCardModal = (props) => {
  const dispatch = useDispatch()
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
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
  } = useImageEditor()

  const [immersionThumbnailImageFile, setImmersionThumbnailImageFile] =
    useState(null)
  const [immersionData, setImmersionData] = useState(
    props.data || {
      organizationLogo: null,
      startDate: formatDateToInputValue(new Date()),
      endDate: formatDateToInputValue(new Date()),
      organizationName: '',
      location: '',
      website: '',
      problem: '',
      solution: '',
      currentlyAttending: false,
      immersionThumbnailUrl: '',
      immersionVideoUrl: ''
    }
  )

  useEffect(() => {
    if (props.data) {
      setImmersionData({
        ...props.data,
        startDate: formatDateToInputValue(props.data?.startDate || new Date()),
        endDate: formatDateToInputValue(props.data?.endDate || new Date())
      })
      setImageUrl(props.data.imageUrl)
    }
  }, [props.data])

  const updateCroppedImmersionImage = (file) => {
    setImmersionThumbnailImageFile(file)
  }

  const handleDataChange = (value, key) => {
    const updatedData = { ...immersionData }
    updatedData[key] = value
    setImmersionData(updatedData)
  }

  const onSaveEducation = async () => {
    let uploadedImageUrl
    let uploadedImmersionThumbnailUrl
    if (imageProperties.croppedImage) {
      uploadedImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    if (immersionThumbnailImageFile) {
      uploadedImmersionThumbnailUrl = await uploadImage(
        immersionThumbnailImageFile
      )
    }

    const newEducationData = {
      ...immersionData,
      organizationLogo: uploadedImageUrl
        ? uploadedImageUrl
        : immersionData.imageUrl,
      immersionThumbnailUrl: uploadedImmersionThumbnailUrl
        ? uploadedImmersionThumbnailUrl
        : immersionData.immersionThumbnailUrl
    }
    debugger
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
      action: () => onSaveEducation(),
      isDisplayed: true
    }
  ]

  const isEdit = () => !!immersionData?.id

  const handleDeleteEducation = (id) => {
    dispatch(deleteMyEducation(id))
  }

  return (
    <PortfolioModalWrapper
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      actions={modalActions}
      class={'edit-immersion-modal'}
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
                  value={immersionData?.startDate}
                  onChange={(e) => {
                    const newValue = e.target.value
                    handleDataChange(newValue, 'startDate')
                  }}
                />
              </span>
            </div>
            {!immersionData.currentlyAttending && (
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
                    value={immersionData?.endDate}
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
              checked={immersionData.currentlyAttending}
              onChange={(e) => {
                const newValue = e.target.checked
                handleDataChange(newValue, 'currentlyAttending')
              }}
              className={'me-2 current-position-checkbox'}
            />
            <span className={'current-position-label'}>
              Currently attending
            </span>
          </div>
        </div>
        <div className={'row'}>
          <div className={' col-md-3 '}>
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
          <div className={'col-md-9 '}>
            <div className={'d-flex gap-5'}>
              <div className={'w-75'}>
                <LabeledInput
                  title={'Organization name'}
                  name={'organizationName'}
                  width={'100%'}
                  value={immersionData?.organizationName}
                  type={'text'}
                  onChange={(e) => handleDataChange(e, 'organizationName')}
                  labelAlign={'start'}
                />
                <div className={'mt-2'}>
                  <LabeledInput
                    type={'text'}
                    title={'Location'}
                    name={'location'}
                    width={'100%'}
                    value={immersionData?.location}
                    onChange={(e) => handleDataChange(e, 'location')}
                    labelAlign={'start'}
                  />
                </div>
                <div className={'mt-2'}>
                  <LabeledInput
                    type={'text'}
                    title={'Website'}
                    name={'website'}
                    width={'100%'}
                    titleClassNames={'bold-text '}
                    value={immersionData?.website}
                    onChange={(e) => handleDataChange(e, 'website')}
                    labelAlign={'start'}
                  />
                </div>
              </div>
              <div>
                <EditPortfolioSubmission
                  height={250}
                  title={'Click the edit icon to link to your slide deck'}
                  titleClasses={'submission-title_edit-mode'}
                  videoUrl={immersionData?.videoUrl}
                  onChangeVideoUrl={(videoUrl) =>
                    handleDataChange?.('videoUrl', videoUrl)
                  }
                  onChangeImageCrop={updateCroppedImmersionImage}
                  value={immersionData?.thumbnailUrl}
                  // deleteImage={handleDeleteImage}
                  // deleteImageFile={handleDeleteImageFile}
                />
              </div>
            </div>
            <div className={'mt-4'}>
              <div
                className={'portfolio-info-title '}
                style={{ textTransform: 'none' }}
              >
                {'The problem'}
              </div>
              <ReactQuill
                className={'portfolio-quill mt-2'}
                value={immersionData?.problem ?? ''}
                onChange={(value) => handleDataChange(value, 'problem')}
              />
            </div>

            <div className={'mt-4'}>
              <div
                className={'portfolio-info-title'}
                style={{ textTransform: 'none' }}
              >
                {'The solution'}
              </div>
              <ReactQuill
                className={'portfolio-quill mt-2'}
                value={immersionData?.solution ?? ''}
                onChange={(value) => handleDataChange(value, 'solution')}
              />
            </div>
          </div>
        </div>
      </div>
      {isEdit() && (
        <div className={' mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton variant={'text'} align={'end'} name={'DELETE EDUCATION'} />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS EXPERIENCE?',
          description:
            'If you delete the experience, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteEducation(immersionData?.id)
        }}
      />
    </PortfolioModalWrapper>
  )
}
export default ImmersionCardModal
