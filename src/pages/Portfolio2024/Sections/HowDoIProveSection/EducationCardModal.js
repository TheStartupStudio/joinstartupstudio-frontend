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

const EducationCardModal = (props) => {
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

  const [educationData, setEducationData] = useState(
    props.data || {
      organizationName: '',
      location: '',
      website: '',
      startDate: formatDateToInputValue(new Date()),
      endDate: formatDateToInputValue(new Date()),
      description: '',
      imageUrl: null,
      currentPosition: false
    }
  )

  useEffect(() => {
    if (props.data) {
      setEducationData({
        ...props.data,
        startDate: formatDateToInputValue(props.data?.startDate || new Date()),
        endDate: formatDateToInputValue(props.data?.endDate || new Date())
      })
      setImageUrl(props.data.imageUrl)
    }
  }, [props.data])

  const handleDataChange = (value, key) => {
    const updatedData = { ...educationData }
    updatedData[key] = value
    setEducationData(updatedData)
  }

  const onSaveEducation = async () => {
    let uploadedImageUrl
    if (imageProperties.croppedImage) {
      uploadedImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    const newEducationData = {
      ...educationData,
      imageUrl: uploadedImageUrl ? uploadedImageUrl : educationData.imageUrl
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
      action: () => onSaveEducation(),
      isDisplayed: true
    }
  ]

  const isEdit = () => !!educationData?.id

  const handleDeleteEducation = async (id) => {
    if (educationData?.imageUrl) {
      const deletedImage = await deleteImage(educationData?.imageUrl)
      if (deletedImage) {
        dispatch(deleteMyEducation(id))
      }
    } else {
      dispatch(deleteMyEducation(id))
    }
  }

  return (
    <PortfolioModalWrapper
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      actions={modalActions}
      class={'edit-education-modal'}
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
                  value={educationData?.startDate}
                  onChange={(e) => {
                    const newValue = e.target.value
                    handleDataChange(newValue, 'startDate')
                  }}
                />
              </span>
            </div>
            {!educationData.currentPosition && (
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
                    value={educationData?.endDate}
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
              checked={educationData.currentPosition}
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
                value={educationData?.organizationName}
                type={'text'}
                onChange={(e) => handleDataChange(e, 'organizationName')}
                labelAlign={'start'}
                placeholder={
                  'Add the name of your school, college, or university'
                }
              />
              <div className={'mt-2'}>
                <LabeledInput
                  titleClassNames={'portf-input-title'}
                  type={'text'}
                  title={'Location'}
                  name={'location'}
                  width={'100%'}
                  value={educationData?.location}
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
                  value={educationData?.website}
                  onChange={(e) => handleDataChange(e, 'website')}
                  labelAlign={'start'}
                  placeholder={
                    'Add the URL for the website of the school, college, or university'
                  }
                />
              </div>
            </>
          </div>
        </div>
        <div className={'mt-4'}>
          <div className={'portfolio-info-title text-uppercase'}>
            {'Description'}
          </div>
          <ReactQuill
            className={'portfolio-quill'}
            value={educationData?.description ?? ''}
            onChange={(value) => handleDataChange(value, 'description')}
            placeholder='Briefly describe what you are studying or the degree you earned at this school, college, or university.'
          />
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
          action: () => handleDeleteEducation(educationData?.id)
        }}
      />
    </PortfolioModalWrapper>
  )
}
export default EducationCardModal
