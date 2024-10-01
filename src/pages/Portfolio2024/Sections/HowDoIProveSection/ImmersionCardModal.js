import React, { useEffect, useState } from 'react'
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
  deleteMyImmersion,
  deleteMyWorkExperience
} from '../../../../redux/portfolio/Actions'
import {
  deleteImage,
  formatDateToInputValue,
  uploadImage
} from '../../../../utils/helpers'
import useImageEditor from '../../../../hooks/useImageEditor'
import EditPortfolioSubmission from '../../Components/EditPortfolioSubmission'

const ImmersionCardModal = (props) => {
  const dispatch = useDispatch()
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

  const deleteAvatarImage = (deleteSuccess) => {
    if (deleteSuccess) {
      if (isEdit()) {
        props.onSave({
          id: immersionData?.id,
          organizationLogo: null
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
      immersionThumbnailUrl: null,
      immersionVideoUrl: null,
      showSection: true
    }
  )

  useEffect(() => {
    if (props.data) {
      setImmersionData({
        ...props.data,
        startDate: formatDateToInputValue(props.data?.startDate ?? new Date()),
        endDate: formatDateToInputValue(props.data?.endDate ?? new Date())
      })
      setImageUrl(props.data?.organizationLogo)
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

  const onSaveImmersion = async () => {
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

    const newImmersionData = {
      ...immersionData,
      organizationLogo: uploadedImageUrl
        ? uploadedImageUrl
        : immersionData.imageUrl,
      immersionThumbnailUrl: uploadedImmersionThumbnailUrl
        ? uploadedImmersionThumbnailUrl
        : immersionData.immersionThumbnailUrl
    }
    props.onSave?.(newImmersionData)
  }

  const modalActions = [
    {
      type: 'hide',
      action: () => props.onHide(),
      isDisplayed: true
    },
    {
      type: 'save',
      action: () => onSaveImmersion(),
      isDisplayed: true
    }
  ]

  const isEdit = () => !!immersionData?.id

  // const handleDeleteImmersion = (id) => {
  //   dispatch(deleteMyImmersion(id))
  // }

  const handleDeleteImmersion = async (id) => {
    try {
      if (immersionData) {
        let deletedImmersionThumbnail = false
        let deletedOrganizationLogo = false

        if (immersionData.immersionThumbnailUrl) {
          deletedImmersionThumbnail = await deleteImage(
            immersionData.immersionThumbnailUrl
          )
        }

        if (immersionData.organizationLogo) {
          deletedOrganizationLogo = await deleteImage(
            immersionData.organizationLogo
          )
        }

        if (deletedImmersionThumbnail || deletedOrganizationLogo) {
          dispatch(deleteMyImmersion(id))
        }
      } else {
        dispatch(deleteMyImmersion(id))
      }
    } catch (error) {
      console.error('Error deleting immersion:', error)
    }
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(
      immersionData?.immersionThumbnailUrl
    )
    if (deleteSuccess) {
      if (isEdit()) {
        props.onSave({
          id: immersionData?.id,
          immersionThumbnailUrl: null
        })
      } else {
        console.error(
          'Error: Trying to delete image for a failure that does not exist'
        )
      }
    } else {
      console.error('Error: Image deletion failed')
    }
  }

  const handleDeleteImageFile = async () => {
    setImmersionData({ ...immersionData, immersionThumbnailUrl: null })
  }

  return (
    <PortfolioModalWrapper
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      actions={modalActions}
      class={'edit-immersion-modal'}
      showSectionCheckbox={true}
      isShownSection={immersionData.showSection}
      onToggleSection={(showSection) => {
        setImmersionData({ ...immersionData, showSection })
      }}
      switchId={`${isEdit() ? 'edit' : 'add'}-immersion-switch`}
      switchName={`${isEdit() ? 'edit' : 'add'}-immersion-switch`}
    >
      <div className={'portfolio-section-container w-100 pt-1 pb-1 px-1'}>
        <div
          className={
            ' d-flex justify-content-between flex-column align-items-end mb-2'
          }
        >
          <div className={'education-card-date d-flex gap-2 mb-2'}>
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
                  dataformatas={''}
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
            <div
              className={
                'checkbox-date-education-resp d-flex align-items-center'
              }
            >
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

          <div className={'checkbox-date-education d-flex align-items-center'}>
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
        <div className={'education-card-row row'}>
          <div className={'immersion-image-align col-md-3 '}>
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
            <div className={'immersion-inputs d-flex gap-5'}>
              <div className={'w-75'}>
                <LabeledInput
                  titleClassNames={'portf-input-title'}
                  title={'ORGANIZATION NAME'}
                  name={'organizationName'}
                  width={'100%'}
                  value={immersionData?.organizationName}
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
                    value={immersionData?.location}
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
                    value={immersionData?.website}
                    onChange={(e) => handleDataChange(e, 'website')}
                    labelAlign={'start'}
                    placeholder={'Add the URL of the organization'}
                  />
                </div>
              </div>
              <div>
                <EditPortfolioSubmission
                  height={250}
                  title={
                    !immersionData?.immersionThumbnailUrl
                      ? 'Click the edit icon to link to your slide deck'
                      : 'My immersion experience'
                  }
                  titleClasses={
                    !immersionData?.immersionThumbnailUrl
                      ? 'submission-title_edit-mode'
                      : ''
                  }
                  videoUrl={immersionData?.immersionVideoUrl}
                  onChangeVideoUrl={(videoUrl) =>
                    handleDataChange?.(videoUrl, 'immersionVideoUrl')
                  }
                  onChangeImageCrop={updateCroppedImmersionImage}
                  value={immersionData?.immersionThumbnailUrl}
                  deleteImage={handleDeleteImage}
                  deleteImageFile={handleDeleteImageFile}
                />
              </div>
            </div>
            <div className={'immersion-problem mt-4'}>
              <div
                className={'portfolio-info-title '}
                style={{ textTransform: 'none' }}
              >
                {'The Problem'}
              </div>
              <ReactQuill
                className={'portfolio-quill mt-2'}
                value={immersionData?.problem ?? ''}
                onChange={(value) => handleDataChange(value, 'problem')}
                placeholder='Explain the problem you identified and why it was worth solving.'
              />
            </div>

            <div className={'mt-4'}>
              <div
                className={'portfolio-info-title'}
                style={{ textTransform: 'none' }}
              >
                {'The Solution'}
              </div>
              <ReactQuill
                className={'portfolio-quill mt-2'}
                value={immersionData?.solution ?? ''}
                onChange={(value) => handleDataChange(value, 'solution')}
                placeholder='Explain how your solution solved the problem you identified.'
              />
            </div>
          </div>
        </div>
      </div>
      {isEdit() && (
        <div
          className={'delete-immersion-btn mt-5'}
          onClick={() => setConfirmDeleteModal(true)}
        >
          <LtsButton variant={'text'} align={'end'} name={'DELETE IMMERSION'} />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS IMMERSION?',
          description:
            'If you delete the immersion, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteImmersion(immersionData?.id)
        }}
      />
    </PortfolioModalWrapper>
  )
}
export default ImmersionCardModal
