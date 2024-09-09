import React, { useState, useEffect, useLayoutEffect } from 'react'
import ReactQuill from 'react-quill'
import Evidences from './Evidences'
import LabeledSwitchInput from '../../Components/Actions/LabeledSwitchInput'

function EditProjectSection(props) {
  const [type, setType] = useState(null)
  const [sectionState, setSectionState] = useState({
    showSection: true,
    editorContent: '',
    evidences: []
  })

  console.log('sectionState', sectionState)

  useLayoutEffect(() => {
    setType(props.type)
  }, [props.type])

  useEffect(() => {
    if (props.projectData) {
      setSectionState(props.projectData)
    }
  }, [])

  const handleChangeVisibility = (show) => {
    setSectionState((prevState) => ({
      ...prevState,
      showSection: !prevState.showSection
    }))
  }

  const handleEditorChange = (content) => {
    setSectionState((prevState) => ({
      ...prevState,
      editorContent: content
    }))
  }

  const onChangeEvidences = (evidences) => {
    setSectionState((prevState) => ({
      ...prevState,
      evidences: evidences
    }))
  }

  useEffect(() => {
    props.onChange({ ...sectionState })
  }, [sectionState])

  return (
    <div className={'mb-5'}>
      <>
        <div className={'row'}>
          <div className={'col-md-9'}>
            <span className={'project-section-title'}>{props.title}</span>
          </div>
          <div className={'col-md-3'}>
            <div
              className={'d-flex gap-2 align-items-center justify-content-end'}
            >
              <LabeledSwitchInput
                label={'Show section'}
                value={sectionState?.showSection}
                onChange={(value) => {
                  handleChangeVisibility(value)
                }}
                name={'show-section'}
                id={type}
              />
            </div>
          </div>
        </div>
        <div className={'project-section-description my-4'}>
          {props.description}
        </div>
      </>

      <div className={'my-4'}>
        <div className={'portfolio-info-title my-2'}>{props.editorTitle}</div>
        <ReactQuill
          className={'portfolio-quill'}
          value={sectionState?.editorContent ?? ''}
          onChange={handleEditorChange}
        />
      </div>
      <Evidences
        evidencesMenuItems={props.evidencesMenuItems}
        onChange={onChangeEvidences}
        evidences={props.projectData?.evidences ?? initialEvidenceData}
        projectType={props.type}
      />
    </div>
  )
}

const initialEvidenceData = [
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    type: 'evidence-1'
  },
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    type: 'evidence-2'
  },
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    type: 'evidence-3'
  }
]

export default EditProjectSection
