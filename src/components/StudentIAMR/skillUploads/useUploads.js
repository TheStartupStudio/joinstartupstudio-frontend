import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useIamrContext } from '../iamrContext/context'
import { showErrors } from '../../../utils/helpers'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

export default function useUploads({ skillId, setSelectedUpload }) {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const { updateSkillStatus } = useIamrContext()
  const { studentId, uploadId } = useParams()

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
        const { upload, updatedSkillStatus } = data
        onSuccessCb()
        editUploads({ upload, updatedSkillStatus })
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
