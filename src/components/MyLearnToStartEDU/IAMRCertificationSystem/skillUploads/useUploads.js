import { useEffect, useState } from 'react'

import { useIamrContext } from '../iamrContext/context'
import { showErrors } from '../../../../utils/helpers'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import { useSelector } from 'react-redux'
import axiosInstance from '../../../../utils/AxiosInstance'
import notificationSocket from '../../../../utils/notificationSocket'
import notificationTypes from '../../../../utils/notificationTypes'

export default function useUploads({ skillId, setSelectedUpload }) {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const { updateSkillStatus } = useIamrContext()
  const { uploadId } = useParams()
  const loggedUser = useSelector((state) => state.user.user.user)

  useEffect(() => {
    if (!skillId) return
    axiosInstance.get(`/iamr/uploads/${skillId}`).then(({ data }) => {
      setUploads(data)
      const upload = data.find((upload) => upload.id === Number(uploadId))
      if (upload) setSelectedUpload(upload)

      setLoading(false)
    })
  }, [skillId])

  const editUploads = ({ action, upload, updatedSkillStatus }) => {
    if (action === 'add') setUploads((uploads) => [upload, ...uploads])
    else
      setUploads((uploads) =>
        uploads.map((u) => (u.id === upload.id ? upload : u))
      )
    updateSkillStatus(updatedSkillStatus)
    setSelectedUpload(upload)
  }

  // const removeUpload = (id) => {
  //   setUploads((uploads) => uploads.filter((upload) => upload.id !== id))
  // }
  const removeUpload = (id, updatedSkillStatus) => {
    setUploads((uploads) => uploads.filter((upload) => upload.id !== id))
    if (updatedSkillStatus) {
      updateSkillStatus(updatedSkillStatus)
    }
  }

  const createUpload = async (values) => {
    setRequestLoading('save')
    await axiosInstance
      .post('/iamr/uploads', values)
      .then(({ data }) => {
        editUploads({ action: 'add', ...data })
      })
      .catch((e) => showErrors(e))
    setRequestLoading()
  }

  // const deleteUpload = async (id, onFinishCb) => {
  //   await axiosInstance
  //     .delete(`/iamr/uploads/${id}`)
  //     .then(() => {
  //       onFinishCb()
  //       toast.success('Upload has been deleted.')
  //       removeUpload(id)
  //     })
  //     .catch((e) => {
  //       onFinishCb()
  //       showErrors(e)
  //     })
  // }

  const deleteUpload = async (id, skillId, onFinishCb) => {
    const not_started = { skill_id: +skillId, SkillStatus: ['not_started'] }
    await axiosInstance
      .delete(`/iamr/uploads/${id}/${skillId}`)
      .then(({ data }) => {
        onFinishCb()
        toast.success('Upload has been deleted.')
        if (typeof data !== 'string') {
          removeUpload(id, not_started)
        } else {
          removeUpload(id)
        }
      })
      .catch((e) => {
        onFinishCb()
        showErrors(e)
      })
  }

  const updateUpload = async (values, onSuccessCb) => {
    setRequestLoading('save')
    await axiosInstance
      .put(`/iamr/uploads/${values.id}`, values)
      .then(({ data }) => {
        onSuccessCb()
        editUploads({ action: 'update', ...data })
        if (loggedUser.Instructor) {
          notificationSocket.emit('sendNotification', {
            sender: loggedUser,
            receivers: [loggedUser.Instructor.User],
            type: notificationTypes.IAMR_UPDATE_SAVED_UPLOAD.key,
            url: `/student-iamr/${loggedUser.id}/${skillId}/uploads/${data.upload.id}`
          })
        }
      })
      .catch((e) => showErrors(e))
    setRequestLoading()
  }

  const submitUpload = async (values, onSuccessCb) => {
    setRequestLoading('submit')
    await axiosInstance
      .post(`iamr/uploads/certification-request/${values.id}`, values)
      .then(({ data }) => {
        onSuccessCb()
        editUploads({ action: 'update', ...data })
        if (loggedUser.Instructor) {
          notificationSocket.emit('sendNotification', {
            sender: loggedUser,
            receivers: [loggedUser.Instructor.User],
            type: notificationTypes.CERTIFICATION_REQUEST.key,
            url: `/student-iamr/${loggedUser.id}/${skillId}/uploads/${data.upload.id}`
          })
        }
      })
      .catch((e) => showErrors(e))
    setRequestLoading()
  }

  return {
    uploads,
    loading,
    requestLoading,
    createUpload,
    updateUpload,
    submitUpload,
    deleteUpload
  }
}
