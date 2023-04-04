import React, { useState } from 'react'
import LoadingAnimation from '../loadingAnimation'
import Upload from './upload'
import UploadsList from './uploadsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useUploads from './useUploads'
import { UploadStatus } from './helpers'
import './index.css'

const SkillUploads = ({ skill }) => {
  const [selectedUpload, setSelectedUpload] = useState(false)
  const { uploads, loading, editUpload } = useUploads({
    skillId: skill?.id,
    setSelectedUpload
  })

  return (
    <div className='skill-uploads'>
      <div className='d-flex w-100 justify-content-between'>
        <p className='skill-title'>
          {selectedUpload && (
            <FontAwesomeIcon
              icon={faChevronLeft}
              color='#01c5d1'
              className='me-2'
              title='Back'
              cursor={'pointer'}
              onClick={() => {
                setSelectedUpload()
              }}
            />
          )}
          <span className='fw-bold'>{skill?.title} - </span> STUDENT UPLOADS
        </p>
        <p className='skill-title text-end'>
          {selectedUpload && (
            <UploadStatus
              status={selectedUpload.status}
              editUpload={editUpload}
            />
          )}
        </p>
      </div>

      {loading ? (
        <LoadingAnimation show={loading} />
      ) : selectedUpload ? (
        <Upload upload={selectedUpload} skill={skill} editUpload={editUpload} />
      ) : (
        <UploadsList
          uploads={uploads}
          setSelectedUpload={setSelectedUpload}
          skillStatus={skill.SkillStatus.status}
        />
      )}
    </div>
  )
}

export default SkillUploads
