import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import PortfolioModalWrapper from './PortfolioModalWrapper'

function StoryModal(props) {
  const [story, setStory] = useState('')

  useEffect(() => {
    if (props.data) {
      setStory(props.data?.story)
    }
  }, [props.data])

  const saveData = async () => {
    const data = {
      story
    }
    props.onSave?.(data)
  }
  const actions = [
    {
      type: 'save',
      action: () => saveData(),
      isSaving: props.isSaving,
      containSpinner: true,
      isDisplayed: true
    },
    {
      type: 'hide',
      isDisplayed: true,
      action: () => props.onHide()
    }
  ]

  return (
    <PortfolioModalWrapper
      {...props}
      actions={actions}
      class={'portf-modal-widths'}
    >
      <div className={'row'}>
        <div className={'col-sm-12'}>
          <ReactQuill
            className={'portfolio-quill'}
            value={story}
            onChange={(value) => setStory(value)}
            placeholder='Use this space to tell your story.'
          />
        </div>
      </div>
    </PortfolioModalWrapper>
  )
}

export default StoryModal
