import React, { createRef, useEffect, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import './index.css'
import { SlCloudUpload } from 'react-icons/sl'
import SectionActions from '../Actions/SectionActions'

const Avatar = (props) => {
  const [imageFile, setImageFile] = useState(null)
  const [showFileInput, setShowFileInput] = useState(false)
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
    if (imageFile) props.onChangeImageCrop?.(imageFile)
  }, [imageFile])

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
        croppedImage: window.URL.createObjectURL(blob)
      }))
    }
  }

  function handleImageLoadSuccess() {
    updateCroppedImage()
  }

  const handleLabelClick = (event) => {
    setShowFileInput(true)
    event.stopPropagation()
  }

  const handleFileInputChange = (event) => {
    setShowFileInput(false)
    handleAdd(event)
    event.stopPropagation()
  }

  return (
    <div className="row ">
      <div className={'row'}>
        <div className="avatar-section position-relative">
          {originalImage !== '' ? (
            <div style={{ width: 200, height: 200 }}>
              <AvatarEditor
                ref={editorRef}
                color={[235, 235, 235, 0.6]}
                scale={scale}
                width={250}
                crossOrigin="anonymous"
                height={250}
                image={originalImage}
                rotate={rotate}
                position={position}
                onPositionChange={handlePositionChange}
                onLoadSuccess={handleImageLoadSuccess}
                border={16}
                borderRadius={6}
                style={{
                  width: 200,
                  height: 200,
                  boxShadow: '0px 3px 6px #0000004D',
                  borderRadius: 28
                }}
              />
            </div>
          ) : (
            <div
              className="upload-image_container p-0 mb-1 position-relative"
              style={{ width: 200, height: 200 }}
            >
              {props.value ? (
                <label className={'w-100 h-100'}>
                  <img
                    src={props.value}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                    alt="Thumb"
                    className={'display-uploaded-image p-2'}
                  />
                </label>
              ) : (
                <label className={'w-100 h-100 p-3'} onClick={handleLabelClick}>
                  <input
                    onChange={handleFileInputChange}
                    accept="image/*"
                    type="file"
                    className="d-none h-100"
                  />
                  <div
                    className={
                      'border-dashed d-flex align-items-center flex-column justify-content-between py-3 px-2 '
                    }
                  >
                    <div className={'upload-image-logo_box-title'}>
                      {props.title ?? 'Mentor Image'}
                    </div>
                    <SlCloudUpload className={'upload-to-cloud_logo'} />

                    <div className={'upload-image-logo_click-here'}>
                      Click to upload file
                    </div>
                  </div>
                </label>
              )}
              {props.value && <SectionActions actions={props.actions} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Avatar
