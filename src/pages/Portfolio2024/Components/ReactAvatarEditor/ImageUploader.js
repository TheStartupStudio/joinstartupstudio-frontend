import React, { createRef, useEffect, useLayoutEffect, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import './index.css'
import { SlCloudUpload } from 'react-icons/sl'
import SectionActions from '../Actions/SectionActions'
import useContainerSize from '../../../../hooks/useImageEditor'

const ImageUploader = (props) => {
  const [value, setValue] = useState(null)
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
    if (props.value) {
      setValue(props.value)
    } else {
      setValue(null)
    }
  }, [props.value])

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
      const imageFile = formData?.get('img')
      props.onChangeImageCrop?.(imageFile)
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
    event.stopPropagation()
  }

  const handleFileInputChange = (event) => {
    handleAdd(event)
    event.stopPropagation()
  }

  const { containerRef, containerSize } = useContainerSize()
  return (
    <div className="avatar-section position-relative" ref={containerRef}>
      {originalImage !== '' ? (
        <div
          style={{
            width: props.isRelativeSize && (containerSize?.width ?? 200),
            height: 200
          }}
        >
          <AvatarEditor
            ref={editorRef}
            color={[235, 235, 235, 0.6]}
            scale={scale}
            width={containerSize?.width ?? 250}
            crossOrigin="anonymous"
            height={containerSize?.height ?? 250}
            image={originalImage}
            rotate={rotate}
            position={position}
            onPositionChange={handlePositionChange}
            onLoadSuccess={handleImageLoadSuccess}
            border={16}
            borderRadius={6}
            style={{
              width: props.width ?? 200,
              height: props.height ?? 200,
              boxShadow: '0px 3px 6px #0000004D',
              borderRadius: 28,
              overflow: 'hidden'
            }}
          />
        </div>
      ) : (
        <div
          className="upload-image_container p-0 mb-1 position-relative"
          style={{
            width: props.isRelativeSize && (containerSize?.width ?? 200),
            height: 200
          }}
        >
          {value ? (
            <label className={'w-100 h-100'}>
              <img
                src={value}
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

                <div className={'upload-image-logo_click-here text-center'}>
                  Click to upload file
                </div>
              </div>
            </label>
          )}
        </div>
      )}
      {(value || originalImage) && <SectionActions actions={props.actions} />}
    </div>
  )
}

export default ImageUploader
