import React, { useEffect, useState } from 'react'
import Upload from './upload'
import UploadsList from './uploadsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useUploads from './useUploads'
import { UploadStatus } from './helpers'
import './index.css'
import LoadingAnimation from '../../../../ui/loadingAnimation'

const SkillUploads = ({ skill }) => {
  const [showUpload, setShowUpload] = useState(false)
  const [selectedUpload, setSelectedUpload] = useState(false)

  const {
    uploads,
    loading,
    requestLoading,
    createUpload,
    updateUpload,
    submitUpload,
    deleteUpload
  } = useUploads({ skillId: skill?.id, setSelectedUpload })

  const newArr = []
  uploads.map((el) => newArr.push(el.SelectedTags))
  const usedTags = []
  newArr.map((el) => usedTags.push(...el))

  return (
    <div className="skill-uploads">
      <div className="d-flex w-100 justify-content-between">
        <p className="skill-title">
          {(selectedUpload || showUpload) && (
            <FontAwesomeIcon
              icon={faChevronLeft}
              color="#01c5d1"
              className="me-2"
              title="Back"
              cursor={'pointer'}
              onClick={() => {
                if (requestLoading) return
                setSelectedUpload()
                setShowUpload()
              }}
            />
          )}
          <span className="text-info fw-bold">{skill.category} - </span>
          <span className="fw-bold">{skill?.title} - </span> STUDENT UPLOADS
        </p>
        <p className="skill-title text-end">
          {showUpload && !selectedUpload && (
            <UploadStatus status={'New upload'} />
          )}
          {selectedUpload && <UploadStatus status={selectedUpload.status} />}
        </p>
      </div>
      {loading ? (
        <LoadingAnimation show={loading} />
      ) : selectedUpload || showUpload ? (
        <Upload
          upload={selectedUpload}
          skill={skill}
          usedTags={usedTags}
          loading={requestLoading}
          createUpload={createUpload}
          updateUpload={updateUpload}
          submitUpload={submitUpload}
        />
      ) : (
        <UploadsList
          uploads={uploads}
          setSelectedUpload={setSelectedUpload}
          setShowUpload={setShowUpload}
          skillStatus={skill.SkillStatus.status}
          deleteUpload={deleteUpload}
        />
      )}
    </div>
  )
}

export default SkillUploads
