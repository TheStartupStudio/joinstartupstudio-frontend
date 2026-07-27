import axios from 'axios'
import axiosInstance from './AxiosInstance'

// ~1.5 GB — enough for a 30–60 min 1080p video at typical web compression (2–4 Mbps).
export const JOURNAL_VIDEO_MAX_BYTES = Math.floor(1.5 * 1024 * 1024 * 1024)
export const JOURNAL_VIDEO_MAX_LABEL = '1.5 GB'

const VIDEO_EXT_PATTERN = /\.(mp4|webm|avi|mov|mkv)$/i

export function validateJournalVideoFile(file) {
  if (!file) return 'No file selected'
  if (!VIDEO_EXT_PATTERN.test(file.name)) {
    return 'Only mp4, webm, avi, mov, or mkv files are supported'
  }
  if (file.size > JOURNAL_VIDEO_MAX_BYTES) {
    const sizeGb = (file.size / (1024 * 1024 * 1024)).toFixed(2)
    return `Video is too large (${sizeGb} GB). Maximum size is ${JOURNAL_VIDEO_MAX_LABEL}.`
  }
  return null
}

async function uploadViaPresignedUrl(file, { onUploadProgress } = {}) {
  const presignResponse = await axiosInstance.post('/upload/journal-video/presign', {
    fileName: file.name,
    contentType: file.type || 'video/mp4',
    fileSize: file.size
  })

  const presignData = presignResponse?.data
  if (!presignData?.success || !presignData?.uploadUrl) {
    throw new Error(presignData?.error || 'Failed to prepare video upload')
  }

  await axios.put(presignData.uploadUrl, file, {
    headers: { 'Content-Type': file.type || 'video/mp4' },
    timeout: 0,
    onUploadProgress
  })

  return presignData.fileLocation
}

async function uploadViaMultipart(file, { onUploadProgress } = {}) {
  const formData = new FormData()
  formData.append('video', file)

  const response = await axiosInstance.post('/upload/journal-video', formData, {
    timeout: 0,
    onUploadProgress
  })

  if (!response.data?.success) {
    throw new Error(response.data?.error || 'Video upload failed')
  }

  return response.data.fileLocation
}

/**
 * Upload a journal intro video. Uses presigned S3 upload first (better for large files),
 * then falls back to multipart API upload if direct upload is blocked.
 */
export async function uploadJournalVideo(file, options = {}) {
  const validationError = validateJournalVideoFile(file)
  if (validationError) {
    throw new Error(validationError)
  }

  try {
    return await uploadViaPresignedUrl(file, options)
  } catch (presignError) {
    console.warn(
      'Presigned journal video upload failed, falling back to API upload:',
      presignError
    )
    return uploadViaMultipart(file, options)
  }
}
