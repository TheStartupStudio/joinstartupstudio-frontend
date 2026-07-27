import React, { useState, useRef } from 'react'
import { uploadImage, deleteImage } from '../../../utils/helpers'
import { toast } from 'react-toastify'

const ImageUploader = ({
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  title,
  description,
  maxSizeMB = 2
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error('Only JPG/JPEG/PNG files are allowed')
      return
    }

    // Removed PNG transparency warning — photos without transparency are valid

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    try {
      setIsUploading(true)

      // Convert to FormData as expected by your backend
      const formData = new FormData()
      formData.append('img', file)

      // Upload the image
      const imageUrl = await uploadImage(formData)

      if (imageUrl) {
        onImageUploaded(imageUrl)
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  // Transparency checks removed

  const handleDeleteImage = async (e) => {
    e.stopPropagation()
    if (!currentImageUrl) return

    try {
      setIsUploading(true)
      const success = await deleteImage(currentImageUrl)

      if (success) {
        onImageDeleted()
      }
    } catch (error) {
      console.error('Image delete error:', error)
      toast.error('Failed to delete image')
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    if (!currentImageUrl && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className='image-uploader-container'>
      <div
        className={`image-uploader-dropzone ${
          currentImageUrl ? 'has-image' : ''
        } ${isDragging ? 'dragging' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt='Uploaded preview'
              className='image-uploader-preview'
            />
            {isHovered && (
              <button
                className='image-uploader-delete-btn'
                onClick={handleDeleteImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span
                    className='spinner-border spinner-border-sm'
                    role='status'
                    aria-hidden='true'
                  ></span>
                ) : (
                  '🗑️'
                )}
              </button>
            )}
          </>
        ) : (
          <>
            <div className='image-uploader-instructions'>
              {isUploading ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  <span> Uploading...</span>
                </>
              ) : isDragging ? (
                'Drop image here'
              ) : (
                'Click to upload or drag and drop'
              )}
            </div>
            <div className='image-uploader-requirements'>
              Only JPG, PNG files supported (max. {maxSizeMB}MB)
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          id='file-input'
          type='file'
          accept='image/jpeg,image/png'
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  )
}

// Add enhanced CSS styles
const styles = `
  .image-uploader-container {
    margin-bottom: 20px;
  }
  .image-uploader-title {
    font-weight: 500;
    margin-bottom: 5px;
  }
  .image-uploader-description {
    font-weight: 400;
    color: #666;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .image-uploader-dropzone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    position: relative;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    background-color: #fafafa;
  }
  .image-uploader-dropzone.has-image {
    padding: 10px;
    min-height: auto;
    background-color: transparent;
  }
  .image-uploader-dropzone:hover {
    border-color: #666;
    background-color: #f5f5f5;
  }
  .image-uploader-dropzone.dragging {
    border-color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }
  .image-uploader-instructions {
    margin-bottom: 8px;
    font-weight: 500;
  }
  .image-uploader-requirements {
    font-size: 12px;
    color: #999;
  }
  .image-uploader-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    display: block;
  }
  .image-uploader-delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.2s;
  }
  .image-uploader-delete-btn:hover {
    background: #f8f9fa;
    transform: scale(1.1);
  }
  .spinner-border {
    display: inline-block;
    vertical-align: middle;
  }
`

// Inject styles
const styleElement = document.createElement('style')
styleElement.innerHTML = styles
document.head.appendChild(styleElement)

export default ImageUploader
