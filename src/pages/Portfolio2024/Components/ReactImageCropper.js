// ImageCropper.js
import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import LtsButton from '../../../components/LTSButtons/LTSButton'
// import Slider from '@material-ui/core/Slider'
// import Button from '@material-ui/core/Button'
// import getCroppedImg from './cropImage'

const ReactImageCropper = ({ onCropComplete }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteCallback = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
    onCropComplete(croppedImage)
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {imageSrc && (
        <div>
          <div
            style={{ position: 'relative', width: '200px', height: '200px' }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              objectFit={'contain'}
              // cropSize={{ width: 200, height: 200 }}
              // style={{
              //   containerStyle: {
              //     width: 200,
              //     height: 200,
              //     border: '1px solid #e3e3e3'
              //   },
              //   mediaStyle: { width: 180, height: 180, objectFit: 'cover' },
              //   cropAreaStyle: { width: 180, height: 180 }
              // }}
              classes={{
                containerClassName: 'cropper-container',
                mediaClassName: 'cropper-image',
                cropAreaClassName: 'cropper-crop-area'
              }}
            />
          </div>
          {/*<Slider*/}
          {/*  value={zoom}*/}
          {/*  min={1}*/}
          {/*  max={3}*/}
          {/*  step={0.1}*/}
          {/*  aria-labelledby="Zoom"*/}
          {/*  onChange={(e, zoom) => onZoomChange(zoom)}*/}
          {/*/>*/}
          {/*<Button onClick={handleCrop} variant="contained" color="primary">*/}
          {/*  Crop Image*/}
          {/*</Button>*/}
          <LtsButton onClick={handleCrop} name={'Crop'} variant={'text'} />
        </div>
      )}
    </>
  )
}

export default ReactImageCropper
function getCroppedImg(imageSrc, pixelCrop) {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues
      image.src = url
    })

  return createImage(imageSrc).then((image) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file))
      }, 'image/jpeg')
    })
  })
}
