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
  const [video, setVideo] = useState(null)

  console.log('video', video)

  console.log('interview', interview)
  console.log('editingInterview', props.editingInterview)

  useEffect(() => {
    if (props.editingInterview)
      setInterview({
        ...interview,
        type: props.editingInterview?.interview?.type,
        url: props.editingInterview?.interview?.url,
        part: props.editingInterview?.interview?.part,
        description: props.editingInterview.description
      })
  }, [])
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
      const createContentData = {
        url: uploadedVideo.data.fileLocation,
        thumbnail: '',
        subtitle: '',
        type: 'video',
        title: ''
      }

      const createdContent = await axiosInstance.post(
        '/contents/',
        createContentData
      )
      setInterview({ ...interview, ...createdContent.data })
      toast.success('Video uploaded successfully!')
    } catch (error) {
      // setVideoUploadingLoader(false);
      toast.error('Video upload failed, please try again!')
    }
  }

  const handleDescriptionChange = (value) => {
    setInterview({ ...interview, description: value })
  }

  const handleChangePart = (value) => {
    setInterview({ ...interview, selectedPart: value })
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
        <div onClick={() => setVideo(interview)} style={{ cursor: 'pointer' }}>
          <LtsButton name={'View uploaded video'} width={'60%'} />
        </div>
        <>
          <h2>Upload Video</h2>
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
          onClick={() => props.onSave(interview)}
        />
      </div>
      <MediaLightbox
        video={video}
        // key={index}
        show={!!video}
        onClose={() => setVideo(false)}
        // watchData={videoWatchData}
        // onVideoData={saveWatchData}
        // onVideoWatched={saveVideoWatched}
      />
    </ModalWrapper>
  )
}

export default InterviewModal
