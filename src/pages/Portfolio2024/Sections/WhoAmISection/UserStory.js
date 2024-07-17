import React, { useEffect, useState } from 'react'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import UserInfo from '../../Components/UserInfo'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import { useDispatch, useSelector } from 'react-redux'
import EditPortfolioSubmission from '../../Components/EditPortfolioSubmission'
import ReactQuill from 'react-quill'
import SectionActions from '../../Components/Actions/SectionActions'
import {
  deleteMyFailureImage,
  saveUserStory
} from '../../../../redux/portfolio/Actions'
import { deleteImage, uploadImage } from '../../../../utils/helpers'

const UserStory = (props) => {
  const loggedUser = useSelector((state) => state.user.user.user)
  const mode = useSelector((state) => state.portfolio.mode)
  const [isEditSection, setIsEditSection] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [valueProposition, setValueProposition] = useState('')
  const [story, setStory] = useState('')
  const [id, setId] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.data) {
      setThumbnailUrl(props.data?.thumbnailUrl)
      setVideoUrl(props.data?.videoUrl)
      setValueProposition(props.data?.valueProposition)
      setStory(props.data?.story)
      setId(props.data?.id)
      setIsEditSection(false)
    }
  }, [props.data])

  const isEdit = () => !!id
  const saveUserStoryData = async () => {
    let newThumbnailUrl
    if (imageFile) {
      newThumbnailUrl = await uploadImage(imageFile)
    }
    dispatch(
      saveUserStory(
        {
          story,
          valueProposition,
          videoUrl,
          thumbnailUrl: newThumbnailUrl ? newThumbnailUrl : thumbnailUrl
        },
        id
      )
    )
  }

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed: mode === 'edit' && isEditSection === false
    },
    {
      type: 'save',
      action: () => saveUserStoryData(),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]
  const updateCroppedImage = (croppedImage) => {
    setImageFile(croppedImage)
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(thumbnailUrl)
    if (deleteSuccess) {
      if (isEdit()) {
        dispatch(
          saveUserStory(
            {
              thumbnailUrl: null
            },
            id
          )
        )
      } else {
        console.error(
          'Error: Trying to delete image for a failure that does not exist'
        )
      }
    } else {
      console.error('Error: Image deletion failed')
    }
  }
  return (
    <>
      {isEditSection && mode === 'edit' ? (
        <>
          <div className={'row'}>
            <div className={'col-md-6'}>
              <EditPortfolioSubmission
                videoUrl={videoUrl}
                onChangeVideoUrl={(videoUrl) => setVideoUrl(videoUrl)}
                onChangeImageCrop={updateCroppedImage}
                value={thumbnailUrl}
                title={'MY PERSONAL BRAND STORY'}
                deleteImage={handleDeleteImage}
              />
            </div>
            <div className={'col-md-6'}>
              <div className={'d-flex flex-column h-100'}>
                <UserInfo user={loggedUser} />

                <div className={'mt-2 '}>
                  {/*<PortfolioInfoBox />*/}
                  <div className={'portfolio-info-title my-2'}>
                    {props.title ?? 'My value proposition'}
                  </div>
                  <ReactQuill
                    className={'portfolio-quill'}
                    value={valueProposition || ''}
                    onChange={(value) => setValueProposition(value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={'row'}>
            <div className={'mt-3 '}>
              <div className={'portfolio-info-title'}>
                {props.title ?? 'My story'}
              </div>
              <ReactQuill
                className={'portfolio-quill'}
                value={story || ''}
                onChange={(value) => setStory(value)}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={'row'}>
            <div className={'col-md-6'}>
              <PortfolioSubmission
                videoUrl={videoUrl}
                thumbnailUrl={thumbnailUrl}
                title={'MY PERSONAL BRAND STORY'}
              />
            </div>
            <div className={'col-md-6'}>
              <div className={'d-flex flex-column h-100'}>
                <UserInfo user={loggedUser} />

                <div className={'mt-auto '}>
                  <PortfolioInfoBox
                    title={'My Value Proposition'}
                    content={valueProposition}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={'row'}>
            <div className={'mt-3 '}>
              <PortfolioInfoBox title={'My story'} content={story} />
            </div>
          </div>
        </>
      )}
      <SectionActions actions={actions} />
    </>
  )
}

export default UserStory
