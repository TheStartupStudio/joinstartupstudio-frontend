import React, { createRef, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { BsCalendar3 } from 'react-icons/bs'
import ReactImageUpload from '../../Components/ReactAvatarEditor/ReactImageUpload'
import PortfolioModalWrapper from '../../Components/Modals/PortfolioModalWrapper'
import ReactQuill from 'react-quill'
import LabeledInput from '../../Components/DisplayData/LabeledInput'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ConfirmDeleteRecordModal from '../../Components/Modals/ConfirmDeleteRecordModal'
import {
  deleteMyCredential,
  deleteMyFailure
} from '../../../../redux/portfolio/Actions'
import { useDispatch } from 'react-redux'
import useImageEditor from '../../../../hooks/useImageEditor'
import { formatDateToInputValue, uploadImage } from '../../../../utils/helpers'

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

  const [credentialData, setCredentialData] = useState(
    props.data || {
      credentialTitle: '',
      certifyingOrganization: '',
      website: '',
      dateAwarded: formatDateToInputValue(new Date()),
      description: '',
      imageUrl: ''
    }
  )

  // useEffect(()=>{},[educationData])
  useEffect(() => {
    if (props.data) {
      setCredentialData({
        ...props.data,
        dateAwarded: formatDateToInputValue(
          props.data?.dateAwarded || new Date()
        )
      })
      setImageUrl(props.data.imageUrl)
    }
  }, [props.data])

  const handleDataChange = (value, key) => {
    const updatedData = { ...credentialData }
    updatedData[key] = value
    setCredentialData(updatedData)
  }

  const onSaveCredential = async () => {
    let uploadedImageUrl
    if (imageProperties.croppedImage) {
      uploadedImageUrl = await uploadImage(imageProperties.croppedImage)
    }

    const newCredentialData = {
      ...credentialData,
      imageUrl: uploadedImageUrl ? uploadedImageUrl : credentialData.imageUrl
    }
    debugger
    props.onSave?.(newCredentialData)
  }

  const modalActions = [
    {
      type: 'hide',
      action: () => props.onHide(),
      isDisplayed: true
    },
    {
      type: 'save',
      action: () => onSaveCredential(),
      isDisplayed: true
    }
  ]

  const isEdit = () => !!credentialData.id

  const handleDeleteCredential = (id) => {
    dispatch(deleteMyCredential(id))
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
            {
              <div className={'select-date d-flex align-items-center'}>
                <span>
                  <BsCalendar3 className={'calendar_icon '} />
                </span>
                <span className={'select-date-label ml-2 me-1'}>
                  Date awarded
                </span>{' '}
                <span className={'date-input-wrapper ml-1'}>
                  <input
                    className={`date-input my-1 py-2 px-2 text-dark `}
                    type={'date'}
                    name={'endDate'}
                    value={credentialData?.dateAwarded || new Date()}
                    onChange={(e) => {
                      const newValue = e.target.value
                      handleDataChange(newValue, 'dateAwarded')
                    }}
                  />
                </span>
              </div>
            }
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
                title={'Credential Image'}
                editorRef={editorRef}
              />
            </div>
          </div>
          <div className={'col-md-8 '}>
            <>
              <LabeledInput
                title={'Organization name'}
                name={'organizationName'}
                width={'100%'}
                value={credentialData?.credentialTitle}
                type={'text'}
                onChange={(e) => handleDataChange(e, 'credentialTitle')}
                labelAlign={'start'}
              />
              <div className={'mt-2'}>
                <LabeledInput
                  type={'text'}
                  title={'Location'}
                  name={'location'}
                  width={'100%'}
                  value={credentialData?.certifyingOrganization}
                  onChange={(e) =>
                    handleDataChange(e, 'certifyingOrganization')
                  }
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
                  value={credentialData?.website}
                  onChange={(e) => handleDataChange(e, 'website')}
                  labelAlign={'start'}
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
            value={credentialData?.description ?? ''}
            onChange={(value) => handleDataChange(value, 'description')}
          />
        </div>
      </div>
      {isEdit() && (
        <div className={' mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton
            variant={'text'}
            align={'end'}
            name={'DELETE CREDENTIAL'}
          />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS CREDENTIAL?',
          description:
            'If you delete the credential, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteCredential(credentialData?.id)
        }}
      />
    </PortfolioModalWrapper>
  )
}
export default EducationCardModal
