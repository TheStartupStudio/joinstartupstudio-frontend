import React, { useState } from 'react'
import './index.css'
import Dropdown from '../customComponents/dropdown'
import { types } from './helpers'
import TagOption from './tagOption'
import Explanation from './explanation'
import ApproveUploadModal from './approveUploadModal'
import RejectUploadModal from './rejectUploadModal'

const Upload = ({ upload, skill, editUpload }) => {
  const [expandedSkillDropdown, setExpandedSkillDropdown] = useState(false)
  const [expandedTypeDropdown, setExpandedTypeDropdown] = useState(false)
  const [showApproveUploadModal, setShowApproveUploadModal] = useState(false)
  const [showRejectUploadModal, setShowRejectUploadModal] = useState(false)
  const isApprovable = upload.status === 'submitted'

  return (
    <>
      <div className='upload my-3'>
        <div className='row'>
          <div className='col-12 col-md-6 mb-2'>
            <input
              className='upload-item'
              type='text'
              placeholder='Title'
              name='title'
              value={upload.title}
              readOnly={true}
            />
          </div>
          <div className='col-12 col-md-6 mb-2'>
            <Dropdown
              title={`${upload.type ? upload.type : 'Type'}`}
              expanded={expandedTypeDropdown}
              toggle={setExpandedTypeDropdown}
            >
              <ul className='custom-dropdown-options'>
                {types.map((type) => (
                  <li key={type} name='type'>
                    {type}
                  </li>
                ))}
              </ul>
            </Dropdown>
          </div>
          <div className='col-12'>
            <Dropdown
              title={`${skill.title} - SKILL DROP DOWN MENU`}
              expanded={expandedSkillDropdown}
              toggle={setExpandedSkillDropdown}
            >
              <ul className='custom-dropdown-options'>
                {skill.SkillTags.map((tag) => (
                  <TagOption
                    tag={tag}
                    key={tag.id}
                    checked={upload?.SelectedTags?.some(
                      (row) => row.id === tag.id
                    )}
                  />
                ))}
              </ul>
            </Dropdown>
          </div>
          {upload?.SelectedTags?.map((tag) => (
            <Explanation key={tag.id} tag={tag} />
          ))}
        </div>
        {isApprovable && (
          <div className='row m-0 my-4'>
            <div className='col-12 col-sm-6 m-0 p-0'>
              <button
                className='lts-button float-end mt-2 me-sm-3'
                style={{ background: '#99cc33' }}
                onClick={() => setShowApproveUploadModal(true)}
              >
                PROFICIENT
              </button>
            </div>
            <div className='col-12 col-sm-6 m-0 p-0'>
              <button
                className='lts-button float-start mt-2 ms-sm-3'
                style={{ background: '#ff3399' }}
                onClick={() => setShowRejectUploadModal(true)}
              >
                DEVELOPING
              </button>
            </div>
          </div>
        )}
      </div>

      <ApproveUploadModal
        show={showApproveUploadModal}
        upload={upload}
        onHide={() => setShowApproveUploadModal(false)}
        editUpload={editUpload}
      />
      <RejectUploadModal
        show={showRejectUploadModal}
        upload={upload}
        onHide={() => setShowRejectUploadModal(false)}
        editUpload={editUpload}
      />
    </>
  )
}

export default Upload
