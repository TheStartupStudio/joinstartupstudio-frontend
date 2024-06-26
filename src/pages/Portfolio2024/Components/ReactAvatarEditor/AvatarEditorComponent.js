import React, { createRef, useEffect, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

const AvatarEditorComponent = (props) => {
  const [containerBorderRadius, setContainerBorderRadius] = useState(28)
  const { width, height, imageProperties, setImageProperties, setImageFile } =
    props
  const editorRef = createRef()
  const { originalImage, position, scale, rotate } = imageProperties
  console.log('imageProperties', imageProperties)
  // useEffect(() => {
  //   if (props.containerBorderRadius)
  //     setContainerBorderRadius(props.containerBorderRadius)
  // }, [props.containerBorderRadius])

  useEffect(() => {
    updateCroppedImage()
    // debugger
  }, [originalImage, position, scale, rotate])

  async function updateCroppedImage() {
    if (editorRef?.current) {
      debugger
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

  function handlePositionChange(position) {
    setImageProperties((prevState) => ({ ...prevState, position }))
  }

  return (
    <div style={{ width, height }}>
      <AvatarEditor
        ref={editorRef}
        color={[235, 235, 235, 0.6]}
        scale={scale}
        width={width}
        height={height}
        crossOrigin="anonymous"
        image={originalImage}
        rotate={rotate}
        position={position}
        onPositionChange={handlePositionChange}
        border={16}
        borderRadius={6}
        style={{
          width,
          height,
          boxShadow: '0px 3px 6px #0000004D'
          // borderRadius: containerBorderRadius
        }}
      />
    </div>
  )
}

export default AvatarEditorComponent
