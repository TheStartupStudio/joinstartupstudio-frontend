import React, { useEffect, useState } from 'react'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import SectionActions from './SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import MyMentorModal from '../Modals/MyMentorModal'
import {
  hideAddMentorModal,
  hideEditMentorModal,
  showAddMentorModal,
  showEditMentorModal
} from '../../../../redux/portfolio/Actions'

function AddMyMentor(props) {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const showMentorModal = useSelector(
    (state) => state.portfolio.whoSection.myMentors.showAddMentorModal
  )

  const handleShowMentorModal = () => {
    dispatch(showAddMentorModal())
  }
  const handleHideMentorModal = () => {
    dispatch(hideAddMentorModal())
  }

  const actions = [
    {
      type: 'add',
      action: () => handleShowMentorModal(),
      isDisplayed: mode === 'edit' && props.isEditSection === true,
      description: `Click here to add a new ${props.type ?? 'mentor'}`
    }
  ]
  return (
    <div className={'my-mentors-container position-relative'}>
      <img
        className={'my-mentors-image'}
        alt={'submission-image'}
        src={imagePlaceholder}
      />
      <div className={'add-new-mentor px-2 pt-3'}>
        {`Click the add button to add a new ${
          props.type ?? 'mentor'
        } relationship.`}
      </div>
      <SectionActions actions={actions} />
      <MyMentorModal
        onHide={handleHideMentorModal}
        show={showMentorModal}
        title={`Add ${props.type ?? 'mentor'}`}
        category={props.category}
      />
    </div>
  )
}

export default AddMyMentor
