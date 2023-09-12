import React, { useEffect, useState, useMemo } from 'react'
import './index.css'
import Dropdown from '../customComponents/dropdown'
import { types } from './helpers'
import TagOption from './tagOption'
import useUploadForm from './uploadFormHook'
import { cloneDeep } from 'lodash'
import Explanation from './explanation'
import DialogModal from '../customComponents/dialogModal'
import ImportJournalEntryModal from './importJournalEntryModal'

const Upload = ({
  upload,
  skill,
  loading,
  createUpload,
  updateUpload,
  submitUpload,
  usedTags
}) => {
  const [expandedSkillDropdown, setExpandedSkillDropdown] = useState(false)
  const [expandedTypeDropdown, setExpandedTypeDropdown] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDialogModal, setShowDialogModal] = useState(false)
  const [onSubmit, setOnSubmit] = useState(null)
  const [showEntryModal, setShowEntryModal] = useState(false)

  const {
    handleChange,
    resetValues,
    selectedTags,
    values,
    errors,
    showErrors,
    handleSubmit: handleFormSubmit
  } = useUploadForm(handleSubmit, cloneDeep(upload))

  const allUsedTags = usedTags.map((item) => item.id)
  const selectedUploadTabs = values.SelectedTags.map((item) => item.id)
  const updatedUsedTabs = allUsedTags.filter(
    (el) => !selectedUploadTabs.includes(el)
  )

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(upload) !== JSON.stringify(values))
  }, [values, upload])

  useEffect(() => {
    upload && resetValues(cloneDeep(upload))
  }, [upload, resetValues])

  const allowUpdate = useMemo(() => {
    if (
      !upload &&
      (skill.SkillStatus !== 'proficient' || skill.SkillStatus !== 'approved')
    )
      return true
    return (
      upload.status !== 'submitted' &&
      upload.status !== 'proficient' &&
      upload.status !== 'approved' &&
      skill.SkillStatus.status !== 'proficient' &&
      skill.SkillStatus.status !== 'approved'
    )
  }, [upload, skill.SkillStatus])

  function handleSubmit(values, type) {
    if (type === 'submit' && !upload) return

    const newUpload = { ...values, skill_id: skill.id }

    if (!upload) return createUpload(newUpload)

    if (type === 'save') {
      return updateUpload(newUpload, () => setHasUnsavedChanges(false))
    }

    if (type === 'submit') {
      setShowDialogModal(true)
      setOnSubmit(
        () => () => submitUpload(newUpload, () => setShowDialogModal(false))
      )
    }
  }

  const handleJournalEntryImport = (entry) => {
    handleChange({
      target: {
        name: 'imported_journal_entry',
        value: entry
      }
    })
  }

  return (
    <>
      <div className="upload my-3 w-100">
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <input
                className="upload-item"
                type="text"
                placeholder="Title"
                name="title"
                onChange={(e) => allowUpdate && handleChange(e)}
                value={values.title}
                readOnly={!allowUpdate}
              />
              <p className="field-error m-0">
                {showErrors && errors?.[showErrors]?.title}
              </p>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <Dropdown
                title={`${values.type ? values.type : 'Type'}`}
                expanded={expandedTypeDropdown}
                toggle={setExpandedTypeDropdown}
              >
                <ul className="custom-dropdown-options">
                  {types.map((type) => (
                    <li
                      key={type}
                      name="type"
                      onClick={() => {
                        allowUpdate &&
                          handleChange({
                            target: { value: type, name: 'type' }
                          })
                        setExpandedTypeDropdown(false)
                      }}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </Dropdown>
              <p className="field-error m-0">
                {showErrors && errors?.[showErrors]?.type}
              </p>
            </div>
            <div className="col-12 col-md-6 mb-2 mb-md-0 import-entry-input">
              <div
                className="upload-item d-flex"
                onClick={() => allowUpdate && setShowEntryModal(true)}
              >
                {values?.imported_journal_entry ? (
                  <span>
                    {' '}
                    Journal entry from:{' '}
                    <span className="fw-bold">
                      {values.imported_journal_entry?.journalTitle}
                    </span>
                  </span>
                ) : (
                  'IMPORT JOURNAL ENTRY'
                )}
              </div>
              {values?.imported_journal_entry && allowUpdate && (
                <span
                  className="remove-entry"
                  onClick={() => handleJournalEntryImport(null)}
                >
                  REMOVE
                </span>
              )}
            </div>
            <div className="col-12 col-md-6 mb-0">
              <input
                className="upload-item"
                type="text"
                placeholder="Link"
                name="link"
                onChange={(e) => allowUpdate && handleChange(e)}
                value={values.link}
                readOnly={!allowUpdate}
              />
            </div>
            <div className="col-12 mb-2">
              <p className="field-error m-0">
                {showErrors && errors?.[showErrors]?.link_journal}
              </p>
            </div>
            <div className="col-12">
              <Dropdown
                title={`${skill.title} - SKILL DROP DOWN MENU`}
                expanded={expandedSkillDropdown}
                toggle={setExpandedSkillDropdown}
              >
                <ul className="custom-dropdown-options">
                  {skill.SkillTags.map(
                    (tag) =>
                      !updatedUsedTabs.includes(tag.id) && (
                        <TagOption
                          tag={tag}
                          key={tag.id}
                          handleChange={(e) =>
                            allowUpdate && handleChange(e, tag)
                          }
                          checked={values?.SelectedTags?.some(
                            (row) => row.id === tag.id
                          )}
                        />
                      )
                  )}
                </ul>
              </Dropdown>
              <p className="field-error m-0">
                {showErrors && errors?.[showErrors]?.tags}
              </p>
            </div>
            {values?.SelectedTags?.map((tag) => (
              <Explanation
                key={tag.id}
                tag={tag}
                handleChange={handleChange}
                allowUpdate={allowUpdate}
                showErrors={showErrors}
                errors={errors}
              />
            ))}
          </div>
          {allowUpdate && (
            <div className="pt-3 d-flex justify-content-end flex-column">
              <div
                className="row m-0 my-3 pb-4"
                style={{ borderBottom: '1px solid #ccc' }}
              >
                <div className="col-12 col-sm-6 m-0 p-0">
                  <button
                    className="lts-button float-end mt-2 me-sm-3"
                    type="submit"
                    value="save"
                    name="save"
                    disabled={loading || !hasUnsavedChanges}
                  >
                    {loading === 'save' ? 'SAVING' : 'SAVE'}
                  </button>
                </div>
                <div className="col-12 col-sm-6 m-0 p-0">
                  <button
                    className="lts-button float-start mt-2 ms-sm-3"
                    type="submit"
                    value="submit"
                    name="submit"
                    disabled={true}
                  >
                    {loading === 'submit' ? 'SUBMITTING' : 'SUBMIT'}
                  </button>
                </div>
              </div>
              <div className="row m-0">
                <div className="col-12 col-sm-6 m-0 p-0">
                  <button
                    className="lts-button float-end mt-2 me-sm-3"
                    type="submit"
                    value="save"
                    name="save"
                    disabled={true}
                  >
                    {'PROFICIENT'}
                  </button>
                </div>
                <div className="col-12 col-sm-6 m-0 p-0">
                  <button
                    className="lts-button float-start mt-2 ms-sm-3"
                    type="submit"
                    value="submit"
                    name="submit"
                    disabled={true}
                  >
                    {'DEVELOPING'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      <DialogModal
        show={showDialogModal}
        onHide={() => setShowDialogModal(false)}
        loading={loading}
        onSubmit={onSubmit}
        title={
          'Are you sure you are ready to submit your "I Am Market-Ready" upload?'
        }
        description={'Once you submit you cannot edit or delete this upload.'}
        submitBtnText={'YES I AM MARKET-READY'}
        isApprovable={true}
      />
      {showEntryModal && (
        <ImportJournalEntryModal
          show={showEntryModal}
          handleJournalEntryImport={handleJournalEntryImport}
          onHide={() => setShowEntryModal(false)}
        />
      )}
    </>
  )
}

export default Upload
