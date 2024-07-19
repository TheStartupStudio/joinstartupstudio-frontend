import React, { useRef, useState } from 'react'
import ImageCropper from '../../../components/ImageCropper'
import imagePlaceholder from '../../../assets/images/image-placeholder.jpeg'
import { SlCloudUpload } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import '../index.css'
import { toast } from 'react-toastify'
import { readFile } from '../../../utils/canvasUtils'
import { setImageCropperData } from '../../../redux'
import AvatarEditor from './ReactAvatarEditor/ImageUploader'
function UploadImageBox(props) {
  const general = useSelector((state) => state.general)
  const [selectedImage, setSelectedImage] = useState('')
  const dispatch = useDispatch()
  const inputImage = useRef(null)
  const imageChange = async (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      let img = document.createElement('img')
      let reader = new FileReader()
      reader.onloadend = function (ended) {
        img.src = ended.target.result
        const formData = new FormData()
        formData.append('image', ended.target.result)
      }

      reader.readAsDataURL(files[0])
      img.onload = async function () {
        if (this.width < 120 || this.height < 100) {
          return toast.error('Minimum required format: 120x100px.')
        } else {
          let imageData = await readFile(files[0])
          dispatch(setImageCropperData(imageData))
          previewImage(files[0])
        }
      }
    }
  }

  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      setSelectedImage(reader.result)
    }
  }

  return (
    <div className="upload-image_container p-0 mb-1 position-relative">
      {general.imageCropperData ? (
        <div
          className="img-placeholder position-relative"
          // style={{ height: '85%%' }}
        >
          <AvatarEditor />
          {/*<ImageCropper*/}
          {/*  width={200}*/}
          {/*  height={200}*/}
          {/*  setImageUrl={setSelectedImage}*/}
          {/*  imageUrl={selectedImage}*/}
          {/*/>*/}
        </div>
      ) : (
        <>
          {selectedImage ? (
            <img
              src={selectedImage}
              style={{
                width: '100%',
                height: '100%'
              }}
              alt="Thumb"
            />
          ) : (
            <label
              className={'w-100 h-100 p-3'}
              onClick={() => inputImage.current.click()}
            >
              <input
                ref={inputImage}
                onChange={imageChange}
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
                  {props.title}
                </div>
                <SlCloudUpload className={'upload-to-cloud_logo'} />

                <div className={'upload-image-logo_click-here'}>
                  Click to upload file
                </div>
              </div>
            </label>
          )}
        </>
      )}
    </div>
  )
}

export default UploadImageBox
