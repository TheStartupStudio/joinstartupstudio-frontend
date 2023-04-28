import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useIamrContext } from '../iamrContext/context'
import { showErrors } from '../../../utils/helpers'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import notificationTypes from '../../../utils/notificationTypes'
import { useSelector } from 'react-redux'
import notificationSocket from '../../../utils/notificationSocket'

export default function useUploads({ skillId, setSelectedUpload }) {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const { updateSkillStatus } = useIamrContext()
  const { studentId, uploadId } = useParams()
  const loggedUser = useSelector((state) => state.user.user.user)

  useEffect(() => {
    if (!skillId) return
    axiosInstance
      .get(`/instructor/iamr/students/uploads/${studentId}/${skillId}`)
      .then(({ data }) => {
        setUploads(data)
        const upload = data.find((upload) => upload.id === Number(uploadId))
        if (upload) setSelectedUpload(upload)

        setLoading(false)
      })
      .catch((e) => setLoading(false))
  }, [skillId])

  const editUploads = ({ upload, updatedSkillStatus }) => {
    setUploads((uploads) =>
      uploads.map((u) => (u.id === upload.id ? upload : u))
    )
    updateSkillStatus(updatedSkillStatus)
    setSelectedUpload(upload)
  }

  const editUpload = async (values, onSuccessCb, onRejectCb) => {
    await axiosInstance
      .put(
        `/instructor/iamr/students/uploads/${studentId}/${values.id}`,
        values
      )
      .then(({ data }) => {
        const { upload, updatedSkillStatus, ticket } = data
        onSuccessCb()
        editUploads({ upload, updatedSkillStatus })
        const type =
          values.status === 'developing'
            ? notificationTypes.FEEDBACK_RECEIVED.key
            : notificationTypes.PROFICIENT_SKILL.key

        const url =
          values.status === 'developing'
            ? `/iamr/${skillId}/feedback/${ticket?.id}`
            : `/iamr/${skillId}/uploads/${upload.id}`

        notificationSocket?.emit('sendNotification', {
          sender: loggedUser,
          receiver: { id: upload.user_id },
          type: type,
          url: url
        })
      })
      .catch((e) => {
        onRejectCb && onRejectCb()
        showErrors(e)
      })
  }

  return {
    uploads,
    loading,
    editUpload
  }
}
