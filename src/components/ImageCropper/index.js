import React, { useState, useCallback, useEffect } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Cropper from 'react-easy-crop'
import { getCroppedImg, readFile } from '../../utils/canvasUtils'
import { useSelector, useDispatch } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../redux'

const ImageCropper = (props) => {
  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [cropSize, setCropSize] = useState({
    width: props.width,
    height: props.height
  })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(async () => {
    if (croppedAreaPixels) {
      const image = await getCroppedImg(
        general.imageCropperData,
        croppedAreaPixels,
        rotation
      )

      dispatch(setCroppedImage(image))
    }
  }, [croppedAreaPixels])

  useEffect(() => {
    return () => {
      props.setImageUrl('')
      dispatch(setCroppedImage(null))
      dispatch(setImageCropperData(null))
    }
  }, [])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  return (
    <div>
      <Cropper
        image={props.imageUrl}
        crop={crop}
        cropSize={cropSize}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        style={{ height: props.height ? props.height : '200px' }}
      />
    </div>
  )
}

export default ImageCropper
