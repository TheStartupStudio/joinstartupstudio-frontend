import { useState, useRef, useEffect } from 'react'
import { deleteImage } from '../utils/helpers'

const useImageEditor = (deleteAvatarImage, deleteAvatarImageFile) => {
  const editorRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageProperties, setImageProperties] = useState({
    originalImage: '',
    croppedImage: undefined,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0
  })

  // const updateCroppedImage = async () => {
  //   if (editorRef.current && editorRef.current.getImage) {
  //     debugger
  //     const dataUrl = editorRef.current.getImage().toDataURL()
  //     const result = await fetch(dataUrl)
  //     const blob = await result.blob()
  //     const uniqueFilename = `image_${Date.now()}.png`
  //     const croppedFile = new File([blob], uniqueFilename, {
  //       lastModified: new Date().getTime(),
  //       type: blob.type
  //     })
  //     const formData = new FormData()
  //     formData.append('img', croppedFile)
  //     setImageProperties((prevState) => ({
  //       ...prevState,
  //       croppedImage: formData
  //     }))
  //   }
  // }

  const updateCroppedImage = async () => {
    if (editorRef.current && editorRef.current.getImage) {
      try {
        const image = editorRef.current.getImage()
        if (!image) {
          console.error('Error: Editor image not available.')
          return
        }

        const dataUrl = image.toDataURL()
        const result = await fetch(dataUrl)
        const blob = await result.blob()

        const uniqueFilename = `image_${Date.now()}.png`
        const croppedFile = new File([blob], uniqueFilename, {
          lastModified: new Date().getTime(),
          type: blob.type
        })

        const formData = new FormData()
        formData.append('img', croppedFile)

        setImageProperties((prevState) => ({
          ...prevState,
          croppedImage: formData
        }))
      } catch (error) {
        console.error('Error updating cropped image:', error)
      }
    } else {
      console.warn(
        'Editor reference not ready or getImage method not available.'
      )
    }
  }

  useEffect(() => {
    updateCroppedImage()
  }, [
    imageProperties.position,
    imageProperties.scale,
    imageProperties.rotate,
    imageProperties.originalImage
  ])

  const handleImageLoadSuccess = () => {
    updateCroppedImage()
  }

  const handleFileInputChange = (event) => {
    event.stopPropagation()
    handleAdd(event)
  }

  const handleAdd = (event) => {
    setImageProperties((prevState) => ({
      ...prevState,
      originalImage: event.target.files[0]
    }))
  }

  const handlePositionChange = (position) => {
    setImageProperties((prevState) => ({ ...prevState, position }))
  }

  const handleScaleChange = (scale) => {
    setImageProperties((prevState) => ({ ...prevState, scale }))
  }

  const handleRotateChange = (rotate) => {
    setImageProperties((prevState) => ({ ...prevState, rotate }))
  }

  const handleDeleteImage = async () => {
    const deleteSuccess = await deleteImage(imageUrl)

    if (deleteSuccess) {
      deleteAvatarImage?.(deleteSuccess)
      setImageUrl(null)
    } else {
      console.error('Error: Image deletion failed')
    }
  }

  const handleDeleteImageFile = async () => {
    if (imageProperties.originalImage) {
      deleteAvatarImageFile?.({ imageFile: '' })
      setImageProperties({
        ...imageProperties,
        originalImage: '',
        croppedImage: undefined
      })
    }
  }
  const handleLabelClick = (event) => {
    event.stopPropagation()
  }

  const avatarEditorActions = [
    {
      type: 'trash',
      action: () => (imageUrl ? handleDeleteImage() : handleDeleteImageFile()),
      isDisplayed: true,
      description: 'Click here to delete image'
    }
  ]
  return {
    editorRef,
    imageProperties,
    imageUrl,
    setImageUrl,
    handleImageLoadSuccess,
    handleFileInputChange,
    handleAdd,
    handlePositionChange,
    handleScaleChange,
    handleRotateChange,
    handleDeleteImage,
    handleDeleteImageFile,
    handleLabelClick,
    avatarEditorActions,
    setImageProperties
  }
}

export default useImageEditor
