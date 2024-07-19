import React, { useState, useRef, useEffect, createRef } from 'react'
import imagePlaceholder from '../../../assets/images/image-placeholder.jpeg'
import { FaPencilAlt } from 'react-icons/fa'
import Tooltip from 'react-bootstrap/Tooltip'
import TooltipAction from './Actions/TooltipAction'
import { IoTrashOutline } from 'react-icons/io5'
import { FiLink } from 'react-icons/fi'
import { BiImageAdd } from 'react-icons/bi'
import AvatarEditor from 'react-avatar-editor'
import LtsButton from '../../../components/LTSButtons/LTSButton'
import { useHistory } from 'react-router-dom'

function EditPortfolioSubmission(props) {
  const [isEditingSubmission, setIsEditingSubmission] = useState(false)
  const [isDeletingSubmission, setIsDeletingSubmission] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const editorRef = createRef()
  const [imageProperties, setImageProperties] = useState({
    originalImage: '',
    croppedImage: undefined,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0
  })
  const { originalImage, croppedImage, position, scale, rotate } =
    imageProperties

  useEffect(() => {
    if (croppedImage) props.onChangeImageCrop?.(croppedImage)
  }, [croppedImage])

  useEffect(() => {
    updateCroppedImage()
  }, [originalImage, position, scale, rotate])

  function handleAdd(event) {
    setImageProperties((prevState) => ({
      ...prevState,
      originalImage: event.target.files[0]
    }))
  }

  function handlePositionChange(position) {
    setImageProperties((prevState) => ({ ...prevState, position }))
  }

  async function updateCroppedImage() {
    if (editorRef?.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas()
      const blob = await new Promise((resolve) => canvasScaled.toBlob(resolve))
      const uniqueFilename = `image_${Date.now()}.png`
      const formData = new FormData()
      formData.append('img', blob, uniqueFilename)
      setImageFile(formData)

      setImageProperties((prevState) => ({
        ...prevState,
        // croppedImage: window.URL.createObjectURL(blob)
        croppedImage: formData
      }))
    }
  }

  function handleImageLoadSuccess() {
    updateCroppedImage()
  }

  const inputImage = useRef(null)
  return (
    <>
      <div className={`portfolio-submission-container `}>
        {imageProperties.originalImage !== '' ? (
          <div className={'portfolio-submission-crop-container'}>
            <AvatarEditor
              ref={editorRef}
              color={[235, 235, 235, 0.6]}
              scale={scale}
              width={600}
              crossOrigin="anonymous"
              height={400}
              image={originalImage}
              rotate={rotate}
              position={position}
              onPositionChange={handlePositionChange}
              onLoadSuccess={handleImageLoadSuccess}
              border={16}
              borderRadius={6}
              style={{
                width: '100%',
                height: '100%',
                boxShadow: '0px 3px 6px #0000004D',
                borderRadius: 28
              }}
            />
          </div>
        ) : (
          <>
            <img
              className={'portfolio-submission-image'}
              alt={'submission-image'}
              src={props.value ?? imagePlaceholder}
            />
          </>
        )}
        <div className={'portfolio-submission-title'}>{props.title}</div>

        <div className={'submission-actions-box'}>
          <div className={'position-relative'}>
            <div className={'submission-actions d-flex justify-content-center'}>
              <TooltipAction
                onClick={() => {
                  setIsEditingSubmission(true)
                  setIsDeletingSubmission(false)
                }}
                icon={<FaPencilAlt className={'action-icon pencil-icon'} />}
                tooltipContent={
                  <Tooltip id="tooltip" className={'tooltip-content'}>
                    Click here to return to edit mode
                  </Tooltip>
                }
              />

              <TooltipAction
                onClick={() => {
                  setIsDeletingSubmission(true)
                  setIsEditingSubmission(false)
                }}
                icon={<IoTrashOutline className={'action-icon public-icon'} />}
                tooltipContent={
                  <Tooltip id="tooltip" className={'tooltip-content '}>
                    Click here to delete image
                  </Tooltip>
                }
              />
            </div>
          </div>
        </div>
        <div className={'submission-edit-actions-box'} style={{ width: '80%' }}>
          <div className={'position-relative'}>
            {isDeletingSubmission && (
              <div
                className={
                  'delete-submission-link-box d-flex gap-1 align-items-center justify-content-between'
                }
              >
                <span className={'ms-4 confirm-action-submission'}>
                  Are you sure?
                </span>
                <div>
                  <LtsButton
                    name={'Yes'}
                    backgroundColor={'#F2359D'}
                    color={'#fff'}
                    borderRadius={'20px'}
                    additionalStyle={{ height: '25px', width: '90px' }}
                    onClick={() => {
                      if (props.value) {
                        props.deleteImage()
                      } else {
                        setImageFile(null)
                        setImageProperties({
                          ...imageProperties,
                          croppedImage: null,
                          originalImage: ''
                        })
                        setIsDeletingSubmission(false)
                        setIsEditingSubmission(true)
                        props.deleteImageFile()
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {isEditingSubmission && (
              <div
                className={
                  'insert-submission-link-box d-flex gap-1 align-items-center'
                }
              >
                <FiLink />
                <input
                  className={'insert-submission-link'}
                  placeholder={'/content-url'}
                  onChange={(e) => props.onChangeVideoUrl(e.target.value)}
                  value={props.videoUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditingSubmission && imageProperties.originalImage === '' && (
        <div
          className={'add-thumbnail cursor-pointer'}
          // onClick={triggerFileInput}
          onClick={() => inputImage.current.click()}
        >
          <BiImageAdd /> Add thumbnail
          <input
            ref={inputImage}
            onChange={handleAdd}
            accept="image/*"
            type="file"
            className="d-none h-100"
          />
        </div>
      )}
    </>
  )
}

export default EditPortfolioSubmission
