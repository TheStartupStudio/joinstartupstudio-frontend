import ModalWrapper from '../Modals/Spotlight/ModalWrapper'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import './index.css'
import OptionSelector from '../OptionSelector'
import LtsButton from '../LTSButtons/LTSButton'
import React, { useEffect, useState } from 'react'
import MediaLightbox from '../MediaLightbox'

const InterviewModal = (props) => {
  const [interview, setInterview] = useState({
    url: '',
    thumbnail: '',
    description: '',
    subtitle: '',
    type: 'video',
    title: '',
    part: ''
  })

  console.log('interview', interview)
  console.log('editingInterview', props.editingInterview)

  useEffect(() => {
    if (props.editingInterview)
      setInterview({
        ...interview,
        type: props.editingInterview?.interview?.type,
        url: props.editingInterview?.interview?.url,
        part: props.editingInterview?.part,
        description: props.editingInterview.description,
        id: props.editingInterview?.id,
        interviewId: props.editingInterview?.interviewId
      })
  }, [])

  const isEdit = () => !!interview?.id

  const validateInputs = () => {
    let isValid = true
    const errors = []

    if (!interview.part) {
      errors.push('Please select a part.')
      isValid = false
    }
    if (!interview.description.trim()) {
      errors.push('Please enter a description.')
      isValid = false
    }

    if (!isValid) {
      toast.error(errors.join('\n'))
    }

    return isValid
  }

  const videoUpload = async (video) => {
    const formData = new FormData()
    formData.append('video', video)

    try {
      const uploadedVideo = await axiosInstance.post(
        '/upload/journal-video/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      const updateContentData = {
        url: uploadedVideo.data.fileLocation,
        thumbnail: '',
        subtitle: '',
        type: 'video',
        title: ''
      }

      if (!isEdit()) {
        const createdContent = await axiosInstance.post(
          '/contents/',
          updateContentData
        )
        setInterview({
          ...interview,
          ...createdContent.data,
          interviewId: createdContent.data.id,
          id: null
        })
        toast.success('Video uploaded successfully!')
      } else {
        const updatedContent = await axiosInstance.put(
          `/contents/${interview?.id}`,
          { ...interview, url: updateContentData.url }
        )
        debugger
        setInterview({
          ...interview,
          ...updatedContent.data
          // interviewId: updatedContent.data.id
        })
        toast.success('Video updated successfully!')
      }
    } catch (error) {
      // setVideoUploadingLoader(false);
      toast.error('Video upload failed, please try again!')
    }
  }

  console.log('isEdit', isEdit())
  const handleDescriptionChange = (value) => {
    setInterview({ ...interview, description: value })
  }

  const handleChangePart = (value) => {
    setInterview({ ...interview, part: value })
  }
  return (
    <ModalWrapper onHide={props.onHide} show={props.show}>
      <div className="interview-modal-box">
        <OptionSelector
          align={'end'}
          label={'Select part'}
          options={[
            { label: 'Select part', value: '', disabled: true },
            { label: 'Part 1', value: 'part-1' },
            { label: 'Part 2', value: 'part-2' }
          ]}
          value={interview.part}
          onChange={(e) => handleChangePart(e.target.value)}
        />

        {interview.url && (
          <video
            key={interview.url}
            width="100%"
            height="250"
            controls
            className={'mt-4'}
          >
            <source src={interview.url} type="video/mp4" />
          </video>
        )}
        <>
          <h2>{!interview.url ? 'Upload Video' : 'Update Video'}</h2>
          <label htmlFor="video-upload" className="upload-btn">
            Choose File
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={(e) => videoUpload(e.target.files[0])}
            />
          </label>
        </>

        <div className="description-input text-start">
          <label htmlFor="description text-start">Description:</label>
          <input
            type="text"
            id="description"
            value={interview?.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter description..."
          />
        </div>
      </div>
      <div className={'mt-2'}>
        <LtsButton
          name={'Save'}
          align={'end'}
          width={'20%'}
          onClick={() => {
            if (!validateInputs()) {
              return
            } else {
              !isEdit() ? props.onSave(interview) : props.onUpdate(interview)
            }
          }}
        />
      </div>
    </ModalWrapper>
  )
}

export default InterviewModal
