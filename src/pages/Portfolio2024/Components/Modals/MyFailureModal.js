import React, { useEffect, useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import EditPortfolioSubmission from '../EditPortfolioSubmission'
import ReactQuill from 'react-quill'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMyFailure,
  deleteMentorImage,
  deleteMyFailure,
  deleteMyFailureImage,
  deleteMyMentor,
  toggleUserStory,
  updateMyFailure
} from '../../../../redux/portfolio/Actions'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ConfirmDeleteRecordModal from './ConfirmDeleteRecordModal'

function MyFailureModal(props) {
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [failure, setFailure] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [pivot, setPivot] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [id, setId] = useState(null)
  const [showSection, setShowSection] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.data) {
      setThumbnailUrl(props.data?.thumbnailUrl)
      setVideoUrl(props.data?.videoUrl)
      setFailure(props.data?.failure)
      setOutcomes(props.data?.outcomes)
      setPivot(props.data?.pivot)
      setId(props.data?.id)
      setShowSection(props.data?.showSection)
      setConfirmDeleteModal(false)
    }
  }, [props.data])
  const isEdit = () => !!id

  const saveMyFailureData = async () => {
    let newThumbnailUrl
    if (imageFile) {
      newThumbnailUrl = await uploadImage(imageFile)
    }

    const failureData = {
      videoUrl,
      failure,
      pivot,
      outcomes,
      thumbnailUrl: newThumbnailUrl ? newThumbnailUrl : thumbnailUrl,
      showSection,
      category: 'my-failures'
    }

    if (isEdit()) {
      dispatch(updateMyFailure(failureData, id))
    } else {
      dispatch(createMyFailure(failureData))
    }
  }
  const actions = [
    {
      type: 'save',
      action: () => saveMyFailureData(),
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
    setImageFile(croppedImage)
  }

  const handleDeleteFailure = (id) => {
    dispatch(deleteMyFailure(id))
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(thumbnailUrl)
    if (deleteSuccess) {
      const updatedFailureData = {
        thumbnailUrl: null
      }

      if (isEdit()) {
        dispatch(deleteMyFailureImage(updatedFailureData, id))
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
    setImageFile(null)
  }

  return (
    <PortfolioModalWrapper
      {...props}
      actions={actions}
      showSectionCheckbox={true}
      isShownSection={!showSection}
      onToggleSection={(showSection) => {
        setShowSection(showSection)
      }}
      switchId={isEdit() ? 'edit-failure-switch' : 'add-failure-switch'}
      switchName={isEdit() ? 'edit-failure-switch' : 'add-failure-switch'}
    >
      <div className={'row'}>
        <div className={'col-lg-6 col-md-12'}>
          <div className={'failure-submission-container my-2'}>
            <EditPortfolioSubmission
              // uploadedImage={videoThumbnail}
              videoUrl={videoUrl}
              onChangeVideoUrl={(videoUrl) => setVideoUrl(videoUrl)}
              onChangeImageCrop={updateCroppedImage}
              value={thumbnailUrl}
              title={'MY FAILURE STORY'}
              deleteImage={handleDeleteImage}
              deleteImageFile={handleDeleteImageFile}
            />{' '}
            <p> Link to your failure story video.</p>
          </div>
        </div>
        <div className={'col-lg-6 col-md-12 '} style={{ marginTop: '10px' }}>
          <div className={'portfolio-info-title text-uppercase'}>
            {'Failure'}
          </div>
          <ReactQuill
            placeholder='Explain the context and outcomes of your failure.'
            className={'portfolio-quill'}
            value={failure ?? ''}
            onChange={(value) => setFailure(value)}
          />
          <div className={'pivot-title portfolio-info-title my-2 text-italic'}>
            {'My Pivot'}
          </div>

          <ReactQuill
            placeholder='Explain how you turned your failure experience into an oppurtunity.'
            className={'portfolio-quill'}
            value={pivot || ''}
            onChange={(value) => setPivot(value)}
          />

          <div className={'portfolio-info-title my-2 text-italic'}>
            {'My Outcomes'}
          </div>
          <ReactQuill
            className={'portfolio-quill'}
            value={outcomes || ''}
            onChange={(value) => setOutcomes(value)}
          />
        </div>
      </div>
      {isEdit() && (
        <div
          className={' mt-5 delete-failure-btn'}
          onClick={() => setConfirmDeleteModal(true)}
        >
          <LtsButton
            variant={'text'}
            align={'end'}
            name={'DELETE FAILURE'}
            className='mydelete-failure-btn'
          />
        </div>
      )}
      <ConfirmDeleteRecordModal
        onHide={() => setConfirmDeleteModal(false)}
        show={confirmDeleteModal}
        modalContent={{
          title: 'YOU’RE ABOUT TO DELETE THIS FAILURE?',
          description:
            'If you delete the failure, it is not recoverable and will no longer appear in your portfolio.',
          action: () => handleDeleteFailure(id)
        }}
      />
    </PortfolioModalWrapper>
  )
}

export default MyFailureModal
