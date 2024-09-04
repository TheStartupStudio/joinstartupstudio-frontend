import React, { createRef, useEffect } from 'react'
import AvatarEditor from 'react-avatar-editor'
import './index.css'
import { SlCloudUpload } from 'react-icons/sl'
import SectionActions from '../Actions/SectionActions'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
// import useContainerSize from '../../../../hooks/useContainerSize'

const ReactImageUpload = ({
  originalImage,
  croppedImage,
  position,
  scale,
  rotate,
  value,
  onPositionChange,
  onImageLoadSuccess,
  onLabelClick,
  onFileInputChange,
  title,
  actions,
  isRelativeSize,
  width,
  height,
  type,
  color,
  editorRef,
  readOnly
}) => {
  // const editorRef = createRef()
  // const { containerRef, containerSize } = useContainerSize()
  return (
    <div className='avatar-section position-relative' ref={null}>
      {originalImage !== '' && !readOnly ? (
        <div
          style={{
            width: isRelativeSize && 200,
            height: 200
          }}
        >
          <AvatarEditor
            ref={editorRef}
            color={color ?? [235, 235, 235, 0.6]}
            scale={scale}
            width={250}
            crossOrigin='anonymous'
            height={250}
            image={originalImage}
            rotate={rotate}
            position={position}
            onPositionChange={onPositionChange}
            onLoadSuccess={onImageLoadSuccess}
            border={type === 'circle' ? 0 : 16}
            borderRadius={type === 'circle' ? 150 : 6}
            style={{
              width: width ?? 200,
              height: height ?? 200,
              boxShadow: '0px 3px 6px #0000004D',
              borderRadius: 28,
              overflow: 'hidden'
            }}
          />
        </div>
      ) : (
        <div
          className='upload-image_container p-0 mb-1 position-relative'
          style={{
            width: isRelativeSize && 200,
            height: 200,
            borderRadius: type === 'circle' ? '50%' : ''
          }}
        >
          {value ? (
            <label className={'w-100 h-100'}>
              <img
                src={value}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: type === 'circle' ? '50%' : ''
                }}
                alt='Thumb'
                className={'display-uploaded-image p-2'}
              />
            </label>
          ) : !readOnly ? (
            <label className={'w-100 h-100 p-3'} onClick={onLabelClick}>
              <input
                onChange={onFileInputChange}
                accept='image/*'
                type='file'
                className='d-none h-100'
              />
              <div
                className={
                  'border-dashed d-flex align-items-center flex-column justify-content-between py-3 px-2 '
                }
                style={{
                  borderRadius: type === 'circle' ? '50%' : ''
                }}
              >
                <div className={'upload-image-logo_box-title'}>
                  {title ?? 'Upload Image'}
                </div>
                <SlCloudUpload className={'upload-to-cloud_logo'} />
                <div
                  className={'upload-image-logo_click-here text-center'}
                  style={{ marginBottom: '25px' }}
                >
                  Click to upload file
                </div>
              </div>
            </label>
          ) : (
            <img
              className={'my-mentors-image'}
              alt={'submission-image'}
              src={imagePlaceholder}
            />
          )}
          {value && !readOnly && (
            <SectionActions
              actions={actions}
              styles={
                type === 'circle'
                  ? { top: 14, right: 14, borderRadius: '0px 28px 0px 28px' }
                  : {}
              }
            />
          )}
        </div>
      )}
      {!value && originalImage && !readOnly && (
        <SectionActions actions={actions} />
      )}
    </div>
  )
}

export default ReactImageUpload
