import React, { useEffect, useState } from 'react'
import { propTypes } from 'react-bootstrap/esm/Image'
import axiosInstance from '../../../utils/AxiosInstance'
import ContentUploadBox from './ContentUploadBox'
const ContentUploads = ({ journal, isEditable, evaluationModal }) => {
  const [contentUploads, setContentUploads] = useState([])
  const [loadingContentUpload, setLoadingContentUploads] = useState(false)
  useEffect(() => {
    const ids = journal.userContentUploads.map((item1) => item1.contentUploadId)

    const differentContentUploads = journal.contentUploads.filter(
      (item1) => !ids.includes(item1.id)
    )
    setContentUploads(
      [...differentContentUploads, ...journal.userContentUploads]
        .slice()
        .sort((a, b) => a.order - b.order)
    )
  }, [journal.userContentUploads, journal.contentUploads])

  const handleToggleContentUpload = (contentUpload, status) => {
    setLoadingContentUploads(true)
    if (contentUpload?.hasOwnProperty('contentUploadId')) {
      axiosInstance
        .put(`/contentUploads/updateUserContentUpload/`, {
          contentUpload: { ...contentUpload, status: status }
        })
        .then(({ data }) => {
          const foundedContentUploadIndex = contentUploads?.findIndex(
            (s) =>
              s?.hasOwnProperty('contentUploadId') &&
              s?.id === contentUpload?.id
          )
          const newContentUploads = [...contentUploads]
          newContentUploads.splice(foundedContentUploadIndex, 1, data)
          setContentUploads(newContentUploads)
          setLoadingContentUploads(false)
        })
    } else {
      const newContentUpload = {
        journalId: contentUpload?.journalId,
        order: contentUpload?.order,
        status: status,
        title: contentUpload?.title,
        content: contentUpload?.content,
        contentUploadId: contentUpload?.id
      }

      axiosInstance
        .post(`/contentUploads/createUserContentUpload/`, {
          contentUpload: newContentUpload
        })
        .then(({ data }) => {
          const foundedContentUploadIndex = contentUploads.findIndex(
            (s) =>
              !s?.hasOwnProperty('contentUploadId') &&
              s?.id === contentUpload?.id
          )
          const newContentUploads = [...contentUploads]
          newContentUploads.splice(foundedContentUploadIndex, 1, data)
          setContentUploads(newContentUploads)
          setLoadingContentUploads(false)
        })
    }
  }

  const updateContentSelection = (skill) => {
    if (skill?.status === 'not_selected') {
      handleToggleContentUpload(skill, 'selected')
    } else if (skill?.status === 'selected') {
      handleToggleContentUpload(skill, 'added')
    } else if (skill?.status === 'added') {
      handleToggleContentUpload(skill, 'not_selected')
    }
  }

  const displayContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  }

  const displayContentStyleEvaluationModal = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '5px',
    marginTop: '20px'
  }

  return (
    <div>
      {journal?.contentUploads?.length ? (
        <div
          className='certskills-grid'
          style={{
            ...(evaluationModal
              ? displayContentStyleEvaluationModal
              : displayContentStyle)
          }}
        >
          {contentUploads?.map((contentUpload) => {
            return (
              <div
                className={
                  'd-flex flex-column justify-content-center align-items-center'
                }
              >
                <ContentUploadBox
                  title={contentUpload?.title}
                  isEditable={isEditable}
                  onSelectContent={() => {
                    if (!loadingContentUpload) {
                      updateContentSelection(contentUpload)
                    }
                  }}
                  isAdded={contentUpload?.status === 'added'}
                  isSelected={contentUpload?.status === 'selected'}
                  evaluationModal={evaluationModal}
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default ContentUploads
