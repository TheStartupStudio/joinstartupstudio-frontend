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
  updateMyFailure
} from '../../../../redux/portfolio/Actions'
import { deleteImage, uploadImage } from '../../../../utils/helpers'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import ConfirmDeleteRecordModal from './ConfirmDeleteRecordModal'

function MyFailureModal(props) {
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [assessment, setAssessment] = useState('')
  const [outcome, setOutcome] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [id, setId] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.data) {
      setThumbnailUrl(props.data?.thumbnailUrl)
      setVideoUrl(props.data?.videoUrl)
      setAssessment(props.data?.assessment)
      setOutcome(props.data?.outcome)
      setId(props.data?.id)
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
      assessment,
      outcome,
      thumbnailUrl: newThumbnailUrl ? newThumbnailUrl : thumbnailUrl,
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
    <PortfolioModalWrapper {...props} actions={actions}>
      <div className={'row'}>
        <div className={'col-lg-6 col-md-12'}>
          <div className={'my-2'}>
            <EditPortfolioSubmission
              // uploadedImage={videoThumbnail}
              videoUrl={videoUrl}
              onChangeVideoUrl={(videoUrl) => setVideoUrl(videoUrl)}
              onChangeImageCrop={updateCroppedImage}
              value={thumbnailUrl}
              title={'MY FAILURE STORY'}
              deleteImage={handleDeleteImage}
              deleteImageFile={handleDeleteImageFile}
            />
          </div>
        </div>
        <div className={'col-lg-6 col-md-12'}>
          <div className={'portfolio-info-title text-uppercase'}>
            {'Failure'}
          </div>
          <ReactQuill
            className={'portfolio-quill'}
            value={assessment}
            onChange={(value) => setAssessment(value)}
          />
          <div className={'portfolio-info-title my-2 text-italic'}>
            {'My Pivot'}
          </div>
          <ReactQuill
            className={'portfolio-quill'}
            value={outcome}
            onChange={(value) => setOutcome(value)}
          />
        </div>
      </div>
      {isEdit() && (
        <div className={' mt-5'} onClick={() => setConfirmDeleteModal(true)}>
          <LtsButton variant={'text'} align={'end'} name={'DELETE FAILURE'} />
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
